import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Phone } from "lucide-react";
import { families, gradeTitle, grades, packKg } from "@/content/catalogue";
import { company, terms } from "@/content/site";
import { FamilySwatch } from "@/components/site/bag-face";
import { GradeSticker, Pouch, PouchFill } from "@/components/site/pouch";
import { QuantityToBags } from "@/components/site/quantity";
import { GradeGallery } from "@/components/site/grade-gallery";
import { btnPrimary, btnSecondary } from "@/components/site/ui";
import { SettleWords } from "@/components/site/rise";
import { Settle } from "@/components/site/motion/effects";

export function generateStaticParams() {
  return grades.map((g) => ({ slug: g.slug }));
}

function find(slug: string) {
  return grades.find((g) => g.slug === slug);
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const g = find(slug);
  if (!g) return {};
  return {
    title: g.listed,
    description: `${g.listed}. ${g.type}, ${g.process.toLowerCase()}. Minimum order ${g.moq ?? terms.moq}. Send ${company.name}, Malad West, Mumbai, an enquiry.`,
    alternates: { canonical: `/products/${slug}` },
    openGraph: g.images[0] ? { images: [g.images[0].src] } : undefined,
  };
}

export default async function GradePage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const g = find(slug);
  if (!g) notFound();
  const fam = families.find((f) => f.id === g.family)!;
  const title = gradeTitle(g);
  const related = grades.filter((x) => x !== g && (x.category === g.category || (x.family === g.family && x.process === g.process))).slice(0, 6);
  const paras = g.description.split("\n").filter(Boolean);

  return (
    <div className="frame pb-24 pt-10 md:pb-32 md:pt-14">
      <nav aria-label="Breadcrumb" className="text-sm text-graphite-2">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link href="/products" className="hover:text-graphite">
              Products
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href={`/products?family=${g.family}`} className="hover:text-graphite">
              {fam.short}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-graphite">
            {title}
          </li>
        </ol>
      </nav>

      <h1 className="d-h2 mt-8 max-w-4xl">
        <SettleWords text={g.listed} delay={0.05} />
      </h1>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="settle lg:col-span-5" style={{ "--d": "0.3s" } as React.CSSProperties}>
          <Pouch className="mx-auto w-full max-w-[28rem]" windowClassName="aspect-[4/5]" sticker={<GradeSticker grade={g} size="lg" press delay={1.4} className="absolute inset-x-4 bottom-4 z-[4] sm:inset-x-6 sm:bottom-6" />}>
            <PouchFill grade={g} pour delay={0.4} fill={0.8} />
          </Pouch>
          <p className="meta mx-auto mt-3 max-w-[28rem]">Drawn sample of {title}. Arihant&apos;s own photos are alongside.</p>
        </div>

        <div className="settle min-w-0 lg:col-span-7" style={{ "--d": "0.45s" } as React.CSSProperties}>
          {g.images.length > 0 && <GradeGallery images={g.images} title={title} producer={g.producer} />}

          <dl className="mt-8 grid grid-cols-3 gap-x-6">
            {[
              ["Minimum order", g.moq ?? terms.moq],
              ["Pack", `${packKg(g)} kg bag`],
              ["Delivery", g.delivery ?? terms.delivery],
            ].map(([k, v]) => (
              <div key={k} className="border-t border-seal pt-4">
                <dt className="meta">{k}</dt>
                <dd className="mt-1.5">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="#how-much" className={btnPrimary}>
              Work out the quantity
              <ArrowRight aria-hidden className="size-4 rotate-90" />
            </Link>
            <a href={`tel:${company.phone.tel}`} className={btnSecondary}>
              <Phone aria-hidden className="size-4" />
              {company.phone.display}
            </a>
          </div>
        </div>
      </div>

      <section id="how-much" className="mt-20 scroll-mt-24 border-t border-seal pt-10 md:mt-28 md:pt-14" aria-labelledby="how-title">
        <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="how-title" className="d-h2">
            How much {title}?
          </h2>
          <p className="eyebrow">Then send it as an enquiry</p>
        </div>
        <QuantityToBags grade={g} />
      </section>

      <div className="mt-20 grid grid-cols-1 gap-12 border-t border-seal pt-10 md:mt-28 md:pt-14 lg:grid-cols-12 lg:gap-16">
        <Settle className="min-w-0 lg:col-span-7">
          <h2 className="d-h3">Specifications</h2>
          <dl className="mt-4 border-t border-seal">
            {[["Producer", g.producer ?? "On request"], ["Polymer", fam.label], ["Type", g.type], ["Process", g.process], ...g.specs].map(([k, v], i) => (
              <div key={`${k}-${i}`} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-4 border-b border-seal py-3 text-[0.95rem]">
                <dt className="text-graphite-2">{k}</dt>
                <dd className="break-words text-end">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm text-graphite-2">As listed by Arihant. Ask for the producer&apos;s full technical data sheet when you enquire.</p>
        </Settle>

        {paras.length > 0 && (
          <Settle className="min-w-0 lg:col-span-5">
            <h2 className="d-h3">About this grade</h2>
            <div className="mt-4 space-y-3 leading-relaxed text-graphite-2">
              {paras.map((p, i) =>
                /^[A-Z][A-Z &/]{3,}$/.test(p) ? (
                  <p key={i} className="meta pt-3 text-graphite">
                    {p.charAt(0) + p.slice(1).toLowerCase()}
                  </p>
                ) : (
                  <p key={i}>{p.replace(/^•\s*/, "")}</p>
                ),
              )}
            </div>
          </Settle>
        )}
      </div>

      {related.length > 0 && (
        <section className="mt-24 md:mt-32" aria-labelledby="related-title">
          <h2 id="related-title" className="d-h2 pb-8">
            Related grades
          </h2>
          <Settle stagger className="grid gap-x-10 border-t border-seal sm:grid-cols-2">
            {related.map((r) => (
              <div key={r.slug} className="border-b border-seal">
                <Link href={`/products/${r.slug}`} className="group flex min-h-20 items-center gap-4 py-3">
                  {r.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.images[0].src} alt="" width={48} height={48} loading="lazy" className="size-12 shrink-0 rounded-lg bg-film object-cover" />
                  ) : (
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-film">
                      <FamilySwatch family={r.family} />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="d-code block text-lg">{gradeTitle(r)}</span>
                    <span className="block truncate text-sm text-graphite-2">
                      {r.producer ?? "Generic"} · {r.process}
                    </span>
                  </span>
                  <ArrowRight aria-hidden className="size-4 shrink-0 -translate-x-1 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100 rtl:-scale-x-100" />
                </Link>
              </div>
            ))}
          </Settle>
        </section>
      )}
    </div>
  );
}
