import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Phone } from "lucide-react";
import { families, gradeTitle, grades } from "@/content/catalogue";
import { company, terms } from "@/content/site";
import { BagFace, FamilySwatch } from "@/components/site/bag-face";
import { GradeGallery } from "@/components/site/grade-gallery";

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
    description: `${g.listed}. ${g.type}, ${g.process.toLowerCase()}. Minimum order ${g.moq ?? terms.moq}. Ask ${company.name}, Malad West, Mumbai, for a rate.`,
    alternates: { canonical: `/products/${slug}` },
    openGraph: g.images[0] ? { images: [g.images[0].src] } : undefined,
  };
}

export default async function GradePage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const g = find(slug);
  if (!g) notFound();
  const fam = families.find((f) => f.id === g.family)!;
  const related = grades.filter((x) => x !== g && (x.category === g.category || (x.family === g.family && x.process === g.process))).slice(0, 6);
  const paras = g.description.split("\n").filter(Boolean);

  return (
    <div className="frame py-10 md:py-14">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-2">
        <Link href="/products" className="underline underline-offset-4">
          Products
        </Link>{" "}
        /{" "}
        <Link href={`/products?family=${g.family}`} className="underline underline-offset-4">
          {fam.short}
        </Link>{" "}
        / {gradeTitle(g)}
      </nav>

      <h1 className="t-h2 mt-4 max-w-4xl text-[clamp(1.9rem,4vw,3rem)]">{g.listed}</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          {g.images.length > 0 && <GradeGallery images={g.images} title={gradeTitle(g)} producer={g.producer} />}
          <BagFace grade={g} size="lg" />
        </div>

        <div className="lg:col-span-5">
          <div className="grid grid-cols-3 border-y-2 border-ink">
            {[
              ["Minimum order", g.moq ?? terms.moq],
              ["Pack", g.packing && /25\s*kg/i.test(g.packing) ? "25 kg bag" : (g.packing ?? "Producer bag")],
              ["Delivery", g.delivery ?? terms.delivery],
            ].map(([k, v]) => (
              <div key={k} className="border-e border-seam py-3 pe-3 last:border-e-0 [&:not(:first-child)]:ps-3">
                <p className="t-label text-ink-2">{k}</p>
                <p className="mt-1 font-semibold">{v}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Link href={`/contact?grade=${g.slug}`} className="inline-flex min-h-13 items-center justify-between gap-3 bg-print px-5 font-semibold text-on-print hover:bg-print-deep">
              Request a rate for {gradeTitle(g)}
              <ArrowRight aria-hidden className="size-5 rtl:-scale-x-100" />
            </Link>
            <a href={`tel:${company.phone.tel}`} className="inline-flex min-h-13 items-center justify-center gap-2 border-2 border-ink px-5 font-semibold hover:bg-ink hover:text-sack">
              <Phone aria-hidden className="size-4" />
              {company.phone.display}
            </a>
          </div>

          <h2 className="t-h3 mt-10">Specifications</h2>
          <dl className="mt-3 border-t-2 border-ink">
            {[["Producer", g.producer ?? "On request"], ["Polymer", fam.label], ["Type", g.type], ["Process", g.process], ...g.specs].map(([k, v], i) => (
              <div key={`${k}-${i}`} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-4 border-b border-seam py-2.5 text-[0.95rem]">
                <dt className="text-ink-2">{k}</dt>
                <dd className="text-end font-semibold break-words">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-sm text-ink-2">As listed by Arihant. For the producer&apos;s full technical data sheet, ask with your rate request.</p>

          {paras.length > 0 && (
            <>
              <h2 className="t-h3 mt-10">About this grade</h2>
              <div className="mt-3 space-y-2 text-[0.98rem] leading-relaxed">
                {paras.map((p, i) =>
                  /^[A-Z][A-Z &/]{3,}$/.test(p) ? (
                    <p key={i} className="t-label pt-2 text-ink-2">
                      {p}
                    </p>
                  ) : (
                    <p key={i}>{p.replace(/^•\s*/, "")}</p>
                  ),
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16" aria-labelledby="related-title">
          <h2 id="related-title" className="t-h3 border-b-2 border-ink pb-2">
            Also on the register
          </h2>
          <ul className="grid gap-x-8 sm:grid-cols-2">
            {related.map((r) => (
              <li key={r.slug} className="border-b border-seam">
                <Link href={`/products/${r.slug}`} className="flex min-h-16 items-center gap-4 py-2 hover:bg-sack-2">
                  {r.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.images[0].src} alt="" width={48} height={48} loading="lazy" className="size-12 shrink-0 border border-seam object-cover" />
                  ) : (
                    <FamilySwatch family={r.family} className="size-12" />
                  )}
                  <span className="min-w-0">
                    <span className="t-code block text-xl text-print">{gradeTitle(r)}</span>
                    <span className="block truncate text-sm">
                      <b>{r.producer ?? "Generic"}</b> <span className="text-ink-2">· {r.process}</span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
