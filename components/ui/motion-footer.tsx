"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// --- MAGNETIC BUTTON PRIMITIVE ---
const MagneticButton = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const text = textRef.current;
    if (!button || !text) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = button.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) * 0.4;
      const y = (e.clientY - top - height / 2) * 0.4;

      gsap.to(button, { x, y, duration: 0.6, ease: "power3.out" });
      gsap.to(text, { x: x * 0.5, y: y * 0.5, duration: 0.6, ease: "power3.out" });
    };

    const handleMouseLeave = () => {
      gsap.to(button, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
      gsap.to(text, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      className={`relative inline-flex items-center justify-center px-8 py-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden group transition-colors hover:bg-white/10 ${className}`}
    >
      <span ref={textRef} className="relative z-10 text-white font-medium tracking-wide">
        {children}
      </span>
    </button>
  );
};

// --- CINEMATIC FOOTER COMPONENT ---
export function CinematicFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!footerRef.current || !textRef.current || !containerRef.current) return;

    // Parallax Reveal Animation
    gsap.fromTo(
      containerRef.current,
      { yPercent: -50, scale: 0.9, opacity: 0 },
      {
        yPercent: 0,
        scale: 1,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
        },
      }
    );

    // Giant Text Parallax
    gsap.fromTo(
      textRef.current,
      { y: 150 },
      {
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
        },
      }
    );
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-black overflow-hidden z-0 flex flex-col"
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
    >
      {/* Aurora Glow & Grid Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-purple-600/30 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] bg-blue-600/20 rounded-full blur-[150px] mix-blend-screen" />
      </div>
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" 
        style={{ maskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)" }}
      />

      {/* Diagonal Marquee */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] -rotate-12 opacity-5 pointer-events-none">
        <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite]">
          {Array(10).fill("EXPLORE THE ASHEN WASTES • UNCOVER SECRETS • ").map((text, i) => (
            <span key={i} className="text-8xl font-display font-black text-white px-4">{text}</span>
          ))}
        </div>
      </div>

      <div ref={containerRef} className="relative z-10 flex flex-col w-full max-w-7xl mx-auto px-6 min-h-full flex-1 pt-6 pb-10">
        <div className="flex-1 flex flex-col items-center justify-start space-y-8 mt-12 mb-8">
          <p className="text-glow-primary tracking-[0.3em] uppercase text-sm font-bold drop-shadow-md">
            The world is evolving
          </p>
          <MagneticButton>Continue Journey</MagneticButton>
        </div>

        {/* Giant Masked Typography */}
        <div className="w-full overflow-hidden mt-auto pb-6">
          <h1 
            ref={textRef}
            className="text-[8.5vw] opacity-90 font-display font-black text-center leading-none text-transparent bg-clip-text bg-gradient-to-b from-purple-900 via-white to-black uppercase tracking-tighter drop-shadow-2xl"
          >
            LUCID AI
          </h1>
        </div>

        {/* Necessary Footer Info */}
        <div className="w-full pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand & Copyright */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-glow-primary/20 border border-glow-primary/50 flex items-center justify-center text-glow-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              </div>
              <span className="font-display font-bold text-lg tracking-wider text-white">
                LUCID AI
              </span>
            </div>
            <p className="text-white/50 text-sm max-w-xs">
              Crafting immersive AI-driven game experiences in the Ashen Wastes.
            </p>
            <div className="flex items-center gap-4 mt-2">
              {/* Social Icons */}
              <a href="#" className="text-white/40 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" className="text-white/40 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="#" className="text-white/40 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
            </div>
            <p className="text-white/40 text-xs mt-auto pt-4">
              © 2026 Lucid AI, All rights reserved
            </p>
          </div>

          {/* Product Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold mb-2">Product</h4>
            <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">Features</a>
            <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">World Map</a>
            <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">Characters</a>
            <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">Pricing</a>
            <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">Help</a>
            <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">Terms</a>
          </div>

          {/* Company Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold mb-2">Company</h4>
            <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">About</a>
            <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">Lore & Story</a>
            <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">Blogs</a>
            <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">Careers</a>
            <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">Contact</a>
            <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">Privacy</a>
          </div>

          {/* Social Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold mb-2">Social</h4>
            <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">X</a>
            <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">LinkedIn</a>
            <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">Facebook</a>
            <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">Discord</a>
            <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">Instagram</a>
            <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">Youtube</a>
          </div>
        </div>
      </div>

      {/* Global tailwind custom animation for marquee */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </footer>
  );
}
