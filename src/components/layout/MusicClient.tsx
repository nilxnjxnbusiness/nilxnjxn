'use client';

import { useState, useRef, useLayoutEffect, useMemo } from 'react';
import { Track } from '@/lib/data';
import { TrackCard } from '@/components/player/TrackCard';
import { Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';
import { Magnetic } from '@/components/ui/Magnetic';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

interface MusicClientProps {
  tracks: Track[];
}

type MoodFilter = 'ALL' | 'FRESH' | 'AKAD' | 'LATE';

export function MusicClient({ tracks }: MusicClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<MoodFilter>('ALL');
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredTracks = useMemo(() => {
    return tracks.filter((track) => {
      const matchesSearch =
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMood = filter === 'ALL' ? true : track.season === filter;
      return matchesSearch && matchesMood;
    });
  }, [tracks, searchQuery, filter]);

  useLayoutEffect(() => {
    if (!gridRef.current) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('.track-item');
      if (items.length === 0) return;

      gsap.from(items, {
        opacity: 0,
        y: 40,
        scale: 0.95,
        duration: 0.8,
        stagger: 0.05,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 85%',
          once: true,
        },
      });
    }, gridRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [filteredTracks.length]);

  return (
    <main className="bg-background selection:bg-accent min-h-screen px-6 pt-32 pb-32 selection:text-black">
      <div className="mx-auto max-w-7xl space-y-16">
        {/* Header Section */}
        <div className="flex flex-col gap-12 pt-8">
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-expressive text-6xl tracking-tighter text-white md:text-8xl lg:text-9xl"
            >
              The Archive
            </motion.h1>
            <p className="font-functional text-[10px] font-light tracking-[0.4em] text-white/30 uppercase md:text-xs">
              Exploration of Human Behavior through Sound
            </p>
          </div>

          {/* Filters & Search - Fully Responsive */}
          <div className="flex flex-col justify-between gap-8 md:gap-12 lg:flex-row lg:items-center">
            <div className="scrollbar-hide -mx-6 w-full overflow-x-auto px-6 pb-4 lg:mx-0 lg:w-auto lg:px-0 lg:pb-0">
              <div className="flex min-w-max items-center gap-3">
                {(['ALL', 'FRESH', 'AKAD', 'LATE'] as const).map((mood) => (
                  <Magnetic key={mood} strength={0.2}>
                    <button
                      onClick={() => setFilter(mood)}
                      className={cn(
                        'font-functional rounded-full border px-10 py-4 text-[10px] font-bold tracking-[0.3em] uppercase transition-all duration-500',
                        filter === mood
                          ? 'scale-105 border-white bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.2)]'
                          : 'border-white/10 bg-white/5 text-white/40 hover:border-white/40 hover:bg-white/10 hover:text-white hover:shadow-[0_0_20px_rgba(34,211,238,0.1)] active:scale-95',
                      )}
                    >
                      {mood}
                    </button>
                  </Magnetic>
                ))}
              </div>
            </div>

            <div className="group relative w-full lg:max-w-md">
              <div className="group-focus-within:text-accent absolute top-1/2 left-6 -translate-y-1/2 text-white/20 transition-colors">
                <HugeiconsIcon icon={Search01Icon} size={18} />
              </div>
              <input
                type="text"
                placeholder="SEARCH FREQUENCY..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="font-functional focus:border-accent/40 h-18 w-full rounded-full border border-white/10 bg-white/5 pr-8 pl-16 text-[11px] tracking-[0.3em] text-white uppercase transition-all placeholder:text-white/10 focus:bg-white/10 focus:shadow-[0_0_40px_rgba(34,211,238,0.05)] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Grid */}
        <div
          ref={gridRef}
          className="grid min-h-[400px] grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filteredTracks.length > 0 ? (
            filteredTracks.map((track, i) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="track-item flex w-full justify-center"
              >
                <TrackCard track={track} priority={i < 4} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center">
              <h3 className="font-expressive text-8xl text-white/10 select-none md:text-9xl">
                Void...
              </h3>
              <p className="text-accent font-functional mt-8 text-[10px] tracking-[0.5em] uppercase">
                Frequency vanished into the shadows
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Global Grain Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.04] mix-blend-overlay">
        <Image src="/noise.png" alt="" fill className="h-full w-full object-cover" />
      </div>
    </main>
  );
}
