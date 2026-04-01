'use client';

import { useState } from 'react';
import {
  InstagramIcon,
  SpotifyIcon,
  YoutubeIcon,
  TwitterIcon,
  WhatsappIcon,
  AppleMusicIcon,
  AmazonIcon,
  MusicNote01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Magnetic } from '@/components/ui/Magnetic';
import { subscribeNewsletter } from '@/app/actions/newsletter';
import Link from 'next/link';
import Image from 'next/image';

const socialLinks = [
  {
    name: 'Instagram',
    icon: InstagramIcon,
    href: 'https://instagram.com/nilxnjxn',
    hoverColor: '#E4405F',
  },
  {
    name: 'Spotify',
    icon: SpotifyIcon,
    href: 'https://open.spotify.com/artist/5XzmR1SLHQvl8YE5cEyhz4',
    hoverColor: '#1DB954',
  },
  {
    name: 'YouTube',
    icon: YoutubeIcon,
    href: 'https://youtube.com/channel/UCztZDitG8Rc7kSjF1Hf1P-Q',
    hoverColor: '#FF0000',
  },
  { name: 'X', icon: TwitterIcon, href: 'https://x.com/Realnilxnjxn', hoverColor: '#FFFFFF' },
  {
    name: 'WhatsApp',
    icon: WhatsappIcon,
    href: 'https://www.whatsapp.com/channel/0029VaibEslFCCoXBTMA270I',
    hoverColor: '#25D366',
  },
  {
    name: 'Apple Music',
    icon: AppleMusicIcon,
    href: 'https://music.apple.com/il/artist/nilxnjxn/1801565249',
    hoverColor: '#FA243C',
  },
  {
    name: 'Shazam',
    icon: MusicNote01Icon,
    href: 'https://www.shazam.com/artist/nilxnjxn/1801565249',
    hoverColor: '#0088FF',
  },
  {
    name: 'Amazon Music',
    icon: AmazonIcon,
    href: 'https://music.amazon.in/artists/B0F15TXBWY/nilxnjxn',
    hoverColor: '#00A8E1',
  },
];

const quickLinks = [
  // { name: 'Music', href: '/music' },
  { name: 'About', href: '/about' },
  { name: 'Store', href: '/store' },
  { name: 'Contact', href: '/contact' },
  { name: 'Licensing', href: '/licensing' },
];

const legalLinks = [
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Refund Policy', href: '/refunds' },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    const result = await subscribeNewsletter({ email });

    if (result.success) {
      setStatus('success');
      setMessage('Welcome to the inner circle!');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    } else {
      setStatus('error');
      setMessage(result.error || 'Failed to subscribe');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <footer
      id="site-footer"
      className="bg-background selection:bg-accent relative mt-24 border-t border-white/5 px-6 pt-24 pb-12 selection:text-black"
    >
      <div className="mx-auto mb-24 grid max-w-7xl grid-cols-1 gap-12 uppercase md:grid-cols-2 lg:grid-cols-4">
        {/* Brand Column */}
        <div className="space-y-6">
          <Link href="/" className="group flex flex-col items-center gap-4">
            <Image
              src="/LOGO-FINAL.png"
              alt="Logo"
              width={160}
              height={64}
              quality={100}
              className="h-16 w-auto opacity-90 transition-opacity group-hover:opacity-100"
            />
            <span className="font-expressive mt-1 px-1 text-sm tracking-[0.2em] text-white">
              nilxnjxn
            </span>
          </Link>
          <p className="text-muted-foreground font-functional max-w-xs text-sm leading-relaxed font-light">
            Hip-Hop Artist from Assam, India with Catchy Hooks & Slick Bars — delivering a New Wave
            to the rap scene.
            <br />
            <span className="mt-2 block italic text-white/50 tracking-wider">
              &quot;LIVE FREE, BE YOU&quot;
            </span>
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <h4 className="text-xs font-medium tracking-[0.2em] text-white uppercase">Navigation</h4>
          <ul className="space-y-4">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-muted-foreground hover:text-accent font-functional text-sm font-light transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal Links */}
        <div className="space-y-6">
          <h4 className="text-xs font-medium tracking-[0.2em] text-white uppercase">
            Transparency
          </h4>
          <ul className="space-y-4">
            {legalLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-muted-foreground hover:text-accent font-functional text-sm font-light transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact/Newsletter */}
        <div className="space-y-6">
          <h4 className="text-xs font-medium tracking-[0.2em] text-white uppercase">
            Stay Connected
          </h4>
          <p className="text-muted-foreground font-functional text-sm font-light">
            Receive updates on secret releases and private events.
          </p>
          <form onSubmit={handleSubscribe} className="group relative">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
              className="font-functional focus:ring-accent/50 w-full rounded-full border border-white/10 bg-white/5 px-6 py-3 text-xs text-white transition-all focus:ring-1 focus:outline-hidden disabled:opacity-50"
              required
            />
            <button
              type="submit"
              disabled={status === 'loading' || !email}
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white px-4 py-1.5 text-[9px] font-bold tracking-widest text-black uppercase transition-all hover:scale-105 disabled:scale-100 disabled:opacity-50"
            >
              {status === 'loading' ? 'Joining...' : 'Join'}
            </button>
            {message && (
              <p
                className={`font-functional mt-2 text-[9px] tracking-widest uppercase ${
                  status === 'success' ? 'text-accent' : 'text-red-400'
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Social Links Row (Centered) */}
      <div className="mb-12 flex flex-wrap justify-center gap-5 md:gap-6">
        {socialLinks.map((social) => (
          <Magnetic key={social.name} strength={0.3}>
            <a
              href={social.href}
              style={{ '--hover-color': social.hoverColor } as React.CSSProperties}
              className="hover:border-(--hover-color) hover:text-(--hover-color) hover:shadow-[0_0_20px_var(--hover-color)] group relative flex h-12 w-12 items-center justify-center rounded-full border border-white/10 transition-all hover:bg-white/5 active:scale-95 md:h-14 md:w-14"
              aria-label={social.name}
            >
              <HugeiconsIcon
                icon={social.icon}
                size={24}
                className="relative z-10 transition-transform duration-300 group-hover:scale-115"
              />
              <div className="absolute inset-0 rounded-full bg-(--hover-color) opacity-0 blur-md transition-opacity group-hover:opacity-20" />
            </a>
          </Magnetic>
        ))}
      </div>

      {/* Bottom Row */}
      <div className="flex flex-col items-center justify-between gap-8 border-t border-white/5 pt-12 md:flex-row">
        <div className="flex flex-col items-center gap-1 md:items-start">
          <p className="text-[10px] font-medium tracking-[0.4em] text-white/40 uppercase">
            &copy; {new Date().getFullYear()} NILXNJXN
          </p>
          <div className="text-muted-foreground flex items-center gap-4 text-[9px] font-bold tracking-widest uppercase">
            <Link href="/privacy" className="hover:text-accent transition-colors">
              Privacy
            </Link>
            <div className="h-1 w-1 rounded-full bg-white/10" />
            <Link href="/terms" className="hover:text-accent transition-colors">
              Terms
            </Link>
            <div className="h-1 w-1 rounded-full bg-white/10" />
            <button className="hover:text-accent transition-colors">Licensing</button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-functional text-muted-foreground text-[10px] tracking-[0.2em] uppercase">
            Made with ❤️ by
          </span>
          <Link
            href="https://github.com/sddion"
            target="_blank"
            className="font-functional decoration-accent/30 hover:text-accent text-[10px] font-bold tracking-[0.2em] text-white uppercase underline underline-offset-4 transition-colors"
          >
            Sddion
          </Link>
        </div>
      </div>

      {/* Noise Overlay */}
      <div
        className="animate-noise pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'url("/noise.png")' }}
      />
    </footer>
  );
}
