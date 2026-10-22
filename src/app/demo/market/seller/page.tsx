"use client";

import { inr, rs, useDemo } from "@/lib/demo/store";
import { Gate, LevelNote, MARKET_TABS, PageTitle, Panel, SubTabs, Table, Tag } from "@/components/demo/ui";

const ME = "S1";
const COMMISSION = 0.015;

export default function SellerPanel() {
  const { state, dispatch } = useDemo();
  return (
    <Gate module="search">
      {(level) => {
        const role = "seller" as "seller" | "admin";
        const sellerId = ME;
        const seller = state.sellers.find((s) => s.id === ME)!;
        const listings = state.listings.filter((l) => (sellerId ? l.sellerId === sellerId : l.sellerId !== "arihant"));
        const editable = role === "seller";
        const value = listings.reduce((a, l) => a + l.stock * 1000 * l.price, 0);
        return (
          <div className="space-y-6">
            <PageTitle title="Marketplace" sub={`What a seller sees after joining. Here: ${seller.name}, ${seller.city}. They keep their own prices and stock up to date.`}>
              <LevelNote level={level} />
            </PageTitle>

            <SubTabs items={MARKET_TABS} />
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="border-b border-seam py-3">
                <p className="text-sm font-semibold text-ink-2">Live listings</p>
                <p className="text-3xl font-bold">{listings.length}</p>
              </div>
              <div className="border-b border-seam py-3">
                <p className="text-sm font-semibold text-ink-2">Stock listed</p>
                <p className="text-3xl font-bold">{inr(value)}</p>
              </div>
              <div className="border-b border-seam py-3">
                <p className="text-sm font-semibold text-ink-2">Commission</p>
                <p className="text-3xl font-bold">{(COMMISSION * 100).toFixed(1)}%</p>
                <p className="text-sm text-ink-2">deducted from each payout (sample rate)</p>
              </div>
            </div>

            <Panel title="Listings">
              <Table head={["Grade", "Producer", ...(role === "admin" ? ["Seller"] : []), "Price ₹/kg", "Stock (t)", "Location", ""]}>
                {listings.map((l) => {
                  const it = state.items.find((i) => i.key === l.itemKey);
                  return (
                    <tr key={l.id}>
                      <td className="font-bold text-print">{it?.code}</td>
                      <td>{it?.producer}</td>
                      {role === "admin" && <td>{state.sellers.find((s) => s.id === l.sellerId)?.name}</td>}
                      <td>
                        {editable ? (
                          <label>
                            <span className="sr-only">Price for {it?.code}</span>
                            <input type="number" step="0.25" value={l.price} onChange={(e) => dispatch({ type: "updateListing", id: l.id, patch: { price: Number(e.target.value) } })} className="h-9 w-24 border border-ink bg-sack px-2 font-semibold" />
                          </label>
                        ) : (
                          rs(l.price)
                        )}
                      </td>
                      <td>
                        {editable ? (
                          <label>
                            <span className="sr-only">Stock for {it?.code}</span>
                            <input type="number" value={l.stock} onChange={(e) => dispatch({ type: "updateListing", id: l.id, patch: { stock: Math.max(0, Number(e.target.value)) } })} className="h-9 w-20 border border-ink bg-sack px-2 font-semibold" />
                          </label>
                        ) : (
                          l.stock
                        )}
                      </td>
                      <td>{l.location}</td>
                      <td>{l.stock === 0 ? <Tag>Sold out</Tag> : <Tag tone="ok">Live</Tag>}</td>
                    </tr>
                  );
                })}
              </Table>
            </Panel>
          </div>
        );
      }}
    </Gate>
  );
}
