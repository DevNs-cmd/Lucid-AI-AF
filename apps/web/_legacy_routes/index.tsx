import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bell, FolderOpen, Shield, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { GlassCard } from "@/components/ui-primitives";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Home,
});

const MODULES = [
  {
    to: "/auth/login",
    icon: Shield,
    title: "Authentication",
    desc: "Login, sign up, verification, password reset, profile.",
    links: [
      { to: "/auth/login", label: "Login" },
      { to: "/auth/signup", label: "Sign up" },
      { to: "/auth/forgot-password", label: "Forgot" },
      { to: "/auth/reset-password", label: "Reset" },
      { to: "/auth/verify-email", label: "Verify" },
      { to: "/profile", label: "Profile" },
    ],
  },
  {
    to: "/notifications",
    icon: Bell,
    title: "Notifications",
    desc: "Center, detail, settings with categories and channels.",
    links: [
      { to: "/notifications", label: "Center" },
      { to: "/notifications/settings", label: "Settings" },
    ],
  },
  {
    to: "/storage",
    icon: FolderOpen,
    title: "Storage",
    desc: "Dashboard, file manager, drag-and-drop uploads.",
    links: [
      { to: "/storage", label: "Dashboard" },
      { to: "/storage/files", label: "Files" },
      { to: "/storage/upload", label: "Upload" },
    ],
  },
] as const;

function Home() {
  return (
    <AppShell>
      <section className="mb-8">
        <GlassCard strong className="relative overflow-hidden p-8 sm:p-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/40 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-electric/30 blur-[100px]" />

          <div className="relative max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Nebula OS · UI System v1
            </div>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              A <span className="gradient-text">futuristic workspace</span> for auth, alerts and files.
            </h1>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
              Premium dark theme, glassmorphism, and micro-interactions — production-ready screens
              ready to wire up to your APIs.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button className="h-11 gradient-primary text-white hover:opacity-95 glow" asChild>
                <Link to="/auth/signup">
                  Get started <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="secondary" className="h-11 bg-white/5 hover:bg-white/10" asChild>
                <Link to="/storage">Explore modules</Link>
              </Button>
            </div>
          </div>
        </GlassCard>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MODULES.map(({ to, icon: Icon, title, desc, links }) => (
          <GlassCard key={to} className="flex flex-col p-6 transition-transform hover:-translate-y-1">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl gradient-primary glow">
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div className="text-lg font-semibold">{title}</div>
            <div className="mt-1 flex-1 text-sm text-muted-foreground">{desc}</div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {links.map((l) => (
                <Link
                  key={l.to + l.label}
                  to={l.to}
                  className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </GlassCard>
        ))}
      </section>
    </AppShell>
  );
}
