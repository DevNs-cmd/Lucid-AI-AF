import { Particles } from "@/components/ui/particles";

export default function ParticlesDemo() {
  return (
    <div className="relative bg-black w-full h-screen overflow-hidden flex items-center justify-center">
      <h1 className="z-10 text-white text-5xl font-bold tracking-tight pointer-events-none">
        ScrollX UI
      </h1>
      
      <div className="absolute inset-0 z-0">
        <Particles animate={true} color="#ffffff" particleCount={25000} particleSize={3}/>
      </div>
    </div>
  );
}
