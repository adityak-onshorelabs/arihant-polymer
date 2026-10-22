import type { Metadata } from "next";
import { Suspense } from "react";
import { families, grades, producersByCount, type Family } from "@/content/catalogue";
import { StockRegister } from "@/components/site/stock-register";

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
    <div className="frame py-12 md:py-16">
      <p className="t-label text-print">Stock register</p>
      <h1 className="t-display mt-3 text-[clamp(2.8rem,7vw,5.5rem)]">Products</h1>
      <p className="t-lead mt-4 max-w-2xl text-ink-2">
        {grades.length} grades from {producersByCount.length} producers. Prices move with every producer price list, so rates are quoted on request.
      </p>
      <div className="mt-10">
        <Suspense fallback={<StockRegister grades={grades} />}>
          <Register searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
