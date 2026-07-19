"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { mockWorlds } from "@/lib/mockData";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { GradientButton } from "@/components/ui/gradient-button";
import { ChevronLeft, Users, Calendar, Map, Scroll, Shield, Settings, Activity, Crown } from "lucide-react";

export default function RealmPage() {
  const params = useParams();
  const id = params?.id as string;
  
  // Find the world, or fallback to the first mock world if not found
  const world = mockWorlds.find(w => w.id === id) || mockWorlds[0];

  return (
    <AuroraBackground className="flex flex-col font-body text-ink min-h-screen overflow-x-hidden">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center bg-black/20 backdrop-blur-md border-b border-white/5">
        <Link href="/dashboard">
          <button className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
            <ChevronLeft size={20} /> Back to Dashboard
          </button>
        </Link>
        <div className="font-display font-bold text-white tracking-widest uppercase">
          Realm Interface
        </div>
        <div className="w-24"></div> {/* Spacer for centering */}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10 flex flex-col gap-12">
        
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl flex flex-col justify-end p-10 lg:p-16"
        >
          {/* Background Image & Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url('${world.imageUrl}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-bold border border-white/20">
                  {world.biome}
                </span>
                <span className={`px-4 py-1.5 rounded-full backdrop-blur-md text-sm font-bold border ${world.status === 'live' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'}`}>
                  {world.status.toUpperCase()}
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-2 tracking-wide drop-shadow-lg">
                {world.name}
              </h1>
              <p className="text-white/70 text-lg flex items-center gap-2">
                <Crown size={18} className="text-glow-primary" /> Owned by <span className="font-bold text-white">{world.owner}</span>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <GradientButton className="px-10">
                Enter Realm
              </GradientButton>
              <button className="px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold backdrop-blur-md transition-colors flex items-center gap-2 justify-center">
                <Map size={20} /> View Map
              </button>
            </div>
          </div>
        </motion.section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<Users className="text-blue-400" />} title="Population" value={world.population.toLocaleString()} />
          <StatCard icon={<Calendar className="text-purple-400" />} title="Created" value={new Date(world.createdAt).toLocaleDateString()} />
          <StatCard icon={<Activity className="text-emerald-400" />} title="Active Players" value={Math.floor(world.population * 0.42).toString()} />
          <StatCard icon={<Shield className="text-rose-400" />} title="Security Level" value="High" />
        </section>

        {/* Dynamic World Content Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Active Realm Quests */}
          <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-md space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
                <Scroll className="text-glow-primary" size={24} /> Regional Quests
              </h2>
              <button className="text-sm text-glow-primary hover:text-white transition-colors">View All</button>
            </div>
            
            <div className="space-y-4">
              <QuestRow title="The Awakening of the Core" type="Main Story" progress={68} />
              <QuestRow title="Lost Artifacts of the Ancients" type="Side Quest" progress={22} />
              <QuestRow title="Defend the Northern Borders" type="World Event" progress={95} />
            </div>
          </div>

          {/* Owner Controls */}
          <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-md space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
                <Settings className="text-white/70" size={24} /> Management
              </h2>
            </div>
            
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white/80 hover:text-white transition-colors flex justify-between items-center">
                World Settings <span>→</span>
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white/80 hover:text-white transition-colors flex justify-between items-center">
                Manage NPCs <span>→</span>
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white/80 hover:text-white transition-colors flex justify-between items-center">
                Economy Overrides <span>→</span>
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 transition-colors flex justify-between items-center mt-4">
                Archive Realm
              </button>
            </div>
          </div>
          
          {/* Multiplayer & Co-op */}
          <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-md space-y-6">
            <div className="border-b border-white/10 pb-4 flex justify-between items-center">
              <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
                <Users className="text-blue-400" size={24} /> Multiplayer
              </h2>
              <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs font-bold">Online</span>
            </div>
            
            <div className="space-y-4">
              <button className="w-full py-4 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 font-bold transition-colors shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                + Invite Friends
              </button>
              
              <div className="pt-2">
                <h3 className="text-xs uppercase tracking-widest text-white/50 font-bold mb-3">Active Guilds</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center">
                        <Shield size={14} className="text-rose-400" />
                      </div>
                      <span className="text-sm font-bold text-white">The Crimson Guard</span>
                    </div>
                    <span className="text-xs text-white/50">42 Members</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Map size={14} className="text-emerald-400" />
                      </div>
                      <span className="text-sm font-bold text-white">Pathfinders</span>
                    </div>
                    <span className="text-xs text-white/50">18 Members</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </section>

      </main>
    </AuroraBackground>
  );
}

function StatCard({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-panel p-6 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-md"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-white/5 rounded-xl border border-white/10">{icon}</div>
        <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest">{title}</h3>
      </div>
      <div className="text-3xl font-display font-bold text-white">{value}</div>
    </motion.div>
  );
}

function QuestRow({ title, type, progress }: { title: string, type: string, progress: number }) {
  return (
    <div className="group flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 cursor-pointer">
      <div>
        <h4 className="font-bold text-white text-lg group-hover:text-glow-primary transition-colors">{title}</h4>
        <span className="text-xs font-medium px-2 py-1 rounded bg-white/10 text-white/60">{type}</span>
      </div>
      <div className="w-full sm:w-48 space-y-2">
        <div className="flex justify-between text-xs text-white/70">
          <span>Progress</span>
          <span className="text-glow-primary font-bold">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full bg-glow-primary shadow-[0_0_10px_rgba(139,92,246,0.8)]"
          />
        </div>
      </div>
    </div>
  );
}
