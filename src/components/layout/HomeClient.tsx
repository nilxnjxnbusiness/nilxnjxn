"use client";

import { useState } from "react";
import { Track } from "@/lib/data";
import { HeroPlayer } from "@/components/player/HeroPlayer";
import { TrackCard } from "@/components/player/TrackCard";
import { motion, AnimatePresence } from "framer-motion";

interface HomeClientProps {
  tracks: Track[];
}

export function HomeClient({ tracks }: HomeClientProps) {
  const [hasInteracted, setHasInteracted] = useState(false);

  // Use first track for Hero, others for Latest Releases
  const featuredTrack = tracks[0];
  const otherTracks = tracks.slice(1);

  const handleInteraction = () => {
    setHasInteracted(true);
  };

  return (
    <main className="min-h-screen relative selection:bg-accent selection:text-black bg-background">

      {/* Hero Section */}
      {featuredTrack && <HeroPlayer track={featuredTrack} onPlay={handleInteraction} hasInteracted={hasInteracted} />}
      
      {/* Scrollable Content - Reveal on interaction */}
      <AnimatePresence>
        {hasInteracted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
          >
            {/* Latest Releases - Horizontal Scroll */}
            {otherTracks.length > 0 && (
              <motion.section 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="py-24 px-6 relative z-10 bg-background/90 backdrop-blur-md"
              >
                <div className="max-w-7xl mx-auto space-y-8">
                  <h2 className="text-3xl font-expressive text-white mb-8 tracking-wider">Latest Releases</h2>
                  
                  <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar">
                    {otherTracks.map((track) => (
                      <TrackCard key={track.id} track={track} />
                    ))}
                  </div>
                </div>
              </motion.section>
            )}

            {/* About Section preview with public image */}
            <motion.section 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="py-32 px-6 relative z-10 bg-[#060606]"
            >
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="relative aspect-4/5 rounded-[24px] overflow-hidden group">
                   <img 
                    src="/extra/250519DSC_0023.webp" 
                    alt="Artist Profile" 
                    className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" 
                   />
                   <div className="absolute inset-0 bg-accent/10 mix-blend-overlay group-hover:opacity-0 transition-opacity" />
                </div>
                <div className="space-y-6">
                  <h2 className="text-4xl md:text-5xl font-expressive tracking-tighter text-white">Behind the Sound</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed font-functional font-light">
                    Nilxnjxn aka Nila, is an upcoming Hip-hop Artist from Assam, India. 
                    Exploring the range of human emotion through the seasonal evolution 
                    of sound. Debut EP "SHADES" dropping 2026.
                  </p>
                  <a href="/about" className="inline-block mt-4 text-accent hover:text-white transition-colors border-b border-accent/30 pb-1 font-functional text-sm tracking-widest uppercase">
                    Read full story →
                  </a>
                </div>
              </div>
            </motion.section>

          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
