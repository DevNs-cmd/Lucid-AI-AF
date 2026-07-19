"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSession, logout } from "@/lib/auth";
import type { AdminUser } from "@/types";

export default function Topbar({ title }: { title: string }) {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    setUser(getSession());
  }, []);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-5 md:px-8 py-4 border-b border-border bg-void/80 backdrop-blur">
      <h1 className="font-display text-lg md:text-xl text-ink">{title}</h1>

      <div className="flex items-center gap-4">
        <input
          type="search"
          placeholder="Search the realm…"
          className="hidden sm:block w-56 bg-elevated border border-border rounded-lg px-3 py-1.5 text-sm text-ink placeholder:text-muted focus:border-arcane outline-none"
        />
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-rune flex items-center justify-center text-xs font-display">
            {user?.name?.charAt(0) ?? "A"}
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm text-ink">{user?.name ?? "Admin"}</p>
            <p className="text-[11px] text-muted capitalize">{user?.role ?? "admin"}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs text-muted hover:text-danger border border-border rounded-lg px-3 py-1.5 hover:border-danger/40 transition"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
