'use client';

import { useRef, useLayoutEffect, useEffect } from 'react';
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
  const { currentTrack, setTrack, hasInteracted, setHasInteracted } = useAudioStore();
  const narrativeRef = useRef<HTMLDivElement>(null);

  // Use AKAD track for Hero, others for Latest Releases
  const featuredTrack = tracks.find((t) => t.title.toUpperCase() === 'AKAD') || tracks[0];
  const otherTracks = tracks;

  useEffect(() => {
    if (!currentTrack && featuredTrack) {
      setTrack(featuredTrack);
    }
  }, [featuredTrack, currentTrack, setTrack]);

  // Optimizing INP: Split the interaction into two phases
  // Phase 1: Immediate feedback (Play music + Hero reveal)
  // Phase 2: Deferred loading of the rest of the page
  const handleInteraction = () => {
    setHasInteracted(true);
    // Explicitly tell the browser to prioritize the audio/hero change
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
       // Future expansion if needed
    }
  };

  useLayoutEffect(() => {
    if (!hasInteracted || !narrativeRef.current) return;

    // Use a longer delay or requestAnimationFrame to stagger GSAP initialization
    // away from the initial heavy render frame
    const ctx = gsap.context(() => {
      gsap.from('.shade-title', {
        opacity: 0,
        y: 60,
        duration: 1.2,
        stagger: 0.2,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: narrativeRef.current,
          start: 'top 80%',
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

      {/* Scrollable Content - Optimized transition for INP */}
      <AnimatePresence>
        {hasInteracted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-0 will-change-opacity"
          >
            {/* SHADES Narrative Section */}
            <section ref={narrativeRef} className="relative overflow-hidden bg-black px-6 py-48">
              <div className="pointer-events-none absolute inset-0 z-0 opacity-20">
                <div className="bg-accent/10 absolute top-0 left-1/4 h-96 w-96 rounded-full blur-[120px]" />
                <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="relative z-10 mx-auto max-w-7xl space-y-24"
              >
                <div className="space-y-4">
                  <h3 className="shade-title text-accent font-functional text-[10px] font-bold tracking-[0.5em] uppercase">
                    The Concept
                  </h3>
                  <h2 className="shade-title font-expressive mt-12 text-5xl leading-tight tracking-normal text-white drop-shadow-2xl md:text-7xl">
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
                      The debut album &apos;SHADES&apos; is a seasonal mapping of the human psyche.
                      Released 2026, it serves as a digital monolith to the journey of Nila — from
                      the valleys of Assam to the global digital frontier.
                    </p>
                    <div className="pt-8">
                      <div className="h-px w-full bg-white/10" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Latest Releases - Infinite Marquee */}
            {otherTracks.length > 0 && (
              <section className="relative z-10 border-y border-white/5 bg-[#080808] py-32">
                <div className="space-y-16">
                  <div className="mx-auto max-w-7xl px-6">
                    <div className="flex items-end justify-between">
                      <div className="space-y-2">
                        <h2 className="font-expressive text-2xl tracking-normal text-white md:text-3xl">
                          Latest available shades
                        </h2>
                      </div>
                    </div>
                  </div>

                  {/* Marquee Container with Gradient Mask */}
                  <div className="w-full inline-flex flex-nowrap overflow-hidden mask-[linear-gradient(to_right,transparent_0,black_128px,black_calc(100%-128px),transparent_100%)]">
                    <ul className="flex animate-infinite-scroll items-center justify-center md:justify-start [&_li]:mx-4">
                      {otherTracks.map((track) => (
                        <li key={track.id} className="flex-none">
                          <TrackCard track={track} />
                        </li>
                      ))}
                    </ul>
                    {/* Duplicate List for Seamless Loop */}
                    <ul
                      className="flex animate-infinite-scroll items-center justify-center md:justify-start [&_li]:mx-4"
                      aria-hidden="true"
                    >
                      {otherTracks.map((track) => (
                        <li key={`${track.id}-copy`} className="flex-none">
                          <TrackCard track={track} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            )}

            {/* Profile Section */}
            <section className="bg-background relative z-10 px-6 py-48">
              <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-24 md:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="group relative aspect-4/5 overflow-hidden rounded-[40px] border border-white/10 shadow-2xl"
                >
                  <Image
                    src="/extra/250519DSC_0023.webp"
                    alt="Artist Profile"
                    fill
                    className="h-full w-full object-cover grayscale-0 md:grayscale transition-all duration-1000 group-hover:scale-110 group-hover:grayscale-0"
                  />
                  <div className="bg-accent/20 absolute inset-0 mix-blend-overlay transition-opacity group-hover:opacity-0" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="space-y-12"
                >
                  <div className="space-y-4">
                    <span className="text-accent text-[10px] font-bold tracking-[0.5em] uppercase">
                      Identity
                    </span>
                    <h2 className="font-expressive text-3xl tracking-normal text-white md:text-5xl">
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
                </motion.div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
