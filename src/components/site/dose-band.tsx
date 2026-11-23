"use client";

import { useRef, type ReactNode } from "react";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * The concentrated pellet: the one fully rubine band on a page. As it scrolls
 * into view the colour spreads out from a single pellet, the way a masterbatch
 * dose disperses into natural granules. Static (fully coloured) without JS or
 * under reduced motion.
 */
export function DoseBand({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const el = ref.current!;
        const inner = el.querySelector("[data-dose-inner]");
        gsap.fromTo(
          el,
          { clipPath: "ellipse(0.95rem 0.68rem at 3.25rem 3.4rem)" },
          {
            clipPath: "ellipse(230% 230% at 3.25rem 3.4rem)",
            ease: "power2.in",
            scrollTrigger: { trigger: el, start: "top 90%", end: "top 50%", scrub: 0.6 },
          },
        );
        if (inner) {
          gsap.from(inner, {
            autoAlpha: 0,
            y: -14,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 70%", end: "top 50%", scrub: 0.6 },
          });
        }
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={cn("relative overflow-hidden rounded-[1.6rem] bg-dose text-on-dose", className)}>
      <div className="seal seal-on-dose" aria-hidden />
      <div data-dose-inner>{children}</div>
    </div>
  );
}
