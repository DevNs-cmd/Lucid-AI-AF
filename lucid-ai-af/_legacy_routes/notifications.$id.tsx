import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Check, Trash2 } from "lucide-react";
import { GlassCard } from "@/components/ui-primitives";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/notifications/$id")({
  component: NotificationDetail,
});

function NotificationDetail() {
  const { id } = Route.useParams();

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Link
        to="/notifications"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to notifications
      </Link>

      <GlassCard strong className="p-6 sm:p-8">
        <div className="flex flex-wrap items-start gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/5">
            <BookOpen className="h-6 w-6 text-electric" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Story update · #{id}
            </div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              New chapter unlocked: The Silver Veil
            </h1>
            <div className="mt-1 text-xs text-muted-foreground">2 minutes ago</div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="bg-white/5 hover:bg-white/10">
              <Check className="h-4 w-4" /> Mark read
            </Button>
            <Button variant="ghost" className="text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-6 space-y-4 text-sm leading-7 text-muted-foreground">
          <p>
            Your saved story <span className="text-foreground">Astral Wardens</span> just released
            chapter 12: <span className="text-foreground">The Silver Veil</span>. The Wardens are
            called to the edge of the Northern Reach where the sky itself has begun to fray.
          </p>
          <p>
            Continue where you left off, or share the update with your reading circle. This chapter
            includes new voice narration and 3 branching decisions.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button className="gradient-primary text-white hover:opacity-95 glow">
            Continue reading
          </Button>
          <Button variant="secondary" className="bg-white/5 hover:bg-white/10">
            Share update
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
