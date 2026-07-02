import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Mail,
  MessageSquare,
  Link2,
  Sparkles,
  Eye,
  Lock,
  Globe2,
  ArrowRight,
  AlertTriangle,
  ShieldAlert,
  BrainCircuit,
  BarChart3,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TrustShield AI — AI-Powered Fraud Prevention for East Africa" },
      {
        name: "description",
        content:
          "TrustShield AI analyzes SMS, emails, and URLs to detect phishing, SIM-swap, and BEC attacks. Explainable AI for stronger cyber resilience across East Africa.",
      },
      { property: "og:title", content: "TrustShield AI — Fraud Prevention & Digital Trust" },
      {
        property: "og:description",
        content:
          "Explainable AI that classifies suspicious communications as Safe, Suspicious, or High Risk — built for East Africa.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <Hero />
      <TrustBar />
      <Features />
      <WhyDigitalTrust />
      <Governance />
      <CTA />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid bg-radial-trust absolute inset-0" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
        <div className="flex flex-col justify-center">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-trust/20 bg-trust-soft px-3 py-1 text-xs font-medium text-trust">
            <Sparkles className="h-3.5 w-3.5" /> EACA Summit 2026 · Track 02 — Fraud Prevention & Trust
          </div>
          <h1 className="font-display text-4xl font-bold leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
            Stop fraud before it{" "}
            <span className="bg-gradient-to-r from-trust to-chart-5 bg-clip-text text-transparent">costs you</span>.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            TrustShield AI analyzes suspicious SMS, emails, and URLs and explains — in plain language — why they are
            Safe, Suspicious, or High Risk. Built for individuals, SMEs, and institutions across East Africa.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/auth">
              <Button size="lg" className="h-12 px-6">
                Analyze a message <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="h-12 px-6">
                How it works
              </Button>
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-trust" /> Minimal data retention
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-trust" /> Explainable AI
            </span>
            <span className="flex items-center gap-1.5">
              <Globe2 className="h-3.5 w-3.5 text-trust" /> East Africa focused
            </span>
          </div>
        </div>

        <div className="relative">
          <HeroPreview />
        </div>
      </div>
    </section>
  );
}

function HeroPreview() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-trust/20 via-transparent to-chart-5/20 blur-2xl" />
      <Card className="relative overflow-hidden border-0 shadow-[var(--shadow-trust)]">
        <div className="border-b border-border bg-muted/40 px-4 py-2.5 text-xs font-medium text-muted-foreground">
          Live analysis · sample SMS
        </div>
        <div className="space-y-4 p-5">
          <div className="rounded-lg bg-muted/60 p-3 font-mono text-xs leading-relaxed text-foreground">
            "URGENT: Your M-PESA account has been suspended. Verify now:
            <br />
            bit.ly/mp-secure-341 or lose access in 24hrs. Reply with your PIN."
          </div>
          <div className="rounded-xl bg-danger-soft p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-danger">
                <ShieldAlert className="h-5 w-5" />
                <span className="font-display text-lg font-bold">High Risk</span>
              </div>
              <span className="text-sm font-bold tabular-nums text-danger">94%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background/60">
              <div className="h-full w-[94%] rounded-full bg-danger" />
            </div>
          </div>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li className="flex gap-2"><span className="mt-1.5 h-1 w-1 rounded-full bg-danger" />Urgent language with 24h deadline</li>
            <li className="flex gap-2"><span className="mt-1.5 h-1 w-1 rounded-full bg-danger" />Shortened URL disguising destination</li>
            <li className="flex gap-2"><span className="mt-1.5 h-1 w-1 rounded-full bg-danger" />Requests PIN over SMS — impersonation</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}

function TrustBar() {
  const items = [
    "Phishing",
    "SIM-Swap",
    "Business Email Compromise",
    "Fake URLs",
    "OTP Fraud",
    "Impersonation",
  ];
  return (
    <div className="border-y border-border/70 bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-4 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:px-6">
        <span className="text-foreground/80">Detects:</span>
        {items.map((i) => (
          <span key={i}>· {i}</span>
        ))}
      </div>
    </div>
  );
}

function Features() {
  const cards = [
    { icon: MessageSquare, title: "SMS analysis", desc: "Spot fraudulent mobile-money and OTP scams instantly." },
    { icon: Mail, title: "Email analysis", desc: "Catch phishing, BEC, and impersonation across inboxes." },
    { icon: Link2, title: "URL scanning", desc: "Flag suspicious, shortened, or deceptive web links." },
    { icon: BrainCircuit, title: "Explainable AI", desc: "Every verdict comes with plain-language reasoning." },
    { icon: BarChart3, title: "Personal dashboard", desc: "Track analyses and threat trends over time." },
    { icon: ShieldCheck, title: "Actionable guidance", desc: "Get clear next steps tailored to each verdict." },
  ];
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionHeading eyebrow="Features" title="One platform for digital trust." />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ icon: Icon, title, desc }) => (
          <Card key={title} className="group border-border/70 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-trust)]">
            <CardContent className="p-6">
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-trust-soft text-trust transition-colors group-hover:bg-trust group-hover:text-trust-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function WhyDigitalTrust() {
  const stats = [
    { k: "3", u: "verdict tiers", d: "Safe · Suspicious · High Risk with confidence scoring" },
    { k: "6", u: "East African countries", d: "Kenya · Uganda · Tanzania · Rwanda · Burundi · S. Sudan" },
    { k: "0", u: "credentials requested", d: "We never ask for passwords, PINs, or OTPs" },
  ];
  return (
    <section className="border-y border-border/70 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Why digital trust matters" title="Digital growth is outpacing digital safety." />
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              Mobile money, e-commerce, and online banking have transformed the region — but fraud has grown with them.
              Existing security tools are often expensive, technical, and rarely explain their reasoning. TrustShield AI
              closes that gap with affordable, explainable protection for everyone.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.u} className="rounded-xl border border-border/70 bg-background p-5">
                <div className="font-display text-3xl font-bold text-trust">{s.k}</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-foreground">{s.u}</div>
                <p className="mt-2 text-xs text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Governance() {
  const principles = [
    { title: "Explainable", desc: "Every prediction includes plain-language reasoning." },
    { title: "Honest confidence", desc: "We show confidence, never claim perfect accuracy." },
    { title: "Human in the loop", desc: "AI supports your judgement — it doesn't replace it." },
    { title: "Privacy-first", desc: "Minimal retention; you can delete your history any time." },
    { title: "Educational", desc: "Every verdict teaches users how to spot threats." },
    { title: "Verify officially", desc: "We always encourage verification through official channels." },
  ];
  return (
    <section id="governance" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionHeading eyebrow="Responsible AI" title="Built on AI governance principles." />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {principles.map((p) => (
          <div key={p.title} className="flex gap-4 rounded-xl border border-border/70 bg-background p-5">
            <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-md bg-trust-soft text-trust">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-display text-base font-semibold text-foreground">{p.title}</h4>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-trust/20 bg-gradient-to-br from-trust via-trust to-chart-5 p-10 text-trust-foreground shadow-[var(--shadow-trust)] sm:p-14">
        <div className="bg-grid absolute inset-0 opacity-20" aria-hidden />
        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-background/15 px-3 py-1 text-xs font-medium backdrop-blur">
              <AlertTriangle className="h-3.5 w-3.5" /> One click could cost everything.
            </div>
            <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
              Start defending your digital life today.
            </h2>
            <p className="mt-3 text-base text-trust-foreground/85">
              Free during the EACA Summit 2026 hackathon. No card required.
            </p>
          </div>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="h-12 px-6">
              Create free account <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-trust">{eyebrow}</div>
      <h2 className="mt-2 max-w-2xl font-display text-3xl font-bold text-foreground sm:text-4xl">{title}</h2>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/70 bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-trust" />
          <span className="font-medium text-foreground">TrustShield AI</span>
          <span>© {new Date().getFullYear()} · Built for EACA Summit 2026</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Advancing Cyber Resilience & AI Governance Across East Africa.
        </p>
      </div>
    </footer>
  );
}
