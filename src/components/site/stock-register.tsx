"use client";

/*
 * Stock register with family filter: "the sample shelf".
 * The family bar adapts Watermelon UI `morphing-discovery-bar`
 * (reference/watermelon/morphing-discovery-bar.tsx): kept the category tabs beside a
 * search field; rebuilt as an ARIA tablist with arrow keys where each tab is a small
 * sample pouch of that family's granules. Rows are ledger lines, not tiles; on hover
 * a film band slides in behind the row, like light passing across a pouch.
 */

import Link from "next/link";
import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Search } from "lucide-react";
import { families, familyLook, gradeSlug, gradeTitle, searchGrades, type Family, type Grade } from "@/content/catalogue";
import { MiniPouch } from "./pouch";
import { FamilySwatch } from "./bag-face";
import { EASE, MOTION_OK, gsap, useGSAP } from "@/lib/gsap";

type Tab = Family | "ALL";

export function StockRegister({ grades, initialFamily, initialQuery }: { grades: Grade[]; initialFamily?: Tab; initialQuery?: string }) {
  const [tab, setTab] = useState<Tab>(initialFamily ?? "ALL");
  const [query, setQuery] = useState(initialQuery ?? "");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panel = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const rows = gsap.utils.toArray<HTMLElement>(".reg-row", panel.current).slice(0, 14);
        gsap.from(rows, { autoAlpha: 0, y: -12, duration: 0.8, stagger: 0.035, ease: EASE, clearProps: "transform,opacity,visibility" });
      });
    },
    { dependencies: [tab], scope: panel },
  );

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
      <div className="flex flex-col gap-6">
        <div className="-mx-4 overflow-x-auto px-4 pb-2 pt-1" data-lenis-prevent>
          <div role="tablist" aria-label="Polymer family" className="flex w-max gap-3 xl:grid xl:w-full xl:grid-cols-10">
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
                  className="group w-[6.5rem] shrink-0 text-start sm:w-[7.25rem] xl:w-auto"
                >
                  <MiniPouch
                    id={`tab-${t.id}`}
                    look={t.id === "ALL" ? "milky" : familyLook[t.id]}
                    seed={i * 31 + 5}
                    fill={0.35 + Math.min(0.5, t.count / 140)}
                    className={`transition-[translate,border-color,box-shadow] duration-500 ${on ? "-translate-y-1 !border-graphite shadow-[0_14px_28px_-18px_oklch(23%_0.018_250/0.55)]" : "group-hover:-translate-y-0.5"}`}
                  />
                  <span className={`mt-2 flex items-baseline justify-between gap-2 rounded-md px-2 py-1 transition-colors ${on ? "bg-graphite text-label" : "text-graphite"}`}>
                    <span className="d-code text-[0.95rem]">{t.label}</span>
                    <span className={`text-xs tabular-nums ${on ? "text-label/70" : "text-graphite-2"}`}>{t.count}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <label className="flex h-12 w-full min-w-0 shrink-0 items-center gap-3 rounded-full border border-rim/60 bg-label px-4 transition-colors hover:border-graphite-2 focus-within:border-graphite focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-graphite sm:max-w-md">
          <Search aria-hidden className="size-4 shrink-0 text-graphite-2" />
          <span className="sr-only">Search grades</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search grades"
            className="h-full w-full min-w-0 bg-transparent outline-none focus-visible:outline-none placeholder:text-graphite-2/70"
          />
        </label>
      </div>

      <div ref={panel} id="register-panel" role="tabpanel" aria-label={`${visible.length} grades`}>
        <p className="meta mt-8" aria-live="polite">
          {visible.length} {visible.length === 1 ? "grade" : "grades"}
        </p>
        {groups.length === 0 ? (
          <p className="mt-10 max-w-lg text-lg text-graphite-2">
            Nothing listed for that.{" "}
            <Link href="/contact" className="font-medium text-graphite underline decoration-rim/60 underline-offset-[6px] hover:decoration-graphite">
              Ask Arihant
            </Link>{" "}
            about the grade you need.
          </p>
        ) : (
          groups.map(([cat, list]) => (
            <section key={cat} className="mt-14">
              <h2 className="d-h3 flex items-baseline justify-between gap-4 pb-4">
                {cat}
                <span className="meta tabular-nums">{list.length}</span>
              </h2>
              <ul className="border-t border-seal">
                {list.map((g) => {
                  const slug = gradeSlug(g);
                  return (
                    <li
                      key={slug}
                      className="reg-row group relative isolate grid grid-cols-[auto_1fr_auto] before:absolute before:-inset-x-3 before:inset-y-0 before:-z-10 before:origin-left before:scale-x-0 before:rounded-lg before:bg-film before:transition-transform before:duration-500 before:ease-[cubic-bezier(0.19,1,0.22,1)] hover:before:scale-x-100 items-center gap-x-5 gap-y-0.5 border-b border-seal py-4 md:grid-cols-[auto_9rem_10rem_1fr_6rem_auto]"
                    >
                      {g.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={g.images[0].src} alt="" width={56} height={56} loading="lazy" className="row-span-3 size-14 rounded-[0.3rem_0.3rem_0.75rem_0.75rem] border border-seal bg-film object-cover transition-transform duration-500 group-hover:-translate-y-0.5 md:row-span-1" />
                      ) : (
                        <span className="row-span-3 flex size-14 items-center justify-center rounded-[0.3rem_0.3rem_0.75rem_0.75rem] border border-seal bg-film md:row-span-1">
                          <FamilySwatch family={g.family} />
                        </span>
                      )}
                      <Link href={`/products/${slug}`} className="d-code text-xl transition-transform duration-500 after:absolute after:inset-0 after:content-[''] group-hover:translate-x-1.5 md:text-[1.35rem]">
                        {gradeTitle(g)}
                      </Link>
                      <span className="col-start-2 md:col-start-auto">{g.producer ?? "Generic"}</span>
                      <span className="col-start-2 text-sm text-graphite-2 md:col-start-auto md:text-base">
                        {g.type} · {g.process}
                      </span>
                      <span className="hidden text-sm text-graphite-2 md:block">{g.mfi ? `MFI ${g.mfi}` : ""}</span>
                      <Link
                        href={`/contact?grade=${slug}`}
                        className="relative z-10 col-start-3 row-span-3 row-start-1 inline-flex min-h-11 items-center rounded-full border border-rim/60 px-4 text-sm font-medium transition-colors hover:border-graphite hover:bg-graphite hover:text-label md:col-start-auto md:row-span-1 md:row-start-auto"
                      >
                        Enquire
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
