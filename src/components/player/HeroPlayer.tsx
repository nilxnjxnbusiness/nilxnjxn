import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { PlayIcon, PauseIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Track } from "@/lib/data";
import { useAudioStore } from "@/store/audioStore";
import { Magnetic } from "@/components/ui/Magnetic";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

interface HeroPlayerProps {
  track: Track;
  onPlay?: () => void;
  hasInteracted: boolean;
}

export function HeroPlayer({ track, onPlay, hasInteracted }: HeroPlayerProps) {
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = useAudioStore();
  const bgRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isCurrentTrack = currentTrack?.id === track.id;

  useLayoutEffect(() => {
    if (!bgRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax
      gsap.to(bgRef.current, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // CTA Reveal
      if (hasInteracted) {
        gsap.from(".cta-reveal", {
          y: 40,
          opacity: 0,
          scale: 0.8,
          duration: 1.2,
          ease: "expo.out",
          delay: 0.5
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [hasInteracted]);

  const handlePlay = () => {
    if (isCurrentTrack) {
      togglePlayPause();
    } else {
      playTrack(track);
    }
    if (onPlay) onPlay();
  };

  return (
    <section ref={containerRef} className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Visuals */}
      <div 
        ref={bgRef}
        className="absolute inset-[ -10% ] z-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url('/extra/250519DSC_0025.webp')`, height: '120%' }}
      />
      <div className="absolute inset-0 z-1 bg-linear-to-b from-background via-transparent to-background" />
      
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
              className="space-y-4 text-center"
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
              "0 0 0px rgba(255,255,255,0)",
              "0 0 40px rgba(255,255,255,0.2)",
              "0 0 0px rgba(255,255,255,0)"
            ]
          } : {}}
          transition={{ repeat: Infinity, duration: 3 }}
          className="relative"
        >
          <Magnetic strength={0.3}>
            <button
              onClick={handlePlay}
              className="w-32 h-32 md:w-40 md:h-40 bg-white text-black rounded-full hover:scale-105 transition-all flex items-center justify-center group shadow-2xl relative z-30"
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
            </button>
          </Magnetic>
        </motion.div>

        {hasInteracted && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="pt-4"
          >
             <Magnetic strength={0.2}>
               <Button 
                variant="outline"
                size="lg" 
                className="cta-reveal rounded-full border-white/20 bg-transparent text-white hover:bg-white hover:text-black font-functional px-8 py-6 text-base tracking-widest uppercase transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              >
                Get Access — {track.price}
              </Button>
             </Magnetic>
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
