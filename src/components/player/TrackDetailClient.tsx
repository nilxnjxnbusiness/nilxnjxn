"use client";

import { useRef, useLayoutEffect } from "react";
import { Track } from "@/lib/data";
import { useAudioStore } from "@/store/audioStore";
import { motion, AnimatePresence } from "framer-motion";
import { PlayIcon, PauseIcon, ArrowLeftIcon, ShoppingCart01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Magnetic } from "@/components/ui/Magnetic";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

interface TrackDetailClientProps {
  track: Track;
}

export function TrackDetailClient({ track }: TrackDetailClientProps) {
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = useAudioStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const isCurrent = currentTrack?.id === track.id;
  const isActive = isCurrent && isPlaying;

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".reveal", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "expo.out",
      });

      gsap.from(".image-reveal", {
        scale: 1.2,
        opacity: 0,
        duration: 2,
        ease: "power4.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handlePlay = () => {
    if (isCurrent) {
      togglePlayPause();
    } else {
      playTrack(track);
    }
  };

  return (
    <main ref={containerRef} className="min-h-screen bg-background pt-24 md:pt-32 pb-24 px-6 overflow-hidden">
      {/* Background Mood Glow */}
      <div className={cn(
        "fixed inset-0 pointer-events-none z-0 blur-[100px] md:blur-[150px] opacity-10 md:opacity-20",
        track.season === "FRESH" && "bg-emerald-500",
        track.season === "AKAD" && "bg-orange-500",
        track.season === "LATE" && "bg-cyan-500"
      )} />

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
        {/* Left: Visuals */}
        <div className="space-y-8 md:space-y-12">
           <Magnetic strength={0.1}>
            <Link 
              href="/music"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors group"
            >
              <HugeiconsIcon 
                icon={ArrowLeftIcon} 
                size={16} 
                className="group-hover:-translate-x-1 transition-transform" 
              />
              <span className="text-[10px] uppercase tracking-[0.3em] font-functional mt-1">Archive</span>
            </Link>
          </Magnetic>

          <div 
            ref={imageRef}
            className="image-reveal aspect-square w-full max-w-[320px] sm:max-w-md mx-auto lg:mx-0 rounded-[32px] md:rounded-[40px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/10 group relative"
          >
            <img 
              src={track.coverUrl} 
              alt={track.title} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 md:group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                <button 
                  onClick={handlePlay}
                  className="w-20 h-20 md:w-24 md:h-24 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl"
                >
                   <HugeiconsIcon icon={isActive ? PauseIcon : PlayIcon} size={28} className="text-current md:size-8" />
                </button>
            </div>
          </div>
        </div>

        {/* Right: Narrative & Content */}
        <div className="space-y-8 md:space-y-12 text-center lg:text-left">
          <div className="space-y-6">
            <div className="reveal inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-accent font-bold">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              Shade: {track.season}
            </div>
            
            <motion.h1 
              className="reveal text-6xl md:text-8xl lg:text-9xl font-expressive text-white tracking-tighter leading-tight"
            >
              {track.title}
            </motion.h1>

            <div className="reveal space-y-2">
               <p className="text-xl md:text-2xl font-functional text-white/40 italic uppercase tracking-widest">
                {track.artist}
              </p>
            </div>
          </div>

          <div className="reveal space-y-8 max-w-lg mx-auto lg:mx-0">
            <p className="text-base md:text-lg text-white/60 font-functional leading-relaxed">
              Explore the spectrum of emotion embedded in this frequency. "{track.title}" is a direct-to-audience release, capturing the raw essence of the {track.season} season.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 md:gap-6 pt-4">
               <Magnetic strength={0.2}>
                  <Button 
                    onClick={handlePlay}
                    size="lg"
                    className="w-full sm:w-auto h-14 md:h-16 px-10 rounded-full bg-white text-black hover:bg-accent hover:text-black transition-all flex items-center justify-center gap-3 font-functional font-bold text-xs md:text-sm tracking-widest uppercase"
                  >
                    <HugeiconsIcon icon={isActive ? PauseIcon : PlayIcon} size={18} className="text-current" />
                    {isActive ? "Pause" : "Play Preview"}
                  </Button>
               </Magnetic>

               <Magnetic strength={0.3}>
                  <Button 
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto h-14 md:h-16 px-10 rounded-full border-white/20 bg-transparent text-white hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 font-functional font-bold text-xs md:text-sm tracking-widest uppercase shadow-[0_0_40px_rgba(255,255,255,0.05)]"
                  >
                    <HugeiconsIcon icon={ShoppingCart01Icon} size={18} className="text-current" />
                    Unlock {track.price}
                  </Button>
               </Magnetic>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="reveal grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 pt-8 md:pt-12 border-t border-white/5 mx-auto lg:mx-0 max-w-lg lg:max-w-none">
            <div className="space-y-1">
              <span className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-widest">Format</span>
              <p className="text-white text-[10px] md:text-xs font-functional tracking-wider">24-bit WAV</p>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-widest">Released</span>
              <p className="text-white text-[10px] md:text-xs font-functional tracking-wider">March 2026</p>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-widest">License</span>
              <p className="text-white text-[10px] md:text-xs font-functional tracking-wider">Personal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Global Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.04] mix-blend-overlay">
        <img src="/noise.png" alt="" className="w-full h-full object-cover" />
      </div>
    </main>
  );
}
