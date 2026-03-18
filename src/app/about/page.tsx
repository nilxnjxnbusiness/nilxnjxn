"use client";

import { motion } from "framer-motion";
import { ArrowLeftIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { Magnetic } from "@/components/ui/Magnetic";

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
              className="group flex items-center gap-3 text-white/40 hover:text-white transition-colors font-functional text-xs uppercase tracking-[0.3em]"
            >
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-accent/50 group-hover:text-accent transition-all">
                <HugeiconsIcon icon={ArrowLeftIcon} size={18} />
              </div>
              <span>Back</span>
            </Link>
          </Magnetic>
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
                Nilxnjxn aka Nila, is an upcoming Hip-hop Artist from Assam, India. 
                Guided by the motto <span className="text-accent italic">"LIVE FREE, BE YOU"</span>, 
                he delivers a precise blend of catchy hooks and slick bars.
              </p>
              <p className="text-muted-foreground font-light">
                With his debut EP <span className="text-white font-medium italic">"SHADES"</span> (dropping 2026), 
                Nila explores the vast range of human emotion and behavior. Each track is released in 
                specific seasons that mirror the mood of the sound.
              </p>
            </div>
            <div className="space-y-6 bg-white/5 backdrop-blur-md p-8 rounded-[32px] border border-white/10 h-fit">
              <h3 className="text-xs uppercase tracking-[0.2em] text-accent font-medium">Concept</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                "FRESH, AKAD, and LATE are just the beginning. I want to bring a new wave to the existing 
                rap scene—if you fck with the sound, hop in for the journey of your life."
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
            <div className="flex flex-wrap gap-4">
              <Magnetic strength={0.3}>
                <button className="px-8 py-4 bg-white text-black rounded-full font-functional text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                  Support via Store
                </button>
              </Magnetic>
              <Magnetic strength={0.2}>
                <Link href="/music" className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-functional text-xs uppercase tracking-widest hover:bg-white/10 transition-all block">
                  Explore Music
                </Link>
              </Magnetic>
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
