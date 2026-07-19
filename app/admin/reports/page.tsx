"use client";

import { useState } from "react";
import Topbar from "@/components/admin/Topbar";
import DataTable, { Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { mockReports } from "@/lib/mockData";
import { formatDate } from "@/lib/utils";
import type { Report } from "@/types";

const statusTone: Record<Report["status"], "warning" | "info" | "success" | "neutral"> = {
  open: "warning",
  reviewing: "info",
  resolved: "success",
  dismissed: "neutral",
};

const NEXT_STATUS: Record<Report["status"], Report["status"]> = {
  open: "reviewing",
  reviewing: "resolved",
  resolved: "resolved",
  dismissed: "dismissed",
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(mockReports);

  function advance(id: string) {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: NEXT_STATUS[r.status] } : r)));
  }

  function dismiss(id: string) {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: "dismissed" } : r)));
  }

  const columns: Column<Report>[] = [
    { header: "Reporter", accessor: (r) => r.reporter },
    { header: "Target", accessor: (r) => <span className="font-medium">{r.target}</span> },
    { header: "Reason", accessor: (r) => <span className="text-muted">{r.reason}</span> },
    { header: "Status", accessor: (r) => <Badge tone={statusTone[r.status]}>{r.status}</Badge> },
    { header: "Filed", accessor: (r) => formatDate(r.createdAt) },
    {
      header: "Actions",
      accessor: (r) =>
        r.status === "open" || r.status === "reviewing" ? (
          <div className="flex gap-3">
            <button className="text-xs text-arcane-light hover:underline" onClick={() => advance(r.id)}>
              {r.status === "open" ? "Review" : "Resolve"}
            </button>
            <button className="text-xs text-danger hover:underline" onClick={() => dismiss(r.id)}>
              Dismiss
            </button>
          </div>
        ) : (
          <span className="text-xs text-muted">—</span>
        ),
    },
  ];

  return (
    <>
      <Topbar title="Reports" />
      <main className="p-5 md:p-8 space-y-4">
        <p className="text-xs text-muted">{reports.filter((r) => r.status === "open").length} open · {reports.length} total</p>
        <DataTable columns={columns} rows={reports} rowKey={(r) => r.id} />
      </main>
    </>
  );
}
