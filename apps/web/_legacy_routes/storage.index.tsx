import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FileText,
  FileVideo,
  HardDrive,
  Image as ImageIcon,
  Music,
  Package,
  TrendingUp,
} from "lucide-react";
import { GlassCard } from "@/components/ui-primitives";

export const Route = createFileRoute("/storage/")({
  component: StorageDashboard,
});

const BREAKDOWN = [
  { label: "Images", value: 42, color: "bg-primary", size: "18.4 GB", icon: ImageIcon },
  { label: "Videos", value: 28, color: "bg-electric", size: "12.2 GB", icon: FileVideo },
  { label: "Audio", value: 12, color: "bg-neon", size: "5.3 GB", icon: Music },
  { label: "Documents", value: 10, color: "bg-warning", size: "4.4 GB", icon: FileText },
  { label: "Other", value: 8, color: "bg-muted", size: "3.5 GB", icon: Package },
];

const RECENT = [
  { name: "hero-nebula.jpg", size: "3.2 MB", time: "2m ago", type: "image" },
  { name: "story-intro.mp4", size: "84 MB", time: "1h ago", type: "video" },
  { name: "kaia-voice.wav", size: "12 MB", time: "3h ago", type: "audio" },
  { name: "contract.pdf", size: "540 KB", time: "Yesterday", type: "doc" },
];

function iconFor(t: string) {
  return t === "image" ? ImageIcon : t === "video" ? FileVideo : t === "audio" ? Music : FileText;
}

function StorageDashboard() {
  const used = 43.8;
  const total = 100;
  const pct = (used / total) * 100;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <GlassCard strong className="p-6 lg:col-span-2">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Storage used</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-4xl font-semibold gradient-text">{used} GB</span>
              <span className="text-sm text-muted-foreground">of {total} GB</span>
            </div>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-xl gradient-primary glow">
            <HardDrive className="h-5 w-5 text-white" />
          </div>
        </div>

        <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background:
                "linear-gradient(90deg, oklch(0.62 0.24 300), oklch(0.72 0.19 240))",
              boxShadow: "0 0 20px oklch(0.62 0.24 300 / 0.6)",
            }}
          />
        </div>

        <div className="mt-6 space-y-3">
          {BREAKDOWN.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.label} className="flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/5">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{b.label}</span>
                    <span className="text-muted-foreground">{b.size}</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                    <div className={`h-full ${b.color}`} style={{ width: `${b.value}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      <div className="space-y-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">This week</div>
            <TrendingUp className="h-4 w-4 text-success" />
          </div>
          <div className="mt-1 text-3xl font-semibold gradient-text">+2.4 GB</div>
          <div className="text-xs text-muted-foreground">128 new files uploaded</div>
          <div className="mt-4 flex h-16 items-end gap-1.5">
            {[30, 55, 40, 70, 45, 80, 65].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-md gradient-primary opacity-80"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold">Recent uploads</div>
            <Link to="/storage/files" className="text-xs text-muted-foreground hover:text-foreground">
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {RECENT.map((f) => {
              const Icon = iconFor(f.type);
              return (
                <div key={f.name} className="flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-white/5">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/5">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm">{f.name}</div>
                    <div className="text-xs text-muted-foreground">{f.size} · {f.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
