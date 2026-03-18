import "./globals.css";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { WaveformPlayer } from "@/components/player/WaveformPlayer";

const functional = Inter({
  subsets: ["latin"],
  variable: "--font-functional",
});

const expressive = localFont({
  src: "./fonts/MrsSheppards-Regular.ttf",
  variable: "--font-expressive",
});

const expressiveAlt = localFont({
  src: "./fonts/Comforter-Regular.ttf",
  variable: "--font-expressive-alt",
});

export const metadata = {
  title: "NILXNJXN | Artist Portfolio",
  description: "Official artist digital presence for NILXNJXN.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${functional.variable} ${expressive.variable} ${expressiveAlt.variable} dark`}>
      <body className="antialiased bg-background text-foreground min-h-screen selection:bg-accent selection:text-black">
        {children}
        <WaveformPlayer />
      </body>
    </html>
  );
}
