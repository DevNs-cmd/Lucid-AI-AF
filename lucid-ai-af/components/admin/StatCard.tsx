import { cn, formatNumber } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  delta: number;
  suffix?: string;
}

export default function StatCard({ label, value, delta, suffix }: StatCardProps) {
  const positive = delta >= 0;
  return (
    <div className="card-glow p-5">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="font-display text-3xl text-ink mt-2">
        {formatNumber(value)}
        {suffix}
      </p>
      <p className={cn("text-xs mt-2 font-medium", positive ? "text-success" : "text-danger")}>
        {positive ? "▲" : "▼"} {Math.abs(delta)}% this week
      </p>
    </div>
  );
}
