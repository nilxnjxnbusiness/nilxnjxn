import fs from 'fs';
import path from 'path';
import { get } from '@vercel/edge-config';

export interface Track {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverUrl: string;
  price: string;
  duration?: string;
  slug?: string;
  season?: 'FRESH' | 'AKAD' | 'LATE';
}

// Simple in-memory cache for track data to improve TTFB
let tracksCache: Track[] | null = null;

export async function getTracks(): Promise<Track[]> {
  if (tracksCache) return tracksCache;

  try {
    const edgeTracks = await get<Track[]>('tracks');
    if (edgeTracks && Array.isArray(edgeTracks) && edgeTracks.length > 0) {
      console.log('Fetched tracks from Vercel Edge Config');
      tracksCache = edgeTracks;
      return edgeTracks;
    }
  } catch (err) {
    console.warn('Edge Config not available or empty, falling back to filesystem.', err);
  }

  // 2. Local Filesystem Fallback (Solid for local dev or if Edge is not linked)
  const publicPath = path.join(process.cwd(), 'public');
  const dirPath = path.join(publicPath, 'cover-arts');
  
  let files: string[] = [];
  try {
    if (fs.existsSync(dirPath)) {
      files = fs.readdirSync(dirPath);
    }
  } catch (err) {
    console.error('Error reading cover-arts directory', err);
    return [];
  }

  const seasons: ('FRESH' | 'AKAD' | 'LATE')[] = ['FRESH', 'AKAD', 'LATE'];

  const tracks = files.map((file, i) => {
    const rawTitle = file.replace(/\.[^/.]+$/, '').replace(/-COVER/i, '');
    const title = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1).toLowerCase();
    const upperFile = file.toUpperCase();

    let season: 'FRESH' | 'AKAD' | 'LATE' = seasons[i % 3] as 'FRESH' | 'AKAD' | 'LATE';
    if (upperFile.includes('FRESH')) season = 'FRESH';
    else if (upperFile.includes('AKAD')) season = 'AKAD';
    else if (upperFile.includes('LATE')) season = 'LATE';

    // Optimize: only check one possible extension to reduce existsSync calls
    const audioFilePath = path.join(publicPath, 'preview', `${rawTitle.toLowerCase()}.m4a`);
    const audioUrl = fs.existsSync(audioFilePath)
      ? `/preview/${rawTitle.toLowerCase()}.m4a`
      : 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

    return {
      id: `trk_${i}`,
      title,
      artist: 'NILXNJXN',
      coverUrl: `/cover-arts/${file}`,
      audioUrl,
      price: '₹49',
      slug: rawTitle.toLowerCase(),
      season,
    };
  }).sort((a, b) => {
    const priority = { AKAD: 0, FRESH: 1, LATE: 2 };
    return priority[a.season || 'LATE'] - priority[b.season || 'LATE'];
  });

  tracksCache = tracks;
  return tracks;
}
