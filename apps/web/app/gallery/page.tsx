"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Image as ImageIcon, Play, Download } from "lucide-react";
import { useState } from "react";

const galleryItems = [
  { id: "1", type: "image", title: "Astronaut Explorer", url: "/gallery/neon_astronaut.png", date: "Collection 1", className: "aspect-[3/4]" },
  { id: "2", type: "image", title: "Sunset Trail", url: "/gallery/sunset_runner.png", date: "Collection 1", className: "aspect-[16/9]" },
  { id: "3", type: "image", title: "Starry Night Hill", url: "/gallery/starry_hill.png", date: "Collection 2", className: "aspect-[9/16]" },
  { id: "4", type: "image", title: "Quantum Cube", url: "/gallery/glass_cube.png", date: "Collection 2", className: "aspect-square" },
  { id: "5", type: "image", title: "Neon Aura", url: "/gallery/abstract_aura.png", date: "Collection 3", className: "aspect-[4/5]" },
];

export default function GalleryPage() {
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");
  const filteredItems = filter === "all" ? galleryItems : galleryItems.filter(item => item.type === filter);

  return (
    <AuroraBackground className="flex flex-col overflow-hidden font-body text-ink">
      {/* Header */}
      <header className="relative z-10 w-full px-12 pt-12 pb-2 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Link href="/dashboard" className="inline-flex mb-6">
            <Button variant="ghost" className="text-muted hover:text-white hover:bg-surface-hover border-none px-0">
              <ChevronLeft size={20} className="mr-1" /> Back to Dashboard
            </Button>
          </Link>
          <h1 className="font-display font-bold text-4xl tracking-wide flex items-center gap-3">
            <ImageIcon className="text-glow-primary" size={32} /> Memories & Lore
          </h1>
        </div>
        
        <div className="flex gap-2 glass-panel p-1 rounded-xl">
          <Button 
            variant={filter === "all" ? "default" : "ghost"}
            className={filter === "all" ? "bg-glow-primary text-white border-none" : "text-muted hover:text-white border-none"}
            onClick={() => setFilter("all")}
          >
            All Media
          </Button>
          <Button 
            variant={filter === "image" ? "default" : "ghost"}
            className={filter === "image" ? "bg-glow-primary text-white border-none" : "text-muted hover:text-white border-none"}
            onClick={() => setFilter("image")}
          >
            Artwork
          </Button>
          <Button 
            variant={filter === "video" ? "default" : "ghost"}
            className={filter === "video" ? "bg-glow-primary text-white border-none" : "text-muted hover:text-white border-none"}
            onClick={() => setFilter("video")}
          >
            Cinematics
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 mx-6 my-6 p-6 lg:p-10 overflow-y-auto custom-scrollbar glass-panel rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6 max-w-7xl mx-auto pb-20">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className={`group relative rounded-3xl overflow-hidden glass-panel cursor-pointer inline-block w-full ${item.className || "aspect-video"}`}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${item.url})` }}
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                {/* Play Button Overlay for Videos */}
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white border border-white/50 group-hover:scale-110 group-hover:bg-glow-primary transition-all">
                      <Play size={24} className="ml-1" />
                    </div>
                  </div>
                )}

                {/* Content info */}
                <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 transition-transform">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-glow-primary text-xs font-bold uppercase tracking-widest block mb-1">
                        {item.date}
                      </span>
                      <h3 className="text-white font-display font-bold text-xl">{item.title}</h3>
                    </div>
                    
                    <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </AuroraBackground>
  );
}
