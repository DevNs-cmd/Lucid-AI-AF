"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface EtheralShadowProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: string;
  animation?: {
    scale?: number;
    speed?: number;
  };
  noise?: {
    opacity?: number;
    scale?: number;
  };
  sizing?: "fill" | "cover";
}

export function Component({
  color = "rgba(128, 0, 128, 0.65)", // Defaulted to a deep purple
  animation = { scale: 100, speed: 90 },
  noise = { opacity: 0.8, scale: 1.2 },
  sizing = "fill",
  className,
  children,
  ...props
}: EtheralShadowProps) {
  const isFill = sizing === "fill";
  const animScale = animation.scale ?? 100;
  const animSpeed = animation.speed ?? 90;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-black", // Forced black background
        isFill ? "absolute inset-0 w-full h-full" : "w-full h-full",
        className
      )}
      {...props}
    >
      {/* SVG Noise Filter */}
      <svg className="hidden">
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={noise.scale}
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
      </svg>

      {/* Animated Ethereal Shadows */}
      <div
        className="absolute inset-0 z-0 opacity-70 mix-blend-screen"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 60%), radial-gradient(circle at 80% 20%, ${color} 0%, transparent 50%)`,
          filter: "blur(60px)",
          animation: `flow ${animSpeed}s ease-in-out infinite alternate`,
          transform: `scale(${animScale / 100})`,
        }}
      />
      
      {/* Texture Overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay"
        style={{
          opacity: noise.opacity,
          filter: "url(#noiseFilter)",
        }}
      />

      {/* Content Overlay */}
      <div className="relative z-20 flex h-full w-full items-center justify-center">
        {children}
      </div>

      {/* Inline Styles for Animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes flow {
            0% { transform: scale(${animScale / 100}) translate(0%, 0%) rotate(0deg); }
            33% { transform: scale(${animScale / 100 * 1.1}) translate(5%, 2%) rotate(2deg); }
            66% { transform: scale(${animScale / 100 * 0.9}) translate(-5%, -2%) rotate(-2deg); }
            100% { transform: scale(${animScale / 100}) translate(0%, 0%) rotate(0deg); }
          }
        `
      }} />
    </div>
  );
}
