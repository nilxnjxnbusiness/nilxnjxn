'use client';

import { motion } from 'framer-motion';
import { Magnetic } from '@/components/ui/Magnetic';
import Link from 'next/link';
import { ArrowLeftIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from 'next/image';

export default function NotFound() {
  return (
    <main className="bg-background relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20">
      {/* Cinematic Glitch Background */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-red-500/10 blur-[200px]" />
      </div>

      <div className="relative z-10 space-y-12 text-center">
        <div className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-expressive text-[12rem] leading-none tracking-tighter text-white/5 select-none md:text-[20rem]"
          >
            404
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center space-y-4"
          >
            <h2 className="font-expressive text-5xl tracking-tighter text-white md:text-7xl">
              Void Lost.
            </h2>
            <p className="text-muted-foreground font-functional text-[10px] font-light tracking-[0.5em] uppercase">
              Frequency Not Found
            </p>
          </motion.div>
        </div>

        <div className="pt-12">
          <Magnetic strength={0.3}>
            <Link
              href="/"
              className="hover:text-accent group inline-flex items-center gap-4 rounded-full border border-white/20 bg-white/5 px-10 py-4 text-white backdrop-blur-md transition-colors"
            >
              <HugeiconsIcon
                icon={ArrowLeftIcon}
                size={18}
                className="transition-transform group-hover:-translate-x-2"
              />
              <span className="font-functional mt-1 text-[10px] font-bold tracking-[0.3em] uppercase">
                Return to Archive
              </span>
            </Link>
          </Magnetic>
        </div>
      </div>

      {/* Narrative Grain */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.04] mix-blend-overlay">
        <Image src="/noise.png" alt="" fill className="h-full w-full object-cover" />
      </div>
    </main>
  );
}
