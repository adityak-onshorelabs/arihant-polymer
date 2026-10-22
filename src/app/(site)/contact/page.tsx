import type { Metadata } from "next";
import { Suspense } from "react";
import { Phone } from "lucide-react";
import { gradeSlug, gradeTitle, grades } from "@/content/catalogue";
import { company } from "@/content/site";
import { RateRequest } from "@/components/site/rate-request";

export const metadata: Metadata = {
  title: "Request a rate",
  description: `Send ${company.name} a grade, quantity and delivery point for a rate. Malad West, Mumbai.`,
  alternates: { canonical: "/contact" },
};

async function Form({ searchParams }: { searchParams: PageProps<"/contact">["searchParams"] }) {
  const sp = await searchParams;
  const g = typeof sp.grade === "string" ? grades.find((x) => gradeSlug(x) === sp.grade) : undefined;
  const initial = g ? [gradeTitle(g), g.producer, g.type].filter(Boolean).join(" ") : undefined;
  return <RateRequest key={initial ?? "blank"} initialGrade={initial} />;
}

export default function ContactPage({ searchParams }: PageProps<"/contact">) {
  return (
    <div className="frame grid gap-12 py-12 md:py-16 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <p className="t-label text-print">Contact</p>
        <h1 className="t-display mt-3 text-[clamp(2.8rem,7vw,5.5rem)]">Request a rate.</h1>
        <p className="t-lead mt-4 max-w-md text-ink-2">Grade, quantity and where it goes. That is all a rate needs.</p>

        <div className="mt-10 border-t-2 border-ink pt-6">
          <p className="t-label text-ink-2">Call</p>
          <p className="mt-1 font-semibold">{company.contactPerson}</p>
          <a href={`tel:${company.phone.tel}`} className="mt-1 inline-flex min-h-11 items-center gap-2 text-3xl font-bold text-print">
            <Phone aria-hidden className="size-6" />
            {company.phone.display}
          </a>
        </div>
        <address className="mt-8 border-t-2 border-ink pt-6 not-italic">
          <p className="t-label text-ink-2">Godown and office</p>
          {company.address.lines.map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))}
          <a href={company.address.mapsUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex min-h-11 items-center font-semibold underline underline-offset-4">
            Directions
          </a>
        </address>
      </div>
      <div className="min-w-0 lg:col-span-7">
        <Suspense fallback={<RateRequest />}>
          <Form searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
