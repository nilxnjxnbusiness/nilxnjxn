'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Magnetic } from '@/components/ui/Magnetic';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Music', href: '/music' },
  { name: 'About', href: '/about' },
];

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // The mobile menu is now closed directly in the link click handlers
  // to avoid synchronous setState updates within an effect.

  return (
    <>
      <header
        className={cn(
          'fixed top-0 right-0 left-0 z-50 px-6 transition-all duration-500',
          isScrolled ? 'py-4' : 'py-8',
        )}
      >
        <div
          className={cn(
            'mx-auto flex max-w-7xl items-center justify-between rounded-full px-6 transition-all duration-500',
            isScrolled
              ? 'border border-white/10 bg-black/40 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-2xl'
              : 'bg-transparent py-0',
          )}
        >
          {/* Logo */}
          <Magnetic strength={0.1}>
            <Link href="/" className="group flex items-center gap-4">
              <Image
                src="/LOGO-FINAL.png"
                alt="Logo"
                width={48}
                height={48}
                className="h-10 w-auto transition-transform duration-500 group-hover:scale-105 md:h-12"
              />
              <span className="font-expressive mt-1 hidden text-xs tracking-[0.3em] text-white sm:block md:text-sm">
                nilxnjxn
              </span>
            </Link>
          </Magnetic>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Magnetic key={link.href} strength={0.2}>
                <Link
                  href={link.href}
                  className="font-functional relative px-1 py-2 text-xs tracking-widest uppercase transition-colors hover:text-white"
                >
                  <span
                    className={cn(
                      'transition-colors',
                      pathname === link.href ? 'text-white' : 'text-muted-foreground',
                    )}
                  >
                    {link.name}
                  </span>
                  {pathname === link.href && (
                    <motion.div
                      layoutId="nav-underline"
                      className="bg-accent absolute right-0 -bottom-1 left-0 h-px"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              </Magnetic>
            ))}
            <Magnetic strength={0.3}>
              <Link
                href="/store"
                className="rounded-full bg-white px-6 py-2 text-[10px] font-bold tracking-widest text-black uppercase shadow-lg shadow-white/10 transition-all hover:scale-105 active:scale-95"
              >
                Store
              </Link>
            </Magnetic>
          </nav>

          {/* Mobile Menu Toggle */}
          <button className="p-2 text-white md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
            <HugeiconsIcon icon={Menu01Icon} size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80"
          >
            <button
              className="absolute top-8 right-8 p-2 text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <HugeiconsIcon icon={Cancel01Icon} size={32} />
            </button>

            <nav className="flex flex-col items-center gap-12">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'font-expressive text-4xl transition-colors',
                    pathname === link.href ? 'text-accent' : 'text-white/60 hover:text-white',
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/store"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-8 rounded-full bg-white px-12 py-4 text-sm font-bold tracking-widest text-black uppercase shadow-2xl"
              >
                Store
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
