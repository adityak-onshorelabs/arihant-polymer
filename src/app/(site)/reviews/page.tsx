import type { Metadata } from "next";
import { company, reviews } from "@/content/site";

export const metadata: Metadata = {
  title: "Reviews",
  description: `${company.name} is rated ${reviews.average} out of 5 by ${reviews.count} buyers on ${reviews.source}.`,
  alternates: { canonical: "/reviews" },
};

export default function ReviewsPage() {
  return (
    <div className="frame py-12 md:py-16">
      <p className="t-label text-print">Reviews</p>
      <h1 className="t-display mt-3 text-[clamp(2.8rem,7vw,5.5rem)]">Rated by buyers across India.</h1>
      <p className="t-lead mt-4 max-w-2xl text-ink-2">
        Ratings left by buyers on {company.name}&apos;s {reviews.source} listing. The listing shows names, cities and ratings; it does not include written comments.
      </p>

      <div className="mt-12 grid gap-10 lg:grid-cols-12">
        <section className="lg:col-span-5" aria-labelledby="summary-title">
          <h2 id="summary-title" className="sr-only">
            Summary
          </h2>
          <p>
            <span className="t-code text-8xl text-print">{reviews.average}</span>
            <span className="t-h3 ms-2 text-ink-2">/ 5</span>
          </p>
          <p className="font-semibold">from {reviews.count} buyers on {reviews.source}</p>
          <ul className="mt-6 space-y-2" aria-label="Rating distribution">
            {reviews.distribution.map((d) => (
              <li key={d.stars} className="grid grid-cols-[3.5rem_1fr_3rem] items-center gap-3">
                <span className="font-semibold">{d.stars} star</span>
                <span className="h-3 bg-sack-3" aria-hidden>
                  <span className="block h-full bg-print" style={{ width: `${d.pct}%` }} />
                </span>
                <span className="text-end text-ink-2">{d.pct}%</span>
              </li>
            ))}
          </ul>
          <h3 className="t-h3 mt-10">Buyer satisfaction</h3>
          <dl className="mt-3 grid grid-cols-3 border-t-2 border-ink">
            {reviews.satisfaction.map((s) => (
              <div key={s.label} className="border-b border-seam py-3">
                <dt className="text-ink-2">{s.label}</dt>
                <dd className="t-code text-4xl">{s.pct}%</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="lg:col-span-7" aria-labelledby="recent-title">
          <h2 id="recent-title" className="t-h3 border-b-2 border-ink pb-2">
            Recent ratings
          </h2>
          <ul>
            {reviews.recent.map((r) => (
              <li key={r.name + r.date} className="grid grid-cols-[1fr_auto] gap-x-4 border-b border-seam py-3">
                <span className="font-semibold">{r.name}</span>
                <span className="text-end text-sm text-ink-2">{r.date}</span>
                <span className="text-ink-2">{r.city}</span>
                <span className="text-end font-semibold text-print" aria-label="5 out of 5">
                  5 / 5
                </span>
                <span className="col-span-2 text-sm text-ink-2">Bought: {r.product}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-ink-2">Showing 20 of {reviews.count} ratings, as published on {reviews.source}.</p>
        </section>
      </div>
    </div>
  );
}
