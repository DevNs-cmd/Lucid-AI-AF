"use client";

import { useMemo, useState } from "react";
import Topbar from "@/components/admin/Topbar";
import DataTable, { Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { mockLogs } from "@/lib/mockData";
import { formatDateTime } from "@/lib/utils";
import type { ActivityLog, LogSeverity } from "@/types";

const severityTone: Record<LogSeverity, "info" | "warning" | "danger"> = {
  info: "info",
  warning: "warning",
  critical: "danger",
};

export default function LogsPage() {
  const [severity, setSeverity] = useState<LogSeverity | "all">("all");

  const filtered = useMemo(
    () => (severity === "all" ? mockLogs : mockLogs.filter((l) => l.severity === severity)),
    [severity]
  );

  const columns: Column<ActivityLog>[] = [
    { header: "Severity", accessor: (l) => <Badge tone={severityTone[l.severity]}>{l.severity}</Badge> },
    { header: "Actor", accessor: (l) => <span className="font-medium">{l.actor}</span> },
    { header: "Action", accessor: (l) => l.action },
    { header: "Target", accessor: (l) => <span className="text-muted">{l.target}</span> },
    { header: "Timestamp", accessor: (l) => <span className="font-mono text-xs">{formatDateTime(l.timestamp)}</span> },
  ];

  return (
    <>
      <Topbar title="Activity Logs" />
      <main className="p-5 md:p-8 space-y-4">
        <div className="flex gap-2">
          {(["all", "info", "warning", "critical"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSeverity(s)}
              className={`px-3 py-1.5 rounded-lg text-xs capitalize border transition ${
                severity === s ? "bg-elevated border-arcane text-ink" : "border-border text-muted hover:text-ink"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted">{filtered.length} of {mockLogs.length} events</p>
        <DataTable columns={columns} rows={filtered} rowKey={(l) => l.id} />
      </main>
    </>
  );
}
