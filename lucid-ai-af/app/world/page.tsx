"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MapPin } from "lucide-react";
import { useState } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Map, MapMarker, MarkerContent, MapControls, MapArc } from "@/components/ui/mapcn-map-controls";

const importantCities = [
  { id: "new-york", name: "New York", lng: -74.0060, lat: 40.7128, desc: "The Big Apple, a global hub of finance and culture." },
  { id: "london", name: "London", lng: -0.1276, lat: 51.5074, desc: "A historic city spanning the River Thames, rich in history and modernity." },
  { id: "tokyo", name: "Tokyo", lng: 139.6917, lat: 35.6895, desc: "A bustling metropolis mixing the ultramodern and the traditional." },
  { id: "paris", name: "Paris", lng: 2.3522, lat: 48.8566, desc: "The City of Light, globally renowned for its art, fashion, and culture." },
  { id: "sydney", name: "Sydney", lng: 151.2093, lat: -33.8688, desc: "Famous for its Opera House, beautiful harbour and spectacular beaches." },
  { id: "san-francisco", name: "San Francisco", lng: -122.4194, lat: 37.7749, desc: "Global center for technology and innovation." },
  { id: "dubai", name: "Dubai", lng: 55.2708, lat: 25.2048, desc: "A futuristic metropolis known for luxury and architecture." },
  { id: "canada", name: "Toronto, Canada", lng: -79.3832, lat: 43.6532, desc: "A diverse hub of finance, arts, and culture." },
  { id: "new-delhi", name: "New Delhi", lng: 77.2090, lat: 28.6139, desc: "The bustling heart and capital of India." },
  { id: "shanghai", name: "Shanghai", lng: 121.4737, lat: 31.2304, desc: "A global financial hub on China's central coast." },
  { id: "singapore", name: "Singapore", lng: 103.8198, lat: 1.3521, desc: "A vibrant island city-state in Southeast Asia." },
];

const networkArcs = [
  { id: "sf-canada", from: [-122.4194, 37.7749] as [number, number], to: [-79.3832, 43.6532] as [number, number] },
  { id: "canada-ny", from: [-79.3832, 43.6532] as [number, number], to: [-74.0060, 40.7128] as [number, number] },
  { id: "ny-london", from: [-74.0060, 40.7128] as [number, number], to: [-0.1276, 51.5074] as [number, number] },
  { id: "london-paris", from: [-0.1276, 51.5074] as [number, number], to: [2.3522, 48.8566] as [number, number] },
  { id: "paris-dubai", from: [2.3522, 48.8566] as [number, number], to: [55.2708, 25.2048] as [number, number] },
  { id: "dubai-delhi", from: [55.2708, 25.2048] as [number, number], to: [77.2090, 28.6139] as [number, number] },
  { id: "delhi-singapore", from: [77.2090, 28.6139] as [number, number], to: [103.8198, 1.3521] as [number, number] },
  { id: "singapore-shanghai", from: [103.8198, 1.3521] as [number, number], to: [121.4737, 31.2304] as [number, number] },
  { id: "shanghai-tokyo", from: [121.4737, 31.2304] as [number, number], to: [139.6917, 35.6895] as [number, number] },
  { id: "tokyo-sydney", from: [139.6917, 35.6895] as [number, number], to: [151.2093, -33.8688] as [number, number] },
  { id: "sydney-sf", from: [151.2093, -33.8688] as [number, number], to: [-122.4194, 37.7749] as [number, number] },
  { id: "london-dubai", from: [-0.1276, 51.5074] as [number, number], to: [55.2708, 25.2048] as [number, number] },
];

export default function WorldMapPage() {
  const [activeCity, setActiveCity] = useState(importantCities[0]);

  return (
    <AuroraBackground className="flex flex-col overflow-hidden font-body text-ink">
      {/* Header */}
      <header className="absolute top-0 left-0 w-full p-6 z-20 flex justify-between items-center pointer-events-none">
        <Link href="/dashboard" className="pointer-events-auto">
          <Button variant="ghost" className="glass-panel text-white hover:bg-surface-hover border-white/10">
            <ChevronLeft size={20} className="mr-2" /> Return to Dashboard
          </Button>
        </Link>
        <h1 className="font-display font-bold text-2xl tracking-widest uppercase text-white shadow-black drop-shadow-lg">
          World Map
        </h1>
      </header>

      {/* Interactive Map Area */}
      <div className="absolute inset-0 z-0">
        <Map
          theme="dark"
          viewport={{
            center: [10, 30],
            zoom: 1.5,
            pitch: 0,
            bearing: 0,
          }}
          className="w-full h-full"
        >
          <MapControls position="bottom-left" showZoom />
          
          <MapArc
            data={networkArcs}
            curvature={0.3}
            animated={true}
            animationDuration={2500}
            staggerDuration={200}
            paint={{
              "line-color": "#38bdf8",
              "line-width": 1.5,
              "line-opacity": 0.6,
            }}
            hoverPaint={{
              "line-color": "#0ea5e9",
              "line-width": 2.5,
              "line-opacity": 1,
            }}
          />

          {importantCities.map((city) => (
            <MapMarker
              key={city.id}
              longitude={city.lng}
              latitude={city.lat}
              onClick={() => setActiveCity(city)}
            >
              <MarkerContent>
                <div className="relative group flex flex-col items-center cursor-pointer">
                  {/* Outer Glow */}
                  <div className={`absolute -inset-2 rounded-full ${activeCity.id === city.id ? 'bg-[#38bdf8]/50 animate-ping' : 'bg-[#38bdf8]/20 group-hover:bg-[#38bdf8]/40'} transition-all`} />
                  
                  {/* Cyan Dot */}
                  <div className={`relative w-2.5 h-2.5 rounded-full shadow-[0_0_8px_#38bdf8] ${activeCity.id === city.id ? 'bg-white' : 'bg-[#38bdf8]'}`} />
                  
                  {/* City Name */}
                  <span className={`absolute top-4 font-display font-bold text-[10px] sm:text-xs tracking-wider uppercase drop-shadow-md whitespace-nowrap ${activeCity.id === city.id ? 'text-white' : 'text-white/60 group-hover:text-white/90'}`}>
                    {city.name}
                  </span>
                </div>
              </MarkerContent>
            </MapMarker>
          ))}
        </Map>
      </div>

      {/* Info Panel Overlay */}
      <motion.div
        key={activeCity.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[90%] max-w-lg glass-panel p-6 rounded-3xl border-white/10 z-20 pointer-events-auto bg-background/80 backdrop-blur-md"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="font-display font-bold text-2xl text-white mb-1">{activeCity.name}</h2>
            <span className="text-xs px-3 py-1 rounded-full uppercase tracking-widest font-bold bg-white/10 text-white/70">
              Important City
            </span>
          </div>
          <Button className="bg-glow-primary hover:bg-glow-primary/90 text-white shadow-glow border-none">
            Travel Here
          </Button>
        </div>
        <p className="text-muted text-sm leading-relaxed">
          {activeCity.desc}
        </p>
      </motion.div>
    </AuroraBackground>
  );
}
