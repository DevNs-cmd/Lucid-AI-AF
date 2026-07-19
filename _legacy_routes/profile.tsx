import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Camera,
  Check,
  Eye,
  EyeOff,
  Github,
  Globe,
  Loader2,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Save,
  Shield,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { GlassCard, PageHeader } from "@/components/ui-primitives";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/auth-shared";
import { Switch } from "@/components/ui/switch";
import { GoogleIcon } from "@/components/icons";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const [tab, setTab] = useState<"profile" | "password" | "connections">("profile");
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function save() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    }, 900);
  }

  return (
    <AppShell>
      <PageHeader title="Your profile" subtitle="Manage your identity, security and connected apps." />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Left column */}
        <div className="space-y-6">
          <GlassCard strong className="p-6 text-center">
            <div className="relative mx-auto w-fit">
              <div className="grid h-24 w-24 place-items-center rounded-2xl gradient-primary text-3xl font-semibold text-white glow">
                AV
              </div>
              <button className="absolute -bottom-2 -right-2 grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-background text-foreground hover:bg-white/10">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 text-lg font-semibold">Ava Reyes</div>
            <div className="text-sm text-muted-foreground">Storyteller · Pro plan</div>
            <div className="mt-3 flex items-center justify-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Lisbon
              </span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" /> ava.reyes
              </span>
            </div>
          </GlassCard>

          <GlassCard className="p-2">
            {[
              { k: "profile", l: "Edit profile", i: Mail },
              { k: "password", l: "Change password", i: Lock },
              { k: "connections", l: "Connected apps", i: Shield },
            ].map(({ k, l, i: Icon }) => (
              <button
                key={k}
                onClick={() => setTab(k as typeof tab)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  tab === k ? "bg-white/10 text-foreground" : "text-muted-foreground hover:bg-white/5"
                }`}
              >
                <Icon className="h-4 w-4" />
                {l}
              </button>
            ))}
            <div className="my-2 h-px bg-white/10" />
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </GlassCard>
        </div>

        {/* Right column */}
        <div>
          {tab === "profile" && (
            <GlassCard strong className="p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold">Personal information</h2>
                <p className="text-sm text-muted-foreground">
                  These details will appear on your public profile.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name">
                  <Input defaultValue="Ava Reyes" className="h-11 border-white/10 bg-white/5" />
                </Field>
                <Field label="Username">
                  <Input defaultValue="ava.reyes" className="h-11 border-white/10 bg-white/5" />
                </Field>
                <Field label="Email">
                  <Input defaultValue="ava@nebula.io" className="h-11 border-white/10 bg-white/5" />
                </Field>
                <Field label="Location">
                  <Input defaultValue="Lisbon, Portugal" className="h-11 border-white/10 bg-white/5" />
                </Field>
                <Field label="Bio" className="sm:col-span-2">
                  <Textarea
                    rows={4}
                    defaultValue="Writing interactive stories at the edge of what's possible."
                    className="border-white/10 bg-white/5"
                  />
                </Field>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-muted-foreground">
                  Last updated · 3 days ago
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost">Cancel</Button>
                  <Button
                    onClick={save}
                    disabled={saving}
                    className="gradient-primary text-white hover:opacity-95 glow"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : saved ? (
                      <>
                        <Check className="h-4 w-4" /> Saved
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" /> Save changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </GlassCard>
          )}

          {tab === "password" && (
            <GlassCard strong className="p-6 sm:p-8">
              <h2 className="mb-1 text-lg font-semibold">Change password</h2>
              <p className="mb-6 text-sm text-muted-foreground">
                Use at least 8 characters with a mix of letters, numbers and symbols.
              </p>
              <div className="max-w-md space-y-4">
                {["Current password", "New password", "Confirm new password"].map((label, i) => (
                  <Field key={i} label={label}>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type={show ? "text" : "password"}
                        className="h-11 pl-9 pr-10 border-white/10 bg-white/5"
                      />
                      {i === 0 && (
                        <button
                          type="button"
                          onClick={() => setShow((v) => !v)}
                          className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-white/5"
                        >
                          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      )}
                    </div>
                  </Field>
                ))}
                <Button className="gradient-primary text-white hover:opacity-95 glow">
                  Update password
                </Button>
              </div>
            </GlassCard>
          )}

          {tab === "connections" && (
            <GlassCard strong className="p-6 sm:p-8">
              <h2 className="mb-6 text-lg font-semibold">Connected accounts</h2>
              <div className="space-y-3">
                {[
                  { icon: GoogleIcon, name: "Google", desc: "ava@gmail.com", connected: true },
                  { icon: Github, name: "GitHub", desc: "@avareyes", connected: true },
                  { icon: Shield, name: "Two-factor auth", desc: "Authenticator app", connected: false },
                ].map(({ icon: Icon, name, desc, connected }) => (
                  <div
                    key={name}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/5">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{name}</div>
                        <div className="text-xs text-muted-foreground">{desc}</div>
                      </div>
                    </div>
                    <Switch defaultChecked={connected} />
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </AppShell>
  );
}
