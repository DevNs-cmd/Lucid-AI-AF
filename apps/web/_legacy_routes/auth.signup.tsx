import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Eye, EyeOff, Github, Loader2, Mail, Lock, User } from "lucide-react";
import { AuthCard, Field, Divider, OAuthRow } from "@/components/auth-shared";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { GoogleIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth/signup")({
  component: SignupPage,
});

function strengthOf(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const LABELS = ["Too weak", "Weak", "Fair", "Strong", "Excellent"];
const COLORS = [
  "bg-destructive",
  "bg-warning",
  "bg-warning",
  "bg-electric",
  "bg-success",
];

function SignupPage() {
  const [show, setShow] = useState(false);
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const s = useMemo(() => strengthOf(pw), [pw]);

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start building your futuristic workspace in seconds."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/auth/login" className="font-medium text-foreground hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <OAuthRow>
        <Button variant="secondary" className="h-11 bg-white/5 hover:bg-white/10">
          <GoogleIcon className="h-4 w-4" /> Google
        </Button>
        <Button variant="secondary" className="h-11 bg-white/5 hover:bg-white/10">
          <Github className="h-4 w-4" /> GitHub
        </Button>
      </OAuthRow>

      <Divider label="or with email" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          setTimeout(() => setLoading(false), 1200);
        }}
        className="space-y-4"
      >
        <Field label="Full name" htmlFor="name">
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="name" placeholder="Ava Reyes" className="h-11 pl-9 border-white/10 bg-white/5" />
          </div>
        </Field>

        <Field label="Email" htmlFor="email">
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="email" type="email" placeholder="you@nebula.io" className="h-11 pl-9 border-white/10 bg-white/5" />
          </div>
        </Field>

        <Field label="Password" htmlFor="password">
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={show ? "text" : "password"}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="8+ characters, mix letters & numbers"
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
                  "h-1.5 flex-1 rounded-full transition-colors",
                  i < s ? COLORS[Math.max(0, s - 1)] : "bg-white/10",
                )}
              />
            ))}
          </div>
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Strength</span>
            <span
              className={cn(
                s >= 4 ? "text-success" : s >= 3 ? "text-electric" : s >= 1 ? "text-warning" : "text-destructive",
              )}
            >
              {pw ? LABELS[Math.min(s, 4)] : "—"}
            </span>
          </div>
        </Field>

        <label className="flex items-start gap-2 text-xs text-muted-foreground">
          <Checkbox className="mt-0.5 border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
          <span>
            I agree to the{" "}
            <a className="text-foreground hover:underline" href="#">
              Terms
            </a>{" "}
            and{" "}
            <a className="text-foreground hover:underline" href="#">
              Privacy Policy
            </a>
            .
          </span>
        </label>

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full gradient-primary text-white hover:opacity-95 glow"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
        </Button>
      </form>
    </AuthCard>
  );
}
