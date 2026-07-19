import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Eye, EyeOff, Loader2, Lock, ShieldCheck } from "lucide-react";
import { AuthCard, Field } from "@/components/auth-shared";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth/reset-password")({
  component: ResetPage,
});

function score(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

function ResetPage() {
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const s = useMemo(() => score(pw), [pw]);
  const match = pw && confirm && pw === confirm;
  const mismatch = confirm && pw !== confirm;

  return (
    <AuthCard
      title={done ? "Password updated" : "Reset your password"}
      subtitle={done ? "You can now sign in with your new credentials." : "Choose a strong new password to secure your account."}
      footer={
        done ? (
          <Link to="/auth/login" className="font-medium text-foreground hover:underline">
            Continue to sign in
          </Link>
        ) : undefined
      }
    >
      {done ? (
        <div className="flex justify-center py-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl gradient-primary glow">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!match) return;
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              setDone(true);
            }, 1000);
          }}
          className="space-y-4"
        >
          <Field label="New password" htmlFor="pw">
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="pw"
                type={show ? "text" : "password"}
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                className="h-11 pl-9 pr-10 border-white/10 bg-white/5"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-white/5 hover:text-foreground"
                aria-label="toggle password"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="mt-2 flex gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 flex-1 rounded-full",
                    i < s ? (s >= 4 ? "bg-success" : s >= 3 ? "bg-electric" : "bg-warning") : "bg-white/10",
                  )}
                />
              ))}
            </div>
          </Field>

          <Field
            label="Confirm password"
            htmlFor="confirm"
            error={mismatch ? "Passwords don't match" : undefined}
          >
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="confirm"
                type={show ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="h-11 pl-9 border-white/10 bg-white/5"
              />
            </div>
          </Field>

          <Button
            disabled={loading || !match}
            className="h-11 w-full gradient-primary text-white hover:opacity-95 glow"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update password"}
          </Button>
        </form>
      )}
    </AuthCard>
  );
}
