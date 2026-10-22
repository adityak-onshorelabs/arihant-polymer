"use client";

import { useState } from "react";
import { daysBetween, fmtDate, inr, owed, rs, useDemo } from "@/lib/demo/store";
import { TODAY } from "@/lib/demo/seed";
import { roleInfo } from "@/lib/demo/access";
import { Gate, LevelNote, PageTitle, Panel, Table, Tag } from "@/components/demo/ui";

export default function Buyers() {
  const { state } = useDemo();
  const [sel, setSel] = useState<string | null>(null);
  return (
    <Gate module="buyers">
      {(level) => {
        const me = state.role ? roleInfo[state.role].who : "";
        const buyers = level === "own" ? state.buyers.filter((b) => b.salesperson === me) : state.buyers;
        const b = state.buyers.find((x) => x.id === (sel ?? buyers[0]?.id));
        const orders = b ? state.orders.filter((o) => o.buyerId === b.id) : [];
        const invoices = b ? state.invoices.filter((i) => i.buyerId === b.id) : [];
        const quotes = b ? state.quotes.filter((q) => q.buyerId === b.id) : [];
        return (
          <div className="space-y-6">
            <PageTitle title="Buyers" sub="Every buyer's history in one place: orders, quotes, money owed and when they usually order again.">
              <LevelNote level={level} />
            </PageTitle>
            <div className="grid gap-6 xl:grid-cols-[1fr_26rem]">
              <Panel title={`${buyers.length} buyers`}>
                <Table head={["Buyer", "Last order", "Owes", ""]}>
                  {buyers.map((x) => {
                    const due = daysBetween(x.lastOrder, TODAY) >= x.cycleDays - 3;
                    return (
                      <tr key={x.id} className={b?.id === x.id ? "bg-print-tint" : ""}>
                        <td>
                          <b>{x.name}</b>
                          <div className="text-sm text-ink-2">
                            {x.city} · {x.salesperson}
                          </div>
                        </td>
                        <td>
                          {fmtDate(x.lastOrder)}
                          {due && (
                            <div className="mt-1">
                              <Tag tone="warn">Usually orders now</Tag>
                            </div>
                          )}
                        </td>
                        <td>{inr(owed(state, x.id))}</td>
                        <td className="text-end">
                          <button type="button" onClick={() => setSel(x.id)} className="min-h-9 border border-ink px-3 text-xs font-semibold hover:bg-ink hover:text-sack">
                            Open
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </Table>
              </Panel>
              {b && (
                <Panel title="Buyer record">
                  <p className="text-xl font-bold">{b.name}</p>
                  <p className="text-ink-2">
                    {b.city} · {b.salesperson} · {b.creditDays} days credit
                  </p>
                  <dl className="mt-4 grid grid-cols-2 gap-x-4 border-t border-seam text-sm">
                    {[
                      ["Credit limit", inr(b.creditLimit)],
                      ["Owes", inr(owed(state, b.id))],
                      ["Freight", `${rs(b.freight)}/kg`],
                      ["Usual cycle", `${b.cycleDays} days`],
                    ].map(([k, v]) => (
                      <div key={k} className="border-b border-seam py-2">
                        <dt className="text-ink-2">{k}</dt>
                        <dd className="font-semibold">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <h3 className="text-sm font-semibold mt-5 text-ink-2">Orders</h3>
                  <ul className="mt-1 divide-y divide-seam text-sm">
                    {orders.length === 0 && <li className="py-2 text-ink-2">None yet.</li>}
                    {orders.map((o) => (
                      <li key={o.id} className="flex justify-between py-2">
                        <span>
                          {fmtDate(o.date)} · <b>{state.items.find((i) => i.key === o.itemKey)?.code}</b> {o.qty} t
                        </span>
                        <Tag tone={o.stage === "Paid" ? "ok" : "plain"}>{o.stage}</Tag>
                      </li>
                    ))}
                  </ul>
                  <h3 className="text-sm font-semibold mt-5 text-ink-2">Quotes</h3>
                  <ul className="mt-1 divide-y divide-seam text-sm">
                    {quotes.length === 0 && <li className="py-2 text-ink-2">None.</li>}
                    {quotes.map((q) => (
                      <li key={q.id} className="flex justify-between py-2">
                        <span>
                          {q.id} · <b>{state.items.find((i) => i.key === q.itemKey)?.code}</b> {q.qty} t at {rs(q.inStockPrice)}
                        </span>
                        <Tag>{q.status}</Tag>
                      </li>
                    ))}
                  </ul>
                  <h3 className="text-sm font-semibold mt-5 text-ink-2">Invoices</h3>
                  <ul className="mt-1 divide-y divide-seam text-sm">
                    {invoices.length === 0 && <li className="py-2 text-ink-2">None.</li>}
                    {invoices.map((i) => (
                      <li key={i.id} className="flex justify-between py-2">
                        <span>
                          {i.id} · {inr(i.amount)}
                        </span>
                        <Tag tone={i.paid ? "ok" : i.due < TODAY ? "print" : "plain"}>{i.paid ? "Paid" : i.due < TODAY ? "Overdue" : `Due ${fmtDate(i.due)}`}</Tag>
                      </li>
                    ))}
                  </ul>
                </Panel>
              )}
            </div>
          </div>
        );
      }}
    </Gate>
  );
}
