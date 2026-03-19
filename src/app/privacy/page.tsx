import { Metadata } from 'next';
import { Magnetic } from '@/components/ui/Magnetic';
import Link from 'next/link';
import { ArrowLeftIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Privacy Policy | NILXNJXN',
  description:
    'How we handle your data at NILXNJXN. Transparency, security, and artist-first privacy.',
};

export default function PrivacyPage() {
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
            Privacy
          </h1>
          <p className="text-muted-foreground font-functional text-sm font-light tracking-[0.4em] uppercase">
            Effective March 2026
          </p>
        </header>

        <div className="font-functional grid gap-12 leading-relaxed text-white/70">
          <section className="space-y-6 rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:p-12">
            <h2 className="text-xl font-bold tracking-widest text-white uppercase">
              01. Collective Data
            </h2>
            <div className="space-y-4 text-sm md:text-base">
              <p>We only collect what is necessary to deliver the sound. This includes:</p>
              <ul className="marker:text-accent list-disc space-y-2 pl-5">
                <li>
                  <span className="text-white">Order Information:</span> Email, name, and
                  transaction ID for secure download delivery.
                </li>
                <li>
                  <span className="text-white">Technical Identifiers:</span> IP address and browser
                  type for fraud prevention and edge delivery optimization.
                </li>
                <li>
                  <span className="text-white">Usage Analytics:</span> Anonymized data on how you
                  interact with the waves to improve the experience.
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-6 p-8 md:p-12">
            <h2 className="text-xl font-bold tracking-widest text-white uppercase">
              02. Handling & Security
            </h2>
            <div className="space-y-4 text-sm md:text-base">
              <p>
                Your data is never for sale. It resides at the edge of the network, protected by
                industry-standard encryption.
              </p>
              <p>
                Payments are handled exclusively via <span className="text-accent">Razorpay</span>.
                We never store or see your credit card or sensitive financial details.
                Communications are delivered via <span className="text-accent">Resend</span> under
                strict authentication protocols.
              </p>
            </div>
          </section>

          <section className="space-y-6 rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:p-12">
            <h2 className="text-xl font-bold tracking-widest text-white uppercase">
              03. Global Rights (GDPR/CCPA)
            </h2>
            <div className="space-y-4 text-sm md:text-base">
              <p>Wherever you are in the world, you have the right to:</p>
              <ul className="marker:text-accent list-disc space-y-2 pl-5">
                <li>Access all personal data we hold about you.</li>
                <li>Request the complete erasure of your digital footprint from our servers.</li>
                <li>Object to any processing based on legitimate interests.</li>
              </ul>
              <p className="pt-4 text-white/40 italic">
                To exercise these rights, contact the source: hello@nilxnjxn.com
              </p>
            </div>
          </section>
        </div>

        <footer className="border-t border-white/5 pt-12 text-center">
          <p className="text-muted-foreground font-functional text-[10px] tracking-widest uppercase">
            NILXNJXN — Independent Digital Infrastructure
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
