'use client';

import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayIcon, PauseIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Track } from '@/lib/data';
import { useAudioStore } from '@/store/audioStore';
import { Magnetic } from '@/components/ui/Magnetic';

gsap.registerPlugin(ScrollTrigger);

import Image from 'next/image';

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
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // CTA Reveal
      if (hasInteracted) {
        gsap.from('.cta-reveal', {
          y: 40,
          opacity: 0,
          scale: 0.8,
          duration: 1.2,
          ease: 'expo.out',
          delay: 0.5,
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
    <section
      ref={containerRef}
      className="relative flex h-screen flex-col items-center justify-center overflow-hidden"
    >
      {/* 
        PRELOADING TRICK: 
        This hidden audio tag forces the browser to pre-fetch the initial HTTP byte-range chunks 
        of the song (usually 5-10s) into memory while the user is reading the landing page. 
        When Wavesurfer (MediaElement backend) asks for the same URL on play, it hits the cache = Instant Play.
      */}
      <audio preload="auto" src={track.audioUrl} className="hidden" />
      
      {/* Background Visuals - Optimized for LCP */}
      <div
        ref={bgRef}
        className="absolute inset-[-10%] z-0 h-[120%] w-[120%] opacity-60"
      >
        <Image
          src="/extra/250519DSC_0025.webp"
          alt="Featured Track Background"
          fill
          priority
          className="object-cover object-center"
          sizes="120vw"
          quality={85}
        />
      </div>
      <div className="from-background to-background/90 absolute inset-0 z-10 bg-linear-to-b via-transparent" />

      {/* Centered Play Core */}
      <div className="relative z-20 flex flex-col items-center justify-center gap-12 pb-24 md:pb-32">
        <AnimatePresence mode="wait">
          {!hasInteracted ? (
            <motion.div
              key="initial-cta"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="space-y-4 text-center"
            >
              <h2 className="font-functional text-[10px] font-bold tracking-[0.6em] text-white/60 uppercase">
                Enter the shades
              </h2>
            </motion.div>
          ) : (
            <motion.div
              key="identity-reveal"
              className="space-y-4 px-4 text-center translate-y-8 md:translate-y-12"
            >
              <h1 className="font-expressive text-4xl leading-tight tracking-normal text-white mix-blend-difference drop-shadow-2xl sm:text-5xl md:text-[6rem] lg:text-[8rem]">
                {'NILXNJXN'.split('').map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.2 + i * 0.08,
                      ease: [0.215, 0.61, 0.355, 1],
                    }}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          animate={
            !hasInteracted
              ? {
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 0 0px rgba(255,255,255,0)',
                    '0 0 40px rgba(34,211,238,0.1)',
                    '0 0 0px rgba(255,255,255,0)',
                  ],
                }
              : {}
          }
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="relative"
        >
          <Magnetic strength={0.4}>
            <button
              onClick={handlePlay}
              className="group relative z-30 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-white text-black shadow-2xl transition-all hover:scale-105 sm:h-32 sm:w-32 md:h-48 md:w-48"
              aria-label={isPlaying && isCurrentTrack ? 'Pause Track' : 'Play Track'}
            >
              {/* Internal Glow Effect */}
              <div className="bg-accent/10 absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" />

              <AnimatePresence mode="wait">
                {isPlaying && isCurrentTrack ? (
                  <motion.div
                    key="pause"
                    initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                  >
                    <HugeiconsIcon
                      icon={PauseIcon}
                      className="h-10 w-10 md:h-14 md:w-14"
                      color="currentColor"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="play"
                    initial={{ opacity: 0, scale: 0.5, rotate: 45 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: -45 }}
                  >
                    <HugeiconsIcon
                      icon={PlayIcon}
                      className="ml-2 h-10 w-10 md:ml-3 md:h-14 md:w-14"
                      color="currentColor"
                    />
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
            className="flex w-full flex-col items-center gap-6 px-6 pt-4 md:max-w-none"
          >
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
            className="absolute right-6 bottom-12 left-6 flex flex-col items-center gap-4 md:left-12 md:flex-row md:items-center md:gap-8"
          >
            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              <span className="text-accent text-[9px] font-bold tracking-[0.4em] uppercase md:text-[10px]">
                Now Playing
              </span>
              <span className="font-expressive mt-1 text-2xl tracking-wide text-white md:text-3xl">
                {track.title}
              </span>
            </div>
            <div className="hidden h-px w-16 bg-white/10 md:block" />
            <span className="font-functional text-[9px] tracking-[0.3em] text-white/40 uppercase md:text-[10px]">
              Lossless Shades
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
