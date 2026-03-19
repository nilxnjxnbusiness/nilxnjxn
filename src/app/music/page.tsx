import { getTracks } from '@/lib/data';
import { MusicClient } from '@/components/layout/MusicClient';

export default async function MusicPage() {
  const tracks = await getTracks();

  return <MusicClient tracks={tracks} />;
}
