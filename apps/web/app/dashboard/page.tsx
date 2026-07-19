"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { mockChapters, mockQuests, mockWorlds } from "@/lib/mockData";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import { Globe } from "@/components/ui/globe";
import { Map, Scroll, Users, Backpack, Image as ImageIcon, Sparkles, ChevronRight, User, Shield } from "lucide-react";
import { CinematicFooter } from "@/components/ui/motion-footer";
import { GradientButton } from "@/components/ui/gradient-button";

export default function DashboardPage() {
  const [username, setUsername] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedUsername = localStorage.getItem("username") || "Adventurer";
    setUsername(savedUsername);
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return <div className="min-h-screen bg-background" />;

  return (
    <AuroraBackground className="flex flex-row overflow-hidden font-body text-ink">

      {/* Sidebar Navigation (Modern Floating Glass Panel) */}
      <aside className="relative z-10 w-20 lg:w-72 glass-panel rounded-3xl my-6 ml-6 p-4 lg:p-6 hidden md:flex flex-col gap-8 shadow-2xl border border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="flex items-center justify-center lg:justify-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-glow-primary/20 border border-glow-primary/50 flex items-center justify-center text-glow-primary shadow-[0_0_15px_rgba(139,92,246,0.5)]">
            <Sparkles size={20} />
          </div>
          <span className="font-display font-bold text-xl tracking-wider hidden lg:block bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            LUCID AI
          </span>
        </div>
        
        <nav className="flex flex-col gap-2 mt-8">
          <SidebarLink href="/dashboard" icon={<Map size={20} />} label="Overview" active />
          <SidebarLink href="/profile" icon={<User size={20} />} label="User Profile" />
          <SidebarLink href="/world" icon={<Map size={20} />} label="World Map" />
          <SidebarLink href="/quests" icon={<Scroll size={20} />} label="Quests" />
          <SidebarLink href="/characters" icon={<Users size={20} />} label="NPC Encyclopedia" />
          <SidebarLink href="/inventory" icon={<Backpack size={20} />} label="Inventory" />
          <SidebarLink href="/gallery" icon={<ImageIcon size={20} />} label="Gallery" />
          <SidebarLink href="/admin" icon={<Shield size={20} />} label="Admin Panel" />
        </nav>

        <div className="mt-auto hidden lg:block">
          <Link href="/premium">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden p-5 rounded-2xl border border-glow-primary/30 cursor-pointer group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-glow-primary/20 to-transparent" />
              <div className="absolute top-0 right-0 w-24 h-24 bg-glow-primary/30 blur-3xl group-hover:bg-glow-primary/50 transition-colors" />
              <h4 className="relative font-display font-bold text-white mb-1">Go Pro</h4>
              <p className="relative text-xs text-muted">Unlock unlimited memory & voices</p>
            </motion.div>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative z-10 flex-1 my-6 mr-6 p-6 lg:p-10 overflow-y-auto custom-scrollbar glass-panel rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl">
        <header className="mb-16 relative flex flex-col lg:flex-row items-center justify-between gap-12 bg-black/20 p-8 lg:p-12 rounded-3xl border border-white/5 backdrop-blur-sm overflow-hidden">
          {/* Subtle background glow for the hero */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-glow-primary/20 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5 }}
            className="flex-1 relative z-10 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-glow-primary/10 border border-glow-primary/20 text-glow-primary text-sm font-medium mb-2">
              <Sparkles size={14} /> Global Network Active
            </div>
            <h1 className="text-4xl lg:text-6xl font-display font-bold leading-tight tracking-wide">
              Welcome back, <br />
              <span className="text-glow-primary drop-shadow-[0_0_15px_rgba(139,92,246,0.6)] capitalize italic">{username}</span>
            </h1>
            <p className="text-muted text-lg lg:text-xl font-light max-w-md leading-relaxed">
              Your story in the Ashen Wastes awaits. The world is evolving while you were gone.
            </p>
            <div className="pt-4">
              <GradientButton asChild className="shadow-[0_8px_25px_rgba(139,92,246,0.4)] hover:shadow-[0_12px_34px_rgba(139,92,246,0.6)]">
                <Link href="/story/chap_3">
                  Continue Journey <ChevronRight className="ml-2" size={20} />
                </Link>
              </GradientButton>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
            className="flex-1 relative z-10 w-full flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[450px] aspect-square rounded-full border border-white/5 bg-black/40 shadow-2xl overflow-hidden flex items-center justify-center">
              {/* The Globe Component */}
              <div className="absolute inset-0 flex items-center justify-center scale-110">
                <Globe />
              </div>
              <div className="absolute inset-0 rounded-full shadow-[inset_0_0_50px_rgba(0,0,0,1)] pointer-events-none" />
            </div>
          </motion.div>
        </header>

        {/* Horizontal Carousel of Recent Worlds */}
        <section className="mb-16">
          <h2 className="text-2xl font-display font-bold mb-6 text-white/90">Recent Worlds</h2>
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory custom-scrollbar">
            {mockWorlds.map((world, i) => (
              <Link key={world.id} href={`/world/${world.id}`} className="snap-start min-w-[300px] lg:min-w-[400px]">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="w-full h-64 rounded-3xl relative overflow-hidden cursor-pointer group border border-border/50 shadow-xl"
                >
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url('${world.imageUrl}')` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <h3 className="text-2xl font-display font-bold text-white mb-2 group-hover:text-glow-primary transition-colors">{world.name}</h3>
                    <div className="flex gap-4 text-sm text-white/70">
                      <span className="glass-panel px-3 py-1 rounded-full">{world.biome}</span>
                      <span className="glass-panel px-3 py-1 rounded-full">{world.population} Pop.</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Lower Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2">
            <h2 className="text-2xl font-display font-bold mb-6 text-white/90">Recent Chapters</h2>
            <div className="space-y-4">
              {mockChapters.map((chap, i) => (
                <motion.div 
                  key={chap.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + (i * 0.1) }}
                  whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.05)" }}
                  className="glass-panel p-5 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 cursor-pointer transition-all border-l-4 border-l-transparent hover:border-l-glow-primary"
                >
                  <div>
                    <h4 className="font-display font-bold text-lg text-white mb-1">{chap.title}</h4>
                    <p className="text-muted text-sm line-clamp-1">{chap.summary}</p>
                  </div>
                  <span className={`text-xs px-4 py-1.5 rounded-full font-medium whitespace-nowrap ${chap.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-glow-primary/10 text-glow-primary border border-glow-primary/20 shadow-[0_0_10px_rgba(139,92,246,0.2)]'}`}>
                    {chap.status === 'completed' ? 'Completed' : 'In Progress'}
                  </span>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="glass-panel p-6 rounded-3xl"
            >
              <h3 className="font-display font-bold text-xl mb-6 text-white flex items-center gap-2">
                <Scroll size={20} className="text-glow-primary" /> Active Quests
              </h3>
              <div className="space-y-6">
                {mockQuests.filter(q => q.status === 'active').map(quest => (
                  <div key={quest.id} className="space-y-2 group">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-white/90 group-hover:text-white transition-colors">{quest.title}</span>
                      <span className="text-glow-primary font-bold">{quest.progress}%</span>
                    </div>
                    <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${quest.progress}%` }}
                        transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                        className="bg-glow-primary h-full shadow-[0_0_10px_rgba(139,92,246,0.8)]" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Multiplayer & Co-op (New Feature) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="glass-panel p-6 rounded-3xl border border-blue-500/20"
            >
              <h3 className="font-display font-bold text-xl mb-6 text-white flex items-center gap-2">
                <Users size={20} className="text-blue-400" /> Co-op & Guilds
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/50 relative">
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-background"></span>
                    <Users size={16} className="text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-white">Elowen is online</h4>
                    <p className="text-xs text-white/50">Exploring: Verdant Hollow</p>
                  </div>
                  <button className="text-xs font-bold text-blue-400 px-3 py-1.5 rounded-full bg-blue-500/10 hover:bg-blue-500/20 transition-colors">
                    Join
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center border border-rose-500/50">
                    <Shield size={16} className="text-rose-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-white">Crimson Guard</h4>
                    <p className="text-xs text-white/50">Guild Raid in 2 hours</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-16 -mx-6 -mb-6 lg:-mx-10 lg:-mb-10 rounded-b-3xl overflow-hidden">
          <CinematicFooter />
        </div>
      </main>
    </AuroraBackground>
  );
}

function SidebarLink({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link href={href}>
      <motion.div 
        whileHover={{ x: 5 }}
        className={`relative flex items-center justify-center lg:justify-start gap-4 p-3 lg:px-4 lg:py-3.5 rounded-2xl transition-all font-display tracking-wide ${active ? 'text-white' : 'text-white/50 hover:text-white'}`}
      >
        {active && (
          <motion.div 
            layoutId="activeSidebarTab"
            className="absolute inset-0 bg-glow-primary/20 rounded-2xl border border-glow-primary/30 shadow-[0_0_20px_rgba(139,92,246,0.15)]"
          />
        )}
        <span className={`relative z-10 ${active ? "text-glow-primary" : ""}`}>{icon}</span>
        <span className={`relative z-10 font-bold hidden lg:block text-xs uppercase tracking-[0.2em] ${active ? "text-white" : ""}`}>{label}</span>
      </motion.div>
    </Link>
  );
}
