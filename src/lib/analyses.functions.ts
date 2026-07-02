import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const AnalyzeInput = z.object({
  content_type: z.enum(["sms", "email", "url", "other"]),
  content: z.string().trim().min(3).max(8000),
});

const AiSchema = z.object({
  classification: z.enum(["safe", "suspicious", "high_risk"]),
  confidence: z.number().int().min(0).max(100),
  explanation: z.string().min(10).max(2000),
  indicators: z.array(z.string().max(240)).max(12),
  recommendations: z.array(z.string().max(240)).max(8),
});

async function callLovableAI(content_type: string, content: string) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

  const system = `You are TrustShield AI, a cybersecurity analyst for East Africa focused on phishing, SIM-swap, BEC, and social engineering.
Analyze user-submitted content and return a JSON object matching this schema:
{
  "classification": "safe" | "suspicious" | "high_risk",
  "confidence": integer 0-100,
  "explanation": short plain-language reasoning (2-4 sentences),
  "indicators": array of concrete signals you detected (e.g. "Urgent language demanding action within 24h", "Shortened URL bit.ly/xyz", "Requests OTP"),
  "recommendations": array of user-facing actions
}
Rules:
- Be honest about uncertainty. Use confidence, do not claim perfect accuracy.
- If content is legitimate, explain WHY it looks safe (no phishing indicators, consistent sender, no credential requests, etc.). Return an empty indicators array only when truly none exist.
- Always encourage verifying sensitive requests through official channels.
- Return ONLY valid JSON, no markdown, no code fences.`;

  const user = `Content type: ${content_type}\n\nContent:\n"""${content}"""`;

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (res.status === 429) throw new Error("AI rate limit reached. Please retry shortly.");
  if (res.status === 402) throw new Error("AI credits exhausted. Please add credits in your workspace.");
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`AI gateway error (${res.status}): ${t.slice(0, 200)}`);
  }

  const data = await res.json();
  const raw = data?.choices?.[0]?.message?.content;
  if (!raw) throw new Error("Empty AI response");

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    const match = String(raw).match(/\{[\s\S]*\}/);
    if (!match) throw new Error("AI returned non-JSON output");
    parsed = JSON.parse(match[0]);
  }

  return AiSchema.parse(parsed);
}

export const analyzeContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => AnalyzeInput.parse(input))
  .handler(async ({ data, context }) => {
    const result = await callLovableAI(data.content_type, data.content);

    const { data: inserted, error } = await context.supabase
      .from("analyses")
      .insert({
        user_id: context.userId,
        content_type: data.content_type,
        content: data.content,
        classification: result.classification,
        confidence: result.confidence,
        explanation: result.explanation,
        indicators: result.indicators,
        recommendations: result.recommendations,
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return inserted;
  });

export const listAnalyses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("analyses")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getAnalysis = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("analyses")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteAnalysis = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("analyses").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
