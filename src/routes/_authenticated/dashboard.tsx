import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  BarChart3,
  ArrowRight,
  ScanSearch,
  Sparkles,
} from "lucide-react";
import { listAnalyses } from "@/lib/analyses.functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — TrustShield AI" }] }),
  component: Dashboard,
});

function Dashboard() {
  const list = useServerFn(listAnalyses);
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["analyses"],
    queryFn: () => list(),
  });

  const items = data ?? [];
  const total = items.length;
  const safe = items.filter((i) => i.classification === "safe").length;
  const suspicious = items.filter((i) => i.classification === "suspicious").length;
  const high = items.filter((i) => i.classification === "high_risk").length;

  const stats = [
    { label: "Total analyses", value: total, icon: BarChart3, tone: "trust" as const },
    { label: "Safe", value: safe, icon: ShieldCheck, tone: "safe" as const },
    { label: "Suspicious", value: suspicious, icon: AlertTriangle, tone: "warning" as const },
    { label: "High Risk", value: high, icon: ShieldAlert, tone: "danger" as const },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-trust">Dashboard</div>
          <h1 className="mt-1 font-display text-3xl font-bold text-foreground">Your protection overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track every analysis, verdict, and trend across your account.
          </p>
        </div>
        <Link to="/analyzer">
          <Button size="lg">
            <ScanSearch className="mr-2 h-4 w-4" /> Quick analysis
          </Button>
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} loading={isLoading} />
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <Card className="shadow-[var(--shadow-card)] lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent activity</CardTitle>
            <Link to="/history" className="text-xs font-medium text-trust hover:underline">
              View all →
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-14 animate-pulse rounded-lg bg-muted/50" />
                ))}
              </div>
            ) : items.length === 0 ? (
              <EmptyState onGo={() => router.navigate({ to: "/analyzer" })} />
            ) : (
              <ul className="divide-y divide-border/70">
                {items.slice(0, 6).map((it) => (
                  <li key={it.id} className="flex items-center gap-4 py-3">
                    <ClassBadge classification={it.classification} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm text-foreground">
                        <span className="mr-2 rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {it.content_type}
                        </span>
                        {it.content.slice(0, 90)}
                        {it.content.length > 90 ? "…" : ""}
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(it.created_at), { addSuffix: true })} · {it.confidence}% confidence
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-trust to-chart-5 text-trust-foreground shadow-[var(--shadow-trust)]">
          <CardContent className="p-6">
            <Sparkles className="h-5 w-5" />
            <h3 className="mt-3 font-display text-xl font-bold">Tip of the day</h3>
            <p className="mt-2 text-sm text-trust-foreground/90">
              Legitimate banks and mobile-money providers will <strong>never</strong> ask for your PIN, password, or
              OTP over SMS, WhatsApp, or email. When in doubt — verify through the official app or branch.
            </p>
            <Link to="/analyzer" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold underline-offset-4 hover:underline">
              Analyze a message <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
  loading,
}: {
  label: string;
  value: number;
  icon: typeof ShieldCheck;
  tone: "trust" | "safe" | "warning" | "danger";
  loading?: boolean;
}) {
  const toneMap = {
    trust: "bg-trust-soft text-trust",
    safe: "bg-safe-soft text-safe",
    warning: "bg-warning-soft text-warning-foreground",
    danger: "bg-danger-soft text-danger",
  };
  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
          <div className={cn("grid h-8 w-8 place-items-center rounded-md", toneMap[tone])}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 font-display text-3xl font-bold tabular-nums text-foreground">
          {loading ? <span className="inline-block h-8 w-12 animate-pulse rounded bg-muted" /> : value}
        </div>
      </CardContent>
    </Card>
  );
}

function ClassBadge({ classification }: { classification: "safe" | "suspicious" | "high_risk" }) {
  const m = {
    safe: { label: "Safe", cls: "bg-safe-soft text-safe" },
    suspicious: { label: "Suspicious", cls: "bg-warning-soft text-warning-foreground" },
    high_risk: { label: "High Risk", cls: "bg-danger-soft text-danger" },
  }[classification];
  return (
    <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold", m.cls)}>{m.label}</span>
  );
}

function EmptyState({ onGo }: { onGo: () => void }) {
  return (
    <div className="grid place-items-center rounded-xl border border-dashed border-border py-12 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-trust-soft text-trust">
        <ScanSearch className="h-6 w-6" />
      </div>
      <p className="mt-4 text-sm font-medium text-foreground">No analyses yet</p>
      <p className="mt-1 max-w-xs text-xs text-muted-foreground">
        Run your first analysis on a suspicious SMS, email, or URL to get started.
      </p>
      <Button className="mt-4" onClick={onGo}>
        Analyze content
      </Button>
    </div>
  );
}
