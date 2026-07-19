import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Download,
  Edit3,
  FileText,
  FileVideo,
  Filter,
  Grid3x3,
  Image as ImageIcon,
  LayoutList,
  Music,
  Search,
  Share2,
  Trash2,
  FolderOpen,
} from "lucide-react";
import { GlassCard } from "@/components/ui-primitives";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/storage/files")({
  component: FileManager,
});

type FileType = "image" | "video" | "audio" | "doc";
type FileItem = {
  id: string;
  name: string;
  type: FileType;
  size: string;
  updated: string;
  color: string;
};

const FILES: FileItem[] = [
  { id: "1", name: "hero-nebula.jpg", type: "image", size: "3.2 MB", updated: "2m ago", color: "from-fuchsia-500 to-indigo-600" },
  { id: "2", name: "astral-cover.png", type: "image", size: "1.8 MB", updated: "1h ago", color: "from-indigo-500 to-cyan-500" },
  { id: "3", name: "story-intro.mp4", type: "video", size: "84 MB", updated: "1h ago", color: "from-purple-600 to-pink-500" },
  { id: "4", name: "trailer-final.mov", type: "video", size: "212 MB", updated: "Yesterday", color: "from-blue-600 to-purple-600" },
  { id: "5", name: "kaia-voice.wav", type: "audio", size: "12 MB", updated: "3h ago", color: "from-emerald-500 to-teal-500" },
  { id: "6", name: "ambient-loop.mp3", type: "audio", size: "6.4 MB", updated: "2d ago", color: "from-teal-500 to-cyan-500" },
  { id: "7", name: "contract.pdf", type: "doc", size: "540 KB", updated: "Yesterday", color: "from-amber-500 to-orange-500" },
  { id: "8", name: "worldbook.md", type: "doc", size: "88 KB", updated: "3d ago", color: "from-orange-500 to-rose-500" },
];

const ICONS: Record<FileType, typeof ImageIcon> = {
  image: ImageIcon,
  video: FileVideo,
  audio: Music,
  doc: FileText,
};

const TYPE_LABELS = [
  { k: "all", l: "All" },
  { k: "image", l: "Images" },
  { k: "video", l: "Videos" },
  { k: "audio", l: "Audio" },
  { k: "doc", l: "Docs" },
] as const;

function FileManager() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [q, setQ] = useState("");
  const [type, setType] = useState<(typeof TYPE_LABELS)[number]["k"]>("all");
  const [sort, setSort] = useState<"recent" | "name" | "size">("recent");

  const items = useMemo(() => {
    let arr = FILES.filter((f) => (type === "all" ? true : f.type === type));
    if (q) arr = arr.filter((f) => f.name.toLowerCase().includes(q.toLowerCase()));
    if (sort === "name") arr = [...arr].sort((a, b) => a.name.localeCompare(b.name));
    return arr;
  }, [q, type, sort]);

  return (
    <div className="space-y-6">
      <GlassCard className="flex flex-wrap items-center gap-3 p-3">
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search files…"
            className="h-8 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
          />
        </div>

        <div className="flex gap-1 rounded-xl bg-white/5 p-1">
          {TYPE_LABELS.map((t) => (
            <button
              key={t.k}
              onClick={() => setType(t.k)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                type === t.k ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.l}
            </button>
          ))}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="bg-white/5 hover:bg-white/10">
              <Filter className="h-4 w-4" /> Sort: {sort}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass-strong border-white/10">
            {(["recent", "name", "size"] as const).map((s) => (
              <DropdownMenuItem key={s} onClick={() => setSort(s)}>
                {s}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex gap-1 rounded-xl bg-white/5 p-1">
          <button
            onClick={() => setView("grid")}
            className={cn("rounded-lg p-1.5", view === "grid" ? "bg-white/10" : "text-muted-foreground")}
            aria-label="Grid view"
          >
            <Grid3x3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={cn("rounded-lg p-1.5", view === "list" ? "bg-white/10" : "text-muted-foreground")}
            aria-label="List view"
          >
            <LayoutList className="h-4 w-4" />
          </button>
        </div>
      </GlassCard>

      {items.length === 0 ? (
        <EmptyFiles />
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((f) => (
            <FileCard key={f.id} file={f} />
          ))}
        </div>
      ) : (
        <GlassCard strong className="divide-y divide-white/5 overflow-hidden">
          {items.map((f) => (
            <FileRow key={f.id} file={f} />
          ))}
        </GlassCard>
      )}
    </div>
  );
}

function Preview({ file }: { file: FileItem }) {
  const Icon = ICONS[file.type];
  return (
    <div className={cn("relative aspect-video w-full overflow-hidden rounded-xl bg-gradient-to-br", file.color)}>
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 grid place-items-center">
        <Icon className="h-10 w-10 text-white/90 drop-shadow" />
      </div>
      <div className="absolute right-2 top-2 rounded-md bg-black/40 px-1.5 py-0.5 text-[10px] font-medium uppercase text-white/90 backdrop-blur">
        {file.type}
      </div>
    </div>
  );
}

function ActionMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Edit3 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-strong border-white/10">
        <DropdownMenuItem>
          <Edit3 className="h-4 w-4" /> Rename
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Download className="h-4 w-4" /> Download
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Share2 className="h-4 w-4" /> Share
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <Trash2 className="h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function FileCard({ file }: { file: FileItem }) {
  return (
    <GlassCard className="group overflow-hidden p-3 transition-transform hover:-translate-y-1">
      <Preview file={file} />
      <div className="mt-3 flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{file.name}</div>
          <div className="text-xs text-muted-foreground">
            {file.size} · {file.updated}
          </div>
        </div>
        <ActionMenu />
      </div>
    </GlassCard>
  );
}

function FileRow({ file }: { file: FileItem }) {
  const Icon = ICONS[file.type];
  return (
    <div className="flex items-center gap-4 p-3 hover:bg-white/5">
      <div className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br", file.color)}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{file.name}</div>
        <div className="text-xs text-muted-foreground">
          {file.type} · {file.size} · {file.updated}
        </div>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Download className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Share2 className="h-4 w-4" />
      </Button>
      <ActionMenu />
    </div>
  );
}

function EmptyFiles() {
  return (
    <GlassCard strong className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/5">
        <FolderOpen className="h-7 w-7 text-muted-foreground" />
      </div>
      <div className="text-lg font-semibold">No files yet</div>
      <div className="max-w-sm text-sm text-muted-foreground">
        Upload your first file to get started. Images, videos, audio and documents are all welcome.
      </div>
    </GlassCard>
  );
}
