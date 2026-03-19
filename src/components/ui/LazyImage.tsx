'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from './Skeleton';
import Image from 'next/image';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}

export function LazyImage({ src, alt, className, aspectRatio = 'aspect-square' }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // We already have onLoad on the Image component below,
    // but we use this effect to ensure states are reset when src changes.
    // Resetting in cleanup avoids the "cascading renders" lint error
    // because it doesn't happen during the synchronous mount/update phase of the effect.
    return () => {
      setIsLoaded(false);
      setError(false);
    };
  }, [src]);

  return (
    <div className={cn('relative overflow-hidden', aspectRatio, className)}>
      {!isLoaded && !error && <Skeleton className="absolute inset-0 z-10" />}

      <Image
        src={src}
        alt={alt}
        fill
        className={cn(
          'object-cover transition-all duration-1000 ease-out',
          isLoaded
            ? 'blur-0 scale-100 opacity-100 grayscale-0'
            : 'scale-110 opacity-0 blur-xl grayscale-100',
        )}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        loading="lazy"
      />

      {error && (
        <div className="font-functional absolute inset-0 flex items-center justify-center bg-white/5 text-[10px] tracking-widest text-white/20 uppercase">
          Media Offline
        </div>
      )}
    </div>
  );
}
