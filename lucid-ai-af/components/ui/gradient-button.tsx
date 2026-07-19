import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function for merging Tailwind classes (often found in lib/utils.ts)
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  "relative inline-flex items-center justify-center rounded-2xl px-8 py-4 text-lg font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-[#0f172a]/80 backdrop-blur-xl text-white shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:bg-[#0f172a]/60",
        outline: "bg-transparent border border-neutral-200 hover:bg-neutral-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <div className="group relative overflow-hidden rounded-2xl p-[1px] transition-transform hover:-translate-y-1 inline-flex shadow-2xl">
        {/* Animated Conic Gradient Border */}
        <div className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#0f172a_0%,#0ea5e9_50%,#fef08a_100%)] opacity-100"></div>
        
        <Comp
          className={cn(buttonVariants({ variant }), className, "relative z-10 h-full w-full")}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

GradientButton.displayName = "GradientButton";

export { GradientButton, buttonVariants };
