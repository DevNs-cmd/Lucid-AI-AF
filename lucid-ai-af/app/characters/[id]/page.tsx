"use client";

import Link from "next/link";
import { use } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Brain, Heart, Swords, MessageSquare } from "lucide-react";
import { mockNPCs } from "@/lib/mockData";

export default function CharacterProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const npc = mockNPCs.find(n => n.id === id) || mockNPCs[0];

  return (
    <div className="relative min-h-screen w-full flex flex-col font-body text-ink overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background/95 z-0" />

      {/* Header */}
      <header className="relative z-10 w-full p-6 lg:p-12 pb-0 flex flex-col justify-between gap-6">
        <div>
          <Link href="/characters" className="inline-flex mb-6">
            <Button variant="ghost" className="text-muted hover:text-white hover:bg-surface-hover border-none px-0">
              <ChevronLeft size={20} className="mr-1" /> Back to Characters
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 p-6 lg:p-12 overflow-y-auto custom-scrollbar">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12">
          
          {/* Left Column: Portrait & Actions */}
          <div className="lg:w-1/3 space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-[3/4] rounded-3xl overflow-hidden glass-panel border-white/10"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
              <div className="absolute inset-0 bg-glow-primary/20 flex items-center justify-center">
                 <span className="text-white/30 text-sm tracking-widest uppercase font-bold">AI Portrait Placeholder</span>
              </div>
            </motion.div>
            
            <Button className="w-full bg-glow-primary hover:bg-glow-primary/90 text-white shadow-glow border-none py-6">
              <MessageSquare size={18} className="mr-2" /> Speak with {npc.name}
            </Button>
          </div>

          {/* Right Column: Details & Memory */}
          <div className="lg:w-2/3 space-y-12">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="font-display font-bold text-5xl text-white mb-2">{npc.name}</h1>
              <span className="text-sm text-glow-primary uppercase tracking-widest font-bold">
                {npc.role}
              </span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <StatCard icon={<Heart className="text-pink-500" />} label="Relationship" value={`${npc.relationshipScore}/100`} />
              <StatCard icon={<Brain className="text-blue-400" />} label="Intelligence" value="High" />
              <StatCard icon={<Swords className="text-red-400" />} label="Combat" value="Deadly" />
              <StatCard icon={<MessageSquare className="text-emerald-400" />} label="Disposition" value="Guarded" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <h2 className="font-display font-bold text-2xl text-white border-b border-white/10 pb-4">AI Memory Bank</h2>
              
              <div className="glass-panel p-6 rounded-2xl border-white/5 space-y-4">
                <div className="flex gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-glow-primary shrink-0" />
                  <div>
                    <p className="text-white/90 text-sm leading-relaxed">
                      Remembers that you saved them from the ash raiders during the ambush at the crossroads.
                    </p>
                    <span className="text-xs text-muted mt-2 block">2 days ago in Chapter 2</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-red-500 shrink-0" />
                  <div>
                    <p className="text-white/90 text-sm leading-relaxed">
                      Still suspicious about why you lied about your origins when first asked.
                    </p>
                    <span className="text-xs text-muted mt-2 block">4 days ago in Chapter 1</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="glass-panel p-4 rounded-2xl border-white/5 flex flex-col items-center justify-center text-center gap-2">
      {icon}
      <div>
        <div className="text-xs text-muted uppercase tracking-widest font-bold mb-1">{label}</div>
        <div className="text-white font-bold">{value}</div>
      </div>
    </div>
  );
}
