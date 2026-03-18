import { useRef, useLayoutEffect } from "react";
import { Track } from "@/lib/data";
import { useAudioStore } from "@/store/audioStore";
import { PlayIcon, PauseIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { gsap } from "gsap";

interface TrackCardProps {
  track: Track;
}

export function TrackCard({ track }: TrackCardProps) {
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = useAudioStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const isCurrent = currentTrack?.id === track.id;
  const isActive = isCurrent && isPlaying;

  useLayoutEffect(() => {
    if (!cardRef.current || !priceRef.current) return;

    const price = priceRef.current;
    
    const ctx = gsap.context(() => {
      // Magnetic effect for price tag within card
      const xTo = gsap.quickTo(price, "x", { duration: 0.6, ease: "power3" });
      const yTo = gsap.quickTo(price, "y", { duration: 0.6, ease: "power3" });

      const onMouseMove = (e: MouseEvent) => {
        const { left, top, width, height } = cardRef.current!.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const moveX = (e.clientX - centerX) * 0.15;
        const moveY = (e.clientY - centerY) * 0.15;
        xTo(moveX);
        yTo(moveY);
      };

      const onMouseLeave = () => {
        xTo(0);
        yTo(0);
      };

      cardRef.current?.addEventListener("mousemove", onMouseMove);
      cardRef.current?.addEventListener("mouseleave", onMouseLeave);
      
      return () => {
        cardRef.current?.removeEventListener("mousemove", onMouseMove);
        cardRef.current?.removeEventListener("mouseleave", onMouseLeave);
      };
    }, cardRef);

    return () => ctx.revert();
  }, []);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlayPause();
    } else {
      playTrack(track);
    }
  };

  return (
    <CardContainer containerClassName="py-4 px-2" className="group">
      <div ref={cardRef}>
        <CardBody className="relative bg-white/5 border border-white/10 w-72 h-auto rounded-[20px] p-4 group-hover:bg-white/8 transition-all duration-500 overflow-hidden">
          {/* Glass Shine Effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
          
          {/* Cover Art Image */}
          <CardItem
            translateZ="60"
            className="w-full aspect-square rounded-[16px] overflow-hidden relative mb-4"
          >
            <img 
              src={track.coverUrl} 
              alt={track.title}
              className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
              loading="lazy"
            />
            
            {/* Audio Interaction Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-xs">
              <button 
                onClick={handlePlayClick}
                className="w-16 h-16 bg-white text-black rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-300 active:scale-95"
              >
                <HugeiconsIcon icon={isActive ? PauseIcon : PlayIcon} size={24} color="currentColor" />
              </button>
            </div>

            {/* Price Tag Overlay - Upgraded */}
            <CardItem
              as="div"
              translateZ="80"
              className="absolute top-3 right-3 z-20"
            >
              <div 
                ref={priceRef}
                className="bg-black/80 backdrop-blur-lg px-4 py-1.5 rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center gap-1.5"
              >
                <div className="w-1 h-1 bg-accent rounded-full animate-pulse" />
                <span className="text-[10px] font-functional font-bold text-white tracking-[0.2em] uppercase">
                  {track.price}
                </span>
              </div>
            </CardItem>
          </CardItem>

          {/* Metadata */}
          <div className="space-y-1">
            <CardItem
              translateZ="40"
              className="text-white font-functional font-medium truncate text-sm"
            >
              {track.title}
            </CardItem>
            <CardItem
              translateZ="20"
              className="text-muted-foreground font-functional text-[10px] uppercase tracking-[0.2em] font-light italic truncate"
            >
              {track.artist}
            </CardItem>
          </div>
        </CardBody>
      </div>
    </CardContainer>
  );
}
