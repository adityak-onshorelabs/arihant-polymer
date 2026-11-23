"use client";

import { useRef, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/** Sticky header that slides away on scroll down, returns on scroll up, and gains a film background once the page has moved. */
export function HeaderShell({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  useGSAP(
    () => {
      const el = ref.current!;
      const show = gsap.quickTo(el, "yPercent", { duration: 0.5, ease: "power3.out" });
      let wasScrolled = false;
      let hidden = false;
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          if (y > 24 !== wasScrolled) {
            wasScrolled = y > 24;
            setScrolled(wasScrolled);
          }
          const hide = !el.contains(document.activeElement) && self.direction === 1 && y > 160;
          if (hide !== hidden) {
            hidden = hide;
            show(hide ? -100 : 0);
          }
        },
      });
      return () => st.kill();
    },
    { scope: ref },
  );
  return (
    <header
      ref={ref}
      data-scrolled={scrolled || undefined}
      className="sticky top-0 z-40 border-b border-transparent bg-natural transition-[background-color,border-color] duration-500 data-[scrolled]:border-seal data-[scrolled]:bg-film"
    >
      {children}
    </header>
  );
}
