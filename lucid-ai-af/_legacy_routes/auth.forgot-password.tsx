import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Loader2, Mail, CheckCircle2 } from "lucide-react";
import { AuthCard, Field } from "@/components/auth-shared";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auth/forgot-password")({
  component: ForgotPage,
});

function ForgotPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <AuthCard
      title={sent ? "Check your inbox" : "Forgot password?"}
      subtitle={
        sent
          ? "We sent a secure reset link to your email. It expires in 30 minutes."
          : "No worries — enter your email and we'll send you a reset link."
      }
      footer={
        <Link to="/auth/login" className="inline-flex items-center gap-1 text-sm hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
        </Link>
      }
    >
      {sent ? (
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl gradient-primary glow">
            <CheckCircle2 className="h-7 w-7 text-white" />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Didn't receive it?{" "}
            <button
              onClick={() => setSent(false)}
              className="font-medium text-foreground hover:underline"
            >
              Try another email
            </button>
          </p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              setSent(true);
            }, 1000);
          }}
          className="space-y-4"
        >
          <Field label="Email" htmlFor="email">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                required
                placeholder="you@nebula.io"
                className="h-11 pl-9 border-white/10 bg-white/5"
              />
            </div>
          </Field>
          <Button
            disabled={loading}
            className="h-11 w-full gradient-primary text-white hover:opacity-95 glow"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthCard>
  );
}
