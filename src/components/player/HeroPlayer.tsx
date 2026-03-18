"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Track } from "@/lib/data";
import { useAudioStore } from "@/store/audioStore";
import { PlayIcon, PauseIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";

interface HeroPlayerProps {
  track: Track;
  onPlay?: () => void;
  hasInteracted: boolean;
}

export function HeroPlayer({ track, onPlay, hasInteracted }: HeroPlayerProps) {
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = useAudioStore();

  const isCurrentTrack = currentTrack?.id === track.id;

  const handlePlay = () => {
    if (isCurrentTrack) {
      togglePlayPause();
    } else {
      playTrack(track);
    }
    if (onPlay) onPlay();
  };

  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Visuals */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.4 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[10s] ease-linear group-hover:scale-110"
        style={{ backgroundImage: `url('/extra/250519DSC_0025.webp')` }}
      />
      
      {/* Centered Play Core */}
      <div className="relative z-20 flex flex-col items-center justify-center gap-12">
        <AnimatePresence mode="wait">
          {!hasInteracted ? (
            <motion.div
              key="initial-cta"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center space-y-4"
            >
              <h2 className="text-white/60 text-sm tracking-[0.3em] uppercase font-functional">
                Experience nilxnjxn
              </h2>
            </motion.div>
          ) : (
            <motion.div
              key="identity-reveal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="space-y-4"
            >
              <h1 className="text-6xl md:text-9xl font-expressive text-white tracking-tighter mix-blend-difference drop-shadow-2xl">
                NILXNJXN
              </h1>
              <div className="overflow-hidden">
                 <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-white/60 font-functional text-xs uppercase tracking-[0.4em] font-light"
                >
                  {track.title}
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          animate={!hasInteracted ? {
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 0 0px rgba(34,211,238,0)",
              "0 0 40px rgba(34,211,238,0.2)",
              "0 0 0px rgba(34,211,238,0)"
            ]
          } : {}}
          transition={{ repeat: Infinity, duration: 3 }}
          className="relative"
        >
          <button
            onClick={handlePlay}
            className="w-32 h-32 md:w-40 md:h-40 bg-white/5 backdrop-blur-xl border border-white/20 text-white rounded-full hover:bg-white/10 transition-all flex items-center justify-center group shadow-2xl relative z-30"
            aria-label={isPlaying && isCurrentTrack ? "Pause Track" : "Play Track"}
          >
            <AnimatePresence mode="wait">
              {isPlaying && isCurrentTrack ? (
                <motion.div
                  key="pause"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <HugeiconsIcon icon={PauseIcon} size={48} color="currentColor" />
                </motion.div>
              ) : (
                <motion.div
                  key="play"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <HugeiconsIcon icon={PlayIcon} size={48} color="currentColor" className="ml-2" />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Pulsing rings for initial state */}
            {!hasInteracted && (
              <div className="absolute inset-0 rounded-full animate-ping bg-accent/20 -z-10" />
            )}
          </button>
        </motion.div>

        {hasInteracted && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="pt-4"
          >
             <Button 
              variant="outline"
              size="lg" 
              className="rounded-full border-white/20 bg-transparent text-white hover:bg-white hover:text-black font-functional px-8 py-6 text-base tracking-widest uppercase transition-all"
            >
              Get Access — {track.price}
            </Button>
          </motion.div>
        )}
      </div>

      {/* Hero Bottom Info - Reveal on interaction */}
      <AnimatePresence>
        {hasInteracted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-12 left-6 md:left-12 flex items-center gap-6"
          >
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase tracking-[0.3em]">Now Playing</span>
              <span className="text-white font-functional text-sm">{track.title}</span>
            </div>
            <div className="h-0.5 w-12 bg-accent/30" />
            <span className="text-accent text-[10px] tracking-widest uppercase">Lossless Audio</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

