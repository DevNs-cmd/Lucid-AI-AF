import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/notifications")({
  component: NotificationsLayout,
});

function NotificationsLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isSettings = path.endsWith("/settings");

  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            <span className="gradient-text">Notifications</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Stay in the loop across stories, quests and messages.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant={isSettings ? "secondary" : "ghost"} className="bg-white/5 hover:bg-white/10" asChild>
            <Link to="/notifications/settings">
              <Settings className="h-4 w-4" /> Settings
            </Link>
          </Button>
        </div>
      </div>
      <Outlet />
    </AppShell>
  );
}
