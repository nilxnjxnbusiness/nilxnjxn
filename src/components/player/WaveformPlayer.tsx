"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { useAudioStore } from "@/store/audioStore";
import { motion } from "framer-motion";
import { PlayIcon, PauseIcon, VolumeHighIcon, VolumeMuteIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function WaveformPlayer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const { currentTrack, isPlaying, togglePlayPause, updateProgress, setVolume, volume, currentTime, duration } = useAudioStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !currentTrack) return;

    wavesurferRef.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "rgba(255, 255, 255, 0.1)",
      progressColor: "rgba(34, 211, 238, 0.6)",
      cursorColor: "transparent",
      barWidth: 1.5,
      barGap: 3,
      barRadius: 4,
      height: 32,
      normalize: true,
      fillParent: true,
      url: currentTrack.audioUrl || "", 
    });

    wavesurferRef.current.on("ready", () => {
      setIsReady(true);
      wavesurferRef.current?.setVolume(volume);
      if (isPlaying) {
        wavesurferRef.current?.play();
      }
    });

    wavesurferRef.current.on("audioprocess", (time) => {
      updateProgress(time, wavesurferRef.current?.getDuration() || 0);
    });

    wavesurferRef.current.on("finish", () => {
      togglePlayPause();
    });

    return () => {
      wavesurferRef.current?.destroy();
      wavesurferRef.current = null;
    };
  }, [currentTrack?.id]);

  useEffect(() => {
    if (!wavesurferRef.current || !isReady) return;
    
    if (isPlaying) {
      wavesurferRef.current.play().catch(() => {});
    } else {
      wavesurferRef.current.pause();
    }
  }, [isPlaying, isReady]);

  useEffect(() => {
    if (wavesurferRef.current && isReady) {
      wavesurferRef.current.setVolume(volume);
    }
  }, [volume, isReady]);

  if (!currentTrack) return null;

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2 pointer-events-none"
    >
      <div className="max-w-5xl mx-auto bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full p-2 pr-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-6 pointer-events-auto">
        {/* Play/Pause Control */}
        <button 
          onClick={togglePlayPause}
          className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
        >
          {isPlaying ? (
            <HugeiconsIcon icon={PauseIcon} size={20} color="currentColor" />
          ) : (
            <HugeiconsIcon icon={PlayIcon} size={20} color="currentColor" className="ml-1" />
          )}
        </button>

        {/* Track Info */}
        <div className="hidden sm:flex items-center gap-3 shrink-0 max-w-[180px]">
          <img src={currentTrack.coverUrl} alt="" className="w-10 h-10 rounded-full object-cover border border-white/10" />
          <div className="overflow-hidden">
            <h4 className="text-white font-functional font-medium truncate text-xs">{currentTrack.title}</h4>
            <p className="text-muted-foreground font-functional text-[10px] uppercase tracking-wider truncate">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Waveform & Progress */}
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex justify-between items-center px-1">
            <span className="text-[9px] font-functional text-muted-foreground font-medium">{formatTime(currentTime)}</span>
            <span className="text-[9px] font-functional text-muted-foreground font-medium">{formatTime(duration)}</span>
          </div>
          <div className="w-full" ref={containerRef} />
        </div>

        {/* Volume Control */}
        <div className="hidden md:flex items-center gap-3 group px-2 shrink-0">
          <HugeiconsIcon icon={volume === 0 ? VolumeMuteIcon : VolumeHighIcon} size={16} className="text-muted-foreground group-hover:text-white transition-colors" />
          <input 
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent"
          />
        </div>
      </div>
    </motion.div>
  );
}
