import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-primary/25 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-electric/20 blur-[120px]" />
        <div className="absolute top-1/3 left-0 h-[320px] w-[320px] rounded-full bg-neon/20 blur-[120px]" />
      </div>

      <div className="relative grid w-full max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Brand panel */}
        <div className="hidden flex-col justify-between rounded-3xl p-10 lg:flex glass-strong">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary glow">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Nebula OS</span>
          </Link>

          <div className="space-y-6">
            <h2 className="text-4xl font-semibold leading-tight tracking-tight">
              Step into the <span className="gradient-text">next dimension</span> of your workspace.
            </h2>
            <p className="max-w-md text-sm text-muted-foreground">
              A futuristic control center for your stories, quests, and every byte you own —
              secured end-to-end, synced everywhere.
            </p>
            <div className="flex flex-wrap gap-2">
              {["End-to-end encrypted", "Zero-trust auth", "Realtime sync"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {["A", "K", "R", "N"].map((c, i) => (
                <div
                  key={c}
                  className="grid h-9 w-9 place-items-center rounded-full border-2 border-background text-xs font-semibold text-white"
                  style={{
                    background: `linear-gradient(135deg, oklch(0.62 0.24 ${280 + i * 12}), oklch(0.62 0.22 ${240 - i * 8}))`,
                  }}
                >
                  {c}
                </div>
              ))}
            </div>
            <div className="text-xs text-muted-foreground">
              Joined by <span className="font-semibold text-foreground">42,908</span> creators this week
            </div>
          </div>
        </div>

        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
