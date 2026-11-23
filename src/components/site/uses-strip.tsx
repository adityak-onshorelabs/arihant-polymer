"use client";

/*
 * Where the granules go: five processes, each a photo in a pouch window with a
 * label (process, number of listed grades for it). The cards settle in once when
 * the strip reaches view; nothing here is scroll-scrubbed (nested scrubbed
 * transforms on five photos read as lag). On touch it is a swipe strip.
 */

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";
import type { uses as Uses } from "@/content/uses";

export function UsesStrip({ items }: { items: typeof Uses }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-use]", { autoAlpha: 0, y: -18, duration: 1, stagger: 0.08, ease: "expo.out", clearProps: "transform,opacity,visibility", scrollTrigger: { trigger: ref.current, start: "top 88%", once: true } });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref}>
      <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-5 lg:overflow-visible lg:px-0">
        {items.map((u) => (
          <li key={u.id} data-use className="w-[68vw] max-w-[18rem] shrink-0 snap-start lg:w-auto lg:max-w-none">
            <Link href={`/products?q=${u.q}`} className="group block">
              <div className="pouch">
                <div className="seal" aria-hidden />
                <div className="pouch-window relative aspect-[3/4] overflow-hidden">
                  <div className="absolute inset-0">
                    <Image src={u.img} alt={u.alt} fill loading="eager" sizes="(min-width: 1024px) 18rem, 68vw" className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.04]" />
                  </div>
                  <div className="sticker absolute inset-x-3 bottom-3 z-[4] px-3.5 py-2.5">
                    <p className="text-[0.95rem] font-medium leading-snug">{u.label}</p>
                    <p className="mt-0.5 flex items-center justify-between gap-2 text-[0.8rem] text-graphite-2">
                      <span className="tabular-nums">
                        {u.count} listed {u.count === 1 ? "grade" : "grades"}
                      </span>
                      <ArrowUpRight aria-hidden className="size-4 transition-transform duration-500 group-hover:rotate-45 group-hover:text-graphite" />
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
