'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Rock_Salt } from 'next/font/google';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft02Icon, LockIcon, Mail02Icon } from '@hugeicons/core-free-icons';
import { Magnetic } from './Magnetic';
import { cn } from '@/lib/utils';
import { Track } from '@/lib/data';
import { toast } from 'sonner';

const rockSalt = Rock_Salt({
  weight: '400',
  subsets: ['latin'],
});

interface CheckoutModalProps {
  onClose: () => void;
  track: Track;
}

// In Next.js App Router, using Razopay checkout script directly
function loadRazorpayScript() {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function CheckoutModal({ onClose, track }: CheckoutModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please provide an email to receive your download.');
      return;
    }
    setIsLoading(true);

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error('Failed to load payment gateway. Please check your connection.');
        setIsLoading(false);
        return;
      }

      // Create Order
      const res = await fetch('/api/razorpay/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          trackId: track.id,
          currency: 'INR'
        })
      });

      const data = await res.json() as { error?: string; order: { amount: number; currency: string; id: string }; dbOrderId: string };
      if (!res.ok) {
        toast.error(data.error || 'Failed to initialize order');
        setIsLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'NILXNJXN',
        description: `Unlock ${track.season} - ${track.title}`,
        image: 'https://nilxnjxn.com/favicon.ico',
        order_id: data.order.id,
        handler: async function (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) {
          // Verify
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderId: data.dbOrderId,
              email,
            })
          });

          const verifyData = await verifyRes.json() as { error?: string };
          if (verifyRes.ok) {
            toast.success('Payment successful! Your download link has been emailed to you.');
            onClose();
          } else {
            toast.error(verifyData.error || 'Payment verification failed.');
          }
        },
        prefill: { email },
        theme: { color: '#0A0A0A' },
        modal: {
            ondismiss: function() {
                setIsLoading(false);
            }
        }
      };

      const paymentObject = new (window as unknown as { Razorpay: new (options: Record<string, unknown>) => { open: () => void } }).Razorpay(options);
      paymentObject.open();

    } catch {
      toast.error('Gltich in the matrix. Try again.');
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-200 flex items-center justify-center bg-black/95 backdrop-blur-2xl"
    >
      <div
        className={cn(
          "absolute inset-0 opacity-20 blur-[120px]",
          track.season === 'FRESH' && "bg-emerald-500",
          track.season === 'AKAD' && "bg-orange-500",
          track.season === 'LATE' && "bg-cyan-500",
          !track.season && "bg-white/10"
        )}
      />

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center gap-12 p-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5"
        >
           <HugeiconsIcon icon={LockIcon} size={32} className="text-white/40" />
        </motion.div>

        <div className="space-y-6">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={cn(rockSalt.className, "text-4xl tracking-normal text-white md:text-5xl")}
          >
            Unlock {track.title}
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-functional mx-auto max-w-sm text-[10px] leading-relaxed tracking-[0.2em] text-white/50 uppercase md:text-xs"
          >
            Enter your email to receive the direct download link. Your email will act as your identity. No signups required.
          </motion.p>
        </div>

        <motion.form 
          onSubmit={handleCheckout}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full space-y-6"
        >
            <div className="relative flex items-center">
                <HugeiconsIcon icon={Mail02Icon} size={20} className="absolute left-4 text-white/40" />
                <input 
                    type="email" 
                    required
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ENTER YOUR EMAIL"
                    className="w-full rounded-full border border-white/10 bg-white/5 py-4 pl-12 pr-6 font-mono text-[10px] uppercase tracking-widest text-white placeholder:text-white/20 focus:border-white/30 focus:outline-none disabled:opacity-50"
                />
            </div>
            
            <Magnetic strength={0.1}>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="font-functional flex w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-white px-8 py-4 text-[10px] font-bold tracking-[0.2em] text-black uppercase transition-all hover:bg-white/90 disabled:opacity-50"
                >
                    {isLoading ? "INITIALIZING SECURE LINK..." : `PAY ${track.price} TO UNLOCK`}
                </button>
            </Magnetic>
        </motion.form>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={onClose}
            disabled={isLoading}
            className="font-functional flex items-center gap-3 rounded-full border border-white/10 bg-transparent px-6 py-3 text-[10px] tracking-[0.2em] text-white/50 uppercase transition-all hover:text-white disabled:opacity-50"
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} size={14} />
            Cancel
          </button>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("/noise.png")', backgroundSize: '200px' }} />
    </motion.div>
  );
}
