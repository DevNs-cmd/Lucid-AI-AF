"use client";

import { useMemo, useState } from "react";
import Topbar from "@/components/admin/Topbar";
import DataTable, { Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { mockUsers } from "@/lib/mockData";
import { formatDate } from "@/lib/utils";
import type { ManagedUser, UserStatus } from "@/types";

const statusTone: Record<UserStatus, "success" | "warning" | "danger"> = {
  active: "success",
  suspended: "warning",
  banned: "danger",
};

export default function UsersPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");
  const [users, setUsers] = useState<ManagedUser[]>(mockUsers);
  const [selected, setSelected] = useState<ManagedUser | null>(null);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesQuery = u.username.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "all" || u.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [users, query, statusFilter]);

  function updateStatus(id: string, status: UserStatus) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
    setSelected(null);
  }

  const columns: Column<ManagedUser>[] = [
    { header: "Username", accessor: (u) => <span className="font-medium">{u.username}</span> },
    { header: "Email", accessor: (u) => <span className="text-muted">{u.email}</span> },
    { header: "Role", accessor: (u) => <Badge tone={u.role === "admin" ? "info" : "neutral"}>{u.role}</Badge> },
    { header: "Status", accessor: (u) => <Badge tone={statusTone[u.status]}>{u.status}</Badge> },
    { header: "Worlds", accessor: (u) => u.worldsOwned },
    { header: "Joined", accessor: (u) => formatDate(u.joinedAt) },
    {
      header: "Actions",
      accessor: (u) => (
        <button className="text-arcane-light text-xs hover:underline" onClick={() => setSelected(u)}>
          Manage
        </button>
      ),
    },
  ];

  return (
    <>
      <Topbar title="User Management" />
      <main className="p-5 md:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search username or email…"
            className="flex-1 bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-arcane outline-none"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as UserStatus | "all")}
            className="bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-ink focus:border-arcane outline-none"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
        </div>

        <p className="text-xs text-muted">{filtered.length} of {users.length} users</p>

        <DataTable columns={columns} rows={filtered} rowKey={(u) => u.id} />
      </main>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected ? `Manage ${selected.username}` : ""}>
        {selected && (
          <div className="space-y-4">
            <p className="text-sm text-muted">
              {selected.email} · Current status: <Badge tone={statusTone[selected.status]}>{selected.status}</Badge>
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="ghost" onClick={() => updateStatus(selected.id, "active")}>Reinstate</Button>
              <Button variant="ghost" onClick={() => updateStatus(selected.id, "suspended")}>Suspend</Button>
              <Button variant="destructive" onClick={() => updateStatus(selected.id, "banned")}>Ban</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
