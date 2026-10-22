"use client";

import { useMemo, useState } from "react";
import { BadgeCheck } from "lucide-react";
import { families, type Family } from "@/content/catalogue";
import { rs, useDemo } from "@/lib/demo/store";
import { Btn, Gate, LevelNote, MARKET_TABS, PageTitle, Panel, SubTabs, Tag } from "@/components/demo/ui";

export default function Marketplace() {
  const { state, dispatch } = useDemo();
  const [q, setQ] = useState("");
  const [fam, setFam] = useState<Family | "ALL">("ALL");
  const [open, setOpen] = useState<string | null>(null);
  const [qty, setQty] = useState(5);
  const [done, setDone] = useState<string | null>(null);

  const groups = useMemo(() => {
    const live = new Set(state.sellers.filter((s) => s.status === "Live").map((s) => s.id));
    const ql = q.toLowerCase();
    const items = state.items.filter((i) => (fam === "ALL" || i.family === fam) && (!ql || `${i.code} ${i.producer} ${i.process}`.toLowerCase().includes(ql)));
    return items
      .map((i) => ({ item: i, offers: state.listings.filter((l) => l.itemKey === i.key && live.has(l.sellerId) && l.stock > 0).sort((a, b) => a.price - b.price) }))
      .filter((g) => g.offers.length > 0)
      .slice(0, 24);
  }, [state.items, state.listings, state.sellers, q, fam]);

  return (
    <Gate module="search">
      {(level) => {
        const canBuy = level === "full";
        return (
          <div className="space-y-6">
            <PageTitle title="Marketplace" sub="Arihant's website, opened to other polymer sellers. A buyer searches once and sees every seller's price. Arihant earns on each sale.">
              <LevelNote level={level} />
            </PageTitle>

            <SubTabs items={MARKET_TABS} />
            <p className="text-ink-2">What a buyer sees: search a grade, compare sellers, order. Arihant&apos;s own stock carries the Arihant Assured badge.</p>
            <div className="flex flex-col gap-3 md:flex-row">
              <label className="flex h-12 flex-1 items-center border-2 border-ink bg-sack px-3">
                <span className="sr-only">Search the marketplace</span>
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search grade, producer or process" className="w-full bg-transparent outline-none" />
              </label>
              <div className="flex flex-wrap gap-1" role="group" aria-label="Polymer family">
                {(["ALL", "PP", "HDPE", "LLDPE", "LDPE", "STYRENICS", "PVC"] as const).map((f) => (
                  <button key={f} type="button" aria-pressed={fam === f} onClick={() => setFam(f)} className={`min-h-12 border-2 border-ink px-3 text-sm font-semibold ${fam === f ? "bg-ink text-sack" : "hover:bg-sack-2"}`}>
                    {f === "ALL" ? "All" : families.find((x) => x.id === f)?.short}
                  </button>
                ))}
              </div>
            </div>

            {done && (
              <p className="border-2 border-ok bg-[oklch(96%_0.03_150)] p-3 font-semibold" role="status">
                {done}
              </p>
            )}

            <div className="space-y-3">
              {groups.map(({ item, offers }) => (
                <Panel key={item.key}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p>
                      <span className="t-code text-3xl text-print">{item.code}</span>
                      <span className="ms-3 font-semibold">{item.producer}</span>
                      <span className="ms-2 text-ink-2">{item.process}</span>
                    </p>
                    <span className="text-sm text-ink-2">
                      {offers.length} seller{offers.length > 1 ? "s" : ""} · from {rs(offers[0].price)}/kg
                    </span>
                  </div>
                  <ul className="mt-3 divide-y divide-seam border-t border-seam text-sm">
                    {offers.map((l) => {
                      const s = state.sellers.find((x) => x.id === l.sellerId)!;
                      return (
                        <li key={l.id} className="grid items-center gap-2 py-2 sm:grid-cols-[1fr_7rem_6rem_6rem_auto]">
                          <span className="flex flex-wrap items-center gap-2">
                            <b>{s.name}</b>
                            {s.id === "arihant" ? <Tag tone="print">Arihant Assured</Tag> : s.verified && <BadgeCheck aria-label="Verified seller" className="size-4 text-ok" />}
                            <span className="text-ink-2">{l.location}</span>
                            {s.rating > 0 && <span className="text-ink-2">★ {s.rating}</span>}
                          </span>
                          <span className="text-lg font-bold">{rs(l.price)}</span>
                          <span>{l.stock} t</span>
                          <span className="text-ink-2">{l.deliveryDays} days</span>
                          <span className="sm:text-end">
                            {canBuy && (
                              <Btn variant="line" onClick={() => setOpen(open === l.id ? null : l.id)} aria-expanded={open === l.id}>
                                Order
                              </Btn>
                            )}
                          </span>
                          {open === l.id && (
                            <div className="flex flex-wrap items-center gap-2 bg-sack-2 p-3 sm:col-span-5">
                              <label className="flex items-center gap-2">
                                Quantity (t)
                                <input type="number" min={1} max={l.stock} value={qty} onChange={(e) => setQty(Math.max(1, Math.min(l.stock, Number(e.target.value))))} className="h-10 w-20 border-2 border-ink bg-sack px-2 font-bold" />
                              </label>
                              <span>= ₹{Math.round(qty * 1000 * l.price * 1.18).toLocaleString("en-IN")} incl. GST, paid through the platform</span>
                              <Btn
                                onClick={() => {
                                  dispatch({ type: "marketOrder", listingId: l.id, qty, buyerName: "Shree Ganesh Moulders" });
                                  setDone(`Order placed: ${qty} t ${item.code} from ${s.name}. Payment held by the platform until delivery; seller paid minus commission.`);
                                  setOpen(null);
                                }}
                              >
                                Place order
                              </Btn>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </Panel>
              ))}
              {groups.length === 0 && <p className="text-ink-2">No sellers list that right now. Post a requirement and sellers will quote.</p>}
            </div>
          </div>
        );
      }}
    </Gate>
  );
}
