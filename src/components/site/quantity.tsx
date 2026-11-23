"use client";

/*
 * "How much?": tonnes become bags, one dot per bag, one row per tonne.
 * Adapted from Watermelon UI `scrub-slider` and `stepper`
 * (reference: registry.watermelon.sh/r/scrub-slider.json, stepper.json): kept a
 * scrubbable track and +/- steps; rebuilt on a native range input (keyboard and
 * screen reader support for free) with a number field, a seal-rib track and a
 * rubine pellet thumb. Arithmetic only: bags = tonnes x 1000 / bag weight from
 * the grade's listed packing. Minimum order and delivery come from the listing.
 */

import Link from "next/link";
import { useId, useState } from "react";
import { ArrowRight, Check, Minus, Plus } from "lucide-react";
import { gradeTitle, moqKg, packKg, type Grade } from "@/content/catalogue";
import { terms } from "@/content/site";
import { cn } from "@/lib/utils";
import { btnDose } from "./ui";

const MIN = 0.5;
const MAX = 30;
const STEP = 0.5;
const PRESETS = [1, 5, 10, 20];
const fmt = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });

export function QuantityToBags({ grade, initial = 5, className }: { grade: Grade; initial?: number; className?: string }) {
  const [t, setT] = useState(initial);
  const [text, setText] = useState(String(initial));
  const id = useId();
  const kg = packKg(grade);
  const moq = moqKg(grade);
  const bags = Math.ceil((t * 1000) / kg);
  const perRow = kg === 25 ? 40 : Math.max(1, Math.round(1000 / kg));
  const jumbo = kg > 25;
  const rowsShown = Math.min(Math.ceil(bags / (jumbo ? 10 : perRow)), 12);
  const dotsPerRow = jumbo ? 10 : perRow;
  const shown = Math.min(bags, rowsShown * dotsPerRow);
  const belowMoq = moq !== null && t * 1000 < moq;
  const title = gradeTitle(grade);

  function commit(n: number) {
    const v = Math.min(MAX * 10, Math.max(MIN, Math.round(n / STEP) * STEP));
    setT(v);
    setText(String(v));
  }

  const fill = `${((Math.min(t, MAX) - MIN) / (MAX - MIN)) * 100}%`;

  return (
    <div className={cn("grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12", className)}>
      <div className="lg:col-span-5">
        <label htmlFor={`${id}-t`} className="meta">
          Quantity of {title}, in tonnes
        </label>
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => commit(t - STEP)}
            disabled={t <= MIN}
            className="flex size-12 shrink-0 items-center justify-center rounded-full border border-rim/60 text-graphite transition-colors hover:border-graphite disabled:opacity-40"
          >
            <Minus aria-hidden className="size-4" />
            <span className="sr-only">Half a tonne less</span>
          </button>
          <div className="flex h-14 min-w-0 flex-1 items-center rounded-2xl border border-rim/70 bg-label px-4 focus-within:border-graphite focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-graphite">
            <input
              id={`${id}-t`}
              inputMode="decimal"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                const n = Number(e.target.value);
                if (Number.isFinite(n) && n >= MIN) setT(Math.min(MAX * 10, n));
              }}
              onBlur={() => commit(Number(text) || MIN)}
              className="d-code h-full w-full min-w-0 bg-transparent text-[1.75rem] outline-none focus-visible:outline-none"
            />
            <span className="text-graphite-2">tonnes</span>
          </div>
          <button
            type="button"
            onClick={() => commit(t + STEP)}
            className="flex size-12 shrink-0 items-center justify-center rounded-full border border-rim/60 text-graphite transition-colors hover:border-graphite"
          >
            <Plus aria-hidden className="size-4" />
            <span className="sr-only">Half a tonne more</span>
          </button>
        </div>
        <input
          type="range"
          min={MIN}
          max={MAX}
          step={STEP}
          value={Math.min(t, MAX)}
          onChange={(e) => commit(Number(e.target.value))}
          aria-label="Quantity in tonnes"
          aria-valuetext={`${fmt.format(t)} tonnes, ${bags} bags`}
          className="qty-range mt-4"
          style={{ "--fill": fill } as React.CSSProperties}
        />
        <ul className="mt-1 flex flex-wrap gap-2" aria-label="Common quantities">
          {PRESETS.map((p) => (
            <li key={p}>
              <button
                type="button"
                aria-pressed={t === p}
                onClick={() => commit(p)}
                className={cn(
                  "min-h-11 rounded-full border px-4 text-sm font-medium tabular-nums transition-colors",
                  t === p ? "border-graphite bg-graphite text-label" : "border-rim/50 text-graphite-2 hover:border-graphite hover:text-graphite",
                )}
              >
                {p} t
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="min-w-0 lg:col-span-7">
        <p className="flex flex-wrap items-baseline gap-x-3" aria-live="polite">
          <span className="d-code text-[clamp(3rem,7vw,4.75rem)] leading-none">{fmt.format(bags)}</span>
          <span className="text-lg text-graphite-2">
            {bags === 1 ? "bag" : "bags"} of {kg} kg
          </span>
        </p>

        <div className="mt-6 space-y-1.5" aria-hidden>
          {Array.from({ length: rowsShown }, (_, r) => {
            const start = r * dotsPerRow;
            const inRow = Math.max(0, Math.min(dotsPerRow, shown - start));
            return (
              <div key={r} className="grid grid-cols-[2.75rem_minmax(0,1fr)] items-center gap-3">
                <span className="text-end text-[0.72rem] tabular-nums text-graphite-2">{jumbo ? `${fmt.format(((r + 1) * dotsPerRow * kg) / 1000)} t` : `${r + 1} t`}</span>
                <span className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${dotsPerRow}, minmax(0, 1fr))` }}>
                  {Array.from({ length: dotsPerRow }, (_, k) => (
                    <span
                      key={k}
                      className={cn("bag-dot transition-[opacity,scale] duration-500", jumbo && "is-jumbo", k < inRow ? "opacity-100" : "scale-50 opacity-0")}
                      style={{ transitionDelay: k < inRow ? `${Math.min(k, 40) * 6}ms` : "0ms" }}
                    />
                  ))}
                </span>
              </div>
            );
          })}
        </div>
        <p className="meta mt-3">
          One dot per {kg} kg bag{jumbo ? "" : ", one row per tonne"}.
          {bags > shown ? ` Showing the first ${rowsShown} rows of ${fmt.format(bags)} bags.` : ""}
        </p>

        <ul className="mt-6 flex flex-col gap-x-8 gap-y-2 border-t border-seal pt-5 text-[0.95rem] xl:flex-row">
          <li className={cn("flex items-start gap-2", belowMoq && "text-dose-deep")}>
            {belowMoq ? <span className="pellet mt-1.5" aria-hidden /> : <Check aria-hidden className="mt-0.5 size-4 shrink-0" />}
            <span>{moq ? (belowMoq ? `Below the listed minimum order of ${fmt.format(moq)} kg` : `Above the listed minimum order of ${fmt.format(moq)} kg`) : `Minimum order: ask Arihant (usually ${terms.moq})`}</span>
          </li>
          <li className="flex items-start gap-2">
            <Check aria-hidden className="mt-0.5 size-4 shrink-0" />
            <span>Listed delivery: {grade.delivery ?? terms.delivery}</span>
          </li>
        </ul>

        <Link href={`/contact?grade=${grade.slug}&qty=${t}&unit=tonnes`} className={cn(btnDose, "mt-7")}>
          Send this enquiry: {fmt.format(t)} t of {title}
          <ArrowRight aria-hidden className="size-4 rtl:-scale-x-100" />
        </Link>
        <p className="meta mt-3">Arihant confirms the rate and dispatch date when you enquire.</p>
      </div>
    </div>
  );
}
