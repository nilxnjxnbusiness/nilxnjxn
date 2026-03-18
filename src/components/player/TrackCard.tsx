"use client";

import { motion } from "framer-motion";
import { Track } from "@/lib/data";
import { useAudioStore } from "@/store/audioStore";
import { PlayIcon, PauseIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function TrackCard({ track }: { track: Track }) {
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = useAudioStore();

  const isCurrentTrack = currentTrack?.id === track.id;

  const handlePlay = () => {
    if (isCurrentTrack) {
      togglePlayPause();
    } else {
      playTrack(track);
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group relative flex-none w-[260px] sm:w-[300px] snap-center shrink-0 space-y-4 cursor-pointer" 
      onClick={handlePlay}
    >
      <div className="relative aspect-square overflow-hidden rounded-[20px] border border-white/5 shadow-2xl transition-all duration-500 group-hover:border-accent/30 group-hover:shadow-[0_0_40px_rgba(34,211,238,0.1)]">
        <img 
          src={track.coverUrl} 
          alt={track.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-20 group-hover:grayscale-0"
          loading="lazy"
        />
        
        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-xs">
          <div 
            className="w-16 h-16 bg-white text-black rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-300"
          >
            {isPlaying && isCurrentTrack ? (
              <HugeiconsIcon icon={PauseIcon} size={24} color="currentColor" />
            ) : (
              <HugeiconsIcon icon={PlayIcon} size={24} color="currentColor" className="ml-1" />
            )}
          </div>
        </div>

        {/* Price Tag */}
        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-[10px] font-functional font-medium text-white tracking-widest uppercase">{track.price}</span>
        </div>
      </div>

      <div className="space-y-1 px-1">
        <h3 className="text-base font-functional font-medium text-white truncate group-hover:text-accent transition-colors duration-300">{track.title}</h3>
        <p className="text-[12px] font-functional text-muted-foreground uppercase tracking-wider">{track.artist}</p>
      </div>
    </motion.div>
  );
}
