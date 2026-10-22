import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { grades, producersByCount } from "@/content/catalogue";
import { YEAR, company, photos } from "@/content/site";
import { PlaceholderTag } from "@/components/site/chrome";

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
          <p className="t-lead mt-6 max-w-xl text-ink-2">
            {company.name} is a {company.legal.toLowerCase()} based in Malad West, Mumbai. Since {company.since} it has bought polymer granules from producers and sold them on to manufacturers, wholesalers and traders, from its own warehouse and depot.
          </p>
        </div>
        <div className="relative min-h-72 lg:col-span-5">
          <Image src={photos.pallets.src} alt={photos.pallets.alt} fill priority sizes="(min-width:1024px) 42vw, 100vw" className="object-cover" />
          {photos.pallets.placeholder && <PlaceholderTag />}
        </div>
      </section>

      <section className="frame grid gap-12 py-14 md:py-20 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h2 className="t-h2">What Arihant handles</h2>
          <p className="mt-5 max-w-xl text-lg">
            {grades.length} listed grades of PP, HDPE, LLDPE, LDPE, polystyrene, ABS, PVC, PET, polycarbonate and EVA, for injection moulding, blown and cast film, raffia, blow moulding, pipe, extrusion coating and rotomoulding.
          </p>
          <h3 className="t-h3 mt-10">Producers on the register</h3>
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
          <h2 className="t-h2">Firm details</h2>
          <dl className="mt-5 border-t-2 border-ink">
            {[
              ["Name", company.name],
              ["Constitution", company.legal],
              ["Established", String(company.since)],
              ["Nature of business", company.nature],
              ["Contact", company.contactPerson],
              ["GST", `${company.gst} (registered ${company.gstSince})`],
              ["Payment", company.payment.join(", ")],
              ["Dispatch", company.shipping],
              ["Bank", company.bank],
            ].map(([k, v]) => (
              <div key={k} className="grid gap-1 border-b border-seam py-3 sm:grid-cols-[12rem_1fr]">
                <dt className="text-ink-2">{k}</dt>
                <dd className="font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <address className="mt-8 not-italic">
            <p className="t-label text-ink-2">Godown and office</p>
            {company.address.lines.map((l) => (
              <span key={l} className="block text-lg">
                {l}
              </span>
            ))}
            <a href={company.address.mapsUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-11 items-center font-semibold underline underline-offset-4">
              Open in Google Maps
            </a>
          </address>
        </div>
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
