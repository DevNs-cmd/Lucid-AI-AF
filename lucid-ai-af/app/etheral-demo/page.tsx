import { Component } from "@/components/ui/etheral-shadow";

export default function DemoOne() {
  return (
    <div className="flex w-full h-screen justify-center items-center bg-black">
      <Component
        color="rgba(138, 43, 226, 0.8)" // Vibrant Purple (BlueViolet)
        animation={{ scale: 120, speed: 20 }}
        noise={{ opacity: 1, scale: 1.5 }}
        sizing="fill"
      >
        <h1 className="text-white text-5xl md:text-7xl font-bold tracking-tight text-center drop-shadow-lg font-display">
          Etheral <br /> Shadows
        </h1>
      </Component>
    </div>
  );
}
