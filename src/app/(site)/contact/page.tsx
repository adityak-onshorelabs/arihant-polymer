import type { Metadata } from "next";
import { Suspense } from "react";
import { gradeSlug, gradeTitle, grades } from "@/content/catalogue";
import { company } from "@/content/site";
import { RateRequest } from "@/components/site/rate-request";
import { SettleWords } from "@/components/site/rise";

export const metadata: Metadata = {
  title: "Send an enquiry",
  description: `Send ${company.name} a grade, quantity and delivery point. Malad West, Mumbai.`,
  alternates: { canonical: "/contact" },
};

async function Form({ searchParams }: { searchParams: PageProps<"/contact">["searchParams"] }) {
  const sp = await searchParams;
  const g = typeof sp.grade === "string" ? grades.find((x) => gradeSlug(x) === sp.grade) : undefined;
  const initial = g ? [gradeTitle(g), g.producer, g.type].filter(Boolean).join(" ") : undefined;
  const qty = typeof sp.qty === "string" && /^\d+(\.\d+)?$/.test(sp.qty) ? sp.qty : undefined;
  const unit = sp.unit === "bags" ? "bags" : "tonnes";
  return <RateRequest key={`${initial ?? "blank"}-${qty ?? ""}`} initialGrade={initial} initialQuantity={qty} initialUnit={unit} />;
}

export default function ContactPage({ searchParams }: PageProps<"/contact">) {
  return (
    <div className="frame grid gap-14 pb-24 pt-16 md:pb-32 md:pt-24 grid-cols-1 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-5">
        <p className="eyebrow settle">Contact</p>
        <h1 className="d-h1 mt-6">
          <SettleWords text="Send an enquiry." delay={0.1} />
        </h1>
        <p className="lead settle mt-6 max-w-md" style={{ "--d": "0.5s" } as React.CSSProperties}>The grade, the quantity and where it goes. That is all Arihant needs to come back to you.</p>

        <div className="settle mt-14 border-t border-seal pt-6" style={{ "--d": "0.65s" } as React.CSSProperties}>
          <p className="meta">Call {company.contactPerson}</p>
          <a href={`tel:${company.phone.tel}`} className="mt-2 inline-flex min-h-11 items-center text-[1.75rem] font-normal tracking-[-0.02em] hover:text-graphite-2">
            {company.phone.display}
          </a>
        </div>
        <address className="settle mt-8 border-t border-seal pt-6 not-italic leading-relaxed" style={{ "--d": "0.75s" } as React.CSSProperties}>
          <p className="meta mb-2">Godown and office</p>
          {company.address.lines.map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))}
          <a
            href={company.address.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex min-h-11 items-center font-medium underline decoration-rim/60 underline-offset-[6px] hover:decoration-graphite"
          >
            Directions
          </a>
        </address>
      </div>
      <div className="settle min-w-0 lg:col-span-7" style={{ "--d": "0.45s" } as React.CSSProperties}>
        <Suspense fallback={<RateRequest />}>
          <Form searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
