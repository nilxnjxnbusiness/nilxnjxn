import { Metadata } from 'next';
import { getTracks } from '@/lib/data';
import { StoreClient } from '@/components/layout/StoreClient';

export const metadata: Metadata = {
  title: 'Direct Digital Store | NILXNJXN',
  description:
    "Secure, direct distribution for NILXNJXN's digital art and lossless audio. Direct artist-to-fan monetization.",
};

export default async function StorePage() {
  const tracks = await getTracks();
  return <StoreClient tracks={tracks} />;
}
