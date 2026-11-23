"use client";

import { useRef, type ReactNode } from "react";
import { EASE, MOTION_OK, gsap, useGSAP } from "@/lib/gsap";

/**
 * Settles into place on first view: content drops a few pixels from above and
 * comes to rest, the way granules settle in a pouch. With `stagger`, the direct
 * children settle one after another.
 */
export function Settle({
  children,
  className,
  stagger = false,
  delay = 0,
  y = 16,
  as: Tag = "div",
  id,
}: {
  children: ReactNode;
  className?: string;
  stagger?: boolean;
  delay?: number;
  y?: number;
  as?: "div" | "ul" | "ol" | "section" | "dl";
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const el = ref.current!;
        const targets = stagger ? Array.from(el.children) : el;
        gsap.from(targets, {
          autoAlpha: 0,
          y: -y,
          duration: 1,
          delay,
          stagger: stagger ? 0.06 : 0,
          ease: EASE,
          clearProps: "transform,opacity,visibility",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });
    },
    { scope: ref },
  );
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} id={id} className={className}>
      {children}
    </Tag>
  );
}
