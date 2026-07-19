"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import { ChevronLeft, User, Shield, Activity, Star } from "lucide-react";

export default function UserProfilePage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Read from localStorage to match the login flow
    const savedEmail = localStorage.getItem("userEmail") || "adventurer@example.com";
    const savedUsername = localStorage.getItem("username") || "Adventurer_01";
    setEmail(savedEmail);
    setUsername(savedUsername);
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return <div className="min-h-screen bg-background" />;

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
            <User className="text-glow-primary" size={32} /> User Profile
          </h1>
          <p className="text-muted mt-2">Manage your account and view your progress.</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 mx-6 my-6 p-6 lg:p-10 overflow-y-auto custom-scrollbar glass-panel rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Profile Header Card */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-glow-primary/50 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                <img src="/avatars/avatar_1.png" alt="User Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-glow-accent border-2 border-background flex items-center justify-center">
                <Star size={14} className="text-black fill-current" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-display font-bold text-white mb-2 capitalize italic">{username}</h2>
              <p className="text-muted mb-4">Level 42 Explorer • Joined 2024</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="px-3 py-1 bg-glow-primary/20 text-glow-primary rounded-full text-xs font-bold uppercase tracking-widest border border-glow-primary/30">
                  Premium Member
                </span>
                <span className="px-3 py-1 bg-white/10 text-white rounded-full text-xs font-bold uppercase tracking-widest border border-white/10">
                  Pioneer
                </span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Button className="bg-glow-primary text-white border-none shadow-glow hover:bg-glow-primary/90">
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <Activity className="text-glow-accent mb-2" size={24} />
              <h4 className="text-4xl font-display font-black text-white mb-1">124</h4>
              <p className="text-muted text-sm uppercase tracking-widest font-bold">Hours Played</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <Shield className="text-emerald-400 mb-2" size={24} />
              <h4 className="text-4xl font-display font-black text-white mb-1">12</h4>
              <p className="text-muted text-sm uppercase tracking-widest font-bold">Quests Completed</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <User className="text-pink-400 mb-2" size={24} />
              <h4 className="text-4xl font-display font-black text-white mb-1">8</h4>
              <p className="text-muted text-sm uppercase tracking-widest font-bold">Companions Met</p>
            </div>
          </div>

          {/* Account Settings Placeholder */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h3 className="text-xl font-display font-bold text-white mb-6">Account Settings</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <div>
                  <h4 className="text-white font-medium">Email Address</h4>
                  <p className="text-muted text-sm">{email}</p>
                </div>
                <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">Change</Button>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <div>
                  <h4 className="text-white font-medium">Password</h4>
                  <p className="text-muted text-sm">Last changed 3 months ago</p>
                </div>
                <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">Update</Button>
              </div>
              <div className="flex justify-between items-center py-3">
                <div>
                  <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                  <p className="text-muted text-sm">Enhance your account security</p>
                </div>
                <Button className="bg-glow-primary text-white border-none shadow-glow">Enable</Button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </AuroraBackground>
  );
}
