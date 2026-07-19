"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Scroll, CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";
import { mockQuests } from "@/lib/mockData";

export default function QuestsPage() {
  const [filter, setFilter] = useState<"active" | "completed">("active");

  const filteredQuests = mockQuests.filter(q => q.status === filter);

  return (
    <div className="relative min-h-screen w-full flex flex-col font-body text-ink overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background/95 z-0" />

      {/* Header */}
      <header className="relative z-10 w-full p-6 lg:p-12 pb-0 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Link href="/dashboard" className="inline-flex mb-6">
            <Button variant="ghost" className="text-muted hover:text-white hover:bg-surface-hover border-none px-0">
              <ChevronLeft size={20} className="mr-1" /> Back to Dashboard
            </Button>
          </Link>
          <h1 className="font-display font-bold text-4xl tracking-wide flex items-center gap-3">
            <Scroll className="text-glow-primary" size={32} /> Quest Journal
          </h1>
        </div>
        
        <div className="flex gap-2 glass-panel p-1 rounded-xl">
          <Button 
            variant={filter === "active" ? "default" : "ghost"}
            className={filter === "active" ? "bg-glow-primary hover:bg-glow-primary/90 text-white border-none" : "text-muted hover:text-white border-none"}
            onClick={() => setFilter("active")}
          >
            Active Quests
          </Button>
          <Button 
            variant={filter === "completed" ? "default" : "ghost"}
            className={filter === "completed" ? "bg-emerald-500 hover:bg-emerald-600 text-white border-none" : "text-muted hover:text-white border-none"}
            onClick={() => setFilter("completed")}
          >
            Completed
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 p-6 lg:p-12 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredQuests.map((quest, i) => (
              <motion.div
                key={quest.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="glass-panel p-6 lg:p-8 rounded-3xl border-white/10 group hover:border-glow-primary/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {quest.status === 'completed' ? (
                      <CheckCircle2 size={24} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                    ) : (
                      <Circle size={24} className="text-glow-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="font-display font-bold text-2xl text-white group-hover:text-glow-primary transition-colors">
                        {quest.title}
                      </h2>
                      <span className="text-xs px-3 py-1 bg-surface-hover rounded-full text-muted uppercase tracking-widest font-bold border border-white/5">
                        {quest.id.includes('main') ? 'Main Quest' : 'Side Quest'}
                      </span>
                    </div>
                    <p className="text-muted leading-relaxed mb-6">
                      {quest.status === 'active' 
                        ? "You are currently investigating the disturbances in the eastern woods. The local merchants mentioned shadows moving between the trees at dusk."
                        : "You successfully completed this mission and earned the trust of the local guild."}
                    </p>
                    
                    {quest.status === 'active' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">Progress</span>
                          <span className="text-glow-primary font-bold">{quest.progress}%</span>
                        </div>
                        <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-glow-primary h-full shadow-[0_0_10px_rgba(139,92,246,0.8)] transition-all duration-1000"
                            style={{ width: `${quest.progress}%` }} 
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredQuests.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 text-muted">
              No quests found in this category.
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
