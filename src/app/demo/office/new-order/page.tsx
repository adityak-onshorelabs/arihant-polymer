"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { inr, owed, rs, useDemo } from "@/lib/demo/store";
import { Btn, Gate, ORDER_TABS, PageTitle, Panel, SubTabs, Tag } from "@/components/demo/ui";
import type { Order } from "@/lib/demo/types";

export default function NewOrder() {
  const { state, dispatch, free } = useDemo();
  const [buyerId, setBuyerId] = useState(state.buyers[0].id);
  const [itemKey, setItemKey] = useState(() => state.items.find((i) => i.code === "H030SG")?.key ?? state.items[0].key);
  const [qty, setQty] = useState(8);
  const [source, setSource] = useState<Order["source"]>("Phone");
  const [priceOverride, setPriceOverride] = useState<string>("");
  const [booked, setBooked] = useState<string | null>(null);

  const buyer = state.buyers.find((b) => b.id === buyerId)!;
  const item = state.items.find((i) => i.key === itemKey)!;
  const suggested = Math.round((item.rate + buyer.freight + state.margins.default) * 100) / 100;
  const price = Number(priceOverride) || suggested;
  const value = qty * 1000 * price * 1.18;
  const available = free(itemKey);
  const owes = owed(state, buyer.id);
  const over = owes + value > buyer.creditLimit;
  const history = useMemo(() => state.orders.filter((o) => o.buyerId === buyerId).slice(0, 4), [state.orders, buyerId]);

  return (
    <Gate module="orders">
      {() => state.role === "owner" || state.role === "sales" ? (
        <div className="space-y-6">
          <PageTitle title="Orders" sub="Write down a phone or WhatsApp order in under a minute. The material is kept aside for the buyer as soon as you book." />
          <SubTabs items={ORDER_TABS} />
          <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
            <div className="space-y-6">
              <Panel title="1 · Who is ordering">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-ink-2">Buyer</span>
                    <select value={buyerId} onChange={(e) => setBuyerId(e.target.value)} className="mt-1 h-12 w-full border-2 border-ink bg-sack px-2 font-semibold">
                      {state.buyers.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} · {b.city}
                        </option>
                      ))}
                    </select>
                  </label>
                  <fieldset>
                    <legend className="text-sm font-semibold text-ink-2">Came in by</legend>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {(["Phone", "WhatsApp", "Website", "Quote"] as const).map((s) => (
                        <button key={s} type="button" aria-pressed={source === s} onClick={() => setSource(s)} className={`min-h-12 border-2 border-ink px-3 text-sm font-semibold ${source === s ? "bg-ink text-sack" : "hover:bg-sack-2"}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                </div>
                {history.length > 0 && (
                  <p className="mt-4 text-sm text-ink-2">
                    Last orders:{" "}
                    {history.map((o) => {
                      const it = state.items.find((i) => i.key === o.itemKey);
                      return (
                        <button key={o.id} type="button" onClick={() => { setItemKey(o.itemKey); setQty(o.qty); }} className="me-2 font-semibold text-ink underline underline-offset-4">
                          {it?.code} {o.qty} t
                        </button>
                      );
                    })}
                    <span className="text-xs">(tap to repeat)</span>
                  </p>
                )}
              </Panel>

              <Panel title="2 · What">
                <div className="grid gap-4 sm:grid-cols-[1fr_12rem]">
                  <label className="block">
                    <span className="text-sm font-semibold text-ink-2">Grade</span>
                    <select value={itemKey} onChange={(e) => { setItemKey(e.target.value); setPriceOverride(""); }} className="mt-1 h-12 w-full border-2 border-ink bg-sack px-2 font-semibold">
                      {state.items.map((i) => (
                        <option key={i.key} value={i.key}>
                          {i.code} · {i.producer} · {i.process}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div>
                    <span className="text-sm font-semibold text-ink-2" id="no-qty">
                      Tonnes
                    </span>
                    <div className="mt-1 flex h-12 border-2 border-ink">
                      <button type="button" aria-label="Less" onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-11 border-e-2 border-ink">
                        <Minus aria-hidden className="mx-auto size-4" />
                      </button>
                      <input aria-labelledby="no-qty" inputMode="numeric" value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value.replace(/\D/g, "")) || 1))} className="w-full bg-transparent text-center font-bold" />
                      <button type="button" aria-label="More" onClick={() => setQty((q) => q + 1)} className="w-11 border-s-2 border-ink">
                        <Plus aria-hidden className="mx-auto size-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <label className="mt-4 block max-w-xs">
                  <span className="text-sm font-semibold text-ink-2">Price ₹/kg ex GST (suggested {rs(suggested)})</span>
                  <input inputMode="decimal" value={priceOverride} placeholder={suggested.toFixed(2)} onChange={(e) => setPriceOverride(e.target.value)} className="mt-1 h-12 w-full border-2 border-ink bg-sack px-3 font-bold" />
                </label>
              </Panel>
            </div>

            <Panel title="3 · Check and book">
              <dl className="divide-y divide-seam text-sm">
                {[
                  ["Grade", `${item.code} ${item.producer}`],
                  ["Quantity", `${qty} t`],
                  ["Price", `${rs(price)}/kg`],
                  ["Value incl. GST", inr(value)],
                  ["Free stock", `${available} t`],
                  ["Buyer owes now", inr(owes)],
                  ["Credit limit", inr(buyer.creditLimit)],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2">
                    <dt className="text-ink-2">{k}</dt>
                    <dd className="font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-3 space-y-2">
                {available < qty && <Tag tone="warn">{qty - Math.max(0, available)} t to be bought from the producer</Tag>}
                {over && (
                  <p className="text-sm font-semibold text-print">This takes {buyer.name} over the credit limit. The order will wait for the owner&apos;s approval.</p>
                )}
              </div>
              <Btn
                className="mt-4 w-full"
                onClick={() => {
                  dispatch({ type: "addOrder", order: { buyerId, itemKey, qty, price, godown: "MLD", source } });
                  setBooked(`${item.code}, ${qty} t for ${buyer.name}`);
                }}
              >
                Book order
              </Btn>
              {booked && (
                <p className="mt-3 border-2 border-ok bg-[oklch(96%_0.03_150)] p-3 text-sm" role="status">
                  Booked: {booked}. Stock set aside, buyer sent a WhatsApp confirmation.{" "}
                  <Link href="/demo/office/orders" className="font-semibold underline underline-offset-4">
                    See orders
                  </Link>
                </p>
              )}
            </Panel>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <PageTitle title="Orders" />
          <SubTabs items={ORDER_TABS} />
          <p className="max-w-lg text-lg">Booking new orders is for Harsh and the sales team. Switch to Harsh or Rohit at the top to try it.</p>
        </div>
      )}
    </Gate>
  );
}
