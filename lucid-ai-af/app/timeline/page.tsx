"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, GitCommit, Play, Scroll, Users, Trophy, BookOpen, Star } from "lucide-react";
import { mockChapters } from "@/lib/mockData";

export default function TimelinePage() {
  const [activeFilter, setActiveFilter] = useState("Chapters");

  const filters = [
    { name: "Chapters", icon: BookOpen },
    { name: "Quests", icon: Scroll },
    { name: "Relationships", icon: Users },
    { name: "Achievements", icon: Trophy },
    { name: "Endings", icon: Star },
  ];

  // Generate some mock timeline events based on the filter
  const getTimelineEvents = () => {
    if (activeFilter === "Chapters") {
      return mockChapters.map(c => ({
        id: c.id,
        title: c.title,
        description: c.summary,
        status: c.status === 'completed' ? 'Archived' : 'Current Era',
        hasCinematic: c.id === 'chap_2',
        icon: BookOpen,
        color: "text-glow-primary",
        bg: "bg-glow-primary"
      }));
    } else if (activeFilter === "Quests") {
      return [
        { id: "q1", title: "The Awakening of the Core", description: "Successfully infiltrated the Ashen Vault and retrieved the neural core.", status: "Completed", hasCinematic: false, icon: Scroll, color: "text-amber-400", bg: "bg-amber-400" },
        { id: "q2", title: "Lost Artifacts of the Ancients", description: "Currently searching the northern ruins for the remaining artifact pieces.", status: "In Progress", hasCinematic: false, icon: Scroll, color: "text-amber-400", bg: "bg-amber-400" },
      ];
    } else if (activeFilter === "Relationships") {
      return [
        { id: "r1", title: "Elowen The Merchant", description: "Reached 'Trusted' status after returning the stolen caravan goods.", status: "Alliance Formed", hasCinematic: false, icon: Users, color: "text-pink-400", bg: "bg-pink-400" },
        { id: "r2", title: "The Crimson Guild", description: "Hostile standing due to the events in the lower city.", status: "Enemies", hasCinematic: true, icon: Users, color: "text-rose-500", bg: "bg-rose-500" },
      ];
    } else if (activeFilter === "Achievements") {
      return [
        { id: "a1", title: "Slayer of Beasts", description: "Defeated the Guardian of the Ashen Wastes without taking damage.", status: "Unlocked", hasCinematic: true, icon: Trophy, color: "text-emerald-400", bg: "bg-emerald-400" },
        { id: "a2", title: "Master of Shadows", description: "Completed 5 quests consecutively using stealth.", status: "Unlocked", hasCinematic: false, icon: Trophy, color: "text-emerald-400", bg: "bg-emerald-400" },
      ];
    } else {
      return [
        { id: "e1", title: "The False Dawn", description: "You chose to side with the automaton, unlocking a dark future for the realm.", status: "Ending Discovered", hasCinematic: true, icon: Star, color: "text-purple-400", bg: "bg-purple-400" }
      ];
    }
  };

  const events = getTimelineEvents();

  return (
    <div className="relative min-h-screen w-full flex flex-col font-body text-ink overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black/95 z-0" />

      {/* Header */}
      <header className="relative z-10 w-full p-6 lg:p-12 pb-0 flex flex-col justify-between gap-6">
        <div>
          <Link href="/dashboard" className="inline-flex mb-6">
            <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10 border-none px-0">
              <ChevronLeft size={20} className="mr-1" /> Back to Dashboard
            </Button>
          </Link>
          <h1 className="font-display font-bold text-4xl tracking-wide flex items-center gap-3 text-white">
            <GitCommit className="text-glow-primary" size={32} /> Story Timeline
          </h1>
          <p className="text-white/50 mt-2">The chronicles of your journey.</p>
        </div>

        {/* Filters (Liquid Glass Tabs) */}
        <div className="flex gap-4 overflow-x-auto pb-6 pt-2 custom-scrollbar px-2">
          {filters.map((filter) => (
            <button
              key={filter.name}
              onClick={() => setActiveFilter(filter.name)}
              className={`relative flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 whitespace-nowrap overflow-hidden group ${
                activeFilter === filter.name 
                  ? 'text-white scale-105 shadow-[0_8px_32px_rgba(255,255,255,0.1)]' 
                  : 'text-white/50 hover:text-white hover:scale-[1.02]'
              }`}
            >
              {/* Glass Background */}
              <div className={`absolute inset-0 backdrop-blur-xl border transition-all duration-300 ${
                activeFilter === filter.name
                  ? 'bg-white/20 border-white/30 border-t-white/60'
                  : 'bg-white/5 border-white/10 border-t-white/20 group-hover:bg-white/10'
              } rounded-2xl`} />
              
              {/* Subtle inner highlight */}
              <div className="absolute inset-0 rounded-2xl opacity-50 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

              {/* Content */}
              <span className="relative z-10 flex items-center gap-2 drop-shadow-md">
                <filter.icon size={16} className={activeFilter === filter.name ? "text-glow-primary" : ""} />
                {filter.name}
              </span>
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 p-6 lg:p-12 overflow-y-auto custom-scrollbar">
        <div className="max-w-3xl mx-auto relative">
          
          {/* Vertical Line */}
          <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-glow-primary via-white/10 to-transparent lg:-translate-x-1/2" />

          <div className="space-y-12">
            <AnimatePresence mode="popLayout">
              {events.map((event, i) => {
                const isEven = i % 2 === 0;
                return (
                  <motion.div 
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className={`relative flex items-center lg:justify-between w-full ${isEven ? 'lg:flex-row-reverse' : ''}`}
                  >
                    {/* Center Node */}
                    <div className={`absolute left-6 lg:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full ${event.bg} shadow-[0_0_15px_rgba(139,92,246,0.8)] border-4 border-black z-10 flex items-center justify-center`}>
                      <event.icon size={12} className="text-black" />
                    </div>

                    {/* Spacer for desktop layout */}
                    <div className="hidden lg:block w-5/12" />

                    {/* Content Card */}
                    <div className={`w-full lg:w-5/12 pl-16 lg:pl-0 ${isEven ? 'lg:pr-12 lg:text-right' : 'lg:pl-12'}`}>
                      <div className="glass-panel bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 group hover:border-glow-primary/30 transition-colors shadow-xl">
                        <span className={`text-xs ${event.color} font-bold uppercase tracking-widest mb-2 block`}>
                          {event.status}
                        </span>
                        <h3 className="font-display font-bold text-xl text-white mb-2">{event.title}</h3>
                        <p className="text-white/70 text-sm leading-relaxed mb-4">{event.description}</p>
                        
                        {event.hasCinematic && (
                          <div className="mt-4 p-3 bg-white/5 rounded-xl flex items-center justify-between border border-white/5 cursor-pointer hover:bg-glow-primary/20 hover:border-glow-primary/50 group/video transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-hover/video:bg-glow-primary group-hover/video:text-white transition-colors">
                                <Play size={14} className="ml-1" />
                              </div>
                              <span className="text-sm font-bold text-white/90">Watch AI Cinematic</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
