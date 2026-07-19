import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { LayoutGrid, Upload } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/storage")({
  component: StorageLayout,
});

const TABS = [
  { to: "/storage", label: "Dashboard", end: true },
  { to: "/storage/files", label: "Files", end: false },
  { to: "/storage/upload", label: "Upload", end: false },
];

function StorageLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            <span className="gradient-text">Storage</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your files, previews and usage — all in one place.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="bg-white/5 hover:bg-white/10" asChild>
            <Link to="/storage/files">
              <LayoutGrid className="h-4 w-4" /> Browse files
            </Link>
          </Button>
          <Button className="gradient-primary text-white hover:opacity-95 glow" asChild>
            <Link to="/storage/upload">
              <Upload className="h-4 w-4" /> Upload
            </Link>
          </Button>
        </div>
      </div>

      <div className="mb-6 flex gap-1 rounded-xl bg-white/5 p-1">
        {TABS.map((t) => {
          const active = t.end ? path === t.to : path.startsWith(t.to) && path !== "/storage";
          const rootActive = t.end && path === "/storage";
          const isActive = rootActive || (!t.end && active);
          return (
            <Link
              key={t.to}
              to={t.to}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      <Outlet />
    </AppShell>
  );
}
