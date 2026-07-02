import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, ScanSearch, MessageSquare, Mail, Link2, FileText } from "lucide-react";
import { analyzeContent } from "@/lib/analyses.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ThreatResult, type AnalysisResult } from "@/components/threat-result";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ContentType = "sms" | "email" | "url" | "other";

export const Route = createFileRoute("/_authenticated/analyzer")({
  head: () => ({ meta: [{ title: "Analyzer — TrustShield AI" }] }),
  component: Analyzer,
});

const TYPES: { id: ContentType; label: string; icon: typeof MessageSquare; hint: string }[] = [
  { id: "sms", label: "SMS", icon: MessageSquare, hint: "Paste the full text message" },
  { id: "email", label: "Email", icon: Mail, hint: "Include sender + full body" },
  { id: "url", label: "URL", icon: Link2, hint: "Paste the full link" },
  { id: "other", label: "Other", icon: FileText, hint: "Any other suspicious content" },
];

function Analyzer() {
  const analyze = useServerFn(analyzeContent);
  const qc = useQueryClient();
  const [type, setType] = useState<ContentType>("sms");
  const [content, setContent] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const mutation = useMutation({
    mutationFn: (input: { content_type: ContentType; content: string }) => analyze({ data: input }),
    onSuccess: (row) => {
      setResult({
        classification: row.classification,
        confidence: row.confidence,
        explanation: row.explanation,
        indicators: row.indicators as string[],
        recommendations: row.recommendations as string[],
      });
      qc.invalidateQueries({ queryKey: ["analyses"] });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Analysis failed");
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim().length < 3) {
      toast.error("Please paste some content to analyze.");
      return;
    }
    setResult(null);
    mutation.mutate({ content_type: type, content: content.trim() });
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-trust">Threat Analyzer</div>
        <h1 className="mt-1 font-display text-3xl font-bold text-foreground">Analyze suspicious content</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Paste a message, email, or link. TrustShield AI will classify it and explain why.
        </p>
      </div>

      <Card className="mt-6 shadow-[var(--shadow-card)]">
        <CardContent className="p-6">
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Content type
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {TYPES.map((t) => {
                  const Icon = t.icon;
                  const active = type === t.id;
                  return (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setType(t.id)}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition",
                        active
                          ? "border-trust bg-trust-soft text-trust"
                          : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {t.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{TYPES.find((t) => t.id === type)?.hint}</p>
            </div>

            <div>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  type === "url"
                    ? "https://suspicious-link.example.com/verify?token=…"
                    : "Paste the suspicious message here…"
                }
                rows={type === "url" ? 3 : 8}
                maxLength={8000}
                className="font-mono text-sm"
              />
              <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
                <span>Never include real passwords, PINs, or OTPs.</span>
                <span className="tabular-nums">{content.length}/8000</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                Results include a confidence score, not a guarantee.
              </p>
              <Button type="submit" size="lg" disabled={mutation.isPending} className="min-w-[160px]">
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing…
                  </>
                ) : (
                  <>
                    <ScanSearch className="mr-2 h-4 w-4" /> Analyze
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {result && (
        <div className="mt-8">
          <ThreatResult result={result} />
        </div>
      )}
    </main>
  );
}
