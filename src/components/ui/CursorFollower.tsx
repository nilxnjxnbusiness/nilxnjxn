"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { MusicNote01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";

export function CursorFollower() {
  const followerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [activeText, setActiveText] = useState("");

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 1024) return;

    const follower = followerRef.current;
    const ring = ringRef.current;
    if (!follower || !ring) return;

    // Movement with different durations for "Elastic" feel
    const xTo = gsap.quickTo(follower, "x", { duration: 0.1, ease: "none" });
    const yTo = gsap.quickTo(follower, "y", { duration: 0.1, ease: "none" });
    
    const xRingTo = gsap.quickTo(ring, "x", { duration: 0.3, ease: "power3.out" });
    const yRingTo = gsap.quickTo(ring, "y", { duration: 0.3, ease: "power3.out" });

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      xRingTo(e.clientX);
      yRingTo(e.clientY);

      // Simple detection for Interactive elements
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('button, a, .track-card-trigger');
      const isPlayable = target.closest('.play-trigger');
      
      if (isPlayable) {
        setIsHovering(true);
        setActiveText("PLAY");
      } else if (isInteractive) {
        setIsHovering(true);
        setActiveText("");
      } else {
        setIsHovering(false);
        setActiveText("");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-9999 hidden lg:block overflow-hidden transition-opacity duration-500">
      {/* Center Icon (The Note) */}
      <div 
        ref={followerRef}
        className="absolute top-0 left-0 -ml-2 -mt-2 text-accent"
      >
        <HugeiconsIcon icon={MusicNote01Icon} size={16} />
      </div>
      
      {/* Outer Ring */}
      <div 
        ref={ringRef}
        className={cn(
          "absolute top-0 left-0 -ml-8 -mt-8 rounded-full border border-accent/20 transition-all duration-300 ease-out flex items-center justify-center",
          isHovering ? "w-10 h-10 bg-accent/5 border-accent/40 scale-125" : "w-10 h-10 bg-transparent"
        )}
      >
        <span className={cn(
          "text-[9px] font-bold tracking-tighter text-accent transition-opacity duration-300",
          activeText ? "opacity-100" : "opacity-0"
        )}>
          {activeText}
        </span>
      </div>
    </div>
  );
}
