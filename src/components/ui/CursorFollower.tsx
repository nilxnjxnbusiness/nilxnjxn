"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function CursorFollower() {
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable on desktop
    if (window.innerWidth < 1024) return;

    const follower = followerRef.current;
    if (!follower) return;

    const xTo = gsap.quickTo(follower, "x", { duration: 0.6, ease: "power3" });
    const yTo = gsap.quickTo(follower, "y", { duration: 0.6, ease: "power3" });

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={followerRef}
      className="fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 rounded-full bg-accent/20 blur-xl pointer-events-none z-9999 mix-blend-screen hidden lg:block"
    />
  );
}
