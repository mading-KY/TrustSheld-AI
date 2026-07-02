import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-trust text-trust-foreground shadow-sm">
            <ShieldCheck className="h-5 w-5" strokeWidth={2.4} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-base font-semibold text-foreground">TrustShield AI</span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Fraud Prevention · East Africa
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {email ? (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/analyzer">Analyzer</NavLink>
              <NavLink to="/history">History</NavLink>
            </>
          ) : (
            <>
              <a href="/#features" className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
                Features
              </a>
              <a href="/#governance" className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
                AI Governance
              </a>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {email ? (
            <>
              <span className="hidden text-xs text-muted-foreground sm:inline">{email}</span>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="mr-1.5 h-4 w-4" /> Sign out
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link to="/auth">
                <Button size="sm">Get started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function NavLink({ to, children }: { to: "/dashboard" | "/analyzer" | "/history"; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      activeProps={{ className: "bg-accent text-accent-foreground" }}
    >
      {children}
    </Link>
  );
}
