import { AlertTriangle, ShieldCheck, ShieldAlert, Info, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type Classification = "safe" | "suspicious" | "high_risk";

export interface AnalysisResult {
  classification: Classification;
  confidence: number;
  explanation: string;
  indicators: string[];
  recommendations: string[];
}

const META: Record<
  Classification,
  { label: string; icon: typeof ShieldCheck; ring: string; bg: string; text: string; bar: string; desc: string }
> = {
  safe: {
    label: "Safe",
    icon: ShieldCheck,
    ring: "ring-safe/30",
    bg: "bg-safe-soft",
    text: "text-safe",
    bar: "bg-safe",
    desc: "No significant phishing or fraud indicators detected.",
  },
  suspicious: {
    label: "Suspicious",
    icon: AlertTriangle,
    ring: "ring-warning/40",
    bg: "bg-warning-soft",
    text: "text-warning-foreground",
    bar: "bg-warning",
    desc: "Some indicators warrant caution — verify before acting.",
  },
  high_risk: {
    label: "High Risk",
    icon: ShieldAlert,
    ring: "ring-danger/40",
    bg: "bg-danger-soft",
    text: "text-danger",
    bar: "bg-danger",
    desc: "Strong signals of phishing or fraud — do not engage.",
  },
};

export function ThreatResult({ result }: { result: AnalysisResult }) {
  const m = META[result.classification];
  const Icon = m.icon;
  const pct = Math.max(0, Math.min(100, result.confidence));

  return (
    <div className="space-y-6">
      <Card className={cn("overflow-hidden border-0 ring-1 shadow-[var(--shadow-card)]", m.ring)}>
        <div className={cn("px-6 py-5", m.bg)}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className={cn("grid h-14 w-14 place-items-center rounded-xl bg-background/70 backdrop-blur", m.text)}>
                <Icon className="h-7 w-7" strokeWidth={2.2} />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Threat Classification
                </div>
                <div className={cn("font-display text-2xl font-bold", m.text)}>{m.label}</div>
                <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
              </div>
            </div>
            <div className="w-full sm:w-64">
              <div className="mb-1.5 flex items-baseline justify-between text-xs font-medium text-muted-foreground">
                <span>AI Confidence</span>
                <span className={cn("text-base font-bold tabular-nums", m.text)}>{pct}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-background/60">
                <div className={cn("h-full rounded-full transition-all", m.bar)} style={{ width: `${pct}%` }} />
              </div>
            </div>
          </div>
        </div>

        <CardContent className="space-y-2 pt-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Info className="h-4 w-4 text-trust" /> AI Explanation
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{result.explanation}</p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-warning" /> Detected Indicators
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.indicators.length === 0 ? (
              <p className="text-sm text-muted-foreground">No suspicious indicators were detected.</p>
            ) : (
              <ul className="space-y-2.5">
                {result.indicators.map((i, idx) => (
                  <li key={idx} className="flex gap-2.5 text-sm text-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="h-4 w-4 text-trust" /> Recommended Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {result.recommendations.map((r, idx) => (
                <li key={idx} className="flex gap-2.5 text-sm text-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-trust" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <p className="rounded-lg border border-border/70 bg-muted/40 p-3 text-xs text-muted-foreground">
        <strong className="text-foreground">AI Governance note:</strong> TrustShield AI provides decision support, not
        a final verdict. Always verify sensitive requests through official channels.
      </p>
    </div>
  );
}
