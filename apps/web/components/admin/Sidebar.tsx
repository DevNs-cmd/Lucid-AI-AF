"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "◈" },
  { href: "/admin/users", label: "Users", icon: "◉" },
  { href: "/admin/worlds", label: "Worlds", icon: "◆" },
  { href: "/admin/analytics", label: "Analytics", icon: "◫" },
  { href: "/admin/logs", label: "Activity Logs", icon: "☰" },
  { href: "/admin/reports", label: "Reports", icon: "⚑" },
  { href: "/admin/settings", label: "Settings", icon: "⚙" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-60 shrink-0 flex-col border-r border-border bg-surface min-h-screen sticky top-0">
      <div className="px-5 py-6 flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-full bg-rune shadow-glow flex items-center justify-center font-display text-sm">L</div>
        <div>
          <p className="font-display text-sm tracking-wide text-ink leading-none">LUCID AI</p>
          <p className="text-[11px] text-muted mt-0.5">Admin Sanctum</p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition border border-transparent",
                active
                  ? "bg-elevated text-ink border-arcane/40 shadow-glow"
                  : "text-muted hover:text-ink hover:bg-elevated/60"
              )}
            >
              <span className={cn("text-base", active && "text-arcane-light")}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 text-[11px] text-muted border-t border-border">
        Monitoring Module v1.0
      </div>
    </aside>
  );
}
