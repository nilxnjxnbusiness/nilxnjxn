'use client';

import { useRef, useLayoutEffect } from 'react';
import { Track } from '@/lib/data';
import { useAudioStore } from '@/store/audioStore';
import { PlayIcon, PauseIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Magnetic } from '@/components/ui/Magnetic';
import { LazyImage } from '@/components/ui/LazyImage';
import Link from 'next/link';

interface TrackCardProps {
  track: Track;
  priority?: boolean;
}

export function TrackCard({ track, priority = false }: TrackCardProps) {
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = useAudioStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const isCurrent = currentTrack?.id === track.id;
  const isActive = isCurrent && isPlaying;

  useLayoutEffect(() => {
    if (!cardRef.current || !infoRef.current) return;

    const info = infoRef.current;

    const ctx = gsap.context(() => {
      // Subtle parallax for info within card
      const xTo = gsap.quickTo(info, 'x', { duration: 0.8, ease: 'power3.out' });
      const yTo = gsap.quickTo(info, 'y', { duration: 0.8, ease: 'power3.out' });

      const onMouseMove = (e: MouseEvent) => {
        const { left, top, width, height } = cardRef.current!.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const moveX = (e.clientX - centerX) * 0.1;
        const moveY = (e.clientY - centerY) * 0.1;
        xTo(moveX);
        yTo(moveY);
      };

      const onMouseLeave = () => {
        xTo(0);
        yTo(0);
      };

      cardRef.current?.addEventListener('mousemove', onMouseMove);
      cardRef.current?.addEventListener('mouseleave', onMouseLeave);

      return () => {
        cardRef.current?.removeEventListener('mousemove', onMouseMove);
        cardRef.current?.removeEventListener('mouseleave', onMouseLeave);
      };
    }, cardRef);

    return () => ctx.revert();
  }, []);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCurrent) {
      togglePlayPause();
    } else {
      playTrack(track);
    }
  };

  return (
    <Magnetic strength={0.1}>
      <Link href={`/music/${track.slug}`} className="group relative block py-4">
        <motion.div
          ref={cardRef}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className="track-card group play-trigger relative aspect-square w-[280px] overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl transition-all duration-700 hover:scale-[1.05] hover:border-white/30 hover:shadow-cyan-500/20 sm:w-[320px] md:w-[340px]"
        >
          {/* Performance Optimized Artwork */}
          <LazyImage
            src={track.coverUrl}
            alt={track.title}
            priority={priority}
            className="transition-transform duration-1000 group-hover:scale-110"
          />

          {/* Hover Overlay: Play State */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:opacity-100">
            <button
              onClick={handlePlayClick}
              className="hover:bg-accent flex h-20 w-20 scale-75 items-center justify-center rounded-full bg-white text-black shadow-2xl transition-all duration-500 group-hover:scale-100 active:scale-90"
            >
              <HugeiconsIcon
                icon={isActive ? PauseIcon : PlayIcon}
                size={32}
                color="currentColor"
              />
            </button>
          </div>

          {/* Seasonal Badge */}
          <div className="absolute top-6 right-6 z-20">
            <div
              className={cn(
                'rounded-full border border-white/10 px-4 py-1.5 text-[9px] font-bold tracking-[0.3em] uppercase shadow-2xl backdrop-blur-xl',
                track.season === 'FRESH' && 'bg-emerald-500/10 text-emerald-400',
                track.season === 'AKAD' && 'bg-orange-500/10 text-orange-400',
                track.season === 'LATE' && 'bg-cyan-500/10 text-cyan-400',
              )}
            >
              {track.season}
            </div>
          </div>

          {/* Content Overlay: Title / Artist */}
          <div
            ref={infoRef}
            className="pointer-events-none absolute right-8 bottom-8 left-8 z-20 space-y-1 transition-transform duration-700"
          >
            <h3 className="font-functional truncate text-lg font-bold tracking-tight text-white drop-shadow-md">
              {track.title}
            </h3>
            <p className="font-functional truncate text-[10px] font-medium tracking-[0.3em] text-white/40 uppercase">
              {track.artist}
            </p>
          </div>

          {/* Price Floating Tag */}
          <div className="absolute right-6 bottom-6 z-30 opacity-0 transition-all duration-500 group-hover:opacity-100">
            <div className="border-accent/20 bg-accent/10 rounded-full border px-4 py-2 backdrop-blur-xl shadow-[0_0_20px_rgba(34,211,238,0.15)]">
              <span className="text-accent text-[10px] font-bold tracking-[0.2em]">
                {track.price}
              </span>
            </div>
          </div>

          {/* 
            SPECULATIVE PRELOADING: 
            Mirroring the HeroPlayer pattern, this hidden tag triggers the browser 
            to pre-fetch the initial chunks of the song. When playback is triggered, 
            it hits the cache for near-instant start.
          */}
          <audio preload="auto" src={track.audioUrl} className="hidden" />
        </motion.div>
      </Link>
    </Magnetic>
  );
}
