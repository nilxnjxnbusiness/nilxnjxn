"use client";

import { motion } from "framer-motion";
import { ArrowLeftIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden selection:bg-accent selection:text-black">
      {/* Background Visual */}
      <div className="fixed inset-0 z-0">
        <img 
          src="/extra/250519DSC_0023.webp" 
          alt="" 
          className="w-full h-full object-cover grayscale opacity-40 scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-48">
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <Link 
            href="/" 
            className="group flex items-center gap-2 text-muted-foreground hover:text-white transition-colors font-functional text-xs uppercase tracking-widest"
          >
            <HugeiconsIcon icon={ArrowLeftIcon} size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </motion.div>

        {/* Narrative Section */}
        <section className="space-y-16">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-expressive text-white tracking-tighter"
          >
            The Paradox of <span className="text-accent underline decoration-1 underline-offset-8">Silence</span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 font-functional leading-relaxed"
          >
            <div className="space-y-6">
              <p className="text-lg text-white/90 font-light">
                NILXNJXN is not just a moniker—it is an exploration of the spaces between noise and void. 
                Born from the shadows of late-night studio sessions and the rhythmic pulse of the urban 
                underground, the project seeks to translate the untranslatable.
              </p>
              <p className="text-muted-foreground font-light">
                Each composition is built on a foundation of raw emotion, using sound as a medium to 
                document a personal journey through light, shadow, and everything in between.
              </p>
            </div>
            <div className="space-y-6 bg-white/5 backdrop-blur-md p-8 rounded-[32px] border border-white/10 h-fit">
              <h3 className="text-xs uppercase tracking-[0.2em] text-accent font-medium">Philosophy</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                "Music is the only medium that can occupy a room without filling it. I strive for 
                minimalism that feels heavy—sounds that resonate long after the silence returns."
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
            className="pt-16 border-t border-white/5 space-y-8"
          >
            <h2 className="text-3xl font-expressive text-white">Direct Distribution</h2>
            <p className="text-muted-foreground font-functional font-light max-w-2xl">
              This space functions as a direct connection between the artist and the listener. 
              By bypassing traditional streaming models, NILXNJXN ensures that the art remains 
              pure and the connection remains unmediated.
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-white text-black rounded-full font-functional text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                Support via Store
              </button>
              <Link href="/music" className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-full font-functional text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                Explore Music
              </Link>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Global Bottom Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay">
        <img src="/noise.png" alt="" className="w-full h-full object-cover" />
      </div>
    </main>
  );
}
