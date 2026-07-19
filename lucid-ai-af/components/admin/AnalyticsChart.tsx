import type { AnalyticsPoint } from "@/types";

interface AnalyticsChartProps {
  data: AnalyticsPoint[];
  metric: keyof Omit<AnalyticsPoint, "label">;
  color?: string;
}

export default function AnalyticsChart({ data, metric, color = "#A855F7" }: AnalyticsChartProps) {
  const width = 640;
  const height = 220;
  const padding = 32;
  const values = data.map((d) => d[metric]);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((d[metric] - min) / range) * (height - padding * 2);
    return { x, y, label: d.label, value: d[metric] };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x},${height - padding} L${points[0].x},${height - padding} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56" role="img" aria-label={`${metric} trend chart`}>
      <defs>
        <linearGradient id={`grad-${metric}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1={padding}
          x2={width - padding}
          y1={padding + f * (height - padding * 2)}
          y2={padding + f * (height - padding * 2)}
          stroke="#2E2249"
          strokeWidth={1}
        />
      ))}
      <path d={areaPath} fill={`url(#grad-${metric})`} stroke="none" />
      <path d={linePath} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p) => (
        <g key={p.label}>
          <circle cx={p.x} cy={p.y} r={3.5} fill={color} />
          <text x={p.x} y={height - 8} textAnchor="middle" fontSize={11} fill="#8B7FA8">
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
