'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Rock_Salt } from 'next/font/google';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft02Icon, Mail02Icon, ShieldKeyIcon } from '@hugeicons/core-free-icons';
import { Magnetic } from '@/components/ui/Magnetic';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const rockSalt = Rock_Salt({
  weight: '400',
  subsets: ['latin'],
});

export default function RequestLinkPage() {
  const [email, setEmail] = useState('');
  const [trackingCode, setTrackingCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !trackingCode) {
      toast.error('Both fields are required.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/download/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, trackingCode }),
      });

      const data = await res.json() as { error?: string; message?: string };

      if (!res.ok) {
        toast.error(data.error || 'Failed to regenerate link.');
        return;
      }

      setSent(true);
      toast.success(data.message || 'A new download link has been sent to your email.');
    } catch {
      toast.error('Network error. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black px-6 pt-32 pb-24 text-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto max-w-xl text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5"
        >
          <HugeiconsIcon icon={ShieldKeyIcon} size={32} className="text-white/40" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={cn(rockSalt.className, 'mt-10 text-4xl tracking-normal text-white md:text-5xl')}
        >
          Fresh Link
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="font-functional mx-auto mt-6 max-w-sm text-[10px] leading-relaxed tracking-[0.2em] text-white/50 uppercase md:text-xs"
        >
          Download links expire in 2 hours. Enter your email and the tracking code from your receipt to regenerate a fresh link instantly.
        </motion.p>

        {sent ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-12 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-10"
          >
            <p className="font-functional text-[10px] tracking-[0.2em] text-emerald-400 uppercase md:text-xs">
              A new download link has been sent to your email. Check your inbox.
            </p>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 w-full space-y-6"
          >
            <div className="relative flex items-center">
              <HugeiconsIcon icon={Mail02Icon} size={20} className="absolute left-4 text-white/40" />
              <input
                type="email"
                required
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="YOUR EMAIL"
                className="w-full rounded-full border border-white/10 bg-white/5 py-4 pl-12 pr-6 font-mono text-[10px] uppercase tracking-widest text-white placeholder:text-white/20 focus:border-white/30 focus:outline-none disabled:opacity-50"
              />
            </div>

            <div className="relative flex items-center">
              <HugeiconsIcon icon={ShieldKeyIcon} size={20} className="absolute left-4 text-white/40" />
              <input
                type="text"
                required
                disabled={isLoading}
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                placeholder="TRACKING CODE (E.G. A1B2C3D4)"
                className="w-full rounded-full border border-white/10 bg-white/5 py-4 pl-12 pr-6 font-mono text-[10px] uppercase tracking-widest text-white placeholder:text-white/20 focus:border-white/30 focus:outline-none disabled:opacity-50"
              />
            </div>

            <Magnetic strength={0.1}>
              <button
                type="submit"
                disabled={isLoading}
                className="font-functional flex w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-white px-8 py-4 text-[10px] font-bold tracking-[0.2em] text-black uppercase transition-all hover:bg-white/90 disabled:opacity-50"
              >
                {isLoading ? 'REGENERATING SECURE LINK...' : 'REGENERATE DOWNLOAD LINK'}
              </button>
            </Magnetic>

            <a
              href="/"
              className="font-functional mx-auto flex w-fit items-center gap-3 rounded-full border border-white/10 bg-transparent px-6 py-3 text-[10px] tracking-[0.2em] text-white/50 uppercase transition-all hover:text-white"
            >
              <HugeiconsIcon icon={ArrowLeft02Icon} size={14} />
              Back to Store
            </a>
          </motion.form>
        )}
      </motion.div>

      <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("/noise.png")', backgroundSize: '200px' }} />
    </main>
  );
}
