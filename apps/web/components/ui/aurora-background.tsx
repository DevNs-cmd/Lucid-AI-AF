"use client";

import React, { ReactNode } from "react";
import { LiveGradient } from "./live-gradient";

function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(" ");
}

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children?: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <div
      className={cn(
        "relative w-full min-h-screen bg-background text-ink overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <LiveGradient className="absolute inset-0 z-0 opacity-80" />
      </div>
      
      {children}
    </div>
  );
};
