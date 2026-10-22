"use client";

/*
 * Quick Quote (module 2.1). Quantity control adapts Watermelon UI `stepper`
 * (reference/watermelon/stepper.tsx): kept the plus/minus stepper idea; removed
 * the spring digit roll; rebuilt with a labelled number input and 44px buttons.
 */

import { useMemo, useState } from "react";
import { Minus, Plus, Send } from "lucide-react";
import { addDays, TODAY } from "@/lib/demo/seed";
import { fmtDate, inr, rs, useDemo } from "@/lib/demo/store";
import { roleInfo } from "@/lib/demo/access";
import { Btn, Gate, LevelNote, PageTitle, Panel, Table, Tag } from "@/components/demo/ui";

export default function QuickQuote() {
  const { state, dispatch, free } = useDemo();
  const [itemKey, setItemKey] = useState(() => state.items.find((i) => i.code === "MI3530")?.key ?? state.items[0].key);
  const [buyerId, setBuyerId] = useState(state.buyers[0].id);
  const [qty, setQty] = useState(10);
  const [margin, setMargin] = useState(state.margins.default);
  const [sent, setSent] = useState<string | null>(null);

  const item = state.items.find((i) => i.key === itemKey)!;
  const buyer = state.buyers.find((b) => b.id === buyerId)!;
  const move = state.priceMoves.find((p) => p.producer === item.producer && p.family === item.family);

  const calc = useMemo(() => {
    const available = Math.max(0, free(item.key));
    const inStockQty = Math.min(qty, available);
    const toBuyQty = Math.max(0, qty - available);
    const replacement = item.rate + (move?.change ?? 0) + 0.6; // next producer price + inward freight
    const inStockPrice = item.rate + buyer.freight + margin;
    const toBuyPrice = replacement + buyer.freight + margin;
    const blended = (inStockQty * inStockPrice + toBuyQty * toBuyPrice) / Math.max(qty, 1);
    return { available, inStockQty, toBuyQty, inStockPrice, toBuyPrice, blended, replacement };
  }, [item, buyer, qty, margin, move, free]);

  const belowMin = margin < state.margins.min;

  return (
    <Gate module="quote">
      {(level) => {
        const me = state.role ? roleInfo[state.role].who : "";
        const canWrite = level === "full";
        const quotes = state.quotes;
        const msg = `Arihant Polymer · Quote for ${buyer.name}\n${item.code} ${item.producer}, ${qty} t to ${buyer.city}\n${calc.inStockQty > 0 ? `In stock (${calc.inStockQty} t): ${rs(calc.inStockPrice)}/kg\n` : ""}${calc.toBuyQty > 0 ? `To be bought (${calc.toBuyQty} t): ${rs(calc.toBuyPrice)}/kg\n` : ""}Freight included, GST 18% extra. Valid until 6 pm today.`;

        return (
          <div className="space-y-6">
            <PageTitle title="Rates and quotes" sub="Pick a grade, a buyer and a quantity. The rate is worked out from the last purchase price, freight and your margin.">
              <LevelNote level={level} />
            </PageTitle>

            <div className="grid gap-6 xl:grid-cols-5">
              <Panel title="Build a quote" className="xl:col-span-3">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-ink-2">Grade</span>
                    <select value={itemKey} onChange={(e) => setItemKey(e.target.value)} disabled={!canWrite} className="mt-1 h-12 w-full border-2 border-ink bg-sack px-2 font-semibold">
                      {state.items.map((i) => (
                        <option key={i.key} value={i.key}>
                          {i.code} · {i.producer} · {i.process}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-ink-2">Buyer</span>
                    <select value={buyerId} onChange={(e) => setBuyerId(e.target.value)} disabled={!canWrite} className="mt-1 h-12 w-full border-2 border-ink bg-sack px-2 font-semibold">
                      {state.buyers.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} · {b.city}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div>
                    <span className="text-sm font-semibold text-ink-2" id="qty-label">
                      Quantity (tonnes)
                    </span>
                    <div className="mt-1 flex h-12 border-2 border-ink">
                      <button type="button" aria-label="Less" disabled={!canWrite} onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-12 border-e-2 border-ink hover:bg-sack-2">
                        <Minus aria-hidden className="mx-auto size-4" />
                      </button>
                      <input aria-labelledby="qty-label" inputMode="numeric" disabled={!canWrite} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value.replace(/\D/g, "")) || 1))} className="w-full bg-transparent text-center text-lg font-bold" />
                      <button type="button" aria-label="More" disabled={!canWrite} onClick={() => setQty((q) => q + 1)} className="w-12 border-s-2 border-ink hover:bg-sack-2">
                        <Plus aria-hidden className="mx-auto size-4" />
                      </button>
                    </div>
                  </div>
                  <label className="block">
                    <span className="text-sm font-semibold text-ink-2">Margin (Rs/kg) · owner minimum {rs(state.margins.min)}</span>
                    <input type="number" step="0.25" min={0} disabled={!canWrite} value={margin} onChange={(e) => setMargin(Number(e.target.value))} className="mt-1 h-12 w-full border-2 border-ink bg-sack px-3 text-lg font-bold" />
                  </label>
                </div>

                <dl className="mt-6 grid grid-cols-2 gap-x-6 border-t border-seam text-sm sm:grid-cols-4">
                  {[
                    ["Last purchase rate", rs(item.rate)],
                    ["Producer move", move ? `${move.change > 0 ? "+" : ""}${move.change.toFixed(2)} on ${fmtDate(move.date)}` : "None recent"],
                    ["Freight to " + buyer.city, rs(buyer.freight)],
                    ["Free stock", `${calc.available} t`],
                  ].map(([k, v]) => (
                    <div key={k} className="border-b border-seam py-2">
                      <dt className="text-ink-2">{k}</dt>
                      <dd className="font-semibold">{v}</dd>
                    </div>
                  ))}
                </dl>
              </Panel>

              <Panel title="Your price" className="xl:col-span-2">
                <div className="divide-y divide-seam">
                  <div className="flex items-baseline justify-between py-3">
                    <span>
                      In stock, <b>{calc.inStockQty} t</b>
                    </span>
                    <span className="text-2xl font-bold">{calc.inStockQty > 0 ? `${rs(calc.inStockPrice)}/kg` : "None free"}</span>
                  </div>
                  <div className="flex items-baseline justify-between py-3">
                    <span>
                      To be bought, <b>{calc.toBuyQty} t</b>
                    </span>
                    <span className="text-2xl font-bold">{calc.toBuyQty > 0 ? `${rs(calc.toBuyPrice)}/kg` : "Not needed"}</span>
                  </div>
                  <div className="flex items-baseline justify-between py-3 text-sm">
                    <span>Order value ex GST</span>
                    <span className="font-semibold">{inr(calc.blended * qty * 1000)}</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-ink-2">Freight included, GST extra. Valid until 6 pm today.</p>
                {belowMin && (
                  <p className="mt-3 font-semibold text-print" role="alert">
                    Below the owner&apos;s minimum margin. This quote will go to {state.role === "owner" ? "you" : "Harsh Jain"} for approval.
                  </p>
                )}
                {canWrite && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Btn
                      onClick={() => {
                        dispatch({
                          type: "addQuote",
                          quote: {
                            date: TODAY,
                            buyerId,
                            itemKey,
                            qty,
                            inStockQty: calc.inStockQty,
                            inStockPrice: Math.round(calc.inStockPrice * 100) / 100,
                            toBuyPrice: Math.round(calc.toBuyPrice * 100) / 100,
                            margin,
                            status: belowMin && state.role !== "owner" ? "Needs approval" : "Sent",
                            by: me,
                            validUntil: TODAY,
                          },
                        });
                        setSent(msg);
                      }}
                    >
                      <Send aria-hidden className="size-4" />
                      {belowMin && state.role !== "owner" ? "Send for approval" : "Send on WhatsApp"}
                    </Btn>
                  </div>
                )}
                {sent && (
                  <div className="mt-4 border-2 border-ok bg-[oklch(96%_0.03_150)] p-3 text-sm" role="status">
                    <p className="text-sm font-semibold text-ok">Quote saved. WhatsApp message:</p>
                    <pre className="mt-2 whitespace-pre-wrap font-sans">{sent}</pre>
                  </div>
                )}
              </Panel>
            </div>

            <Panel title="Quotes">
              <Table head={["Quote", "Date", "Buyer", "Grade", "Qty", "In stock", "To buy", "By", "Status", ""]}>
                {quotes.map((q) => {
                  const b = state.buyers.find((x) => x.id === q.buyerId);
                  const it = state.items.find((x) => x.key === q.itemKey);
                  return (
                    <tr key={q.id}>
                      <td className="font-semibold">{q.id}</td>
                      <td>{fmtDate(q.date)}</td>
                      <td>{b?.name}</td>
                      <td>
                        <b>{it?.code}</b> {it?.producer}
                      </td>
                      <td>{q.qty} t</td>
                      <td>{q.inStockQty > 0 ? rs(q.inStockPrice) : "-"}</td>
                      <td>{rs(q.toBuyPrice)}</td>
                      <td>{q.by}</td>
                      <td>
                        <Tag tone={q.status === "Won" ? "ok" : q.status === "Lost" ? "plain" : q.status === "Needs approval" ? "print" : "warn"}>{q.status}</Tag>
                      </td>
                      <td className="text-end">
                        {canWrite && q.status === "Sent" && (
                          <Btn variant="line" onClick={() => dispatch({ type: "quoteToOrder", quoteId: q.id })}>
                            Make order
                          </Btn>
                        )}
                        {state.role === "owner" && q.status === "Needs approval" && (
                          <Btn variant="line" onClick={() => dispatch({ type: "approveQuote", quoteId: q.id })}>
                            Approve
                          </Btn>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </Table>
              <p className="mt-3 text-xs text-ink-2">Valid-until dates shown are the quote day; quotes expire at 6 pm. Next working day: {fmtDate(addDays(TODAY, 1))}.</p>
            </Panel>
          </div>
        );
      }}
    </Gate>
  );
}
