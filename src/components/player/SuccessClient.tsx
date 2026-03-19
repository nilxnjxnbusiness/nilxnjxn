'use client';

import { motion } from 'framer-motion';
import { SecurityCheckIcon, Download01Icon, Home01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Magnetic } from '@/components/ui/Magnetic';
import Link from 'next/link';
import Image from 'next/image';

export function SuccessClient() {
  return (
    <main className="bg-background relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      {/* Pulsing Success Glow */}
      <div className="fixed inset-0 z-0 bg-radial from-emerald-500/10 via-transparent to-transparent opacity-50" />

      <div className="relative z-10 w-full max-w-lg space-y-12 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 shadow-[0_0_50px_rgba(16,185,129,0.1)]"
        >
          <HugeiconsIcon icon={SecurityCheckIcon} size={40} className="text-emerald-500" />
        </motion.div>

        <div className="space-y-4">
          <h1 className="font-expressive text-5xl tracking-tighter text-white md:text-7xl">
            Unlocked
          </h1>
          <p className="text-muted-foreground font-functional text-sm tracking-[0.4em] uppercase">
            Payment Verified. Shade Released.
          </p>
        </div>

        <div className="space-y-8 rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-3xl">
          <p className="font-functional text-sm leading-relaxed text-white/60">
            The high-resolution audio files have been sent to your email. You can also download them
            directly below using your secure token.
          </p>

          <Magnetic strength={0.2}>
            <button className="bg-accent font-functional shadow-accent/20 flex w-full items-center justify-center gap-3 rounded-full py-5 text-xs font-bold tracking-widest text-black uppercase shadow-lg transition-all hover:scale-[1.02]">
              <HugeiconsIcon icon={Download01Icon} size={20} color="currentColor" />
              Download Archive (.ZIP)
            </button>
          </Magnetic>

          <p className="text-[10px] tracking-[0.2em] text-white/20 uppercase italic">
            * This link expires in 24 hours for security.
          </p>
        </div>

        <div className="pt-8">
          <Magnetic strength={0.1}>
            <Link
              href="/"
              className="text-muted-foreground group inline-flex items-center gap-2 transition-colors hover:text-white"
            >
              <HugeiconsIcon icon={Home01Icon} size={18} />
              <span className="font-functional mt-1 text-[10px] tracking-[0.3em] uppercase">
                Return Home
              </span>
            </Link>
          </Magnetic>
        </div>
      </div>

      {/* Global Grain */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.04] mix-blend-overlay">
        <Image src="/noise.png" alt="" fill className="h-full w-full object-cover" />
      </div>
    </main>
  );
}
