import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { CheckCircle2, CloudUpload, FileText, X } from "lucide-react";
import { GlassCard } from "@/components/ui-primitives";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/storage/upload")({
  component: UploadPage,
});

type Uploading = {
  id: string;
  name: string;
  size: string;
  progress: number;
  done: boolean;
};

function fmt(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function UploadPage() {
  const [drag, setDrag] = useState(false);
  const [items, setItems] = useState<Uploading[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function add(files: FileList | null) {
    if (!files) return;
    const list: Uploading[] = Array.from(files).map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      size: fmt(f.size),
      progress: 0,
      done: false,
    }));
    setItems((prev) => [...list, ...prev]);
    list.forEach((it) => simulate(it.id));
  }

  function simulate(id: string) {
    const tick = () => {
      setItems((prev) => {
        const idx = prev.findIndex((p) => p.id === id);
        if (idx === -1) return prev;
        const next = [...prev];
        const cur = next[idx];
        if (cur.done) return prev;
        const nextP = Math.min(100, cur.progress + Math.random() * 18 + 6);
        next[idx] = { ...cur, progress: nextP, done: nextP >= 100 };
        return next;
      });
    };
    const iv = setInterval(() => {
      tick();
      setItems((prev) => {
        const cur = prev.find((p) => p.id === id);
        if (cur?.done) clearInterval(iv);
        return prev;
      });
    }, 350);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <GlassCard strong className="p-6 sm:p-8">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            add(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "relative flex cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed p-10 text-center transition-all",
            drag
              ? "border-primary/60 bg-primary/10"
              : "border-white/15 bg-white/5 hover:bg-white/10",
          )}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            hidden
            onChange={(e) => add(e.target.files)}
          />
          <div className="grid h-16 w-16 place-items-center rounded-2xl gradient-primary glow animate-float">
            <CloudUpload className="h-7 w-7 text-white" />
          </div>
          <div className="space-y-1">
            <div className="text-lg font-semibold">Drop files to upload</div>
            <div className="text-sm text-muted-foreground">
              or <span className="text-foreground underline">click to browse</span> from your device
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
            {["Images", "Videos", "Audio", "Documents"].map((t) => (
              <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                {t}
              </span>
            ))}
          </div>
          <div className="text-xs text-muted-foreground">Up to 2 GB per file · resumes automatically</div>
        </div>

        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold">Upload queue</div>
            {items.length > 0 && (
              <button
                onClick={() => setItems([])}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear all
              </button>
            )}
          </div>
          {items.length === 0 ? (
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center text-sm text-muted-foreground">
              Nothing in the queue yet.
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/5">
                    {it.done ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : (
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <div className="truncate text-sm font-medium">{it.name}</div>
                      <div className="ml-auto shrink-0 text-xs text-muted-foreground">
                        {it.size} · {Math.round(it.progress)}%
                      </div>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${it.progress}%`,
                          background: it.done
                            ? "oklch(0.72 0.19 155)"
                            : "linear-gradient(90deg, oklch(0.62 0.24 300), oklch(0.72 0.19 240))",
                        }}
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setItems((p) => p.filter((x) => x.id !== it.id))}
                    aria-label="Remove"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </GlassCard>

      <div className="space-y-6">
        <GlassCard className="p-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Tips</div>
          <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              Uploads continue in the background — feel free to keep working.
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-electric" />
              We generate previews for images, video and audio automatically.
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neon" />
              Files are encrypted at rest and only visible to you.
            </li>
          </ul>
        </GlassCard>

        <GlassCard strong className="p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Storage</div>
            <span className="text-xs text-muted-foreground">43.8 / 100 GB</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full"
              style={{
                width: "44%",
                background: "linear-gradient(90deg, oklch(0.62 0.24 300), oklch(0.72 0.19 240))",
              }}
            />
          </div>
          <Button className="mt-4 w-full gradient-primary text-white hover:opacity-95 glow">
            Upgrade plan
          </Button>
        </GlassCard>
      </div>
    </div>
  );
}
