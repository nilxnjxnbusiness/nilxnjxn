'use client';

import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { Track } from '@/lib/data';
import { useAudioStore } from '@/store/audioStore';
import { HeroPlayer } from '@/components/player/HeroPlayer';
import { TrackCard } from '@/components/player/TrackCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Magnetic } from '@/components/ui/Magnetic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

interface HomeClientProps {
  tracks: Track[];
}

export function HomeClient({ tracks }: HomeClientProps) {
  const { currentTrack, setTrack } = useAudioStore();
  const [hasInteracted, setHasInteracted] = useState(false);
  const narrativeRef = useRef<HTMLDivElement>(null);

  // Use AKAD track for Hero, others for Latest Releases
  const featuredTrack = tracks.find((t) => t.title.toUpperCase() === 'AKAD') || tracks[0];
  const otherTracks = featuredTrack ? tracks.filter((t) => t.id !== featuredTrack.id) : tracks;

  useEffect(() => {
    if (!currentTrack && featuredTrack) {
      setTrack(featuredTrack);
    }
  }, [featuredTrack, currentTrack, setTrack]);

  const handleInteraction = () => {
    setHasInteracted(true);
  };

  useLayoutEffect(() => {
    if (!hasInteracted || !narrativeRef.current) return;

    const ctx = gsap.context(() => {
      // Cinematic text reveal
      gsap.from('.shade-title', {
        opacity: 0,
        y: 100,
        duration: 1.5,
        stagger: 0.3,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: narrativeRef.current,
          start: 'top 70%',
        },
      });
    }, narrativeRef);

    return () => ctx.revert();
  }, [hasInteracted]);

  return (
    <main className="selection:bg-accent bg-background relative min-h-screen selection:text-black">
      {/* Hero Section */}
      {featuredTrack && (
        <HeroPlayer
          track={featuredTrack}
          onPlay={handleInteraction}
          hasInteracted={hasInteracted}
        />
      )}

      {/* Scrollable Content - Reveal on interaction */}
      <AnimatePresence>
        {hasInteracted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="space-y-0"
          >
            {/* SHADES Narrative Section - High Impact */}
            <section ref={narrativeRef} className="relative overflow-hidden bg-black px-6 py-48">
              <div className="pointer-events-none absolute inset-0 z-0 opacity-20">
                <div className="bg-accent/10 absolute top-0 left-1/4 h-96 w-96 rounded-full blur-[120px]" />
                <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />
              </div>

              <div className="relative z-10 mx-auto max-w-7xl space-y-24">
                <div className="space-y-4">
                  <h3 className="shade-title text-accent font-functional text-[10px] font-bold tracking-[0.5em] uppercase">
                    The Concept
                  </h3>
                  <h2 className="shade-title font-expressive text-6xl leading-tight tracking-tighter text-white drop-shadow-2xl md:text-9xl">
                    SHADES <br /> OF BEING.
                  </h2>
                </div>

                <div className="grid grid-cols-1 items-end gap-16 md:gap-32 lg:grid-cols-2">
                  <p className="shade-title font-functional max-w-xl text-xl leading-relaxed font-light text-white/50 italic md:text-2xl">
                    &quot;We exist in frequencies. Some are FRESH, full of morning light. Some are
                    AKAD, sharp like the dust of the North-East. Some are LATE, lingering in the
                    blue of the night.&quot;
                  </p>
                  <div className="shade-title space-y-8">
                    <div className="h-px w-full bg-white/10" />
                    <p className="text-muted-foreground font-functional text-sm leading-8">
                      The debut EP &apos;SHADES&apos; is a seasonal mapping of the human psyche.
                      Dropping 2026, it serves as a digital monolith to the journey of Nila — from
                      the valleys of Assam to the global digital frontier.
                    </p>
                    <Magnetic strength={0.2}>
                      <Link
                        href="/music"
                        className="hover:bg-accent inline-flex h-16 items-center rounded-full bg-white px-12 text-[10px] font-bold tracking-[0.3em] text-black uppercase shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all"
                      >
                        Explore the Archive
                      </Link>
                    </Magnetic>
                  </div>
                </div>
              </div>
            </section>

            {/* Latest Releases - Horizontal Scroll */}
            {otherTracks.length > 0 && (
              <section className="relative z-10 border-y border-white/5 bg-[#080808] px-6 py-32">
                <div className="mx-auto max-w-7xl space-y-16">
                  <div className="flex items-end justify-between">
                    <div className="space-y-2">
                      <h2 className="font-expressive text-4xl tracking-tighter text-white md:text-5xl">
                        New Frequencies
                      </h2>
                      <p className="text-muted-foreground font-functional text-[10px] tracking-[0.4em] uppercase">
                        Latest available shades
                      </p>
                    </div>
                    <Link
                      href="/music"
                      className="text-accent border-accent/20 hidden border-b pb-1 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors hover:text-white md:block"
                    >
                      View All
                    </Link>
                  </div>

                  <div className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-12 overflow-x-auto px-6 pb-12">
                    {otherTracks.map((track, index) => (
                      <div key={track.id} className="snap-center">
                        <TrackCard track={track} priority={index < 2} />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Profile Section */}
            <section className="bg-background relative z-10 px-6 py-48">
              <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-24 md:grid-cols-2">
                <div className="group relative aspect-4/5 overflow-hidden rounded-[40px] border border-white/10 shadow-2xl">
                  <Image
                    src="/extra/250519DSC_0023.webp"
                    alt="Artist Profile"
                    fill
                    className="h-full w-full object-cover grayscale transition-all duration-1000 group-hover:scale-110 group-hover:grayscale-0"
                  />
                  <div className="bg-accent/20 absolute inset-0 mix-blend-overlay transition-opacity group-hover:opacity-0" />
                </div>
                <div className="space-y-12">
                  <div className="space-y-4">
                    <span className="text-accent text-[10px] font-bold tracking-[0.5em] uppercase">
                      Identity
                    </span>
                    <h2 className="font-expressive text-6xl tracking-tighter text-white md:text-7xl">
                      Behind the <br /> Shadow
                    </h2>
                  </div>
                  <p className="font-functional text-xl leading-relaxed font-light text-white/40 italic">
                    &quot;I intend to deliver a new wave to the existing rap scene. It&apos;s not
                    just about bars, it&apos;s about the shades we all wear.&quot;
                  </p>
                  <Magnetic strength={0.3}>
                    <Link
                      href="/about"
                      className="font-functional inline-flex h-14 items-center rounded-full border border-white/20 px-10 text-[10px] font-bold tracking-[0.3em] text-white uppercase transition-all hover:bg-white hover:text-black"
                    >
                      Full Disclosure →
                    </Link>
                  </Magnetic>
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Grain Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.04] mix-blend-overlay">
        <Image src="/noise.png" alt="" fill className="h-full w-full object-cover" />
      </div>
    </main>
  );
}
