"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Replaces the browser scrollbar (hidden in globals.css) with a slim graphite
 * pellet on the right edge that shows the page position while scrolling and
 * fades out when the page is still. Decorative: keyboard, wheel and touch
 * scrolling are unchanged.
 */
export function ScrollPellet() {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      const el = ref.current!;
      const setY = gsap.quickSetter(el, "y", "px");
      let idle: number | undefined;
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          setY(self.progress * (window.innerHeight - el.offsetHeight - 12) + 6);
          el.setAttribute("data-on", "");
          window.clearTimeout(idle);
          idle = window.setTimeout(() => el.removeAttribute("data-on"), 900);
        },
      });
      return () => {
        st.kill();
        window.clearTimeout(idle);
      };
    },
    { scope: ref },
  );
  return <span ref={ref} className="scroll-pellet" aria-hidden />;
}
