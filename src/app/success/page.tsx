import { Metadata } from 'next';
import { Suspense } from 'react';
import { SuccessClient } from '@/components/player/SuccessClient';

export const metadata: Metadata = {
  title: 'Success | NILXNJXN',
  robots: { index: false, follow: false },
};

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <SuccessClient />
    </Suspense>
  );
}

