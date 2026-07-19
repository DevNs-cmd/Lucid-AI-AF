import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Shield,
  Sparkles,
  User as UserIcon,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type NavItem = { to: string; label: string; icon: typeof Bell };

const NAV: NavItem[] = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/auth/login", label: "Authentication", icon: Shield },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/storage", label: "Storage", icon: FolderOpen },
  { to: "/profile", label: "Profile", icon: UserIcon },
];

export function AppShell({ children }: { children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen w-full text-foreground">
      {/* Ambient orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-primary/30 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-electric/20 blur-[140px]" />
      </div>

      <div className="relative flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-72 shrink-0 transform p-4 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="glass-strong flex h-full flex-col rounded-3xl p-5">
            <Link to="/" className="mb-8 flex items-center gap-3" onClick={() => setOpen(false)}>
              <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary glow">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold tracking-tight">Nebula OS</div>
                <div className="text-xs text-muted-foreground">Futuristic workspace</div>
              </div>
            </Link>

            <nav className="flex flex-1 flex-col gap-1">
              {NAV.map((item) => {
                const active =
                  item.to === "/"
                    ? path === "/"
                    : path.startsWith(item.to.split("/").slice(0, 2).join("/"));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                      active
                        ? "bg-white/10 text-foreground"
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-8 w-8 place-items-center rounded-lg transition-colors",
                        active
                          ? "gradient-primary text-white"
                          : "bg-white/5 text-muted-foreground group-hover:text-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="font-medium">{item.label}</span>
                    {active && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_currentColor]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full gradient-primary text-sm font-semibold text-white">
                  AV
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">Ava Reyes</div>
                  <div className="truncate text-xs text-muted-foreground">ava@nebula.io</div>
                </div>
                <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
                  <Link to="/auth/login" aria-label="Sign out">
                    <LogOut className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {open && (
          <button
            aria-label="Close menu"
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 px-4 pt-4 lg:px-6">
            <div className="glass flex items-center gap-3 rounded-2xl px-3 py-2.5">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <div className="flex flex-1 items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  placeholder="Search anything…"
                />
                <kbd className="hidden rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline">
                  ⌘K
                </kbd>
              </div>
              <Link
                to="/notifications"
                className="relative grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-foreground transition-colors hover:bg-white/10"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                  5
                </span>
              </Link>
              <Link
                to="/profile"
                className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-xs font-semibold text-white"
              >
                AV
              </Link>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 lg:px-6 lg:py-8">{children ?? <Outlet />}</main>
        </div>
      </div>
    </div>
  );
}
