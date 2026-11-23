"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Holds any pour (`.drop-layer`) and press-on animations inside it until the block scrolls into view. */
export function PourOnView({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`${on ? "" : "pour-wait"} ${className ?? ""}`}>
      {children}
    </div>
  );
}
