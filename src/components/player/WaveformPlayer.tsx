'use client';

import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useAudioStore } from '@/store/audioStore';
import { motion } from 'framer-motion';
import { PlayIcon, PauseIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from 'next/image';


import { cn } from '@/lib/utils';
import { Magnetic } from '@/components/ui/Magnetic';

export function WaveformPlayer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const {
    currentTrack,
    isPlaying,
    togglePlayPause,
    updateProgress,
    volume,
    currentTime,
    duration,
    clearTrack,
  } = useAudioStore();
  const [isReady, setIsReady] = useState(false);
  const [isVisibleByFooter, setIsVisibleByFooter] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setIsVisibleByFooter(!entry.isIntersecting);
        }
      },
      { threshold: 0.1 },
    );

    const footer = document.getElementById('site-footer');
    if (footer) observer.observe(footer);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!containerRef.current || !currentTrack) return;

    wavesurferRef.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: 'rgba(255, 255, 255, 0.2)',
      progressColor: 'rgba(34, 211, 238, 1)',
      cursorColor: 'rgba(34, 211, 238, 0.8)',
      barWidth: 2,
      barGap: 4,
      barRadius: 10,
      height: 32,
      normalize: true,
      fillParent: true,
      backend: 'MediaElement',
      url: currentTrack.audioUrl || '',
    });

    wavesurferRef.current.on('ready', () => {
      setIsReady(true);
      wavesurferRef.current?.setVolume(volume);
      if (isPlaying) {
        wavesurferRef.current?.play();
      }
    });

    wavesurferRef.current.on('audioprocess', (time) => {
      updateProgress(time, wavesurferRef.current?.getDuration() || 0);
    });

    wavesurferRef.current.on('finish', () => {
      clearTrack();
    });

    return () => {
      wavesurferRef.current?.destroy();
      wavesurferRef.current = null;
    };
  }, [currentTrack, isPlaying, togglePlayPause, updateProgress, volume, clearTrack]);

  useEffect(() => {
    if (!wavesurferRef.current || !isReady) return;

    if (isPlaying) {
      wavesurferRef.current.play().catch(() => { });
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
      initial={{ y: 150 }}
      animate={{ y: isPlaying && isVisibleByFooter ? 0 : 150 }}
      exit={{ y: 150 }}
      className="pointer-events-none fixed right-0 bottom-0 left-0 z-100 px-4 pt-2 pb-6 md:pb-8"
    >
      <div className="group/player pointer-events-auto mx-auto flex max-w-4xl items-center gap-3 rounded-full border border-white/10 bg-black/60 p-2 pr-4 shadow-[0_40px_100px_rgba(0,0,0,0.8)] backdrop-blur-3xl md:gap-6 md:pr-8">
        {/* Play/Pause - Smaller on mobile */}
        <Magnetic strength={0.2}>
          <button
            onClick={togglePlayPause}
            className="hover:bg-accent relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-xl transition-all hover:scale-110 active:scale-95 md:h-14 md:w-14"
          >
            {isPlaying ? (
              <HugeiconsIcon icon={PauseIcon} size={20} color="currentColor" />
            ) : (
              <HugeiconsIcon icon={PlayIcon} size={20} color="currentColor" className="ml-1" />
            )}
          </button>
        </Magnetic>

        {/* Dynamic Track Visual - Compact on mobile */}
        <div className="flex max-w-[120px] shrink-0 items-center gap-3 md:max-w-[200px]">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/20 md:h-12 md:w-12">
            <Image
              src={currentTrack.coverUrl}
              alt=""
              fill
              className={cn(
                'h-full w-full object-cover transition-transform duration-3000 ease-linear',
                isPlaying ? 'animate-spin-slow' : '',
              )}
            />
            <div className="absolute inset-0 bg-black/20 mix-blend-overlay" />
            <div className="absolute top-1/2 left-1/2 z-10 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black md:h-2 md:w-2" />
          </div>
          <div className="hidden overflow-hidden sm:block">
            <h4 className="font-functional truncate text-[10px] font-bold tracking-tight text-white md:text-[11px]">
              {currentTrack.title}
            </h4>
            <p className="font-functional truncate text-[8px] tracking-[0.2em] text-white/40 uppercase md:text-[9px]">
              {currentTrack.artist}
            </p>
          </div>
        </div>

        {/* Waveform Visualization - Responsive Heights */}
        <div className="flex flex-1 flex-col justify-center gap-1 px-4 pt-1 md:gap-2 md:pt-2">
          <div className="h-8 w-full md:h-10" ref={containerRef} />
          <div className="flex items-center justify-between px-1">
            <span className="font-functional text-[7px] font-bold tracking-widest text-white/30 uppercase md:text-[8px]">
              {formatTime(currentTime)}
            </span>
            <div className="mx-4 h-px flex-1 bg-white/5" />
            <span className="font-functional text-[7px] font-bold tracking-widest text-white/30 uppercase md:text-[8px]">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
