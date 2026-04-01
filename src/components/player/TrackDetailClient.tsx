'use client';

import { useRef, useLayoutEffect } from 'react';
import { Track } from '@/lib/data';
import { useAudioStore } from '@/store/audioStore';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayIcon, PauseIcon, ArrowLeftIcon, ShoppingCart01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Magnetic } from '@/components/ui/Magnetic';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface TrackDetailClientProps {
  track: Track;
}

import { ComingSoonWall } from '@/components/ui/ComingSoonWall';
import { useState } from 'react';

export function TrackDetailClient({ track }: TrackDetailClientProps) {
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = useAudioStore();
  const [showComingSoon, setShowComingSoon] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const isCurrent = currentTrack?.id === track.id;
  const isActive = isCurrent && isPlaying;

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.reveal', {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: 'expo.out',
      });

      gsap.from('.image-reveal', {
        scale: 1.2,
        opacity: 0,
        duration: 2,
        ease: 'power4.out',
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
    <main
      ref={containerRef}
      className="bg-background min-h-screen overflow-hidden px-6 pt-24 pb-24 md:pt-32"
    >
      {/* Background Mood Glow */}
      <div
        className={cn(
          'pointer-events-none fixed inset-0 z-0 opacity-10 blur-[100px] md:opacity-20 md:blur-[150px]',
          track.season === 'FRESH' && 'bg-emerald-500',
          track.season === 'AKAD' && 'bg-orange-500',
          track.season === 'LATE' && 'bg-cyan-500',
        )}
      />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-32">
        {/* Left: Visuals */}
        <div className="space-y-8 md:space-y-12">
          <Magnetic strength={0.1}>
            <Link
              href="/music"
              className="text-muted-foreground group inline-flex items-center gap-2 transition-colors hover:text-white"
            >
              <HugeiconsIcon
                icon={ArrowLeftIcon}
                size={16}
                className="transition-transform group-hover:-translate-x-1"
              />
              <span className="font-functional mt-1 text-[10px] tracking-[0.3em] uppercase">
                Archive
              </span>
            </Link>
          </Magnetic>

          <div
            ref={imageRef}
            className="image-reveal group relative mx-auto aspect-square w-full max-w-[320px] overflow-hidden rounded-[32px] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] sm:max-w-md md:rounded-[40px] lg:mx-0"
          >
            <Image
              src={track.coverUrl}
              alt={track.title}
              fill
              className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105 md:group-hover:scale-110"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:opacity-100">
              <button
                onClick={handlePlay}
                className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-white text-black shadow-2xl transition-all hover:scale-110 active:scale-95 md:h-24 md:w-24"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isActive ? 'pause' : 'play'}
                    initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                    transition={{ duration: 0.3, ease: 'backOut' }}
                    className="flex items-center justify-center"
                  >
                    <HugeiconsIcon
                      icon={isActive ? PauseIcon : PlayIcon}
                      size={28}
                      className="text-current md:size-8"
                    />
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Narrative & Content */}
        <div className="space-y-8 text-center md:space-y-12 lg:text-left">
          <div className="space-y-6">
            <div className="reveal text-accent inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[9px] font-bold tracking-[0.3em] uppercase md:text-[10px]">
              <span className="bg-accent h-1.5 w-1.5 animate-pulse rounded-full" />
              Shade: {track.season}
            </div>

            <motion.h1 className="reveal font-expressive text-6xl leading-tight tracking-normal text-white md:text-8xl lg:text-9xl">
              {track.title}
            </motion.h1>

            <div className="reveal space-y-2">
              <p className="font-functional text-xl tracking-widest text-white/40 uppercase italic md:text-2xl">
                {track.artist}
              </p>
            </div>
          </div>

          <div className="reveal mx-auto max-w-lg space-y-8 lg:mx-0">
            <p className="font-functional text-base leading-relaxed text-white/60 md:text-lg">
              Explore the spectrum of emotion embedded in this frequency. &quot;{track.title}&quot;
              is a direct-to-audience release, capturing the raw essence of the {track.season}{' '}
              season.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row md:gap-6 lg:justify-start">
              <Magnetic strength={0.2}>
                <Button
                  onClick={handlePlay}
                  size="lg"
                  className="hover:bg-accent font-functional flex h-14 w-full items-center justify-center gap-3 rounded-full bg-white px-10 text-xs font-bold tracking-widest text-black uppercase transition-all hover:text-black sm:w-auto md:h-16 md:text-sm"
                >
                  <HugeiconsIcon
                    icon={isActive ? PauseIcon : PlayIcon}
                    size={18}
                    className="text-current"
                  />
                  {isActive ? 'Pause' : 'Preview'}
                </Button>
              </Magnetic>

              <Magnetic strength={0.3}>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowComingSoon(true)}
                  className="font-functional flex h-14 w-full items-center justify-center gap-3 rounded-full border-white/20 bg-transparent px-10 text-xs font-bold tracking-widest text-white uppercase shadow-[0_0_40px_rgba(255,255,255,0.05)] transition-all hover:bg-white hover:text-black sm:w-auto md:h-16 md:text-sm"
                >
                  <HugeiconsIcon icon={ShoppingCart01Icon} size={18} className="text-current" />
                  Get {track.season} — {track.price}
                </Button>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>

      {/* Global Grain Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.04] mix-blend-overlay">
        <Image src="/noise.png" alt="" fill className="h-full w-full object-cover" />
      </div>

      <AnimatePresence>
        {showComingSoon && (
          <ComingSoonWall 
            onClose={() => setShowComingSoon(false)} 
            title={track.title}
            season={track.season}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
