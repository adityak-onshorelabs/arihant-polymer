"use client";

/*
 * The signature: "grade, then how much".
 * 1. Find a grade: an ARIA combobox (adapted earlier from Watermelon UI
 *    `command-search`: filter-as-you-type with arrow keys; palette, blur and demo
 *    items removed). The chosen grade pours into a sample pouch and its label
 *    presses on.
 * 2. Say how much: tonnes become bags (`QuantityToBags`), then a prefilled enquiry.
 */

import Link from "next/link";
import { useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ArrowRight, Search } from "lucide-react";
import { gradeSlug, gradeTitle, searchGrades, type Grade } from "@/content/catalogue";
import { FamilySwatch } from "./bag-face";
import { GradeSticker, Pouch, PouchFill } from "./pouch";
import { QuantityToBags } from "./quantity";
import { textLink } from "./ui";

const SUGGESTIONS = ["MI3530", "Reliance raffia", "GAIL", "HDPE film", "blow moulding", "PVC"];

export function GradeSample({ grades, initial, heading, intro }: { grades: Grade[]; initial: Grade; heading: ReactNode; intro?: ReactNode }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [picked, setPicked] = useState<Grade>(initial);
  const [pours, setPours] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const listId = `${id}-list`;

  const results = useMemo(() => (query.trim() ? searchGrades(query, grades).slice(0, 8) : []), [query, grades]);
  const showList = open && query.trim().length > 0;

  function pick(g: Grade) {
    setPicked(g);
    setPours((n) => n + 1);
    setOpen(false);
    setQuery(gradeTitle(g));
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      if (showList && results[active]) {
        e.preventDefault();
        pick(results[active]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const slug = gradeSlug(picked);
  const title = gradeTitle(picked);
  const first = pours === 0;

  return (
    <div>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end lg:gap-16">
        <div className="lg:col-span-7">
          {heading}
          {intro}

          <div className="settle mt-10 max-w-xl" style={{ "--d": "0.7s" } as React.CSSProperties}>
            <label htmlFor={`${id}-input`} className="meta">
              Grade code, producer or process
            </label>
            <div className="relative mt-3">
              <div className="flex h-16 items-center gap-3 rounded-2xl border border-rim/70 bg-label px-5 shadow-[0_10px_30px_-18px_oklch(23%_0.018_250/0.35)] transition-colors hover:border-graphite-2 focus-within:border-graphite focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-graphite">
                <Search aria-hidden className="size-5 shrink-0 text-graphite-2" />
                <input
                  ref={inputRef}
                  id={`${id}-input`}
                  type="text"
                  role="combobox"
                  aria-expanded={showList}
                  aria-controls={listId}
                  aria-autocomplete="list"
                  aria-activedescendant={showList && results[active] ? `${id}-opt-${active}` : undefined}
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="e.g. MI3530"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActive(0);
                    setOpen(true);
                  }}
                  onFocus={() => setOpen(true)}
                  onBlur={() => setTimeout(() => setOpen(false), 120)}
                  onKeyDown={onKey}
                  className="h-full w-full bg-transparent text-xl tracking-[-0.01em] outline-none focus-visible:outline-none placeholder:text-graphite-2/60"
                />
              </div>

              {showList && (
                <ul
                  id={listId}
                  role="listbox"
                  data-lenis-prevent
                  aria-label="Matching grades"
                  className="absolute inset-x-0 top-full z-30 mt-2 max-h-96 overflow-y-auto rounded-2xl border border-seal bg-label py-2 shadow-[0_18px_40px_-20px_oklch(23%_0.018_250/0.35)]"
                >
                  {results.length === 0 ? (
                    <li className="px-5 py-4 text-graphite-2" role="option" aria-selected={false} aria-disabled>
                      Not in the listed range. Send an enquiry and ask Arihant about it.
                    </li>
                  ) : (
                    results.map((g, i) => (
                      <li
                        key={gradeSlug(g)}
                        id={`${id}-opt-${i}`}
                        role="option"
                        aria-selected={i === active}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => pick(g)}
                        onMouseEnter={() => setActive(i)}
                        className={`flex min-h-12 cursor-pointer items-center gap-3 px-5 py-2 ${i === active ? "bg-film" : ""}`}
                      >
                        <FamilySwatch family={g.family} />
                        <span className="d-code w-28 shrink-0 text-lg">{gradeTitle(g)}</span>
                        <span className="min-w-0 truncate text-sm text-graphite-2">
                          {g.producer ?? "Generic"} · {g.process}
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>

            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Try">
              {SUGGESTIONS.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery(s);
                      setActive(0);
                      setOpen(true);
                      const hit = searchGrades(s, grades)[0];
                      if (hit) {
                        setPicked(hit);
                        setPours((n) => n + 1);
                      }
                      inputRef.current?.focus();
                    }}
                    className="min-h-11 rounded-full border border-rim/45 px-4 text-sm text-graphite-2 transition-colors hover:border-graphite hover:text-graphite"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-5">
          <Pouch className="mx-auto w-full max-w-[26rem]" windowClassName="aspect-[4/5]" sticker={<GradeSticker key={`s-${slug}-${pours}`} grade={picked} press delay={first ? 1.6 : 0.95} className="absolute inset-x-4 bottom-4 z-[4] sm:inset-x-6 sm:bottom-6" />}>
            <PouchFill key={`f-${slug}-${pours}`} grade={picked} pour delay={first ? 0.35 : 0} fill={0.78} />
          </Pouch>
          <p className="mx-auto mt-3 flex max-w-[26rem] items-center justify-between gap-3 text-sm text-graphite-2" aria-live="polite">
            <span>Drawn sample of {title}</span>
            <Link href={`/products/${slug}`} className={`${textLink} text-sm`}>
              Photos and specs
              <ArrowRight aria-hidden className="size-3.5 rtl:-scale-x-100" />
            </Link>
          </p>
        </div>
      </div>

      <section id="how-much" aria-labelledby={`${id}-how`} className="mt-20 scroll-mt-24 border-t border-seal pt-10 md:mt-28 md:pt-14">
        <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4">
          <h2 id={`${id}-how`} className="d-h2">
            Then, how much?
          </h2>
          <p className="eyebrow">Step 2 of 2 · {title}</p>
        </div>
        <QuantityToBags grade={picked} />
      </section>
    </div>
  );
}
