import { Metadata } from 'next';
import { SuccessClient } from '@/components/player/SuccessClient';

export const metadata: Metadata = {
  title: 'Success | NILXNJXN',
  robots: { index: false, follow: false },
};

export default function SuccessPage() {
  return <SuccessClient />;
}
