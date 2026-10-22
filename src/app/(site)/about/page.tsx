import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { categories, grades, producersByCount } from "@/content/catalogue";
import { YEAR, about, company, photos, terms } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: `${company.name} is a ${company.legal.toLowerCase()} trading and distributing polymer granules from Malad West, Mumbai, since ${company.since}.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const years = YEAR - company.since;
  return (
    <>
      <section className="grid border-b-2 border-ink lg:grid-cols-12">
        <div className="frame py-12 md:py-16 lg:col-span-7 lg:mx-0 lg:max-w-none lg:ps-[max(2rem,calc((100vw-80rem)/2+2rem))]">
          <p className="t-label text-print">About</p>
          <h1 className="t-display mt-3 text-[clamp(2.8rem,7vw,5.5rem)]">{years} years in the polymer trade.</h1>
          <div className="t-lead mt-6 max-w-xl space-y-4 text-ink-2">
            {about.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <div className="relative min-h-80 lg:col-span-5">
          <Image src={photos.godown.src} alt={photos.godown.alt} fill priority sizes="(min-width:1024px) 42vw, 100vw" className="object-cover" />
          <span className="absolute bottom-3 start-3 bg-ink/80 px-2 py-1 text-xs font-semibold text-sack">The godown, Malad</span>
        </div>
      </section>

      <section className="frame grid gap-12 py-14 md:py-20 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h2 className="t-h2">What Arihant handles</h2>
          <p className="mt-5 max-w-xl text-lg">
            {grades.length} listed grades across {categories.length} categories: PP, HDPE, LLDPE, LDPE, polystyrene, ABS, PVC, PET, polycarbonate and EVA, for injection moulding, film, raffia, blow moulding, pipe, extrusion coating and rotomoulding.
          </p>
          <dl className="mt-6 grid grid-cols-3 border-y-2 border-ink">
            {[
              ["Minimum order", terms.moq],
              ["Usual pack", "25 kg bag"],
              ["Delivery", terms.delivery],
            ].map(([k, v]) => (
              <div key={k} className="border-e border-seam py-3 pe-3 last:border-e-0 [&:not(:first-child)]:ps-3">
                <dt className="t-label text-ink-2">{k}</dt>
                <dd className="mt-1 font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <h3 className="t-h3 mt-10">Trading brands</h3>
          <p className="mt-2 text-lg">{about.brands.join(", ")} and more.</p>
          <h3 className="t-h3 mt-8">Producers on the register</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {producersByCount.map((p) => (
              <li key={p.name}>
                <Link href={`/products?producer=${encodeURIComponent(p.name)}`} className="inline-flex min-h-11 items-center gap-2 border border-ink px-3 font-semibold hover:bg-ink hover:text-sack">
                  {p.name}
                  <span className="text-sm font-normal opacity-70">{p.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-6">
          <h2 className="t-h2">Why buyers stay</h2>
          <ul className="mt-5 border-t-2 border-ink">
            {about.whyUs.map((w) => (
              <li key={w} className="flex items-center gap-3 border-b border-seam py-3 text-lg font-semibold">
                <Check aria-hidden className="size-5 text-print" />
                {w}
              </li>
            ))}
          </ul>
          <h3 className="t-h3 mt-10">The team</h3>
          <p className="mt-2 text-ink-2">{about.teamNote}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {about.team.map((t) => (
              <li key={t} className="bg-sack-2 px-3 py-1.5 font-semibold">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y-2 border-ink" aria-labelledby="place-title">
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[28rem]">
            <Image src={photos.office.src} alt={photos.office.alt} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="relative aspect-[3/4] sm:aspect-auto">
              <Image src={photos.building.src} alt={photos.building.alt} fill sizes="(min-width:768px) 25vw, 50vw" className="object-cover" />
            </div>
            <div className="frame flex flex-col justify-center py-8 sm:px-6">
              <h2 id="place-title" className="t-h3">Office and godown</h2>
              <address className="mt-3 not-italic">
                {company.address.lines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </address>
              <a href={company.address.mapsUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-11 items-center font-semibold underline underline-offset-4">
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="frame py-14 md:py-20">
        <h2 className="t-h2">Firm details</h2>
        <dl className="mt-5 grid border-t-2 border-ink md:grid-cols-2 md:gap-x-12">
          {[
            ["Name", company.name],
            ["Constitution", company.legal],
            ["Established", String(company.since)],
            ["Nature of business", company.nature],
            ["Also", about.additional.join(", ")],
            ["Contact", company.contactPerson],
            ["GST", `${company.gst} (registered ${company.gstSince})`],
            ["Team size", about.employees],
            ["Payment", company.payment.join(", ")],
            ["Dispatch", company.shipping],
            ["Bank", company.bank],
          ].map(([k, v]) => (
            <div key={k} className="grid gap-1 border-b border-seam py-3 sm:grid-cols-[11rem_1fr]">
              <dt className="text-ink-2">{k}</dt>
              <dd className="font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="weave border-t-2 border-ink">
        <div className="frame flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center">
          <p className="t-h3 max-w-xl">Know the grade you need?</p>
          <Link href="/contact" className="inline-flex min-h-13 items-center gap-4 bg-print px-5 font-semibold text-on-print hover:bg-print-deep">
            Request a rate
            <ArrowRight aria-hidden className="size-5 rtl:-scale-x-100" />
          </Link>
        </div>
      </section>
    </>
  );
}
