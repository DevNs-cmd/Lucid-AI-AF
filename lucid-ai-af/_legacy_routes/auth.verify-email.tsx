import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { MailCheck, Loader2 } from "lucide-react";
import { AuthCard } from "@/components/auth-shared";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth/verify-email")({
  component: VerifyPage,
});

function VerifyPage() {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const [loading, setLoading] = useState(false);

  function setAt(i: number, v: string) {
    const c = [...code];
    c[i] = v.slice(-1);
    setCode(c);
    if (v && i < 5) refs.current[i + 1]?.focus();
  }

  const complete = code.every((c) => c);

  return (
    <AuthCard
      title="Verify your email"
      subtitle="We sent a 6-digit code to ava@nebula.io. Enter it below to activate your account."
      footer={
        <>
          Wrong email?{" "}
          <Link to="/auth/signup" className="font-medium text-foreground hover:underline">
            Change it
          </Link>
        </>
      }
    >
      <div className="mb-6 flex justify-center">
        <div className="grid h-16 w-16 place-items-center rounded-2xl gradient-primary glow animate-pulse-glow">
          <MailCheck className="h-7 w-7 text-white" />
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          setTimeout(() => setLoading(false), 1200);
        }}
        className="space-y-5"
      >
        <div className="flex justify-center gap-2 sm:gap-3">
          {code.map((v, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              inputMode="numeric"
              maxLength={1}
              value={v}
              onChange={(e) => setAt(i, e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !v && i > 0) refs.current[i - 1]?.focus();
              }}
              className={cn(
                "h-12 w-10 sm:h-14 sm:w-12 rounded-xl border border-white/10 bg-white/5 text-center text-xl font-semibold outline-none transition-all",
                "focus:border-primary focus:bg-white/10 focus:shadow-[0_0_0_4px_oklch(0.62_0.24_300/0.2)]",
              )}
            />
          ))}
        </div>

        <Button
          disabled={!complete || loading}
          className="h-11 w-full gradient-primary text-white hover:opacity-95 glow"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify email"}
        </Button>

        <div className="text-center text-xs text-muted-foreground">
          Didn't get a code?{" "}
          <button type="button" className="font-medium text-foreground hover:underline">
            Resend in 00:42
          </button>
        </div>
      </form>
    </AuthCard>
  );
}
