'use client';

import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import Image from 'next/image';
import { Magnetic } from '@/components/ui/Magnetic';

export default function AboutPage() {
  return (
    <main className="bg-background selection:bg-accent relative min-h-screen overflow-hidden selection:text-black">
      {/* Background Visual */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/extra/250519DSC_0023.webp"
          alt=""
          fill
          className="h-full w-full scale-110 object-cover opacity-40 grayscale"
          priority
        />
        <div className="from-background to-background absolute inset-0 bg-linear-to-b via-transparent" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 pt-32 pb-48">
        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <Magnetic strength={0.2}>
            <Link
              href="/"
              className="group font-functional flex items-center gap-3 text-xs tracking-[0.3em] text-white/40 uppercase transition-colors hover:text-white"
            >
              <div className="group-hover:border-accent/50 group-hover:text-accent flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition-all">
                <HugeiconsIcon icon={ArrowLeftIcon} size={18} />
              </div>
              <span>Back</span>
            </Link>
          </Magnetic>
        </motion.div>

        {/* Narrative Section */}
        <section className="space-y-24">
          <div className="space-y-6">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-accent font-functional text-[10px] font-bold tracking-[0.5em] uppercase"
            >
              The Story Of Nila
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="font-expressive mt-12 text-4xl leading-[0.8] tracking-normal text-white md:text-[6rem]"
            >
              Nilxnjxn
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
            className="font-functional grid grid-cols-1 gap-16 leading-relaxed md:grid-cols-2 md:gap-32"
          >
            <div className="space-y-12">
              <div className="space-y-6">
                <p className="text-2xl leading-snug font-light text-white/90">
                  &quot;LIVE FREE, BE YOU&quot;
                </p>
                <p className="text-lg font-light text-white/50">
                  Nilxnjxn aka Nila, is an Hip-hop Artist from Assam, India. With his{' '}
                  <span className="font-expressive-alt text-accent ml-2 hidden text-3xl md:inline">
                    Catchy Hooks & Slick Bars
                  </span>
                  , he intends to deliver a new wave to the existing rap scene.
                </p>
              </div>

              <p className="text-muted-foreground text-base font-light">
                Debut Album{' '}
                <span className="decoration-accent/30 font-medium text-white italic underline underline-offset-8">
                  &quot;SHADES&quot;
                </span>{' '}
                (Released 2026) explores the range of Human Emotion and Behavior, reflected through
                the seasons. All 3 SHADES — <span className="text-emerald-400">FRESH</span>;{' '}
                <span className="text-orange-400">AKAD</span>;{' '}
                <span className="text-cyan-400">LATE</span> — are officially out now.
              </p>
            </div>

            <div className="space-y-12">
              <div className="group relative space-y-6 overflow-hidden rounded-[48px] border border-white/10 bg-white/5 p-10 backdrop-blur-3xl md:p-16">
                <div className="absolute top-0 right-0 p-8 opacity-10 transition-opacity group-hover:opacity-30">
                  <HugeiconsIcon icon={ArrowLeftIcon} size={80} className="rotate-180" />
                </div>
                <h3 className="text-accent text-[10px] font-bold tracking-[0.4em] uppercase">
                  What&apos;s Next?
                </h3>
                <p className="relative z-10 text-lg leading-relaxed font-light text-white/80">
                  &quot;If you fck with the motto, sound or concept—hop in for the journey of your
                  life. We are mapping the shadows together.&quot;
                </p>
                <div className="pt-4">
                  <span className="font-expressive text-4xl text-white/20">- Nila</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
            className="space-y-8 border-t border-white/5 pt-16"
          >
            <h2 className="font-expressive mb-6 text-xl text-white">Direct &nbsp;&nbsp; Distribution</h2>
            <p className="text-muted-foreground font-functional max-w-2xl font-light">
              This space functions as a direct connection between the artist and the listener. By
              bypassing traditional streaming models, NILXNJXN ensures that the art remains pure and
              the connection remains unmediated.
            </p>
            <div className="flex flex-wrap gap-4">
              <Magnetic strength={0.3}>
                <button className="font-functional rounded-full bg-white px-8 py-4 text-xs tracking-widest text-black uppercase transition-all hover:scale-105 active:scale-95">
                  Support via Store
                </button>
              </Magnetic>
              <Magnetic strength={0.2}>
                <Link
                  href="/music"
                  className="font-functional block rounded-full border border-white/10 bg-white/5 px-8 py-4 text-xs tracking-widest text-white uppercase transition-all hover:bg-white/10"
                >
                  Explore Music
                </Link>
              </Magnetic>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Global Bottom Grain Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay">
        <Image src="/noise.png" alt="" fill className="h-full w-full object-cover" />
      </div>
    </main>
  );
}
