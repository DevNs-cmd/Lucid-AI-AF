"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Backpack, Sword, Shield, Coins, Sparkles } from "lucide-react";
import { useState } from "react";

const inventoryItems = [
  { id: "1", name: "Steel Longsword", type: "weapon", rarity: "common", value: 50, icon: <Sword size={24} /> },
  { id: "2", name: "Elven Cloak", type: "armor", rarity: "rare", value: 200, icon: <Shield size={24} /> },
  { id: "3", name: "Healing Potion", type: "consumable", rarity: "common", value: 15, icon: <Sparkles size={24} /> },
  { id: "4", name: "Dragon's Tear", type: "artifact", rarity: "legendary", value: 5000, icon: <Sparkles size={24} /> },
  { id: "5", name: "Iron Shield", type: "armor", rarity: "common", value: 30, icon: <Shield size={24} /> },
];

export default function InventoryPage() {
  const [filter, setFilter] = useState<"all" | "weapon" | "armor" | "consumable" | "artifact">("all");

  const filteredItems = filter === "all" ? inventoryItems : inventoryItems.filter(item => item.type === filter);

  const getRarityColor = (rarity: string) => {
    switch(rarity) {
      case "common": return "text-white/70";
      case "rare": return "text-blue-400";
      case "legendary": return "text-gold drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]";
      default: return "text-white";
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col font-body text-ink overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-5" />
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
            <Backpack className="text-glow-primary" size={32} /> Inventory Vault
          </h1>
        </div>
        
        <div className="flex items-center gap-2 glass-panel px-4 py-2 rounded-xl">
          <Coins className="text-gold" size={20} />
          <span className="font-bold text-white text-lg">1,240</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 p-6 lg:p-12 flex flex-col h-full overflow-hidden">
        
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 custom-scrollbar shrink-0">
          {["all", "weapon", "armor", "consumable", "artifact"].map((f) => (
            <Button 
              key={f}
              variant={filter === f ? "default" : "ghost"}
              className={`capitalize ${filter === f ? "bg-glow-primary text-white border-none" : "text-muted hover:text-white border-none glass-panel"}`}
              onClick={() => setFilter(f as any)}
            >
              {f}
            </Button>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6 pb-20">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  className="glass-panel aspect-square rounded-2xl border-white/5 hover:border-glow-primary/50 transition-colors cursor-pointer group flex flex-col relative overflow-hidden"
                >
                  <div className="absolute top-3 right-3 text-xs font-bold text-white/50 bg-black/50 px-2 py-1 rounded-md">
                    {item.value}g
                  </div>
                  
                  <div className="flex-1 flex items-center justify-center">
                    <div className={`p-4 rounded-full bg-surface ${getRarityColor(item.rarity)} group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-surface/50 border-t border-white/5 text-center">
                    <h3 className="font-bold text-sm text-white truncate">{item.name}</h3>
                    <span className={`text-[10px] uppercase tracking-widest ${getRarityColor(item.rarity)}`}>
                      {item.rarity}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
