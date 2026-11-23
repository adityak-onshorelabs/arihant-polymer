"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { MOTION_OK, gsap, ScrollTrigger } from "@/lib/gsap";

let lenis: Lenis | null = null;

/**
 * Smooth scrolling for the whole site, driven by GSAP's ticker so every
 * ScrollTrigger (settles, the rubine band, the header) reads the same eased
 * scroll position. Sticky elements keep working. Off under reduced motion.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (!window.matchMedia(MOTION_OK).matches) return;
    lenis = new Lenis({ autoRaf: false, lerp: 0.085, anchors: { offset: -96 } });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis?.raf(time * 1000);
    // Lenis first in every tick, so scrubbed animations read this frame's scroll, not the last one's.
    gsap.ticker.add(tick, false, true);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
    ScrollTrigger.refresh();
  }, [pathname]);

  return null;
}

/** Smoothly scroll to an element or offset (falls back to native when Lenis is off). */
export function smoothScrollTo(target: string | HTMLElement | number) {
  if (lenis) lenis.scrollTo(target, { offset: -96 });
  else if (typeof target === "number") window.scrollTo({ top: target });
  else (typeof target === "string" ? document.querySelector(target) : target)?.scrollIntoView();
}
