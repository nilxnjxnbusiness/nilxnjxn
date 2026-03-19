'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative"
      >
        {/* Shutter: Top Overlay */}
        <motion.div
          variants={{
            initial: { scaleY: 1 },
            animate: { scaleY: 0, transition: { duration: 0.8, ease: [0.83, 0, 0.17, 1] } },
            exit: { scaleY: 1, transition: { duration: 0.6, ease: [0.83, 0, 0.17, 1] } },
          }}
          style={{ originY: 0 }}
          className="pointer-events-none fixed inset-0 z-100 bg-black"
        />

        {/* Shutter: Bottom Overlay */}
        <motion.div
          variants={{
            initial: { scaleY: 1 },
            animate: {
              scaleY: 0,
              transition: { duration: 0.8, ease: [0.83, 0, 0.17, 1], delay: 0.1 },
            },
            exit: { scaleY: 1, transition: { duration: 0.6, ease: [0.83, 0, 0.17, 1] } },
          }}
          style={{ originY: 1 }}
          className="bg-accent/10 pointer-events-none fixed inset-0 z-100 backdrop-blur-xl"
        />

        {/* Content Fade */}
        <motion.div
          variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0, transition: { duration: 1, delay: 0.6, ease: 'easeOut' } },
            exit: { opacity: 0, y: -20, transition: { duration: 0.4, ease: 'easeIn' } },
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
