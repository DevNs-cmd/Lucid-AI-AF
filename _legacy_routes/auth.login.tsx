import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Github, Loader2, Mail, Lock, CheckCircle2 } from "lucide-react";
import { AuthCard, Field, Divider, OAuthRow } from "@/components/auth-shared";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { GoogleIcon } from "@/components/icons";

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
});

function LoginPage() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailError = email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Enter a valid email" : "";

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1200);
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to continue your journey."
      footer={
        <>
          New here?{" "}
          <Link to="/auth/signup" className="font-medium text-foreground hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      {success && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-success/30 bg-success/10 p-3 text-sm text-success">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Signed in. Redirecting you to your workspace…</span>
        </div>
      )}

      <OAuthRow>
        <Button variant="secondary" className="h-11 bg-white/5 hover:bg-white/10">
          <GoogleIcon className="h-4 w-4" /> Google
        </Button>
        <Button variant="secondary" className="h-11 bg-white/5 hover:bg-white/10">
          <Github className="h-4 w-4" /> GitHub
        </Button>
      </OAuthRow>

      <Divider label="or with email" />

      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Email" htmlFor="email" error={emailError}>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@nebula.io"
              className="h-11 pl-9 border-white/10 bg-white/5"
            />
          </div>
        </Field>

        <Field label="Password" htmlFor="password">
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 pl-9 pr-10 border-white/10 bg-white/5"
            />
            <button
              type="button"
              aria-label={show ? "Hide password" : "Show password"}
              onClick={() => setShow((v) => !v)}
              className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-white/5 hover:text-foreground"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Checkbox className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
            Remember me
          </label>
          <Link
            to="/auth/forgot-password"
            className="text-sm font-medium text-foreground hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full gradient-primary text-white hover:opacity-95 glow"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
        </Button>
      </form>
    </AuthCard>
  );
}
