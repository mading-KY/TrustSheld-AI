import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Search, Trash2, ChevronDown, ChevronRight, ScanSearch } from "lucide-react";
import { listAnalyses, deleteAnalysis } from "@/lib/analyses.functions";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThreatResult } from "@/components/threat-result";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/history")({
  head: () => ({ meta: [{ title: "History — TrustShield AI" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const list = useServerFn(listAnalyses);
  const del = useServerFn(deleteAnalysis);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["analyses"], queryFn: () => list() });
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "safe" | "suspicious" | "high_risk">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const remove = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => {
      toast.success("Analysis deleted.");
      qc.invalidateQueries({ queryKey: ["analyses"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  const rows = useMemo(() => {
    const src = data ?? [];
    return src.filter((r) => {
      if (filter !== "all" && r.classification !== filter) return false;
      if (q && !r.content.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [data, q, filter]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-trust">Analysis history</div>
          <h1 className="mt-1 font-display text-3xl font-bold text-foreground">Past analyses</h1>
          <p className="mt-1 text-sm text-muted-foreground">Search, filter, and review previous verdicts.</p>
        </div>
        <Link to="/analyzer">
          <Button>
            <ScanSearch className="mr-2 h-4 w-4" /> New analysis
          </Button>
        </Link>
      </div>

      <Card className="mt-6 shadow-[var(--shadow-card)]">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search content…" className="pl-9" />
            </div>
            <div className="flex gap-1.5">
              {(["all", "safe", "suspicious", "high_risk"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "rounded-md px-3 py-2 text-xs font-semibold capitalize transition",
                    filter === f
                      ? "bg-trust text-trust-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {f === "high_risk" ? "High Risk" : f}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4 overflow-hidden shadow-[var(--shadow-card)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="w-10 px-4 py-3"></th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Content</th>
                <th className="px-4 py-3">Verdict</th>
                <th className="px-4 py-3 text-right">Confidence</th>
                <th className="w-10 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="px-4 py-3">
                      <div className="h-6 animate-pulse rounded bg-muted/50" />
                    </td>
                  </tr>
                ))
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    No matching analyses.
                  </td>
                </tr>
              ) : (
                rows.map((r) => {
                  const isOpen = expanded === r.id;
                  return (
                    <>
                      <tr key={r.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setExpanded(isOpen ? null : r.id)}
                            className="grid h-6 w-6 place-items-center rounded text-muted-foreground hover:bg-accent"
                            aria-label={isOpen ? "Collapse" : "Expand"}
                          >
                            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </button>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                          {format(new Date(r.created_at), "MMM d, yyyy · HH:mm")}
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            {r.content_type}
                          </span>
                        </td>
                        <td className="max-w-md px-4 py-3">
                          <div className="truncate text-foreground">{r.content}</div>
                        </td>
                        <td className="px-4 py-3">
                          <Verdict c={r.classification} />
                        </td>
                        <td className="px-4 py-3 text-right font-semibold tabular-nums text-foreground">
                          {r.confidence}%
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => remove.mutate(r.id)}
                            className="text-muted-foreground hover:text-danger"
                            aria-label="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                      {isOpen && (
                        <tr key={`${r.id}-detail`} className="bg-muted/20">
                          <td colSpan={7} className="px-4 py-5">
                            <div className="mb-3 rounded-lg bg-background p-3 font-mono text-xs leading-relaxed text-muted-foreground">
                              {r.content}
                            </div>
                            <ThreatResult
                              result={{
                                classification: r.classification,
                                confidence: r.confidence,
                                explanation: r.explanation,
                                indicators: r.indicators as string[],
                                recommendations: r.recommendations as string[],
                              }}
                            />
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  );
}

function Verdict({ c }: { c: "safe" | "suspicious" | "high_risk" }) {
  const m = {
    safe: { label: "Safe", cls: "bg-safe-soft text-safe" },
    suspicious: { label: "Suspicious", cls: "bg-warning-soft text-warning-foreground" },
    high_risk: { label: "High Risk", cls: "bg-danger-soft text-danger" },
  }[c];
  return <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", m.cls)}>{m.label}</span>;
}
