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
  priority?: boolean;
}

export function LazyImage({
  src,
  alt,
  className,
  aspectRatio = 'aspect-square',
  priority = false,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Reset state when src changes
    setIsLoaded(false);
    setError(false);
  }, [src]);

  return (
    <div className={cn('relative overflow-hidden bg-white/5', aspectRatio, className)}>
      {!isLoaded && !error && <Skeleton className="absolute inset-0 z-10" />}

      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className={cn(
          'object-cover transition-all duration-1000 ease-out',
          isLoaded
            ? 'blur-0 scale-100 opacity-100 grayscale-0'
            : 'scale-110 opacity-0 blur-xl grayscale-100',
        )}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        loading={priority ? 'eager' : 'lazy'}
      />

      {error && (
        <div className="font-functional absolute inset-0 flex items-center justify-center bg-white/5 text-[10px] tracking-widest text-white/20 uppercase">
          Media Offline
        </div>
      )}
    </div>
  );
}
