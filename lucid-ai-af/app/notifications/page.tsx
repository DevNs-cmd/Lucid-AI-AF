"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Bell, Globe, Sword, Star } from "lucide-react";

const notifications = [
  { id: 1, type: "world", title: "War in Esteria", time: "2 hours ago", desc: "The Ash Raiders have officially declared war on the merchants of Esteria.", icon: <Sword className="text-red-400" /> },
  { id: 2, type: "system", title: "New Cinematic Rendered", time: "5 hours ago", desc: "Your encounter with the Dragon of the Peaks has been rendered into a video.", icon: <Star className="text-gold" /> },
  { id: 3, type: "world", title: "Economy Shift", time: "1 day ago", desc: "Silver prices have plummeted in the Shadow Kingdom.", icon: <Globe className="text-blue-400" /> },
];

export default function NotificationsPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col font-body text-ink overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background/95 z-0" />

      {/* Header */}
      <header className="relative z-10 w-full p-6 lg:p-12 pb-0 flex flex-col justify-between gap-6">
        <div>
          <Link href="/dashboard" className="inline-flex mb-6">
            <Button variant="ghost" className="text-muted hover:text-white hover:bg-surface-hover border-none px-0">
              <ChevronLeft size={20} className="mr-1" /> Back to Dashboard
            </Button>
          </Link>
          <h1 className="font-display font-bold text-4xl tracking-wide flex items-center gap-3">
            <Bell className="text-glow-primary" size={32} /> Notifications
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 p-6 lg:p-12 overflow-y-auto custom-scrollbar">
        <div className="max-w-3xl mx-auto space-y-4 pb-20">
          <AnimatePresence>
            {notifications.map((notif, i) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="glass-panel p-6 rounded-2xl border-white/5 flex gap-4 hover:border-glow-primary/30 transition-colors cursor-pointer group"
              >
                <div className="mt-1 w-10 h-10 rounded-full bg-black/40 flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-glow-primary/10 transition-colors">
                  {notif.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-white text-lg">{notif.title}</h3>
                    <span className="text-xs text-muted">{notif.time}</span>
                  </div>
                  <p className="text-muted text-sm leading-relaxed">{notif.desc}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
