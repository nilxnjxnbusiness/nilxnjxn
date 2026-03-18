import fs from "fs";
import path from "path";

export interface Track {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverUrl: string;
  price: string;
  duration?: string;
  slug?: string;
}

export async function getTracks(): Promise<Track[]> {
  const dirPath = path.join(process.cwd(), "public", "cover-arts");
  let files: string[] = [];
  try {
    files = fs.readdirSync(dirPath);
  } catch (err) {
    console.error("Error reading cover-arts directory", err);
  }

  return files.map((file, i) => {
    // Basic title formatting: remove extension and "-COVER"
    const rawTitle = file.replace(/\.[^/.]+$/, "").replace(/-COVER/i, "");
    // Title case
    const title = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1).toLowerCase();

    return {
      id: `trk_${i}`,
      title,
      artist: "NILXNJXN",
      coverUrl: `/cover-arts/${file}`,
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Demo audio
      price: "₹150",
      slug: rawTitle.toLowerCase(),
    };
  });
}
