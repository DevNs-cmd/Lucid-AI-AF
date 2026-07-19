import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/ui-primitives";
import { Switch } from "@/components/ui/switch";
import {
  BookOpen,
  CreditCard,
  MessageCircle,
  ShieldAlert,
  Star,
  Swords,
  UserPlus,
} from "lucide-react";

export const Route = createFileRoute("/notifications/settings")({
  component: NotificationsSettings,
});

const CATEGORIES = [
  { icon: BookOpen, label: "Story Updates", desc: "New chapters, edits and comments on your stories." },
  { icon: Swords, label: "Quest Completed", desc: "Alerts when a quest is finished or ready to claim." },
  { icon: UserPlus, label: "Friend Requests", desc: "When someone wants to connect with you." },
  { icon: MessageCircle, label: "AI Character Messages", desc: "Direct messages from AI companions." },
  { icon: Star, label: "Achievements", desc: "New badges, streaks and level ups." },
  { icon: CreditCard, label: "Subscription Updates", desc: "Billing, renewals and plan changes." },
  { icon: ShieldAlert, label: "Security Alerts", desc: "Logins, password changes and device activity." },
];

const CHANNELS = ["In-app", "Push", "Email"] as const;

function NotificationsSettings() {
  return (
    <div className="space-y-6">
      <GlassCard strong className="p-6 sm:p-8">
        <h2 className="text-lg font-semibold">Delivery channels</h2>
        <p className="text-sm text-muted-foreground">
          Choose where you'd like to receive each type of notification.
        </p>

        <div className="mt-6 overflow-x-auto">
          <div className="min-w-[560px]">
            <div className="grid grid-cols-[1fr_repeat(3,90px)] gap-4 border-b border-white/10 pb-3 text-xs uppercase tracking-wider text-muted-foreground">
              <div>Category</div>
              {CHANNELS.map((c) => (
                <div key={c} className="text-center">
                  {c}
                </div>
              ))}
            </div>

            {CATEGORIES.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="grid grid-cols-[1fr_repeat(3,90px)] items-center gap-4 border-b border-white/5 py-4 last:border-0"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/5">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{label}</div>
                    <div className="line-clamp-1 text-xs text-muted-foreground">{desc}</div>
                  </div>
                </div>
                {CHANNELS.map((c) => (
                  <div key={c} className="flex justify-center">
                    <Switch defaultChecked={c !== "Email" || label !== "Achievements"} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <h2 className="text-lg font-semibold">Quiet hours</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pause push notifications during your focus and sleep hours.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
            <Switch defaultChecked />
            <div className="text-sm">Enabled</div>
          </div>
          <div className="rounded-xl bg-white/5 px-4 py-3 text-sm">
            <span className="text-muted-foreground">From </span>22:00
            <span className="text-muted-foreground"> to </span>07:30
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
