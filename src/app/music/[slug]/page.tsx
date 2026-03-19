import { Metadata } from 'next';
import { getTracks } from '@/lib/data';
import { notFound } from 'next/navigation';
import { TrackDetailClient } from '@/components/player/TrackDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tracks = await getTracks();
  const track = tracks.find((t) => t.slug === slug);

  if (!track) return { title: 'Track Not Found' };

  return {
    title: `${track.title} | NILXNJXN`,
    description: `Experience ${track.title} by NILXNJXN. Premium lossless audio from the ${track.season} shade.`,
    openGraph: {
      images: [track.coverUrl],
    },
  };
}

export default async function TrackPage({ params }: Props) {
  const { slug } = await params;
  const tracks = await getTracks();
  const track = tracks.find((t) => t.slug === slug);

  if (!track) notFound();

  return <TrackDetailClient track={track} />;
}
