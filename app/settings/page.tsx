"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Settings2, Shield, User, Bot, Volume2 } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col font-body text-ink overflow-hidden bg-background">
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
            <Settings2 className="text-glow-primary" size={32} /> Platform Settings
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 p-6 lg:p-12 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
          
          {/* Settings Nav */}
          <div className="space-y-2">
            <SettingsNav active icon={<User size={18} />} label="Account Profile" />
            <SettingsNav icon={<Bot size={18} />} label="AI Preferences" />
            <SettingsNav icon={<Volume2 size={18} />} label="Audio & Display" />
            <SettingsNav icon={<Shield size={18} />} label="Privacy & Security" />
          </div>

          {/* Settings Form Area */}
          <div className="md:col-span-2 space-y-8">
            <div className="glass-panel p-8 rounded-3xl border-white/5 space-y-6">
              <h2 className="font-display font-bold text-2xl text-white mb-6">Account Profile</h2>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted">Display Name</label>
                <input 
                  type="text" 
                  defaultValue="Adventurer"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-ink focus:outline-none focus:border-glow-primary transition-all" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted">Email Address</label>
                <input 
                  type="email" 
                  defaultValue="adventurer@lucid.ai"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-ink focus:outline-none focus:border-glow-primary transition-all" 
                />
              </div>

              <div className="pt-4">
                <Button className="bg-glow-primary hover:bg-glow-primary/90 text-white shadow-glow border-none px-8">
                  Save Changes
                </Button>
              </div>
            </div>

            <div className="glass-panel p-8 rounded-3xl border-white/5 space-y-6">
              <h2 className="font-display font-bold text-2xl text-white mb-6">AI Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                  <div>
                    <h4 className="text-white font-medium">Emotion AI Core</h4>
                    <p className="text-sm text-muted">Allow the UI theme to shift based on story tension.</p>
                  </div>
                  <div className="w-12 h-6 bg-glow-primary rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                  <div>
                    <h4 className="text-white font-medium">Auto-generate Cinematics</h4>
                    <p className="text-sm text-muted">Automatically use credits to render major scenes.</p>
                  </div>
                  <div className="w-12 h-6 bg-white/10 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white/50 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-panel p-8 rounded-3xl border-red-500/20 bg-red-500/5 space-y-4">
              <h2 className="font-display font-bold text-xl text-red-400">Danger Zone</h2>
              <p className="text-sm text-muted">Deleting your account will permanently erase all worlds, characters, and memory vectors.</p>
              <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300">
                Delete Account
              </Button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

function SettingsNav({ active = false, icon, label }: { active?: boolean, icon: React.ReactNode, label: string }) {
  return (
    <button className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all text-left ${active ? 'bg-glow-primary/20 text-white border border-glow-primary/50 shadow-[0_0_15px_rgba(139,92,246,0.15)]' : 'text-muted hover:text-white hover:bg-surface-hover border border-transparent'}`}>
      <span className={active ? "text-glow-primary" : ""}>{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}
