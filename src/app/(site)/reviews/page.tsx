import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { company, reviews } from "@/content/site";
import { SettleWords } from "@/components/site/rise";
import { Settle } from "@/components/site/motion/effects";
import { PourOnView } from "@/components/site/motion/pour-on-view";
import { Pouch } from "@/components/site/pouch";
import { GranuleSvg, packPellets } from "@/components/site/granules";
import { DoseBand } from "@/components/site/dose-band";
import { btnOnDose, btnOnDoseSecondary } from "@/components/site/ui";

export const metadata: Metadata = {
  title: "Reviews",
  description: `${company.name} is rated ${reviews.average} out of 5 by ${reviews.count} buyers on ${reviews.source}.`,
  alternates: { canonical: "/reviews" },
};

/** Each pellet in a rating strip stands for 5% of ratings. */
const SLOTS = 20;

export default function ReviewsPage() {
  const states = new Map<string, number>();
  for (const r of reviews.recent) {
    const st = r.city.split(", ")[1];
    states.set(st, (states.get(st) ?? 0) + 1);
  }
  const byState = [...states.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  return (
    <>
      <div className="frame pt-16 md:pt-24">
        <p className="eyebrow settle">Reviews</p>
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
          <h1 className="d-h1 lg:col-span-7">
            <SettleWords text="Rated by buyers across India." delay={0.1} />
          </h1>
          <p className="lead settle lg:col-span-4 lg:col-start-9" style={{ "--d": "0.6s" } as React.CSSProperties}>
            Ratings left on {company.name}&apos;s {reviews.source} listing. The listing shows names, cities and ratings, not written comments.
          </p>
        </div>
      </div>

      {/* Score and distribution, in pellets */}
      <section className="frame section grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16" aria-labelledby="score-title">
        <div className="settle lg:col-span-5" style={{ "--d": "0.5s" } as React.CSSProperties}>
          <div className="sticker overflow-hidden">
            <div className="px-6 pb-6 pt-6 md:px-8 md:pt-8">
              <h2 id="score-title" className="meta">
                Average rating on {reviews.source}
              </h2>
              <p className="mt-3 flex items-baseline gap-2">
                <span className="d-code text-[clamp(4.5rem,9vw,6.5rem)] leading-[0.9]">{reviews.average}</span>
                <span className="text-xl text-graphite-2">/ 5</span>
              </p>
              <p className="mt-2 text-graphite-2">from {reviews.count} buyers</p>
            </div>
            <ul className="border-t border-dashed border-seal px-6 py-5 md:px-8" aria-label="Rating distribution">
              {reviews.distribution.map((d) => {
                const filled = Math.round(d.pct / (100 / SLOTS));
                return (
                  <li key={d.stars} className="grid grid-cols-[3.25rem_minmax(0,1fr)_2.75rem] items-center gap-3 py-1.5 text-sm">
                    <span className="text-graphite-2">{d.stars} star</span>
                    <span className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${SLOTS}, minmax(0, 1fr))` }} aria-hidden>
                      {Array.from({ length: SLOTS }, (_, k) => (
                        <span key={k} className={`aspect-[1.3] -rotate-12 rounded-[50%] ${k < filled ? (d.stars === 5 ? "bg-dose" : "bg-graphite") : "bg-film-2"}`} />
                      ))}
                    </span>
                    <span className="text-end font-medium tabular-nums">{d.pct}%</span>
                  </li>
                );
              })}
            </ul>
            <p className="border-t border-seal px-6 py-2.5 text-[0.72rem] text-graphite-2 md:px-8">Each pellet is 5% of ratings.</p>
          </div>
        </div>

        <div className="min-w-0 lg:col-span-7">
          <Settle stagger className="max-w-xl">
            <p className="eyebrow">Buyer satisfaction</p>
            <h2 className="d-h2 mt-5">How full each pouch is, is how many buyers were satisfied.</h2>
          </Settle>
          <PourOnView className="mt-10 grid grid-cols-3 gap-3 sm:gap-5">
            {reviews.satisfaction.map((s, i) => {
              const W = 200;
              const H = 260;
              const pellets = packPellets({ width: W, height: H, size: 9, fill: s.pct / 100, mound: 0.04, seed: 41 + i * 13 });
              return (
                <figure key={s.label}>
                  <Pouch windowClassName="aspect-[200/260]">
                    <GranuleSvg id={`sat-${i}`} pellets={pellets} width={W} height={H} look="milky" pour delay={i * 0.25} dose={[4]} className="absolute inset-0 size-full" />
                    <span aria-hidden className="absolute inset-x-0 border-t border-dashed border-graphite/30" style={{ top: `${100 - s.pct}%` }} />
                  </Pouch>
                  <figcaption className="mt-3">
                    <span className="d-code block text-[clamp(1.6rem,3.4vw,2.4rem)] leading-none">{s.pct}%</span>
                    <span className="meta mt-1 block">{s.label}</span>
                  </figcaption>
                </figure>
              );
            })}
          </PourOnView>
        </div>
      </section>

      {/* Where the buyers are */}
      <section className="border-y border-seal bg-film/60" aria-labelledby="where-title">
        <div className="frame grid grid-cols-1 gap-8 py-14 md:py-20 lg:grid-cols-12 lg:gap-16">
          <Settle stagger className="lg:col-span-4">
            <p className="eyebrow">Where recent buyers are</p>
            <h2 id="where-title" className="d-h2 mt-5">
              {byState.length} states in the last {reviews.recent.length} ratings.
            </h2>
          </Settle>
          <Settle stagger as="ul" className="flex flex-wrap content-start gap-2 lg:col-span-8">
            {byState.map(([st, n]) => (
              <li key={st} className="sticker inline-flex min-h-11 items-center gap-2.5 px-4">
                <span>{st}</span>
                <span className="d-code text-graphite-2">{n}</span>
              </li>
            ))}
          </Settle>
        </div>
      </section>

      {/* The ledger */}
      <section className="frame section" aria-labelledby="recent-title">
        <div className="flex flex-wrap items-baseline justify-between gap-4 pb-6">
          <h2 id="recent-title" className="d-h2">
            Recent ratings
          </h2>
          <p className="meta">
            Showing {reviews.recent.length} of {reviews.count}, as published on {reviews.source}.
          </p>
        </div>
        <div className="hidden grid-cols-[7.5rem_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1.4fr)_3.5rem] gap-4 border-y border-seal py-3 text-[0.8rem] font-medium text-graphite-2 md:grid">
          <span>Date</span>
          <span>Buyer</span>
          <span>City</span>
          <span>Bought</span>
          <span className="text-end">Rating</span>
        </div>
        <Settle stagger as="ul" className="border-t border-seal md:border-t-0">
          {reviews.recent.map((r) => (
            <li
              key={r.name + r.date}
              className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-0.5 border-b border-seal py-4 md:grid-cols-[7.5rem_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1.4fr)_3.5rem] md:items-baseline"
            >
              <span className="order-2 text-end text-sm tabular-nums text-graphite-2 md:order-none md:text-start">{r.date}</span>
              <span className="order-1 font-medium md:order-none">{r.name}</span>
              <span className="order-3 text-graphite-2 md:order-none">{r.city}</span>
              <span className="order-5 col-span-2 text-sm text-graphite-2 md:order-none md:col-span-1 md:text-base md:text-graphite">{r.product}</span>
              <span className="order-4 text-end text-sm md:order-none" aria-label="5 out of 5">
                5 / 5
              </span>
            </li>
          ))}
        </Settle>
      </section>

      <section className="frame pb-[clamp(4.5rem,10vw,8rem)]" aria-labelledby="cta-title">
        <DoseBand>
          <div className="flex flex-col gap-8 px-6 pb-10 pt-12 md:flex-row md:items-end md:justify-between md:px-12 md:pb-14 md:pt-16">
            <h2 id="cta-title" className="d-h1 max-w-[14ch]">
              Buy from the same godown.
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className={btnOnDose}>
                Send an enquiry
                <ArrowRight aria-hidden className="size-4 rtl:-scale-x-100" />
              </Link>
              <a href={`tel:${company.phone.tel}`} className={btnOnDoseSecondary}>
                <Phone aria-hidden className="size-4" />
                {company.phone.display}
              </a>
            </div>
          </div>
        </DoseBand>
      </section>
    </>
  );
}
