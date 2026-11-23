"use client";

/*
 * Polymer families as rows, each carrying a strip of that family's granules.
 * Adapted from Watermelon UI `card-split-accordian`
 * (reference: registry.watermelon.sh/r/card-split-accordian.json): kept the idea
 * that the open row splits away from its neighbours; rebuilt as a disclosure
 * list (button + region), expanding with grid-template-rows instead of height,
 * and the open row becomes a sealed pouch panel.
 */

import Link from "next/link";
import { useId, useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import type { GranuleLook } from "@/content/catalogue";
import { cn } from "@/lib/utils";
import { GranuleSvg, stripPellets } from "./granules";

export interface FamilyRow {
  id: string;
  short: string;
  label: string;
  count: number;
  look: GranuleLook;
  producers: { name: string; count: number }[];
  top: { slug: string; code: string; producer: string }[];
}

export function FamilyRows({ rows }: { rows: FamilyRow[] }) {
  const [open, setOpen] = useState<string | null>(rows[0]?.id ?? null);
  const id = useId();
  return (
    <ul className="border-t border-seal">
      {rows.map((r, i) => {
        const on = open === r.id;
        const pellets = stripPellets({ width: 260, height: 44, size: r.look === "powder" ? 5 : 6.5, density: 0.5, seed: i * 97 + 13 });
        return (
          <li
            key={r.id}
            className={cn(
              "transition-[background-color,border-color,box-shadow,border-radius] duration-500",
              on ? "pouch my-3 border-seal" : "border-b border-seal",
            )}
          >
            {on && <div className="seal" aria-hidden />}
            <h3>
              <button
                type="button"
                aria-expanded={on}
                aria-controls={`${id}-${r.id}`}
                onClick={() => setOpen(on ? null : r.id)}
                className="group grid min-h-20 w-full grid-cols-[6.75rem_minmax(0,1fr)_auto] items-center gap-3 px-1 py-4 text-start sm:grid-cols-[8.75rem_minmax(0,1fr)_11rem_auto] sm:gap-4 sm:px-4"
              >
                <span className="d-code whitespace-nowrap text-[1.2rem] leading-none sm:text-[1.65rem]">{r.short}</span>
                <span className="min-w-0">
                  <span className="block truncate text-[1.05rem]">{r.label}</span>
                  <span className="meta block tabular-nums">
                    {r.count} {r.count === 1 ? "grade" : "grades"}
                  </span>
                </span>
                <span className="relative hidden h-11 overflow-hidden rounded-full bg-film-2 sm:block" aria-hidden>
                  <GranuleSvg id={`fr-${r.id}`} pellets={pellets} width={260} height={44} look={r.look} dose={r.look === "dose" ? [] : [7]} className="absolute inset-0 size-full" />
                </span>
                <span
                  className={cn(
                    "flex size-11 items-center justify-center rounded-full border border-rim/50 transition-[transform,background-color,color] duration-500",
                    on ? "rotate-45 bg-graphite text-label" : "group-hover:border-graphite",
                  )}
                  aria-hidden
                >
                  <Plus className="size-4" />
                </span>
              </button>
            </h3>
            <div id={`${id}-${r.id}`} role="region" aria-label={r.label} className="fam-panel" data-open={on || undefined} inert={!on}>
              <div>
                <div className="grid gap-8 px-1 pb-7 pt-1 sm:px-4 md:grid-cols-2">
                  <div>
                    <p className="meta">Grades to start with</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {r.top.map((g) => (
                        <li key={g.slug}>
                          <Link href={`/products/${g.slug}`} className="sticker inline-flex min-h-11 items-center gap-2 px-3.5 transition-transform duration-300 hover:-translate-y-0.5">
                            <span className="d-code text-[1.05rem]">{g.code}</span>
                            <span className="text-xs text-graphite-2">{g.producer}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="meta">Producers</p>
                    <p className="mt-3 leading-relaxed">
                      {r.producers.map((p, k) => (
                        <span key={p.name}>
                          {p.name}
                          <span className="text-graphite-2"> {p.count}</span>
                          {k < r.producers.length - 1 ? <span className="text-graphite-2"> · </span> : null}
                        </span>
                      ))}
                    </p>
                    <Link href={`/products?family=${r.id}`} className="mt-4 inline-flex min-h-11 items-center gap-1.5 font-medium underline decoration-rim/60 underline-offset-[6px] hover:decoration-graphite">
                      All {r.count} {r.short} grades
                      <ArrowRight aria-hidden className="size-4 rtl:-scale-x-100" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
