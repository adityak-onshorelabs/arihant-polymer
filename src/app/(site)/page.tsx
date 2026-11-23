import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { families, familyLook, gradeTitle, grades, producersByCount } from "@/content/catalogue";
import { YEAR, company, photos, reviews, reviewStates } from "@/content/site";
import { GradeSample } from "@/components/site/grade-lookup";
import { FamilyRows, type FamilyRow } from "@/components/site/family-rows";
import { DoseBand } from "@/components/site/dose-band";
import { UsesStrip } from "@/components/site/uses-strip";
import { uses } from "@/content/uses";
import { Pouch } from "@/components/site/pouch";
import { SectionHead } from "@/components/site/section-head";
import { SettleWords } from "@/components/site/rise";
import { Settle } from "@/components/site/motion/effects";
import { DriftImage } from "@/components/site/motion/drift-image";
import { btnOnDose, btnOnDoseSecondary, textLink } from "@/components/site/ui";

const featured = grades.find((g) => g.code === "MI3530")!;

export default function HomePage() {
  const years = YEAR - company.since;
  const famRows: FamilyRow[] = families
    .map((f) => {
      const list = grades.filter((g) => g.family === f.id);
      const prod = new Map<string, number>();
      for (const g of list) if (g.producer) prod.set(g.producer, (prod.get(g.producer) ?? 0) + 1);
      return {
        id: f.id,
        short: f.short,
        label: f.label,
        count: list.length,
        look: familyLook[f.id],
        producers: [...prod.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, count]) => ({ name, count })),
        top: list
          .filter((g) => g.code)
          .slice(0, 6)
          .map((g) => ({ slug: g.slug, code: gradeTitle(g), producer: g.producer ?? "Generic" })),
      };
    })
    .filter((f) => f.count > 0);

  return (
    <>
      {/* Hero and the signature: grade, then how much */}
      <section className="frame pb-[clamp(4.5rem,10vw,8rem)] pt-10 md:pt-16" aria-labelledby="hero-title">
        <GradeSample
          grades={grades}
          initial={featured}
          heading={
            <>
              <p className="eyebrow settle" style={{ "--d": "0.05s" } as React.CSSProperties}>
                Stockist and distributor · {company.address.short} · Since {company.since}
              </p>
              <h1 id="hero-title" className="d-hero mt-7 max-w-[14ch]">
                <SettleWords text="Polymer granules, by the grade code." delay={0.1} />
              </h1>
            </>
          }
          intro={
            <p className="lead settle mt-7 max-w-lg" style={{ "--d": "0.55s" } as React.CSSProperties}>
              PP, HDPE, LLDPE, LDPE and more from Reliance, GAIL, IOCL, HMEL, OPaL and Borouge. Find your grade, say how much, and Arihant comes back with the rate.
            </p>
          }
        />
      </section>

      {/* Families */}
      <section className="border-t border-seal bg-film/60" aria-labelledby="range-title">
        <div className="frame section grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
            <SectionHead label="The range" title={<span id="range-title">{grades.length} grades across {famRows.length} families.</span>}>
              Commodity grades for moulding, film, raffia, blow moulding and pipe, plus styrenics, PVC, PET and engineering resins.
            </SectionHead>
            <Settle delay={0.2}>
              <Link href="/products" className={`${textLink} mt-6`}>
                Browse all {grades.length} grades
                <ArrowRight aria-hidden className="size-4 rtl:-scale-x-100" />
              </Link>
            </Settle>
          </div>
          <Settle className="min-w-0 lg:col-span-8">
            <FamilyRows rows={famRows} />
          </Settle>
        </div>
      </section>

      {/* Where the granules go */}
      <section className="frame overflow-x-clip pt-[clamp(4.5rem,10vw,8rem)]" aria-labelledby="uses-title">
        <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
          <SectionHead className="lg:col-span-7" label="Where the granules go" title={<span id="uses-title">Grades for the machine you run.</span>} />
          <Settle className="lg:col-span-4 lg:col-start-9">
            <p className="lead">Each listed grade names its process. Pick yours to see the grades for it.</p>
          </Settle>
        </div>
        <UsesStrip items={uses} />
        <p className="meta mt-4">Process photos: Unsplash. They show the process, not Arihant&apos;s customers.</p>
      </section>

      {/* Producers, as one printed label line */}
      <section className="frame pt-[clamp(4.5rem,10vw,8rem)]" aria-labelledby="producers-title">
        <Settle className="sticker overflow-hidden">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-dashed border-seal px-5 py-3 md:px-7">
            <h2 id="producers-title" className="meta">
              Grades stocked from
            </h2>
            <span className="meta tabular-nums">{producersByCount.length} producers</span>
          </div>
          <p className="px-5 py-5 text-[clamp(1.15rem,2.2vw,1.6rem)] leading-[1.5] tracking-[-0.02em] md:px-7 md:py-6">
            {producersByCount.slice(0, 16).map((p, i) => (
              <span key={p.name}>
                <Link href={`/products?producer=${encodeURIComponent(p.name)}`} className="underline decoration-transparent underline-offset-[6px] transition-colors hover:decoration-graphite">
                  {p.name}
                </Link>
                <sup className="ms-0.5 text-[0.55em] text-graphite-2 tabular-nums">{p.count}</sup>
                {i < 15 ? <span className="text-seal"> / </span> : null}
              </span>
            ))}
            <span className="text-graphite-2"> and {producersByCount.length - 16} more.</span>
          </p>
        </Settle>
      </section>

      {/* The firm: real photos, facts as a label, ratings */}
      <section className="frame section grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16" aria-labelledby="who-title">
        <Settle className="lg:col-span-5">
          <Pouch windowClassName="aspect-[3/4]">
            <DriftImage src={photos.godown.src} alt={photos.godown.alt} sizes="(min-width: 1024px) 28rem, 100vw" />
          </Pouch>
          <p className="meta mt-3">The godown, Malad West. Arihant&apos;s own photograph.</p>
        </Settle>

        <div className="min-w-0 lg:col-span-7">
          <SectionHead label="The firm" title={<span id="who-title">A Malad partnership, trading granules for {years} years.</span>} />

          <Settle className="sticker mt-10 overflow-hidden">
            <dl className="grid grid-cols-2 gap-px bg-seal sm:grid-cols-3">
              {[
                ["Established", String(company.since)],
                ["Constitution", company.legal],
                ["Facility", "Warehouse and depot"],
                ["Contact", company.contactPerson],
                ["Dispatch", company.shipping],
                ["GST", company.gst],
              ].map(([k, v]) => (
                <div key={k} className="min-w-0 bg-label px-5 py-4">
                  <dt className="meta">{k}</dt>
                  <dd className="mt-1 break-words font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </Settle>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] sm:items-end">
            <Settle>
              <p className="meta">Buyer ratings on {reviews.source}</p>
              <p className="mt-3 flex items-baseline gap-2">
                <span className="d-code text-[clamp(3.25rem,7vw,4.5rem)] leading-none">{reviews.average}</span>
                <span className="text-lg text-graphite-2">/ 5 from {reviews.count} buyers</span>
              </p>
              <ul className="mt-5 space-y-1.5" aria-label="Rating distribution">
                {reviews.distribution.map((d) => (
                  <li key={d.stars} className="grid grid-cols-[3rem_minmax(0,1fr)_2.5rem] items-center gap-3 text-sm text-graphite-2">
                    <span>{d.stars} star</span>
                    <span className="h-1.5 overflow-hidden rounded-full bg-film-2" aria-hidden>
                      <span className="block h-full rounded-full bg-graphite" style={{ width: `${d.pct}%` }} />
                    </span>
                    <span className="text-end tabular-nums">{d.pct}%</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-relaxed text-graphite-2">
                Recent buyers in {reviewStates.slice(0, 4).join(", ")} and {reviewStates.length - 4} more states.
              </p>
              <Link href="/reviews" className={`${textLink} mt-2 text-[0.95rem]`}>
                Read the ratings
                <ArrowRight aria-hidden className="size-4 rtl:-scale-x-100" />
              </Link>
            </Settle>
            <Settle delay={0.15}>
              <Pouch windowClassName="aspect-[4/3]">
                <DriftImage src={photos.office.src} alt={photos.office.alt} sizes="(min-width: 1024px) 20rem, 100vw" />
              </Pouch>
              <p className="meta mt-3">Arihant&apos;s office, Malad West.</p>
            </Settle>
          </div>
        </div>
      </section>

      {/* The concentrated pellet: one rubine band */}
      <section className="frame pb-[clamp(4.5rem,10vw,8rem)]" aria-labelledby="cta-title">
        <DoseBand>
          <div className="grid grid-cols-1 gap-10 px-6 pb-10 pt-12 md:px-12 md:pb-14 md:pt-16 lg:grid-cols-12 lg:px-16">
            <div className="lg:col-span-7">
              <p className="text-sm font-medium text-on-dose/80">Send an enquiry</p>
              <h2 id="cta-title" className="d-h1 mt-5 max-w-[16ch]">
                Tell Arihant the grade and the quantity.
              </h2>
            </div>
            <div className="flex flex-col justify-end gap-8 lg:col-span-5">
              <p className="text-lg leading-relaxed text-on-dose/85">
                {company.contactPerson} or the Arihant team comes back with the rate and the dispatch date. Material leaves the Malad godown {company.shipping.toLowerCase()}.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/contact" className={btnOnDose}>
                  Send an enquiry
                  <ArrowRight aria-hidden className="size-4 rtl:-scale-x-100" />
                </Link>
                <a href={`tel:${company.phone.tel}`} className={btnOnDoseSecondary}>
                  <Phone aria-hidden className="size-4" />
                  Call {company.contactPerson}
                </a>
              </div>
            </div>
          </div>
        </DoseBand>
      </section>
    </>
  );
}
