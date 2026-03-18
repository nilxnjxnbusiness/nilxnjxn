import { InstagramIcon, SpotifyIcon, YoutubeIcon, TwitterIcon, WhatsappIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Magnetic } from "@/components/ui/Magnetic";
import Link from "next/link";

const socialLinks = [
  { name: "Instagram", icon: InstagramIcon, href: "https://instagram.com/nilxnjxn" },
  { name: "Spotify", icon: SpotifyIcon, href: "https://open.spotify.com/artist/5XzmR1SLHQvl8YE5cEyhz4" },
  { name: "YouTube", icon: YoutubeIcon, href: "https://youtube.com/channel/UCztZDitG8Rc7kSjF1Hf1P-Q" },
  { name: "X", icon: TwitterIcon, href: "https://x.com/Realnilxnjxn" },
  { name: "WhatsApp", icon: WhatsappIcon, href: "https://www.whatsapp.com/channel/0029VaibEslFCCoXBTMA270I" },
];

const quickLinks = [
  { name: "Music", href: "/music" },
  { name: "About", href: "/about" },
  { name: "Store", href: "/store" },
  { name: "Licensing", href: "/licensing" },
];

const legalLinks = [
  { name: "Terms of Service", href: "/terms" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Refund Policy", href: "/refunds" },
];

export function Footer() {
  return (
    <footer className="relative bg-background pt-24 pb-12 px-6 border-t border-white/5 selection:bg-accent selection:text-black mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24 uppercase">
        {/* Brand Column */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/LOGO-FINAL.png" alt="Logo" className="h-10 w-auto opacity-80 group-hover:opacity-100 transition-opacity" />
            <span className="text-2xl font-expressive text-white tracking-widest mt-1">nilxnjxn</span>
          </Link>
          <p className="text-muted-foreground font-functional text-sm leading-relaxed font-light max-w-xs lowercase">
            Upcoming Hip-hop Artist from Assam, India. "LIVE FREE, BE YOU". 
            Catchy Hooks & Slick Bars — delivering a New Wave to the rap scene.
          </p>
          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <Magnetic key={social.name} strength={0.2}>
                <a 
                  href={social.href} 
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:text-accent hover:border-accent/30 transition-all text-muted-foreground"
                  aria-label={social.name}
                >
                  <HugeiconsIcon icon={social.icon} size={18} />
                </a>
              </Magnetic>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <h4 className="text-white text-xs uppercase tracking-[0.2em] font-medium">Navigation</h4>
          <ul className="space-y-4">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="text-muted-foreground hover:text-accent transition-colors font-functional text-sm font-light">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal Links */}
        <div className="space-y-6">
          <h4 className="text-white text-xs uppercase tracking-[0.2em] font-medium">Transparency</h4>
          <ul className="space-y-4">
            {legalLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="text-muted-foreground hover:text-accent transition-colors font-functional text-sm font-light">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact/Newsletter */}
        <div className="space-y-6">
          <h4 className="text-white text-xs uppercase tracking-[0.2em] font-medium">Stay Connected</h4>
          <p className="text-muted-foreground text-sm font-functional font-light">
            Receive updates on secret releases and private events.
          </p>
          <div className="relative group">
            <input 
              type="email" 
              placeholder="Email address"
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-6 text-xs font-functional text-white focus:outline-hidden focus:ring-1 focus:ring-accent/50 transition-all"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-black px-4 py-1.5 rounded-full text-[9px] uppercase font-bold tracking-widest hover:scale-105 transition-all">
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-white/5">
            <div className="flex flex-col items-center md:items-start gap-1">
              <p className="text-[10px] uppercase tracking-[0.4em] font-medium text-white/40">
                &copy; 2026 NILXNJXN — All Rights Reserved
              </p>
              <div className="flex items-center gap-4 text-[9px] uppercase tracking-widest font-bold text-muted-foreground">
                <Link href="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
                <div className="w-1 h-1 bg-white/10 rounded-full" />
                <Link href="/terms" className="hover:text-accent transition-colors">Terms</Link>
                <div className="w-1 h-1 bg-white/10 rounded-full" />
                <button className="hover:text-accent transition-colors">Licensing</button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] font-functional text-muted-foreground">Made with ❤️ by</span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-functional text-white font-bold underline decoration-accent/30 underline-offset-4">Sddon</span>
            </div>
          </div>

      {/* Noise Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] animate-noise" style={{ backgroundImage: 'url("/noise.png")' }} />
    </footer>
  );
}
