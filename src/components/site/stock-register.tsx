"use client";

/*
 * Stock register with family filter.
 * The family bar adapts Watermelon UI `morphing-discovery-bar`
 * (reference/watermelon/morphing-discovery-bar.tsx): kept the category pills with
 * a sliding active indicator (layoutId) beside a search field; removed the
 * search-morph, blur and spring bounce; rebuilt as an ARIA tablist with arrow
 * keys and square bag-print styling. Rows are ledger lines, not tiles.
 */

import Link from "next/link";
import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Search } from "lucide-react";
import { families, gradeSlug, gradeTitle, searchGrades, type Family, type Grade } from "@/content/catalogue";
import { FamilySwatch } from "./bag-face";

type Tab = Family | "ALL";

export function StockRegister({ grades, initialFamily, initialQuery }: { grades: Grade[]; initialFamily?: Tab; initialQuery?: string }) {
  const [tab, setTab] = useState<Tab>(initialFamily ?? "ALL");
  const [query, setQuery] = useState(initialQuery ?? "");
  const reduce = useReducedMotion();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "ALL", label: "All", count: grades.length },
    ...families.map((f) => ({ id: f.id as Tab, label: f.short, count: grades.filter((g) => g.family === f.id).length })).filter((t) => t.count > 0),
  ];

  const visible = useMemo(() => {
    const byFam = tab === "ALL" ? grades : grades.filter((g) => g.family === tab);
    return searchGrades(query, byFam);
  }, [grades, tab, query]);

  const groups = useMemo(() => {
    const m = new Map<string, Grade[]>();
    for (const g of visible) m.set(g.category, [...(m.get(g.category) ?? []), g]);
    return [...m.entries()];
  }, [visible]);

  function onTabKey(e: KeyboardEvent, i: number) {
    let n = i;
    if (e.key === "ArrowRight") n = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = tabs.length - 1;
    else return;
    e.preventDefault();
    setTab(tabs[n].id);
    tabRefs.current[n]?.focus();
  }

  return (
    <div>
      <div className="flex flex-col gap-4 border-y-2 border-ink py-4 lg:flex-row lg:items-center">
        <div className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:px-0">
          <div role="tablist" aria-label="Polymer family" className="flex w-max gap-1">
            {tabs.map((t, i) => {
              const on = tab === t.id;
              return (
                <button
                  key={t.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  type="button"
                  aria-selected={on}
                  aria-controls="register-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setTab(t.id)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className={`relative flex min-h-11 items-center gap-2 px-3 font-semibold ${on ? "text-on-print" : "hover:bg-sack-2"}`}
                >
                  {on && (
                    <motion.span
                      layoutId="family-pill"
                      className="absolute inset-0 -z-0 bg-print"
                      transition={reduce ? { duration: 0 } : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                  <span className="relative">{t.label}</span>
                  <span className={`relative text-xs ${on ? "" : "text-ink-2"}`}>{t.count}</span>
                </button>
              );
            })}
          </div>
        </div>
        <label className="flex h-12 min-w-0 flex-1 items-center gap-3 border-2 border-ink bg-sack px-3 focus-within:outline focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-print lg:max-w-sm lg:ms-auto">
          <Search aria-hidden className="size-4 shrink-0 text-ink-2" />
          <span className="sr-only">Search grades</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Code, producer, process"
            className="h-full w-full min-w-0 bg-transparent outline-none placeholder:text-ink-2/70"
          />
        </label>
      </div>

      <div id="register-panel" role="tabpanel" aria-label={`${visible.length} grades`}>
        <p className="mt-4 text-sm text-ink-2" aria-live="polite">
          {visible.length} {visible.length === 1 ? "grade" : "grades"}
        </p>
        {groups.length === 0 ? (
          <p className="mt-8 max-w-lg text-lg">
            Nothing listed for that. <Link href="/contact" className="font-semibold underline underline-offset-4">Ask Arihant</Link> about the grade you need.
          </p>
        ) : (
          groups.map(([cat, list]) => (
            <section key={cat} className="mt-8">
              <h2 className="t-h3 border-b-2 border-ink pb-2">{cat}</h2>
              <ul>
                {list.map((g) => {
                  const slug = gradeSlug(g);
                  return (
                    <li key={slug} className="grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-1 border-b border-seam py-3 md:grid-cols-[auto_9rem_10rem_1fr_7rem_auto]">
                      {g.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={g.images[0].src} alt="" width={56} height={56} loading="lazy" className="row-span-3 size-14 border border-seam object-cover md:row-span-1" />
                      ) : (
                        <span className="row-span-3 flex size-14 items-center justify-center border border-seam md:row-span-1">
                          <FamilySwatch family={g.family} />
                        </span>
                      )}
                      <Link href={`/products/${slug}`} className="t-code text-2xl text-print hover:underline md:text-[1.7rem]">
                        {gradeTitle(g)}
                      </Link>
                      <span className="col-start-2 font-semibold md:col-start-auto">{g.producer ?? "Generic"}</span>
                      <span className="col-start-2 text-sm text-ink-2 md:col-start-auto md:text-base">
                        {g.type} · {g.process}
                      </span>
                      <span className="hidden text-sm text-ink-2 md:block">{g.mfi ? `MFI ${g.mfi}` : ""}</span>
                      <Link
                        href={`/contact?grade=${slug}`}
                        className="col-start-3 row-span-3 row-start-1 inline-flex min-h-11 items-center border-2 border-ink px-3 text-sm font-semibold hover:bg-ink hover:text-sack md:col-start-auto md:row-span-1 md:row-start-auto"
                      >
                        Rate
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
