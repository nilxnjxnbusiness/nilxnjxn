'use client';

import { motion } from 'framer-motion';
import { Track } from '@/lib/data';
import { TrackCard } from '@/components/player/TrackCard';
import { ShoppingCart01Icon, SecurityCheckIcon, ZapIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Magnetic } from '@/components/ui/Magnetic';
import Link from 'next/link';
import Image from 'next/image';

interface StoreClientProps {
  tracks: Track[];
}

export function StoreClient({ tracks }: StoreClientProps) {
  return (
    <main className="bg-background relative min-h-screen overflow-hidden px-6 pt-32 pb-24">
      {/* Cinematic Background */}
      <div className="from-background to-background fixed inset-0 z-0 bg-linear-to-b via-black" />
      <div className="bg-accent/5 fixed top-0 left-1/2 z-0 h-[500px] w-full -translate-x-1/2 rounded-full blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-24">
        {/* Store Header */}
        <div className="flex flex-col items-center space-y-6 text-center md:space-y-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 md:h-20 md:w-20"
          >
            <HugeiconsIcon icon={ShoppingCart01Icon} size={28} className="text-accent md:size-8" />
          </motion.div>

          <div className="space-y-4">
            <h1 className="font-expressive text-5xl leading-tight tracking-tighter text-white md:text-8xl">
              Direct Outlet
            </h1>
            <p className="font-functional mx-auto max-w-2xl text-[10px] leading-loose tracking-[0.3em] text-white/40 uppercase md:text-sm md:tracking-[0.5em]">
              Premium Lossless Audio & Digital Identity Assets
            </p>
          </div>

          {/* Value Props - Stack on mobile */}
          <div className="flex flex-col items-center justify-center gap-6 pt-4 md:flex-row md:gap-12">
            <div className="flex items-center gap-3">
              <HugeiconsIcon icon={SecurityCheckIcon} size={18} className="text-accent/60" />
              <span className="font-functional text-[9px] tracking-widest text-white/60 uppercase md:text-[10px]">
                Secure Checkout
              </span>
            </div>
            <div className="flex items-center gap-3">
              <HugeiconsIcon icon={ZapIcon} size={18} className="text-accent/60" />
              <span className="font-functional text-[9px] tracking-widest text-white/60 uppercase md:text-[10px]">
                Instant Delivery
              </span>
            </div>
          </div>
        </div>

        {/* Store Grid - Responsive Spacing */}
        <div className="grid grid-cols-1 justify-items-center gap-12 sm:grid-cols-2 md:gap-16 lg:grid-cols-3 xl:grid-cols-4">
          {tracks.map((track) => (
            <div key={track.id} className="group flex w-full flex-col items-center space-y-6">
              <TrackCard track={track} />
              <div className="w-full max-w-[320px] px-4">
                <Magnetic strength={0.1}>
                  <button className="w-full rounded-full border border-white/10 bg-white/5 py-4 text-[10px] font-bold tracking-[0.3em] text-white uppercase shadow-xl transition-all hover:bg-white hover:text-black active:scale-95">
                    Get Shade — {track.price}
                  </button>
                </Magnetic>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ/Support Section */}
        <div className="mx-auto max-w-2xl space-y-8 border-t border-white/5 pt-24 text-center">
          <h3 className="font-expressive text-3xl text-white">Direct Delivery</h3>
          <p className="font-functional text-sm leading-relaxed text-white/40">
            Once your payment is verified via Razorpay, a time-limited signed download link will be
            delivered to your inbox and provided instantly on the success page.
          </p>
          <Link
            href="/terms"
            className="text-accent inline-block text-[10px] tracking-[0.2em] uppercase underline-offset-8 hover:underline"
          >
            Read Licensing Terms
          </Link>
        </div>
      </div>

      {/* Global Grain */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.04] mix-blend-overlay">
        <Image src="/noise.png" alt="" fill className="h-full w-full object-cover" />
      </div>
    </main>
  );
}
