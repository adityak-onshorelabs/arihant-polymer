"use client";

/*
 * Page-to-page loader: "the next sample".
 * Clicking an internal link raises a pouch-film panel from the bottom (its
 * heat-seal ribs leading), a small sample pouch sits in the middle, one rubine
 * pellet drops in and the label names where you're going. Once the new route
 * has rendered the panel lifts away upward.
 *
 * Only transforms are animated (GPU-composited), so it costs nothing while
 * scrolling. Links that only change the query (filters), hash links, new-tab
 * clicks, downloads and external links are left alone. Off under reduced motion.
 */

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { grades, gradeTitle } from "@/content/catalogue";
import { MOTION_OK, gsap } from "@/lib/gsap";
import { GranuleSvg, packPellets } from "../granules";

const W = 160;
const H = 200;
const pellets = packPellets({ width: W, height: H, size: 9, fill: 0.62, mound: 0.1, seed: 64 });

function labelFor(pathname: string) {
  if (pathname === "/") return "Home";
  const grade = pathname.match(/^\/products\/(.+)$/);
  if (grade) {
    const g = grades.find((x) => x.slug === grade[1]);
    return g ? gradeTitle(g) : "Grade";
  }
  const map: Record<string, string> = { "/products": "Products", "/about": "About", "/reviews": "Reviews", "/contact": "Enquiry", "/demo": "Platform demo" };
  return map[pathname] ?? "Arihant Polymer";
}

export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const pellet = useRef<HTMLSpanElement>(null);
  const covering = useRef(false);
  const fallback = useRef<number | undefined>(undefined);

  // Reveal once the new route has rendered.
  useEffect(() => {
    if (!covering.current) return;
    const el = panel.current!;
    window.clearTimeout(fallback.current);
    const raf = requestAnimationFrame(() => {
      gsap.to(el, {
        yPercent: -100,
        duration: 0.7,
        delay: 0.12,
        ease: "power3.inOut",
        onComplete: () => {
          covering.current = false;
          gsap.set(el, { yPercent: 100, visibility: "hidden" });
        },
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  // Intercept internal link clicks and cover first.
  useEffect(() => {
    const el = panel.current!;
    gsap.set(el, { y: 0, yPercent: 100, visibility: "hidden" });
    if (!window.matchMedia(MOTION_OK).matches) return;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // same page: hash or filter change
      if (covering.current) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      covering.current = true;
      label.current!.textContent = labelFor(url.pathname);
      const href = url.pathname + url.search + url.hash;
      router.prefetch(href);

      gsap.killTweensOf([el, pellet.current]);
      gsap.set(el, { visibility: "visible", yPercent: 100 });
      gsap
        .timeline()
        .to(el, { yPercent: 0, duration: 0.6, ease: "power3.inOut" })
        .fromTo(pellet.current, { y: -70, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, ease: "power2.in" }, 0.25)
        .add(() => {
          // The new page's CSS entrances wait for the panel to lift (see `.is-entering` in globals.css).
          const d = document.documentElement;
          d.classList.add("is-entering");
          window.setTimeout(() => d.classList.remove("is-entering"), 3600);
          router.push(href, { scroll: false });
          // Never leave the panel up if a navigation stalls.
          fallback.current = window.setTimeout(() => {
            if (!covering.current) return;
            gsap.to(el, { yPercent: -100, duration: 0.6, ease: "power3.inOut", onComplete: () => void (covering.current = false) });
          }, 6000);
        }, 0.62);
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.clearTimeout(fallback.current);
    };
  }, [router]);

  return (
    <div ref={panel} className="page-cover" aria-hidden>
      <div className="seal" />
      <div className="flex flex-1 flex-col items-center justify-center gap-5">
        <div className="pouch w-24">
          <div className="seal !h-2.5" />
          <div className="pouch-window relative aspect-[4/5]">
            <GranuleSvg id="page-cover" pellets={pellets} width={W} height={H} look="milky" className="absolute inset-0 size-full" />
            <span ref={pellet} className="page-cover-dose" />
          </div>
        </div>
        <p className="sticker flex items-center gap-2 px-3.5 py-1.5">
          <span className="pellet" />
          <span ref={label} className="d-code text-[1.05rem]">
            Arihant Polymer
          </span>
        </p>
      </div>
    </div>
  );
}
