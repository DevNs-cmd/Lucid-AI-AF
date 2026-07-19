"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Users, Heart } from "lucide-react";
import { mockNPCs } from "@/lib/mockData";

export default function NPCEncyclopediaPage() {
  return (
    <AuroraBackground className="flex flex-col overflow-hidden font-body text-ink">

      {/* Header */}
      <header className="relative z-10 w-full px-12 pt-12 pb-2 flex flex-col justify-between gap-6">
        <div>
          <Link href="/dashboard" className="inline-flex mb-6">
            <Button variant="ghost" className="text-muted hover:text-white hover:bg-surface-hover border-none px-0">
              <ChevronLeft size={20} className="mr-1" /> Back to Dashboard
            </Button>
          </Link>
          <h1 className="font-display font-bold text-4xl tracking-wide flex items-center gap-3">
            <Users className="text-glow-primary" size={32} /> Companions & Encounters
          </h1>
          <p className="text-muted mt-2">Everyone remembers what you do.</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 mx-6 my-6 p-6 lg:p-10 overflow-y-auto custom-scrollbar glass-panel rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockNPCs.map((npc, i) => {
            const relationshipPercent = ((npc.relationshipScore + 100) / 2);
            return (
            <Link key={npc.id} href={`/characters/${npc.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-panel rounded-3xl border-white/10 group hover:border-glow-primary/50 transition-all cursor-pointer overflow-hidden h-full flex flex-col"
              >
                {/* AI Portrait */}
                <div className="h-48 w-full relative overflow-hidden bg-surface">
                   <div 
                     className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
                     style={{ backgroundImage: `url(${npc.avatarUrl})` }} 
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="font-display font-bold text-2xl text-white group-hover:text-glow-primary transition-colors">
                      {npc.name}
                    </h2>
                  </div>
                  <span className="text-xs text-muted uppercase tracking-widest font-bold mb-4">
                    {npc.role}
                  </span>
                  
                  <div className="mt-auto pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-white/70 flex items-center gap-2">
                        <Heart size={14} className={npc.relationshipScore > 50 ? "text-pink-500" : "text-muted"} />
                        Relationship
                      </span>
                      <span className="text-white font-bold">{npc.relationshipScore}/100</span>
                    </div>
                    <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full ${npc.relationshipScore > 50 ? 'bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.8)]' : 'bg-white/30'}`}
                        style={{ width: `${relationshipPercent}%` }} 
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
            );
          })}
        </div>
      </main>
    </AuroraBackground>
  );
}
