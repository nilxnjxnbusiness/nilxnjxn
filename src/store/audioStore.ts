import { create } from 'zustand';
import { Track } from '@/lib/data';

interface AudioState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  duration: number;
  currentTime: number;

  // Actions
  playTrack: (track: Track) => void;
  setTrack: (track: Track) => void;
  togglePlayPause: () => void;
  setVolume: (volume: number) => void;
  updateProgress: (currentTime: number, duration: number) => void;
  clearTrack: () => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 1,
  duration: 0,
  currentTime: 0,

  playTrack: (track) => set({ currentTrack: track, isPlaying: true }),
  setTrack: (track) => set({ currentTrack: track, isPlaying: false }),
  togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setVolume: (volume) => set({ volume }),
  updateProgress: (currentTime, duration) => set({ currentTime, duration }),
  clearTrack: () => set({ currentTrack: null, isPlaying: false, currentTime: 0, duration: 0 }),
}));
