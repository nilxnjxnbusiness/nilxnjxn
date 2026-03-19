import './globals.css';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import { WaveformPlayer } from '@/components/player/WaveformPlayer';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { CursorFollower } from '@/components/ui/CursorFollower';

const functional = Inter({
  subsets: ['latin'],
  variable: '--font-functional',
});

const expressive = localFont({
  src: './fonts/MrsSheppards-Regular.ttf',
  variable: '--font-expressive',
});

const expressiveAlt = localFont({
  src: './fonts/Comforter-Regular.ttf',
  variable: '--font-expressive-alt',
});

export const metadata = {
  metadataBase: new URL('https://nilxnjxn.com'),
  title: {
    default: 'NILXNJXN | Hip-hop Artist from Assam',
    template: '%s | NILXNJXN',
  },
  description:
    'Official platform for Nilxnjxn aka Nila. Upcoming Hip-hop wave from Assam, India. Debut EP SHADES dropping 2026. LIVE FREE, BE YOU.',
  keywords: [
    'Nilxnjxn',
    'Nila',
    'Assam Hip-hop',
    'Indian Rap',
    'SHADES EP',
    'Independent Music',
    'Direct Distribution',
  ],
  authors: [{ name: 'Nilxnjxn' }],
  creator: 'Nilxnjxn',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nilxnjxn.com',
    title: 'NILXNJXN | Hip-hop Artist from Assam',
    description:
      'Official artist platform. Explore the sound of Nila. Debut EP SHADES coming 2026.',
    siteName: 'NILXNJXN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NILXNJXN | Hip-hop Artist from Assam',
    description:
      'Official platform for Nilxnjxn aka Nila. Upcoming Hip-hop wave from Assam, India.',
    creator: '@Realnilxnjxn',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MusicGroup',
  name: 'Nilxnjxn',
  alternateName: 'Nila',
  description:
    'Upcoming Hip-hop Artist from Assam, India specializing in cinematic soundscapes and seasonal mood exploration.',
  url: 'https://nilxnjxn.com',
  logo: 'https://nilxnjxn.com/LOGO-FINAL.png',
  sameAs: [
    'https://instagram.com/nilxnjxn',
    'https://open.spotify.com/artist/5XzmR1SLHQvl8YE5cEyhz4',
    'https://youtube.com/channel/UCztZDitG8Rc7kSjF1Hf1P-Q',
    'https://x.com/Realnilxnjxn',
    'https://www.whatsapp.com/channel/0029VaibEslFCCoXBTMA270I',
  ],
  genre: ['Hip-hop', 'Rap', 'Experimental'],
  knowsAbout: ['Music Production', 'Songwriting', 'Sound Design'],
};

import { PageTransition } from '@/components/layout/PageTransition';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${functional.variable} ${expressive.variable} ${expressiveAlt.variable} dark`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-background text-foreground selection:bg-accent flex min-h-screen flex-col overflow-x-hidden uppercase antialiased selection:text-black">
        <SmoothScroll>
          <Header />
          <PageTransition>
            <main className="min-h-[calc(100vh-80px)] flex-1">{children}</main>
          </PageTransition>
          <Footer />
          <WaveformPlayer />
          <CursorFollower />
        </SmoothScroll>
      </body>
    </html>
  );
}
