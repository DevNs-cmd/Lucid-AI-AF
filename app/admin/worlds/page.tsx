"use client";

import { useMemo, useState } from "react";
import Topbar from "@/components/admin/Topbar";
import DataTable, { Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { mockWorlds } from "@/lib/mockData";
import { formatDate, formatNumber } from "@/lib/utils";
import type { World, WorldStatus } from "@/types";

const statusTone: Record<WorldStatus, "success" | "neutral" | "warning"> = {
  live: "success",
  draft: "neutral",
  archived: "warning",
};

export default function WorldsPage() {
  const [query, setQuery] = useState("");
  const [worlds, setWorlds] = useState<World[]>(mockWorlds);

  const filtered = useMemo(
    () => worlds.filter((w) => w.name.toLowerCase().includes(query.toLowerCase()) || w.owner.toLowerCase().includes(query.toLowerCase())),
    [worlds, query]
  );

  function archive(id: string) {
    setWorlds((prev) => prev.map((w) => (w.id === id ? { ...w, status: "archived" } : w)));
  }

  const columns: Column<World>[] = [
    { header: "World", accessor: (w) => <span className="font-medium">{w.name}</span> },
    { header: "Biome", accessor: (w) => <span className="text-muted">{w.biome}</span> },
    { header: "Owner", accessor: (w) => w.owner },
    { header: "Status", accessor: (w) => <Badge tone={statusTone[w.status]}>{w.status}</Badge> },
    { header: "Population", accessor: (w) => formatNumber(w.population) },
    { header: "Created", accessor: (w) => formatDate(w.createdAt) },
    {
      header: "Actions",
      accessor: (w) =>
        w.status !== "archived" ? (
          <button className="text-xs text-danger hover:underline" onClick={() => archive(w.id)}>
            Archive
          </button>
        ) : (
          <span className="text-xs text-muted">—</span>
        ),
    },
  ];

  return (
    <>
      <Topbar title="World Management" />
      <main className="p-5 md:p-8 space-y-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search world or owner…"
          className="w-full sm:w-80 bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-arcane outline-none"
        />
        <p className="text-xs text-muted">{filtered.length} of {worlds.length} worlds</p>
        <DataTable columns={columns} rows={filtered} rowKey={(w) => w.id} />
      </main>
    </>
  );
}
