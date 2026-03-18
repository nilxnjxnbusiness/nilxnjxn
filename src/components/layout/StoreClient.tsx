"use client";

import { motion } from "framer-motion";
import { Track } from "@/lib/data";
import { TrackCard } from "@/components/player/TrackCard";
import { ShoppingCart01Icon, SecurityCheckIcon, ZapIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Magnetic } from "@/components/ui/Magnetic";

interface StoreClientProps {
  tracks: Track[];
}

export function StoreClient({ tracks }: StoreClientProps) {
  return (
    <main className="min-h-screen bg-background pt-32 pb-24 px-6 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="fixed inset-0 z-0 bg-linear-to-b from-background via-black to-background" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-accent/5 blur-[120px] rounded-full z-0" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-24">
        {/* Store Header */}
        <div className="flex flex-col items-center text-center space-y-6 md:space-y-8">
           <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
           >
              <HugeiconsIcon icon={ShoppingCart01Icon} size={28} className="text-accent md:size-8" />
           </motion.div>
           
           <div className="space-y-4">
             <h1 className="text-5xl md:text-8xl font-expressive text-white tracking-tighter leading-tight">
                Direct Outlet
             </h1>
             <p className="text-white/40 font-functional text-[10px] md:text-sm tracking-[0.3em] md:tracking-[0.5em] uppercase max-w-2xl mx-auto leading-loose">
                Premium Lossless Audio & Digital Identity Assets
             </p>
           </div>

           {/* Value Props - Stack on mobile */}
           <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 pt-4">
              <div className="flex items-center gap-3">
                <HugeiconsIcon icon={SecurityCheckIcon} size={18} className="text-accent/60" />
                <span className="text-[9px] md:text-[10px] uppercase tracking-widest font-functional text-white/60">Secure Checkout</span>
              </div>
              <div className="flex items-center gap-3">
                <HugeiconsIcon icon={ZapIcon} size={18} className="text-accent/60" />
                <span className="text-[9px] md:text-[10px] uppercase tracking-widest font-functional text-white/60">Instant Delivery</span>
              </div>
           </div>
        </div>

        {/* Store Grid - Responsive Spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 md:gap-16 justify-items-center">
          {tracks.map((track) => (
            <div key={track.id} className="space-y-6 group w-full flex flex-col items-center">
               <TrackCard track={track} />
               <div className="px-4 w-full max-w-[320px]">
                  <Magnetic strength={0.1}>
                    <button className="w-full bg-white/5 border border-white/10 py-4 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold text-white hover:bg-white hover:text-black transition-all shadow-xl active:scale-95">
                      Get Shade — {track.price}
                    </button>
                  </Magnetic>
               </div>
            </div>
          ))}
        </div>

        {/* FAQ/Support Section */}
        <div className="max-w-2xl mx-auto pt-24 border-t border-white/5 text-center space-y-8">
           <h3 className="text-white font-expressive text-3xl">Direct Delivery</h3>
           <p className="text-white/40 font-functional text-sm leading-relaxed">
             Once your payment is verified via Razorpay, a time-limited signed download link will be delivered to your inbox and provided instantly on the success page.
           </p>
           <Link href="/terms" className="inline-block text-accent text-[10px] uppercase tracking-[0.2em] hover:underline underline-offset-8">
             Read Licensing Terms
           </Link>
        </div>
      </div>

      {/* Global Grain */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.04] mix-blend-overlay">
        <img src="/noise.png" alt="" className="w-full h-full object-cover" />
      </div>
    </main>
  );
}

import Link from "next/link";
