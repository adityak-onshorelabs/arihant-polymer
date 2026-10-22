"use client";

import Image from "next/image";
import { useState } from "react";
import type { GradeImage } from "@/content/catalogue";

/** Arihant's own photos of the grade: the bag and the granules, shot in the godown. */
export function GradeGallery({ images, title, producer }: { images: GradeImage[]; title: string; producer: string | null }) {
  const [i, setI] = useState(0);
  const img = images[i];
  return (
    <figure>
      <div className="relative aspect-[4/3] overflow-hidden border-2 border-ink bg-sack-2">
        <Image src={img.src} alt={`${title}${producer ? ` ${producer}` : ""}, photo ${i + 1} of ${images.length}, in Arihant's godown`} fill priority sizes="(min-width: 1024px) 55vw, 100vw" className="object-contain" />
      </div>
      {images.length > 1 && (
        <ul className="mt-2 flex gap-2" aria-label="More photos">
          {images.map((m, k) => (
            <li key={m.src}>
              <button type="button" onClick={() => setI(k)} aria-label={`Photo ${k + 1}`} aria-pressed={k === i} className={`relative block size-20 overflow-hidden border-2 ${k === i ? "border-print" : "border-seam hover:border-ink"}`}>
                <Image src={m.src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <figcaption className="mt-2 text-sm text-ink-2">Photos from Arihant&apos;s godown.</figcaption>
    </figure>
  );
}
