"use client";

import { useState } from "react";
import { fmtDate, rs, useDemo } from "@/lib/demo/store";
import { Btn, Gate, LevelNote, MARKET_TABS, PageTitle, Panel, SubTabs, Tag } from "@/components/demo/ui";

const ME_BUYER = { name: "Shree Ganesh Moulders", city: "Vapi GIDC" };
const ME_SELLER = "S1";

export default function Requirements() {
  const { state, dispatch } = useDemo();
  const [itemKey, setItemKey] = useState(state.items[0].key);
  const [qty, setQty] = useState(10);
  const [price, setPrice] = useState<Record<string, string>>({});

  return (
    <Gate module="search">
      {(level) => {
        const list = state.requirements;
        return (
          <div className="space-y-6">
            <PageTitle title="Marketplace" sub="A buyer posts what they need once; sellers send their prices.">
              <LevelNote level={level} />
            </PageTitle>

            <SubTabs items={MARKET_TABS} />
            {(
              <Panel title="Try it as a buyer: post a request">
                <div className="flex flex-wrap items-end gap-3">
                  <label className="block">
                    <span className="text-sm font-semibold text-ink-2">Grade</span>
                    <select value={itemKey} onChange={(e) => setItemKey(e.target.value)} className="mt-1 block h-12 border-2 border-ink bg-sack px-2 font-semibold">
                      {state.items.map((i) => (
                        <option key={i.key} value={i.key}>
                          {i.code} · {i.producer}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-ink-2">Tonnes</span>
                    <input type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value)))} className="mt-1 block h-12 w-24 border-2 border-ink bg-sack px-2 font-bold" />
                  </label>
                  <Btn className="h-12" onClick={() => dispatch({ type: "postRequirement", req: { buyerName: ME_BUYER.name, city: ME_BUYER.city, itemKey, qty } })}>
                    Post to sellers
                  </Btn>
                </div>
              </Panel>
            )}

            <div className="space-y-3">
              {list.map((r) => {
                const it = state.items.find((i) => i.key === r.itemKey);
                const mine = r.responses.find((x) => x.sellerId === ME_SELLER);
                return (
                  <Panel key={r.id}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p>
                        <span className="t-code text-2xl text-print">{it?.code}</span>
                        <span className="ms-2 font-semibold">{it?.producer}</span> · {r.qty} t to {r.city}
                      </p>
                      <span className="text-sm text-ink-2">
                        {r.buyerName} · {fmtDate(r.date)}
                      </span>
                    </div>
                    <ul className="mt-3 divide-y divide-seam border-t border-seam text-sm">
                      {r.responses.length === 0 && <li className="py-2 text-ink-2">No quotes yet.</li>}
                      {r.responses
                        .slice()
                        .sort((a, b) => a.price - b.price)
                        .map((x, i) => (
                          <li key={x.sellerId} className="flex justify-between py-2">
                            <span>
                              <b>{state.sellers.find((s) => s.id === x.sellerId)?.name}</b> {i === 0 && <Tag tone="ok">Lowest</Tag>}
                            </span>
                            <span>
                              {rs(x.price)}/kg · {x.days} days
                            </span>
                          </li>
                        ))}
                    </ul>
                    {(
                      <div className="mt-3 flex flex-wrap items-center gap-2 bg-sack-2 p-3">
                        <span className="text-sm font-semibold">{mine ? "Update the price" : "Try it as a seller: send a price as Shah Petrochem"}</span>
                        <label className="flex items-center gap-1 text-sm">
                          ₹/kg
                          <input value={price[r.id] ?? ""} onChange={(e) => setPrice((p) => ({ ...p, [r.id]: e.target.value }))} inputMode="decimal" className="h-10 w-24 border-2 border-ink bg-sack px-2 font-bold" />
                        </label>
                        <Btn
                          variant="line"
                          disabled={!Number(price[r.id])}
                          onClick={() => dispatch({ type: "respond", reqId: r.id, sellerId: ME_SELLER, price: Number(price[r.id]), days: 3 })}
                        >
                          Send quote
                        </Btn>
                      </div>
                    )}
                  </Panel>
                );
              })}
            </div>
          </div>
        );
      }}
    </Gate>
  );
}
