import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Phone } from "lucide-react";
import { families, gradeSlug, gradeTitle, grades } from "@/content/catalogue";
import { company } from "@/content/site";
import { BagFace, FamilySwatch } from "@/components/site/bag-face";


export function generateStaticParams() {
  return grades.map((g) => ({ slug: gradeSlug(g) }));
}

function find(slug: string) {
  return grades.find((g) => gradeSlug(g) === slug);
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const g = find(slug);
  if (!g) return {};
  const t = gradeTitle(g);
  return {
    title: `${t}${g.producer ? ` ${g.producer}` : ""} ${g.type}`,
    description: `${g.listed}. ${g.process}. Ask ${company.name}, Malad West, Mumbai, for a rate.`,
    alternates: { canonical: `/products/${slug}` },
  };
}

export default async function GradePage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const g = find(slug);
  if (!g) notFound();
  const fam = families.find((f) => f.id === g.family)!;
  const related = grades.filter((x) => x !== g && (x.category === g.category || (x.family === g.family && x.process === g.process))).slice(0, 6);

  return (
    <div className="frame py-10 md:py-14">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-2">
        <Link href="/products" className="underline underline-offset-4">
          Products
        </Link>{" "}
        / <Link href={`/products?family=${g.family}`} className="underline underline-offset-4">{fam.short}</Link> / {gradeTitle(g)}
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h1 className="sr-only">
            {gradeTitle(g)} {g.producer} {g.type}
          </h1>
          <BagFace grade={g} size="lg" />
        </div>
        <div className="lg:col-span-5">
          <p className="t-label text-ink-2">As listed</p>
          <p className="mt-1 text-lg font-semibold">{g.listed}</p>
          <dl className="mt-6 border-t-2 border-ink">
            {[
              ["Producer", g.producer ?? "On request"],
              ["Polymer", fam.label],
              ["Type", g.type],
              ["Process", g.process],
              ["MFI", g.mfi ? `${g.mfi} g/10 min` : "As per producer data sheet"],
              ["Category", g.category],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 border-b border-seam py-3">
                <dt className="text-ink-2">{k}</dt>
                <dd className="text-end font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm text-ink-2">Need the producer’s technical data sheet? Ask for it with your rate request.</p>
          <div className="mt-8 flex flex-col gap-3">
            <Link href={`/contact?grade=${slug}`} className="inline-flex min-h-13 items-center justify-between gap-3 bg-print px-5 font-semibold text-on-print hover:bg-print-deep">
              Request a rate for {gradeTitle(g)}
              <ArrowRight aria-hidden className="size-5 rtl:-scale-x-100" />
            </Link>
            <a href={`tel:${company.phone.tel}`} className="inline-flex min-h-13 items-center justify-center gap-2 border-2 border-ink px-5 font-semibold hover:bg-ink hover:text-sack">
              <Phone aria-hidden className="size-4" />
              {company.phone.display}
            </a>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16" aria-labelledby="related-title">
          <h2 id="related-title" className="t-h3 border-b-2 border-ink pb-2">
            Also on the register
          </h2>
          <ul>
            {related.map((r) => (
              <li key={gradeSlug(r)} className="border-b border-seam">
                <Link href={`/products/${gradeSlug(r)}`} className="flex min-h-14 items-center gap-4 py-2 hover:bg-sack-2">
                  <FamilySwatch family={r.family} />
                  <span className="t-code w-32 shrink-0 text-2xl text-print">{gradeTitle(r)}</span>
                  <span className="font-semibold">{r.producer ?? "Generic"}</span>
                  <span className="hidden text-ink-2 sm:inline">{r.process}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
