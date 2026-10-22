import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { families, grades, producersByCount } from "@/content/catalogue";
import { YEAR, company, photos, reviews, reviewStates, terms } from "@/content/site";
import { GradeLookup } from "@/components/site/grade-lookup";
import { FamilySwatch } from "@/components/site/bag-face";
import { SectionHead } from "@/components/site/section-head";
import { Reveal } from "@/components/site/reveal";

const featured = grades.find((g) => g.code === "MI3530")!;
const showcase = ["mi3530-reliance", "f52h04-opal", "t50a010a-gail", "f0120l-hmel"]
  .map((s) => grades.find((g) => g.slug === s))
  .filter((g): g is (typeof grades)[number] => Boolean(g && g.images.length));

export default function HomePage() {
  const famCounts = families
    .map((f) => ({ ...f, count: grades.filter((g) => g.family === f.id).length }))
    .filter((f) => f.count > 0);

  return (
    <>
      {/* Hero: committed vermilion slab + stacked sacks */}
      <section className="grid lg:grid-cols-12" aria-labelledby="hero-title">
        <div className="weave-print relative flex flex-col justify-between px-4 pb-10 pt-12 text-on-print md:px-8 lg:col-span-7 lg:px-12 lg:pb-14 lg:pt-20">
          <div>
            <p className="t-label">Stockist and distributor · {company.address.short} · Since {company.since}</p>
            <h1 id="hero-title" className="t-display mt-5">
              PP. HDPE.
              <br />
              LLDPE.
              <br />
              And the rest.
            </h1>
            <p className="t-lead mt-6 max-w-xl">
              Polymer granules from Reliance, GAIL, IOCL, HMEL, OPaL, Borouge and more, traded out of Malad West for {YEAR - company.since} years. Minimum order {terms.moq}, delivery in {terms.delivery}.
            </p>
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href="#lookup" className="inline-flex min-h-13 items-center justify-between gap-6 bg-sack px-5 font-semibold text-print hover:bg-sack-2">
              Find your grade
              <ArrowRight aria-hidden className="size-5 rotate-90" />
            </a>
            <a href={`tel:${company.phone.tel}`} className="inline-flex min-h-13 items-center justify-center gap-2 border-2 border-on-print px-5 font-semibold hover:bg-on-print hover:text-print">
              <Phone aria-hidden className="size-4" />
              {company.phone.display}
            </a>
          </div>
        </div>
        <div className="relative min-h-72 lg:col-span-5 lg:min-h-0">
          <Image src={photos.godown.src} alt={photos.godown.alt} fill priority sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" />
          <span className="absolute bottom-3 start-3 bg-ink/80 px-2 py-1 text-xs font-semibold text-sack">Arihant&apos;s godown, Malad</span>
        </div>
      </section>

      {/* Producer ribbon */}
      <div className="border-y-2 border-ink bg-sack-2">
        <div className="frame flex flex-wrap items-center gap-x-6 gap-y-1 py-3">
          <span className="t-label text-ink-2">On the register</span>
          {producersByCount.slice(0, 9).map((p) => (
            <span key={p.name} className="t-h3 text-[1.25rem]">
              {p.name}
            </span>
          ))}
        </div>
      </div>

      {/* Signature: grade lookup */}
      <section id="lookup" tabIndex={-1} className="frame scroll-mt-20 py-16 outline-none md:py-24" aria-labelledby="lookup-title">
        <SectionHead no="01" label="Grade lookup" title={<span id="lookup-title">Have a grade code? Start there.</span>}>
          Type a code, a producer or a process. The grade prints below, ready to send for a rate.
        </SectionHead>
        <div className="mt-10">
          <GradeLookup grades={grades} initial={featured} />
        </div>
      </section>

      <hr className="seam frame" />

      {/* Register by family */}
      <section className="frame grid gap-10 py-16 md:py-24 lg:grid-cols-12" aria-labelledby="register-title">
        <div className="lg:col-span-5">
          <SectionHead no="02" label="Stock register" title={<span id="register-title">{grades.length} grades across {famCounts.length} polymer families.</span>}>
            Commodity grades for moulding, film, raffia, blow moulding and pipe, plus styrenics, PVC, PET and engineering resins.
          </SectionHead>
          <ul className="mt-10 grid grid-cols-2 gap-2">
            {showcase.map((g) => (
              <li key={g.slug}>
                <Link href={`/products/${g.slug}`} className="group block">
                  <span className="relative block aspect-square overflow-hidden border border-seam bg-sack-2">
                    <Image src={g.images[0].src} alt={`${g.code} ${g.producer} bag in Arihant's godown`} fill sizes="(min-width: 1024px) 18vw, 45vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  </span>
                  <span className="t-code mt-1 block text-xl text-print">{g.code}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-ink-2">Photos from Arihant&apos;s godown.</p>
        </div>
        <Reveal className="lg:col-span-7">
          <ul className="border-t-2 border-ink">
            {famCounts.map((f) => (
              <li key={f.id} className="border-b border-seam">
                <Link href={`/products?family=${f.id}`} className="group flex min-h-16 items-center gap-4 py-3 hover:bg-sack-2">
                  <FamilySwatch family={f.id} className="size-4" />
                  <span className="t-h3 w-28 shrink-0 text-[1.4rem]">{f.short}</span>
                  <span className="min-w-0 flex-1 text-ink-2">{f.label}</span>
                  <span className="t-code text-3xl text-print">{String(f.count).padStart(2, "0")}</span>
                  <ArrowRight aria-hidden className="size-5 shrink-0 opacity-40 group-hover:opacity-100 rtl:-scale-x-100" />
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/products" className="mt-6 inline-flex min-h-13 items-center gap-3 border-2 border-ink px-5 font-semibold hover:bg-ink hover:text-sack">
            Open the full register
            <ArrowRight aria-hidden className="size-5 rtl:-scale-x-100" />
          </Link>
        </Reveal>
      </section>

      {/* How buying works */}
      <section className="weave border-y-2 border-ink" aria-labelledby="how-title">
        <div className="frame py-16 md:py-24">
          <SectionHead no="03" label="How a rate works" title={<span id="how-title">Three lines and it moves.</span>} />
          <ol className="mt-10 grid border-t-2 border-ink md:grid-cols-3">
            {[
              ["Send the grade", "Grade code or producer, quantity in bags or tonnes, and your delivery point."],
              ["Get the rate", "Arihant confirms the rate and when the material can leave the godown."],
              ["Dispatch by road", `Payment by ${company.payment.join(", ").toLowerCase().replace(/, ([^,]*)$/, " or $1")}.`],
            ].map(([t, d], i) => (
              <li key={t} className="border-b border-seam py-6 md:border-b-0 md:border-e md:px-6 md:first:ps-0 md:last:border-e-0">
                <span className="t-code text-5xl text-print">{i + 1}</span>
                <h3 className="t-h3 mt-3">{t}</h3>
                <p className="mt-2 max-w-xs text-ink-2">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Manifest + reviews */}
      <section className="frame grid gap-12 py-16 md:py-24 lg:grid-cols-12" aria-labelledby="who-title">
        <div className="lg:col-span-7">
          <SectionHead no="04" label="The firm" title={<span id="who-title">A Malad partnership, trading granules since {company.since}.</span>} />
          <dl className="mt-8 grid grid-cols-2 border-t-2 border-ink sm:grid-cols-3">
            {[
              ["Established", String(company.since)],
              ["Constitution", company.legal],
              ["Business", "Trader, distributor"],
              ["Facility", "Warehouse and depot"],
              ["Minimum order", terms.moq],
              ["Delivery", terms.delivery],
            ].map(([k, v]) => (
              <div key={k} className="border-b border-seam py-4 pe-4">
                <dt className="t-label text-ink-2">{k}</dt>
                <dd className="mt-1 break-words text-lg font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <Link href="/about" className="mt-6 inline-block font-semibold underline underline-offset-4">
            About Arihant
          </Link>
        </div>
        <Reveal className="lg:col-span-5">
          <div className="border-2 border-ink p-6">
            <p className="t-label text-ink-2">Buyer ratings on {reviews.source}</p>
            <p className="mt-3">
              <span className="t-code text-7xl text-print">{reviews.average}</span>
              <span className="t-h3 ms-2 text-ink-2">/ 5</span>
            </p>
            <p className="mt-1 font-semibold">from {reviews.count} buyers</p>
            <p className="mt-5 text-ink-2">Recent buyers in {reviewStates.slice(0, -1).join(", ")} and {reviewStates.at(-1)}.</p>
            <Link href="/reviews" className="mt-5 inline-block font-semibold underline underline-offset-4">
              Read the ratings
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Closing CTA */}
      <section className="relative isolate overflow-hidden border-t-2 border-ink" aria-labelledby="cta-title">
        <Image src={photos.office.src} alt="" fill sizes="100vw" className="-z-10 object-cover" />
        <div className="absolute inset-0 -z-10 bg-ink/80" aria-hidden />
        <div className="frame py-20 text-sack md:py-28">
          <h2 id="cta-title" className="t-h2 max-w-3xl">Tell us the grade and the quantity. We&apos;ll come back with a rate.</h2>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="inline-flex min-h-13 items-center justify-between gap-6 bg-print px-5 font-semibold text-on-print hover:bg-print-deep">
              Request a rate
              <ArrowRight aria-hidden className="size-5 rtl:-scale-x-100" />
            </Link>
            <a href={`tel:${company.phone.tel}`} className="inline-flex min-h-13 items-center justify-center gap-2 border-2 border-sack px-5 font-semibold hover:bg-sack hover:text-ink">
              <Phone aria-hidden className="size-4" />
              Call {company.contactPerson}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
