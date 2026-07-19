import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  BellOff,
  BookOpen,
  Check,
  CheckCheck,
  MessageCircle,
  Search,
  ShieldAlert,
  Sparkles,
  Star,
  Swords,
  Trash2,
  UserPlus,
  CreditCard,
  Filter,
} from "lucide-react";
import { GlassCard } from "@/components/ui-primitives";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications/")({
  component: NotificationsCenter,
});

type Category =
  | "story"
  | "quest"
  | "friend"
  | "ai"
  | "achievement"
  | "subscription"
  | "security";

type Notification = {
  id: string;
  category: Category;
  title: string;
  body: string;
  time: string;
  unread: boolean;
};

const CATS: Record<Category, { label: string; icon: typeof Sparkles; color: string }> = {
  story: { label: "Story Updates", icon: BookOpen, color: "text-electric" },
  quest: { label: "Quest Completed", icon: Swords, color: "text-success" },
  friend: { label: "Friend Requests", icon: UserPlus, color: "text-primary" },
  ai: { label: "AI Character Messages", icon: MessageCircle, color: "text-neon" },
  achievement: { label: "Achievements", icon: Star, color: "text-warning" },
  subscription: { label: "Subscription", icon: CreditCard, color: "text-electric" },
  security: { label: "Security Alerts", icon: ShieldAlert, color: "text-destructive" },
};

const SEED: Notification[] = [
  { id: "1", category: "story", title: "New chapter unlocked: The Silver Veil", body: "Your saved story 'Astral Wardens' just released chapter 12.", time: "2m", unread: true },
  { id: "2", category: "quest", title: "Quest completed: Guardian of the North", body: "You've earned 240 XP and a rare artifact.", time: "14m", unread: true },
  { id: "3", category: "ai", title: "Kaia sent you a message", body: "\"Are you ready for what waits beyond the citadel?\"", time: "1h", unread: true },
  { id: "4", category: "friend", title: "Jordan wants to connect", body: "You have 3 friends in common.", time: "3h", unread: true },
  { id: "5", category: "achievement", title: "Achievement unlocked: Nightwalker", body: "Completed 10 stories after midnight.", time: "Yesterday", unread: false },
  { id: "6", category: "subscription", title: "Your Pro plan renews on Aug 12", body: "$12.00 will be billed to Visa •• 4242.", time: "2d", unread: false },
  { id: "7", category: "security", title: "New device signed in", body: "MacBook Pro · Lisbon, PT. If this wasn't you, secure your account.", time: "3d", unread: false },
];

const FILTERS = [
  { k: "all", l: "All" },
  { k: "unread", l: "Unread" },
] as const;

function NotificationsCenter() {
  const [items, setItems] = useState<Notification[]>(SEED);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["k"]>("all");
  const [cat, setCat] = useState<Category | "all">("all");

  const filtered = useMemo(
    () =>
      items.filter((n) => {
        if (filter === "unread" && !n.unread) return false;
        if (cat !== "all" && n.category !== cat) return false;
        if (q && !`${n.title} ${n.body}`.toLowerCase().includes(q.toLowerCase())) return false;
        return true;
      }),
    [items, filter, cat, q],
  );

  const unreadCount = items.filter((i) => i.unread).length;

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      {/* Categories rail */}
      <aside className="space-y-4">
        <GlassCard className="p-2">
          <button
            onClick={() => setCat("all")}
            className={cn(
              "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors",
              cat === "all" ? "bg-white/10" : "hover:bg-white/5 text-muted-foreground",
            )}
          >
            <span className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/5">
                <Filter className="h-4 w-4" />
              </span>
              All notifications
            </span>
            <span className="text-xs text-muted-foreground">{items.length}</span>
          </button>
          <div className="my-2 h-px bg-white/10" />
          {(Object.keys(CATS) as Category[]).map((k) => {
            const c = CATS[k];
            const n = items.filter((i) => i.category === k).length;
            const Icon = c.icon;
            return (
              <button
                key={k}
                onClick={() => setCat(k)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors",
                  cat === k ? "bg-white/10" : "hover:bg-white/5 text-muted-foreground",
                )}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/5">
                    <Icon className={cn("h-4 w-4", c.color)} />
                  </span>
                  <span className="truncate">{c.label}</span>
                </span>
                <span className="text-xs text-muted-foreground">{n}</span>
              </button>
            );
          })}
        </GlassCard>

        <GlassCard className="p-4">
          <div className="text-xs text-muted-foreground">Unread</div>
          <div className="mt-1 text-3xl font-semibold gradient-text">{unreadCount}</div>
          <Button
            onClick={() => setItems((it) => it.map((i) => ({ ...i, unread: false })))}
            className="mt-3 w-full bg-white/5 hover:bg-white/10"
            variant="secondary"
          >
            <CheckCheck className="h-4 w-4" /> Mark all as read
          </Button>
        </GlassCard>
      </aside>

      {/* List */}
      <div className="space-y-4">
        <GlassCard className="flex flex-wrap items-center gap-3 p-3">
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search notifications…"
              className="h-8 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
            />
          </div>
          <div className="flex gap-1 rounded-xl bg-white/5 p-1">
            {FILTERS.map((f) => (
              <button
                key={f.k}
                onClick={() => setFilter(f.k)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  filter === f.k ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {f.l}
              </button>
            ))}
          </div>
        </GlassCard>

        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <GlassCard strong className="divide-y divide-white/5 overflow-hidden">
            {filtered.map((n) => {
              const c = CATS[n.category];
              const Icon = c.icon;
              return (
                <Link
                  to="/notifications/$id"
                  params={{ id: n.id }}
                  key={n.id}
                  className="group flex gap-4 p-4 transition-colors hover:bg-white/5"
                >
                  <div className="relative">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/5">
                      <Icon className={cn("h-5 w-5", c.color)} />
                    </div>
                    {n.unread && (
                      <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_10px_currentColor] text-primary" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <div className="truncate text-sm font-medium">{n.title}</div>
                      <div className="ml-auto shrink-0 text-xs text-muted-foreground">{n.time}</div>
                    </div>
                    <div className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{n.body}</div>
                    <div className="mt-2 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setItems((it) =>
                            it.map((i) => (i.id === n.id ? { ...i, unread: false } : i)),
                          );
                        }}
                        className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                      >
                        <Check className="h-3 w-3" /> Mark read
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setItems((it) => it.filter((i) => i.id !== n.id));
                        }}
                        className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-1 text-xs text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </GlassCard>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <GlassCard strong className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/5">
        <BellOff className="h-7 w-7 text-muted-foreground" />
      </div>
      <div className="text-lg font-semibold">You're all caught up</div>
      <div className="max-w-sm text-sm text-muted-foreground">
        No notifications match your filters. Try changing the category, or check back later — new
        adventures are always brewing.
      </div>
    </GlassCard>
  );
}
