"use client";

import Image from "next/image";
import { useRef } from "react";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";

/**
 * A photo that drifts slowly inside its window as the page scrolls, like the
 * view through a pouch shifting in the hand. Place inside a positioned,
 * overflow-hidden frame (a `.pouch-window`). Static under reduced motion.
 * Loaded eagerly: decoding a large photo the moment it scrolls into view
 * stalled a frame mid-scroll.
 */
export function DriftImage({ src, alt, sizes, priority = false, amount = 10, className }: { src: string; alt: string; sizes: string; priority?: boolean; amount?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          ref.current,
          { yPercent: -amount / 2 },
          { yPercent: amount / 2, ease: "none", scrollTrigger: { trigger: ref.current!.parentElement, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className="absolute inset-x-0 -inset-y-[8%] will-change-transform">
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} loading={priority ? undefined : "eager"} className={className ?? "object-cover"} />
    </div>
  );
}
