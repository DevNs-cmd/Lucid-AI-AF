"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Sparkles, Check } from "lucide-react";

export default function PremiumPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col font-body text-ink overflow-hidden bg-background">
      {/* Background */}
      <motion.div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=2000&auto=format&fit=crop')` }}
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background/50 z-0" />

      {/* Header */}
      <header className="relative z-10 w-full p-6 flex items-center justify-between">
        <Link href="/dashboard">
          <Button variant="ghost" className="text-muted hover:text-ink hover:bg-surface border-none flex items-center gap-2">
            <ChevronLeft size={20} />
            <span className="uppercase tracking-widest text-xs font-bold">Back to Dashboard</span>
          </Button>
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 pb-24">
        <div className="text-center max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-glow-primary/30 text-glow-primary text-sm font-bold tracking-widest uppercase mb-6">
            <Sparkles size={16} />
            Lucid Pro
          </div>
          <h1 className="font-display font-bold text-4xl md:text-6xl tracking-wide mb-6">
            Unlock Infinite Worlds
          </h1>
          <p className="text-xl text-muted font-light leading-relaxed">
            Upgrade your account to experience limitless AI generations, permanent memory for all characters, and breathtaking cinematic renders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          {/* Free Tier */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-panel p-8 rounded-3xl border-white/10 flex flex-col"
          >
            <h2 className="font-display font-bold text-2xl mb-2 text-white">Wanderer</h2>
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-4xl font-bold text-white">$0</span>
              <span className="text-muted">/ forever</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <FeatureItem text="50 AI Story Generations / day" />
              <FeatureItem text="Basic Character Memory (Last 10 turns)" />
              <FeatureItem text="1 Active World Save" />
              <FeatureItem text="Standard Text Speed" />
            </ul>
            
            <Button variant="outline" className="w-full py-6 text-lg border-white/20 text-muted hover:text-white" disabled>
              Current Plan
            </Button>
          </motion.div>

          {/* Pro Tier */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-panel relative p-8 rounded-3xl border-glow-primary/50 flex flex-col shadow-[0_0_30px_rgba(139,92,246,0.15)] overflow-hidden"
          >
            {/* Glow effect */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-glow-primary/40 blur-3xl rounded-full pointer-events-none" />
            
            <h2 className="font-display font-bold text-2xl mb-2 text-glow-primary flex items-center gap-2">
              <Sparkles size={24} /> Hero
            </h2>
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-4xl font-bold text-white">$15</span>
              <span className="text-muted">/ month</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <FeatureItem text="Unlimited AI Story Generations" active />
              <FeatureItem text="Infinite Character Memory (Vector DB)" active />
              <FeatureItem text="Unlimited World Saves" active />
              <FeatureItem text="10 AI Cinematic Video Renders / month" active />
              <FeatureItem text="Premium AI Voiceovers" active />
              <FeatureItem text="Priority Server Access" active />
            </ul>
            
            <Button className="w-full py-6 text-lg bg-glow-primary hover:bg-glow-primary/90 text-white border-none shadow-[0_0_20px_rgba(139,92,246,0.4)] animate-soft-pulse">
              Upgrade to Hero
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function FeatureItem({ text, active = false }: { text: string, active?: boolean }) {
  return (
    <li className="flex items-start gap-3">
      <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${active ? 'bg-glow-primary/20 text-glow-primary' : 'bg-white/5 text-white/50'}`}>
        <Check size={12} strokeWidth={3} />
      </div>
      <span className={`${active ? 'text-white' : 'text-muted'}`}>{text}</span>
    </li>
  );
}
