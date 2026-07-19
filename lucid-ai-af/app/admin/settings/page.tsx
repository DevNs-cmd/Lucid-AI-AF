"use client";

import { useState } from "react";
import Topbar from "@/components/admin/Topbar";
import { Button } from "@/components/ui/button";
import { mockSettings } from "@/lib/mockData";
import type { AppSettings } from "@/types";

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center justify-between py-3 border-b border-border/60 last:border-0 cursor-pointer">
      <span className="text-sm text-ink">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-arcane shadow-glow" : "bg-elevated border border-border"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${checked ? "left-5" : "left-0.5"}`} />
      </button>
    </label>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(mockSettings);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
  }

  return (
    <>
      <Topbar title="Settings" />
      <main className="p-5 md:p-8 max-w-2xl">
        <form onSubmit={handleSave} className="space-y-6">
          <section className="card-glow p-5 space-y-4">
            <h2 className="font-display text-base text-ink">General</h2>
            <div>
              <label className="block text-xs text-muted mb-1.5">Site name</label>
              <input
                value={settings.siteName}
                onChange={(e) => update("siteName", e.target.value)}
                className="w-full bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-ink focus:border-arcane outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5">Support email</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => update("supportEmail", e.target.value)}
                className="w-full bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-ink focus:border-arcane outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5">Max worlds per user</label>
              <input
                type="number"
                min={1}
                value={settings.maxWorldsPerUser}
                onChange={(e) => update("maxWorldsPerUser", Number(e.target.value))}
                className="w-full bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-ink focus:border-arcane outline-none"
              />
            </div>
          </section>

          <section className="card-glow p-5">
            <h2 className="font-display text-base text-ink mb-1">Platform Controls</h2>
            <Toggle checked={settings.registrationOpen} onChange={(v) => update("registrationOpen", v)} label="Allow new registrations" />
            <Toggle checked={settings.autoModeration} onChange={(v) => update("autoModeration", v)} label="Automatic content moderation" />
            <Toggle checked={settings.maintenanceMode} onChange={(v) => update("maintenanceMode", v)} label="Maintenance mode" />
          </section>

          <div className="flex items-center gap-3">
            <Button type="submit">Save changes</Button>
            {saved && <span className="text-xs text-success">Settings saved.</span>}
          </div>
        </form>
      </main>
    </>
  );
}
