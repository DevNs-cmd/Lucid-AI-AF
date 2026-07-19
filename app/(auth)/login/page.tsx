"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Mail } from "lucide-react";
import { Particles } from "@/components/ui/particles";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      localStorage.setItem("userEmail", email);
      // Derive a simple username from email
      const username = email.split('@')[0];
      localStorage.setItem("username", username);
    }
    window.location.href = '/dashboard';
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-body text-ink overflow-hidden bg-background">
      {/* Background with 3D Particles */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <Particles 
          color="#b465ff" 
          particleCount={8000} 
          particleSize={4} 
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background/50 z-0 pointer-events-none" />

      {/* Main Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md p-8 md:p-12 glass-panel rounded-3xl shadow-2xl border-t border-white/10"
      >
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-glow-primary/20 border border-glow-primary/50 flex items-center justify-center text-glow-primary shadow-[0_0_15px_rgba(139,92,246,0.5)]">
            <Sparkles size={24} />
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-3xl tracking-wide mb-2">Welcome Back</h1>
          <p className="text-muted font-light">Enter the portal to continue your story.</p>
        </div>

        <div className="space-y-4">
          <Button variant="outline" className="w-full glass-panel hover:bg-surface-hover text-ink border-white/10 py-6 text-lg flex items-center justify-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Button>
          
          <Button variant="outline" className="w-full glass-panel hover:bg-surface-hover text-ink border-white/10 py-6 text-lg flex items-center justify-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            Continue with GitHub
          </Button>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-background text-muted">Or continue with email</span>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface border border-white/10 rounded-xl py-3 pl-10 pr-4 text-ink placeholder:text-white/20 focus:outline-none focus:border-glow-primary focus:ring-1 focus:ring-glow-primary transition-all" 
                placeholder="adventurer@lucid.ai" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-muted">Password</label>
              <a href="#" className="text-xs text-glow-primary hover:text-glow-primary/80 transition-colors">Forgot password?</a>
            </div>
            <input 
              type="password" 
              required
              className="w-full bg-surface border border-white/10 rounded-xl py-3 px-4 text-ink placeholder:text-white/20 focus:outline-none focus:border-glow-primary focus:ring-1 focus:ring-glow-primary transition-all" 
              placeholder="••••••••" 
            />
          </div>

          <Button type="submit" className="w-full bg-glow-primary hover:bg-glow-primary/90 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] border-none py-6 text-lg mt-4 group">
            Login to Dashboard
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
          </Button>
        </form>

        <p className="text-center text-sm text-muted mt-8">
          Don't have an account? <Link href="/signup" className="text-glow-primary hover:underline">Start your journey</Link>
        </p>
      </motion.div>
    </div>
  );
}
