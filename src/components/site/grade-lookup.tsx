"use client";

/*
 * Grade lookup, the site's signature interaction.
 * Adapted from Watermelon UI `command-search` (reference/watermelon/command-search.tsx):
 * kept the filter-as-you-type list with arrow-key navigation; removed the
 * floating palette, layoutId morph, backdrop blur and demo items; rebuilt as an
 * ARIA combobox + listbox that prints the chosen grade as a bag face and hands
 * it to the rate request.
 */

import Link from "next/link";
import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Phone, Search } from "lucide-react";
import { gradeSlug, gradeTitle, searchGrades, type Grade } from "@/content/catalogue";
import { company } from "@/content/site";
import { BagFace, FamilySwatch } from "./bag-face";

const SUGGESTIONS = ["MI3530", "Reliance raffia", "GAIL", "HDPE film", "blow moulding", "PVC"];

export function GradeLookup({ grades, initial }: { grades: Grade[]; initial: Grade }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [picked, setPicked] = useState<Grade>(initial);
  const inputRef = useRef<HTMLInputElement>(null);
  const reduce = useReducedMotion();
  const id = useId();
  const listId = `${id}-list`;

  const results = useMemo(() => (query.trim() ? searchGrades(query, grades).slice(0, 8) : []), [query, grades]);
  const showList = open && query.trim().length > 0;

  function pick(g: Grade) {
    setPicked(g);
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

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-5">
        <label htmlFor={`${id}-input`} className="t-label text-ink-2">
          Grade code, producer or process
        </label>
        <div className="relative mt-2">
          <div className="flex h-16 items-center gap-3 border-2 border-ink bg-sack px-4 focus-within:outline focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-print">
            <Search aria-hidden className="size-5 shrink-0 text-ink-2" />
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
              className="h-full w-full bg-transparent text-xl font-semibold uppercase tracking-wide outline-none placeholder:normal-case placeholder:font-normal placeholder:tracking-normal placeholder:text-ink-2/70"
            />
          </div>

          {showList && (
            <ul
              id={listId}
              role="listbox"
              aria-label="Matching grades"
              className="absolute inset-x-0 top-full z-30 max-h-96 overflow-y-auto border-2 border-t-0 border-ink bg-sack"
            >
              {results.length === 0 ? (
                <li className="px-4 py-4 text-ink-2" role="option" aria-selected={false} aria-disabled>
                  Not in the listed range. Send a rate request and ask Arihant about it.
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
                    className={`flex min-h-12 cursor-pointer items-center gap-3 border-b border-seam px-4 py-2 last:border-b-0 ${
                      i === active ? "bg-print-tint" : ""
                    }`}
                  >
                    <FamilySwatch family={g.family} />
                    <span className="t-code w-28 shrink-0 text-xl text-print">{gradeTitle(g)}</span>
                    <span className="min-w-0 truncate text-sm">
                      <span className="font-semibold">{g.producer ?? "Generic"}</span>
                      <span className="text-ink-2"> · {g.process}</span>
                    </span>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        <p className="mt-4 text-sm text-ink-2">Try:</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => {
                  setQuery(s);
                  setActive(0);
                  setOpen(true);
                  const first = searchGrades(s, grades)[0];
                  if (first) setPicked(first);
                  inputRef.current?.focus();
                }}
                className="min-h-11 border border-ink px-3 text-sm font-semibold hover:bg-ink hover:text-sack"
              >
                {s}
              </button>
            </li>
          ))}
        </ul>

        <p className="mt-8 max-w-md text-ink-2">
          {grades.length} grades listed from {new Set(grades.map((g) => g.producer).filter(Boolean)).size} producers. Not on the list? Ask Arihant about it.
        </p>
      </div>

      <div className="lg:col-span-7">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slug}
            initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <BagFace grade={picked} size="lg" />
          </motion.div>
        </AnimatePresence>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/contact?grade=${slug}`}
            className="inline-flex min-h-13 flex-1 items-center justify-between gap-3 bg-print px-5 font-semibold text-on-print hover:bg-print-deep"
          >
            Request a rate for {title}
            <ArrowRight aria-hidden className="size-5 rtl:-scale-x-100" />
          </Link>
          <a
            href={`tel:${company.phone.tel}`}
            className="inline-flex min-h-13 items-center justify-center gap-2 border-2 border-ink px-5 font-semibold hover:bg-ink hover:text-sack"
          >
            <Phone aria-hidden className="size-4" />
            {company.phone.display}
          </a>
        </div>
        <Link href={`/products/${slug}`} className="mt-3 inline-block text-sm font-semibold underline underline-offset-4">
          Grade details
        </Link>
      </div>
    </div>
  );
}
