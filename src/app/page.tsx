import { getTracks } from '@/lib/data';
import { HomeClient } from '@/components/layout/HomeClient';

export default async function Home() {
  const tracks = await getTracks();

  return <HomeClient tracks={tracks} />;
}
