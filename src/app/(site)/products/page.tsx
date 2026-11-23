import type { Metadata } from "next";
import { Suspense } from "react";
import { families, grades, producersByCount, type Family } from "@/content/catalogue";
import { StockRegister } from "@/components/site/stock-register";
import { company, terms } from "@/content/site";
import { SettleWords } from "@/components/site/rise";

export const metadata: Metadata = {
  title: "Products",
  description: `${grades.length} polymer grades: PP, HDPE, LLDPE, LDPE, polystyrene, ABS, PVC, PET and more from ${producersByCount.length} producers.`,
  alternates: { canonical: "/products" },
};

async function Register({ searchParams }: { searchParams: PageProps<"/products">["searchParams"] }) {
  const sp = await searchParams;
  const fam = typeof sp.family === "string" && families.some((f) => f.id === sp.family) ? (sp.family as Family) : undefined;
  const q = typeof sp.q === "string" ? sp.q : typeof sp.producer === "string" ? sp.producer : undefined;
  return <StockRegister key={`${fam ?? "ALL"}-${q ?? ""}`} grades={grades} initialFamily={fam} initialQuery={q} />;
}

export default function ProductsPage({ searchParams }: PageProps<"/products">) {
  return (
    <div className="frame pb-24 pt-16 md:pb-32 md:pt-24">
      <p className="eyebrow settle">Products</p>
      <div className="mt-6 grid gap-6 grid-cols-1 lg:grid-cols-12 lg:items-end">
        <h1 className="d-h1 lg:col-span-7">
          <SettleWords text={`${grades.length} grades from ${producersByCount.length} producers.`} delay={0.1} />
        </h1>
        <p className="lead settle lg:col-span-4 lg:col-start-9" style={{ "--d": "0.6s" } as React.CSSProperties}>
          Pick a family from the shelf or search a code. Prices move with every producer price list, so Arihant confirms them when you enquire.
        </p>
      </div>
      <dl className="sticker settle mt-10 grid grid-cols-2 gap-px overflow-hidden bg-seal sm:grid-cols-4" style={{ "--d": "0.7s" } as React.CSSProperties}>
        {[
          ["Usual minimum order", terms.moq],
          ["Usual pack", "25 kg bag"],
          ["Usual delivery", terms.delivery],
          ["Dispatch", company.shipping],
        ].map(([k, v]) => (
          <div key={k} className="bg-label px-5 py-3.5">
            <dt className="meta">{k}</dt>
            <dd className="mt-0.5 font-medium">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="settle mt-12 md:mt-14" style={{ "--d": "0.8s" } as React.CSSProperties}>
        <Suspense fallback={<StockRegister grades={grades} />}>
          <Register searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
