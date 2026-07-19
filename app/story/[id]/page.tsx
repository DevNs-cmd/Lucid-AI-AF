"use client";

import { useState, use, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, BookOpen, Sparkles, MessageSquare, 
  Map, Skull, Heart, Drama, Zap, RefreshCw, Send, Shield,
  Mic, Film, BookText, Settings, Video, Mic2
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Custom hook for Typewriter effect
function useTypewriter(text: string, speed = 20) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setIsTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayedText, isTyping };
}

const mockStory = `The heavy iron doors of the Ashen Vault scream as they scrape across the stone floor, revealing a cavernous hall untouched for centuries. The air is thick with the scent of ozone and ancient dust. 

In the center of the room, illuminated by a solitary shaft of moonlight, kneels a towering automaton. Its armor is etched with glowing runes that pulse in a slow, rhythmic heartbeat. As you step forward, the construct's head snaps up. Its optical sensors flare a brilliant, hostile red. 

"Intruder," a mechanical voice echoes, vibrating through your very bones. "The Aegis protocol has been triggered. State your purpose, or be eradicated."`;

export default function StoryScreen({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const [generationMode, setGenerationMode] = useState("Main Story");
  const [genre, setGenre] = useState("Action");
  const [isGenerating, setIsGenerating] = useState(false);
  const { displayedText, isTyping } = useTypewriter(mockStory, 15);
  const [customPrompt, setCustomPrompt] = useState("");
  const [showJournal, setShowJournal] = useState(false);
  const [isRenderingCinematic, setIsRenderingCinematic] = useState(false);
  const [aiVoiceEnabled, setAiVoiceEnabled] = useState(true);

  const handleChoice = () => {
    setIsGenerating(true);
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 3000);
  };

  const handleCustomAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt) return;
    setIsGenerating(true);
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 3000);
  };

  const handleCinematicRender = () => {
    setIsRenderingCinematic(true);
    setTimeout(() => {
      setIsRenderingCinematic(false);
      // Simulate video modal opening here
      alert("Cinematic Video Rendered!");
    }, 3000);
  };

  return (
    <div className="relative min-h-screen w-full flex bg-black overflow-hidden font-body text-ink">
      {/* Cinematic Background */}
      <motion.div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url('/gallery/ashen_wastes.png')` }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/60 backdrop-blur-sm"></div>
      </motion.div>

      {/* AI Journal Left Sidebar */}
      <AnimatePresence>
        {showJournal && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute left-0 top-0 bottom-0 w-80 glass-panel border-r border-white/10 shadow-2xl z-40 flex flex-col bg-black/60 backdrop-blur-2xl"
          >
            <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-glow-primary/20 rounded-lg border border-glow-primary/30">
                  <BookText className="text-glow-primary" size={20} />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-white">AI Journal</h2>
                  <p className="text-xs text-white/50">Auto-Summary</p>
                </div>
              </div>
              <button onClick={() => setShowJournal(false)} className="text-white/50 hover:text-white">
                <ChevronLeft size={20} />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto space-y-8 custom-scrollbar">
              <div>
                <h3 className="text-xs uppercase tracking-widest text-glow-primary font-bold mb-3 flex items-center gap-2">
                  <Settings size={14} /> Daily Progress
                </h3>
                <p className="text-sm text-white/80 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                  You navigated the treacherous Ashwood Forest and discovered the hidden path to the Ashen Vault. Your encounter with the traveling merchant increased your standing in the local guild.
                </p>
              </div>
              
              <div>
                <h3 className="text-xs uppercase tracking-widest text-glow-primary font-bold mb-3 flex items-center gap-2">
                  <Shield size={14} /> Important Events
                </h3>
                <ul className="space-y-3">
                  <li className="text-sm text-white/80 flex gap-3 items-start bg-white/5 p-3 rounded-xl">
                    <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>Unlocked the Aegis Protocol seal.</span>
                  </li>
                  <li className="text-sm text-white/80 flex gap-3 items-start bg-white/5 p-3 rounded-xl">
                    <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-rose-400 shrink-0" />
                    <span>Lost 15 Silver Coins to a trap.</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-widest text-glow-primary font-bold mb-3 flex items-center gap-2">
                  <BookOpen size={14} /> Player History
                </h3>
                <p className="text-sm text-white/80 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                  A wandering mercenary who arrived in the Ashen Wastes looking for ancient technology. Known to favor stealth and diplomacy over brute force.
                </p>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area (Left/Center) */}
      <main className="relative z-10 flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="w-full p-6 flex justify-between items-center bg-black/20 backdrop-blur-md border-b border-white/5">
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10 border-none flex items-center gap-2 transition-colors">
                <ChevronLeft size={20} />
                <span className="uppercase tracking-widest text-xs font-bold">Dashboard</span>
              </Button>
            </Link>
            {!showJournal && (
              <Button variant="ghost" onClick={() => setShowJournal(true)} className="text-glow-primary hover:text-glow-accent hover:bg-glow-primary/10 border-none flex items-center gap-2 transition-colors">
                <BookText size={18} />
                <span className="uppercase tracking-widest text-xs font-bold">Open Journal</span>
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Shield size={14} className="text-glow-primary" />
            <span className="text-xs font-bold text-white/80 uppercase tracking-wider">Chapter 3: The Ashen Vault</span>
          </div>
        </header>

        {/* Story Reading Area */}
        <div className="flex-1 flex flex-col p-6 lg:p-12 max-w-4xl w-full mx-auto justify-center overflow-y-auto custom-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full relative"
          >
            {/* Action Bar (Cinematics & Audio) */}
            <div className="flex justify-end gap-3 mb-8">
              <button 
                onClick={handleCinematicRender}
                className="flex items-center gap-2 px-4 py-2 bg-glow-primary/20 hover:bg-glow-primary/40 border border-glow-primary/30 rounded-xl text-white text-sm font-bold transition-colors"
              >
                {isRenderingCinematic ? <RefreshCw size={16} className="animate-spin" /> : <Film size={16} />}
                {isRenderingCinematic ? "Rendering Cinematic..." : "Generate Cinematic"}
              </button>
            </div>

            {/* Story Text Box */}
            <div className="mb-12 relative group">
              <div className="absolute -left-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                {aiVoiceEnabled && (
                  <button className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-glow-primary transition-colors">
                    <VolumeIcon />
                  </button>
                )}
              </div>
              <p className="text-xl lg:text-2xl text-white/90 leading-relaxed font-body whitespace-pre-wrap">
                {displayedText}
                {isTyping && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-3 h-6 bg-glow-primary ml-1 align-middle"
                  />
                )}
              </p>
            </div>

            {/* Interactive Choices */}
            <AnimatePresence mode="wait">
              {!isTyping && !isGenerating && (
                <motion.div
                  key="choices"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.5 }}
                  className="w-full space-y-4"
                >
                  <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Sparkles size={16} className="text-glow-primary" /> How do you respond?
                  </h3>
                  
                  <button onClick={handleChoice} className="w-full p-5 glass-panel rounded-2xl text-left hover:bg-white/5 border border-white/5 hover:border-glow-primary transition-all group shadow-lg">
                    <span className="text-glow-primary font-bold mr-3 group-hover:text-white transition-colors">A.</span>
                    <span className="text-white/90 font-medium text-lg">Draw your weapon and prepare for combat. "I am no intruder. Stand down!"</span>
                  </button>
                  
                  <button onClick={handleChoice} className="w-full p-5 glass-panel rounded-2xl text-left hover:bg-white/5 border border-white/5 hover:border-glow-primary transition-all group shadow-lg">
                    <span className="text-glow-primary font-bold mr-3 group-hover:text-white transition-colors">B.</span>
                    <span className="text-white/90 font-medium text-lg">Raise your hands peacefully. "I seek the lost archives. I mean no harm."</span>
                  </button>

                  <button onClick={handleChoice} className="w-full p-5 glass-panel rounded-2xl text-left hover:bg-white/5 border border-white/5 hover:border-glow-primary transition-all group shadow-lg">
                    <span className="text-glow-primary font-bold mr-3 group-hover:text-white transition-colors">C.</span>
                    <span className="text-white/90 font-medium text-lg">Use the EMP device hidden in your cloak to disable it immediately.</span>
                  </button>

                  {/* Custom Input */}
                  <form onSubmit={handleCustomAction} className="mt-6 relative">
                    <input 
                      type="text" 
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="Or type your own custom action..." 
                      className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-white focus:outline-none focus:border-glow-primary focus:ring-1 focus:ring-glow-primary transition-all shadow-inner"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-glow-primary rounded-xl text-white transition-colors">
                      <Send size={18} />
                    </button>
                  </form>
                </motion.div>
              )}

              {isGenerating && (
                <motion.div
                  key="generating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full mt-12 p-8 glass-panel rounded-3xl border border-white/10 flex flex-col items-center justify-center gap-6"
                >
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-white/10 border-t-glow-primary rounded-full animate-spin"></div>
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-glow-primary animate-pulse" size={16} />
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-white mb-2">The Engine is weaving...</p>
                    <p className="text-white/50 text-sm">Processing your choices and generating the next sequence.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      {/* AI Story Engine Sidebar (Right) */}
      <aside className="w-80 lg:w-96 glass-panel border-l border-white/10 shadow-2xl z-30 flex flex-col bg-black/60 backdrop-blur-2xl">
        <div className="p-6 border-b border-white/10 bg-white/5 flex items-center gap-3">
          <div className="p-2 bg-glow-primary/20 rounded-lg border border-glow-primary/30">
            <BookOpen className="text-glow-primary" size={20} />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-white">AI Engine</h2>
            <p className="text-xs text-white/50">Director Controls</p>
          </div>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto space-y-8 custom-scrollbar">
          
          {/* AI Voice Settings */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-white/50 font-bold flex items-center gap-2">
              <Mic2 size={14} /> AI Voice Settings
            </h3>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">NPC Dialogue TTS</p>
                  <p className="text-xs text-white/50">Every NPC speaks</p>
                </div>
                <button onClick={() => setAiVoiceEnabled(!aiVoiceEnabled)} className={`w-10 h-6 rounded-full relative transition-colors ${aiVoiceEnabled ? 'bg-glow-primary shadow-[0_0_10px_rgba(139,92,246,0.5)]' : 'bg-white/20'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${aiVoiceEnabled ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>
              
              {aiVoiceEnabled && (
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/70">Voice Model</span>
                    <span className="text-xs font-bold text-glow-primary bg-glow-primary/10 px-2 py-1 rounded">Deep Male (Elder)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/70">Emotion Engine</span>
                    <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded">Hostile</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Generation Modes */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-white/50 font-bold">Generate Target</h3>
            <div className="grid grid-cols-1 gap-2">
              {[
                { name: "Main Story", icon: BookOpen },
                { name: "Side Quests", icon: Map },
                { name: "Plot Twists", icon: RefreshCw },
                { name: "Character Dialogues", icon: MessageSquare }
              ].map((mode) => (
                <button 
                  key={mode.name}
                  onClick={() => setGenerationMode(mode.name)}
                  className={`relative flex items-center gap-3 p-4 rounded-2xl font-bold transition-all duration-300 overflow-hidden group ${
                    generationMode === mode.name 
                      ? 'text-white scale-[1.02] shadow-[0_8px_32px_rgba(139,92,246,0.2)]' 
                      : 'text-white/70 hover:text-white hover:scale-[1.01]'
                  }`}
                >
                  {/* Glass Background */}
                  <div className={`absolute inset-0 backdrop-blur-xl border transition-all duration-300 ${
                    generationMode === mode.name
                      ? 'bg-glow-primary/20 border-glow-primary/40 border-t-glow-primary/60'
                      : 'bg-white/5 border-white/10 border-t-white/20 group-hover:bg-white/10 group-hover:border-white/20'
                  } rounded-2xl`} />
                  
                  {/* Subtle inner highlight */}
                  <div className="absolute inset-0 rounded-2xl opacity-50 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

                  {/* Content */}
                  <span className="relative z-10 flex items-center gap-3 drop-shadow-md w-full">
                    <mode.icon size={18} className={generationMode === mode.name ? "text-glow-primary" : "text-white/50 group-hover:text-white/80 transition-colors"} />
                    <span className="text-sm font-bold tracking-wide">{mode.name}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Genre / Tone Override */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-white/50 font-bold">Tone Override</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "Action", icon: Zap, color: "text-amber-400", bg: "bg-amber-400/20" },
                { name: "Horror", icon: Skull, color: "text-rose-500", bg: "bg-rose-500/20" },
                { name: "Mystery", icon: Sparkles, color: "text-purple-400", bg: "bg-purple-400/20" },
                { name: "Romance", icon: Heart, color: "text-pink-400", bg: "bg-pink-400/20" },
                { name: "Comedy", icon: Drama, color: "text-emerald-400", bg: "bg-emerald-400/20" },
              ].map((t) => (
                <button
                  key={t.name}
                  onClick={() => setGenre(t.name)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-bold transition-all ${
                    genre === t.name 
                      ? `${t.bg} border-${t.color.split('-')[1]}-500/50 text-white` 
                      : 'bg-white/5 border-transparent text-white/50 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <t.icon size={14} className={genre === t.name ? t.color : ""} />
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Force Generate Button */}
        <div className="p-6 border-t border-white/10 bg-black/40">
          <Button 
            className="w-full bg-gradient-to-r from-glow-primary to-glow-accent hover:from-glow-primary/90 hover:to-glow-accent/90 text-white border-none py-6 rounded-xl font-bold shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all hover:scale-[1.02]"
            onClick={handleChoice}
          >
            <Sparkles size={18} className="mr-2" /> Force Generate
          </Button>
        </div>
      </aside>

    </div>
  );
}

function VolumeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
    </svg>
  );
}
