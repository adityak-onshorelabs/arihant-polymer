import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { categories, families, familyLook, grades, producersByCount } from "@/content/catalogue";
import { YEAR, about, company, photos, terms } from "@/content/site";
import { materialPhotos, uses } from "@/content/uses";
import { btnOnDose, btnOnDoseSecondary, textLink } from "@/components/site/ui";
import { SettleWords } from "@/components/site/rise";
import { Settle } from "@/components/site/motion/effects";
import { DriftImage } from "@/components/site/motion/drift-image";
import { PourOnView } from "@/components/site/motion/pour-on-view";
import { MiniPouch, Pouch } from "@/components/site/pouch";
import { SectionHead } from "@/components/site/section-head";
import { UsesStrip } from "@/components/site/uses-strip";
import { DoseBand } from "@/components/site/dose-band";

export const metadata: Metadata = {
  title: "About",
  description: `${company.name} is a ${company.legal.toLowerCase()} trading and distributing polymer granules from Malad West, Mumbai, since ${company.since}.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const years = YEAR - company.since;
  const tray = families
    .map((f, i) => ({ ...f, count: grades.filter((g) => g.family === f.id).length, look: familyLook[f.id], i }))
    .filter((f) => f.count > 0);

  return (
    <>
      {/* Hero: the firm, with its own godown */}
      <section className="frame grid grid-cols-1 gap-12 pt-12 md:pt-20 lg:grid-cols-12 lg:items-end lg:gap-16">
        <div className="lg:col-span-7 lg:pb-6">
          <p className="eyebrow settle">About</p>
          <h1 className="d-hero mt-8 max-w-[13ch]">
            <SettleWords text={`${years} years in the polymer trade.`} delay={0.1} />
          </h1>
          <div className="lead settle mt-8 max-w-xl space-y-4" style={{ "--d": "0.6s" } as React.CSSProperties}>
            {about.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <figure className="settle lg:col-span-5" style={{ "--d": "0.3s" } as React.CSSProperties}>
          <Pouch windowClassName="aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] overflow-hidden">
            <DriftImage src={photos.godown.src} alt={photos.godown.alt} priority sizes="(min-width: 1024px) 30rem, 100vw" />
          </Pouch>
          <figcaption className="meta mt-3">The godown, Malad West. Arihant&apos;s own photograph.</figcaption>
        </figure>
      </section>

      {/* The material, wide, with the job in one label */}
      <section className="frame pt-[clamp(4.5rem,10vw,8rem)]" aria-label="The material">
        <Settle>
          <Pouch windowClassName="aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9] overflow-hidden">
            <DriftImage src={materialPhotos.natural.src} alt={materialPhotos.natural.alt} sizes="(min-width: 1280px) 76rem, 100vw" amount={14} />
            <div className="sticker absolute bottom-4 start-4 end-4 z-[4] max-w-md p-5 sm:bottom-6 sm:start-6 sm:end-auto md:p-6">
              <p className="meta">The job, since {company.since}</p>
              <p className="d-h3 mt-2 text-[1.35rem] leading-snug">The right grade, in 25 kg bags, sent {company.shipping.toLowerCase()}.</p>
            </div>
          </Pouch>
        </Settle>
        <p className="meta mt-3">Natural polymer pellets. Photo: Unsplash.</p>
      </section>

      {/* The range as a sample tray */}
      <section className="frame section grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16" aria-labelledby="range-title">
        <div className="lg:col-span-5">
          <SectionHead label="The range" title={<span id="range-title">What Arihant handles.</span>}>
            {grades.length} listed grades across {categories.length} categories: PP, HDPE, LLDPE, LDPE, polystyrene, ABS, PVC, PET, polycarbonate and EVA.
          </SectionHead>
          <Settle stagger className="mt-10 space-y-8">
            <div>
              <h3 className="d-h3">Trading brands</h3>
              <p className="mt-2 text-graphite-2">{about.brands.join(", ")} and more.</p>
            </div>
            <div>
              <h3 className="d-h3">Producers</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {producersByCount.slice(0, 14).map((p) => (
                  <li key={p.name}>
                    <Link href={`/products?producer=${encodeURIComponent(p.name)}`} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-seal bg-label px-4 text-[0.95rem] transition-colors hover:border-graphite">
                      {p.name}
                      <span className="text-sm tabular-nums text-graphite-2">{p.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/products" className={`${textLink} mt-3 text-[0.95rem]`}>
                All {producersByCount.length} producers in the register
                <ArrowRight aria-hidden className="size-4 rtl:-scale-x-100" />
              </Link>
            </div>
          </Settle>
        </div>

        <PourOnView className="lg:col-span-7">
          <p className="meta mb-4">The sample tray: one pouch per family</p>
          <ul className="grid grid-cols-3 gap-3 sm:gap-4">
            {tray.map((f) => (
              <li key={f.id}>
                <Link href={`/products?family=${f.id}`} className="group block">
                  <MiniPouch id={`tray-${f.id}`} look={f.look} seed={f.i * 19 + 3} fill={0.3 + Math.min(0.55, f.count / 120)} pour delay={f.i * 0.12} className="transition-[translate,border-color] duration-500 group-hover:-translate-y-1 group-hover:border-graphite" />
                  <span className="mt-2 flex items-baseline justify-between gap-2 px-0.5">
                    <span className="d-code text-[1.05rem] sm:text-[1.2rem]">{f.short}</span>
                    <span className="text-xs tabular-nums text-graphite-2">{f.count}</span>
                  </span>
                  <span className="block truncate px-0.5 text-[0.8rem] text-graphite-2">{f.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </PourOnView>
      </section>

      {/* Why buyers stay, beside clear pellets */}
      <section className="border-y border-seal bg-film/60" aria-labelledby="why-title">
        <div className="frame section grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <Settle className="lg:col-span-5">
            <Pouch windowClassName="aspect-[4/3] lg:aspect-[4/5] overflow-hidden">
              <DriftImage src={materialPhotos.clear.src} alt={materialPhotos.clear.alt} sizes="(min-width: 1024px) 30rem, 100vw" />
            </Pouch>
            <p className="meta mt-3">Clear pellets held to the light. Photo: Unsplash.</p>
          </Settle>
          <div className="lg:col-span-6 lg:col-start-7">
            <SectionHead label="Why buyers stay" title={<span id="why-title">Plain dealing, for {years} years.</span>} />
            <Settle stagger as="ol" className="mt-10 border-t border-seal">
              {about.whyUs.map((w, i) => (
                <li key={w} className="flex items-baseline gap-5 border-b border-seal py-4 text-lg">
                  <span className="d-code w-8 shrink-0 text-graphite-2">0{i + 1}</span>
                  {w}
                </li>
              ))}
            </Settle>
            <Settle className="mt-10">
              <h3 className="d-h3">The team</h3>
              <p className="mt-2 text-graphite-2">{about.teamNote}</p>
              <p className="mt-3">{about.team.join(" · ")}</p>
            </Settle>
          </div>
        </div>
      </section>

      {/* Where the granules go */}
      <section className="frame section overflow-x-clip" aria-labelledby="uses-title">
        <SectionHead className="mb-10 max-w-2xl" label="Where the granules go" title={<span id="uses-title">From the godown to the buyer&apos;s machine.</span>} />
        <UsesStrip items={uses} />
        <p className="meta mt-4">Process photos: Unsplash. They show the process, not Arihant&apos;s customers.</p>
      </section>

      {/* The place */}
      <section className="frame pb-[clamp(4.5rem,10vw,8rem)]" aria-labelledby="place-title">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <Settle className="md:col-span-7">
            <Pouch windowClassName="aspect-[4/3] md:aspect-auto md:min-h-[30rem] overflow-hidden">
              <DriftImage src={photos.office.src} alt={photos.office.alt} sizes="(min-width: 768px) 44rem, 100vw" />
            </Pouch>
          </Settle>
          <div className="grid gap-4 md:col-span-5">
            <Settle delay={0.1}>
              <Pouch windowClassName="aspect-[4/3] overflow-hidden">
                <DriftImage src={photos.building.src} alt={photos.building.alt} sizes="(min-width: 768px) 30rem, 100vw" />
              </Pouch>
            </Settle>
            <Settle delay={0.2} className="sticker p-7">
              <h2 id="place-title" className="d-h3">
                Office and godown
              </h2>
              <address className="mt-3 not-italic leading-relaxed text-graphite-2">
                {company.address.lines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </address>
              <a href={company.address.mapsUrl} target="_blank" rel="noreferrer" className={`${textLink} mt-2`}>
                Open in Google Maps
              </a>
            </Settle>
          </div>
        </div>
      </section>

      {/* The firm's label */}
      <section className="frame pb-[clamp(4.5rem,10vw,8rem)]" aria-labelledby="firm-title">
        <SectionHead className="mb-8 max-w-2xl" label="Firm details" title={<span id="firm-title">The firm&apos;s label.</span>} />
        <Settle className="sticker overflow-hidden">
          <div className="seal" aria-hidden />
          <dl className="grid grid-cols-1 gap-px bg-seal sm:grid-cols-2 lg:grid-cols-3">
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
              ["Usual terms", `${terms.moq} minimum, ${terms.delivery}`],
            ].map(([k, v]) => (
              <div key={k} className="min-w-0 bg-label px-5 py-4 md:px-6">
                <dt className="meta">{k}</dt>
                <dd className="mt-1 break-words">{v}</dd>
              </div>
            ))}
          </dl>
        </Settle>
      </section>

      <section className="frame pb-[clamp(4.5rem,10vw,8rem)]" aria-labelledby="cta-title">
        <DoseBand>
          <div className="flex flex-col gap-8 px-6 pb-10 pt-12 md:flex-row md:items-end md:justify-between md:px-12 md:pb-14 md:pt-16">
            <h2 id="cta-title" className="d-h1 max-w-[14ch]">
              Know the grade you need?
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
