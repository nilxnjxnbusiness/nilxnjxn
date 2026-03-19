import { Metadata } from 'next';
import { Magnetic } from '@/components/ui/Magnetic';
import Link from 'next/link';
import { ArrowLeftIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Terms of Service | NILXNJXN',
  description:
    'Digital licensing, usage rights, and the legal framework for NILXNJXN distribution.',
};

export default function TermsPage() {
  return (
    <main className="bg-background selection:bg-accent min-h-screen px-6 pt-32 pb-24 selection:text-black">
      <div className="mx-auto max-w-4xl space-y-16">
        {/* Back Navigation */}
        <Magnetic strength={0.2}>
          <Link
            href="/"
            className="text-muted-foreground group inline-flex items-center gap-2 transition-colors hover:text-white"
          >
            <HugeiconsIcon
              icon={ArrowLeftIcon}
              size={18}
              className="transition-transform group-hover:-translate-x-1"
            />
            <span className="font-functional mt-1 text-[10px] tracking-[0.3em] uppercase">
              Back
            </span>
          </Link>
        </Magnetic>

        <header className="space-y-4">
          <h1 className="font-expressive text-6xl tracking-tighter text-white md:text-8xl">
            Terms
          </h1>
          <p className="text-muted-foreground font-functional text-sm font-light tracking-[0.4em] uppercase">
            Digital License v1.0
          </p>
        </header>

        <div className="font-functional grid gap-12 leading-relaxed text-white/70">
          <section className="space-y-6 rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:p-12">
            <h2 className="text-xl font-bold tracking-widest text-white uppercase">
              01. Intellectual Property
            </h2>
            <div className="space-y-4 text-sm md:text-base">
              <p>
                All music, audio files, digital art, logos, and visual assets available on this
                platform are the exclusive property of{' '}
                <span className="font-bold tracking-wider text-white">NILXNJXN</span>.
              </p>
              <p>
                Upon purchase, you are granted a{' '}
                <span className="text-accent decoration-accent/30 underline underline-offset-4">
                  Non-Exclusive Personal Use License
                </span>
                . This is not a transfer of ownership.
              </p>
            </div>
          </section>

          <section className="space-y-6 p-8 md:p-12">
            <h2 className="text-xl font-bold tracking-widest text-white uppercase">
              02. Usage & Restrictions
            </h2>
            <div className="space-y-4 text-sm md:text-base">
              <p>
                <span className="font-medium text-white">YOU ARE PERMITTED TO:</span> Listen, enjoy,
                and keep for personal archival purposes.
              </p>
              <p className="font-medium text-white">YOU ARE STRICKLY PROHIBITED FROM:</p>
              <ul className="list-disc space-y-2 pl-5 marker:text-red-500/50">
                <li>Reselling, redistributing, or leasing any digital file.</li>
                <li>
                  Using the audio for commercial synchronized projects without an additional
                  Commercial Sync License.
                </li>
                <li>Utilizing any asset for NFT minting or blockchain-based distribution.</li>
                <li>
                  Submitting any audio/visual asset to AI training models or machine learning
                  datasets.
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-6 rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:p-12">
            <h2 className="text-xl font-bold tracking-widest text-white uppercase">
              03. Returns & Refunds
            </h2>
            <div className="space-y-4 text-sm md:text-base">
              <p>
                Due to the irreversible nature of digital downloads,{' '}
                <span className="font-bold text-white">ALL SALES ARE FINAL</span> once a download
                link has been generated or delivered.
              </p>
              <p>
                If you experience technical failure or file corruption, contact us within 48 hours
                for a replacement link.
              </p>
            </div>
          </section>
        </div>

        <footer className="border-t border-white/5 pt-12 text-center">
          <p className="text-muted-foreground font-functional text-[10px] tracking-widest uppercase">
            By interacting with this platform, you accept these terms.
          </p>
        </footer>
      </div>

      {/* Narrative Grain */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay">
        <Image src="/noise.png" alt="" fill className="h-full w-full object-cover" />
      </div>
    </main>
  );
}
