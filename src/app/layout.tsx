import './globals.css';


import { Inter, Rock_Salt } from 'next/font/google';

import { WaveformPlayer } from '@/components/player/WaveformPlayer';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { CursorFollower } from '@/components/ui/CursorFollower';
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { GoogleAnalytics } from '@/components/Analytics';
import { Toaster } from 'sonner';

const functional = Inter({
  subsets: ['latin'],
  variable: '--font-functional',
});

const expressive = Rock_Salt({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-expressive',
});

const expressiveAlt = Rock_Salt({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-expressive-alt',
});

export const metadata = {
  metadataBase: new URL('https://nilxnjxn.com'),
  title: {
    default: 'NILXNJXN | Hip-hop Artist from Assam',
    template: '%s | NILXNJXN',
  },
  description:
    'Official platform for Nilxnjxn aka Nila. Hip-hop wave from Assam, India. Debut Album SHADES — Out Now. LIVE FREE, BE YOU.',
  keywords: [
    'Nilxnjxn',
    'Nila',
    'Assam Hip-hop',
    'Indian Rap',
    'SHADES Album',
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
      'Official artist platform. Explore the sound of Nila. Debut Album SHADES — Out Now.',
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
  icons: {
    icon: '/favicons/favicon.ico',
    shortcut: '/favicons/android-icon-192x192.png',
    apple: '/favicons/apple-icon-180x180.png',
    other: [
      {
        rel: 'icon',
        url: '/favicons/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        rel: 'icon',
        url: '/favicons/favicon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        rel: 'apple-touch-icon',
        url: '/favicons/apple-icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
      },
      {
        rel: 'apple-touch-icon',
        url: '/favicons/apple-icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
      },
    ],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MusicGroup',
  name: 'Nilxnjxn',
  alternateName: 'Nila',
  description:
    'Hip-hop Artist from Assam, India specializing in cinematic soundscapes and seasonal mood exploration.',
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

import Script from 'next/script';
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
          <GoogleAnalytics />
          <Analytics />
          <SpeedInsights />
          <WaveformPlayer />
          <CursorFollower />
        </SmoothScroll>
        <Toaster position="top-right" theme="dark" />

        {/* Chatbase AI Chatbot */}
        <Script id="chatbase-init" strategy="afterInteractive">
          {`(function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="${process.env.NEXT_PUBLIC_nilxnjxn_CHATBOT_ID}";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();`}
        </Script>
      </body>
    </html>
  );
}
