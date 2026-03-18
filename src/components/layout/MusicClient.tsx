"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { Track } from "@/lib/data";
import { TrackCard } from "@/components/player/TrackCard";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface MusicClientProps {
  tracks: Track[];
}

export function MusicClient({ tracks }: MusicClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredTracks = tracks.filter(track => 
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useLayoutEffect(() => {
    if (!gridRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".track-item", {
        opacity: 0,
        y: 40,
        scale: 0.95,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
        },
      });
    }, gridRef);

    return () => ctx.revert();
  }, [filteredTracks.length]);

  return (
    <main className="min-h-screen bg-background pb-32 pt-32 px-6 selection:bg-accent selection:text-black">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-12">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-expressive text-white tracking-tighter">
              Archive
            </h1>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-sm w-full group">
            <HugeiconsIcon 
              icon={Search01Icon} 
              size={18} 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" 
            />
            <input 
              type="text"
              placeholder="Search tracks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 text-sm font-functional text-white focus:outline-hidden focus:ring-1 focus:ring-accent/50 transition-all backdrop-blur-md"
            />
          </div>
        </div>

        {/* Grid Content */}
        <div 
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {filteredTracks.length > 0 ? (
            filteredTracks.map((track) => (
              <div
                key={track.id}
                className="track-item"
              >
                <TrackCard track={track} />
              </div>
            ))
          ) : (
            <div className="col-span-full py-32 text-center space-y-4">
               <p className="text-muted-foreground font-functional text-lg">No tracks found matching your search.</p>
               <button 
                onClick={() => setSearchQuery("")}
                className="text-accent hover:underline decoration-accent/30 underline-offset-4 font-functional text-sm uppercase tracking-widest"
               >
                 Clear Search
               </button>
            </div>
          )}
        </div>
      </div>

      {/* Global Bottom Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay">
        <img src="/noise.png" alt="" className="w-full h-full object-cover" />
      </div>
    </main>
  );
}
