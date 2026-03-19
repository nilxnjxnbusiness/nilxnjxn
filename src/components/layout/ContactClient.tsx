'use client';

import { motion } from 'framer-motion';
import { Magnetic } from '@/components/ui/Magnetic';
import { Mail01Icon, InstagramIcon, SpotifyIcon, AppleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import Image from 'next/image';

export function ContactClient() {
  return (
    <main className="bg-background relative min-h-screen overflow-hidden px-6 pt-32 pb-24">
      {/* Background Glow */}
      <div className="from-background to-background fixed inset-0 z-0 bg-linear-to-b via-black" />
      <div className="bg-accent/5 fixed -right-1/4 -bottom-1/4 z-0 h-[600px] w-[600px] rounded-full blur-[150px]" />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
        <div className="space-y-8 text-center lg:space-y-12 lg:text-left">
          <div className="space-y-4 lg:space-y-6">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-accent text-[8px] font-bold tracking-[0.5em] uppercase md:text-[10px]"
            >
              Direct Frequency
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-expressive text-6xl leading-[0.8] tracking-tighter text-white md:text-8xl lg:text-9xl"
            >
              Connect.
            </motion.h1>
          </div>

          <p className="font-functional mx-auto max-w-md text-lg leading-loose font-light text-white/40 italic md:text-xl lg:mx-0">
            &quot;For inquiries, vibrations, or the unknown. Reach out and leave a trace in the
            shadows.&quot;
          </p>

          <div className="flex flex-col items-center space-y-6 pt-8 md:space-y-8 lg:items-start lg:pt-12">
            <div className="flex items-center gap-6">
              <div className="text-accent flex h-10 w-10 items-center justify-center rounded-full border border-white/10 md:h-12 md:w-12">
                <HugeiconsIcon icon={Mail01Icon} size={18} />
              </div>
              <div className="space-y-0.5 text-left">
                <span className="text-muted-foreground text-[8px] tracking-widest uppercase">
                  Email
                </span>
                <p className="font-functional text-xs tracking-widest text-white md:text-sm">
                  hello@nilxnjxn.com
                </p>
              </div>
            </div>

            <div className="flex gap-4 md:gap-6">
              {[
                {
                  icon: SpotifyIcon,
                  href: 'https://open.spotify.com/artist/5XzmR1SLHQvl8YE5cEyhz4',
                },
                { icon: InstagramIcon, href: 'https://instagram.com/nilxnjxn' },
                { icon: AppleIcon, href: 'https://music.apple.com/artist/nilxnjxn' },
              ].map((social, i) => (
                <Magnetic key={i} strength={0.3}>
                  <Link
                    href={social.href}
                    target="_blank"
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/40 transition-all hover:border-white/30 hover:text-white md:h-14 md:w-14"
                  >
                    <HugeiconsIcon icon={social.icon} size={18} />
                  </Link>
                </Magnetic>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-3xl md:space-y-8 md:rounded-[48px] md:p-12">
          <h3 className="font-expressive text-center text-3xl text-white md:text-4xl lg:text-left">
            Message
          </h3>
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-muted-foreground ml-4 text-[10px] font-bold tracking-widest uppercase">
                Your Identity
              </label>
              <input
                type="text"
                placeholder="NAME / ALIAS"
                className="font-functional focus:border-accent/50 h-16 w-full rounded-full border border-white/10 bg-white/5 px-8 text-sm tracking-widest text-white uppercase transition-all placeholder:text-white/20 focus:bg-white/10 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-muted-foreground ml-4 text-[10px] font-bold tracking-widest uppercase">
                Digital Address
              </label>
              <input
                type="email"
                placeholder="EMAIL"
                className="font-functional focus:border-accent/50 h-16 w-full rounded-full border border-white/10 bg-white/5 px-8 text-sm tracking-widest text-white uppercase transition-all placeholder:text-white/20 focus:bg-white/10 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-muted-foreground ml-4 text-[10px] font-bold tracking-widest uppercase">
                The Inquiry
              </label>
              <textarea
                placeholder="WHAT IS THE FREQUENCY?"
                rows={4}
                className="font-functional focus:border-accent/50 w-full resize-none rounded-[32px] border border-white/10 bg-white/5 p-8 text-sm tracking-widest text-white uppercase transition-all placeholder:text-white/20 focus:bg-white/10 focus:outline-none"
              />
            </div>
            <Magnetic strength={0.2}>
              <button className="font-functional hover:bg-accent h-16 w-full rounded-full bg-white text-[10px] font-bold tracking-[0.4em] text-black uppercase shadow-xl transition-all">
                Transmit Signal
              </button>
            </Magnetic>
          </form>
        </div>
      </div>

      {/* Global Grain */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.04] mix-blend-overlay">
        <Image src="/noise.png" alt="" fill className="h-full w-full object-cover" />
      </div>
    </main>
  );
}
