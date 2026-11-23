"use client";

import { useRef } from "react";
import { EASE, MOTION_OK, gsap, useGSAP } from "@/lib/gsap";

let firstLoad = true;

/** Every page settles in on navigation (not on the first load, which has its own CSS entrance): a short drop and fade, the site's one page transition. */
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (firstLoad) {
        firstLoad = false;
        return;
      }
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(ref.current, { autoAlpha: 0, y: -10, duration: 0.7, ease: EASE, clearProps: "transform,opacity,visibility" });
      });
    },
    { scope: ref },
  );
  return <div ref={ref}>{children}</div>;
}
