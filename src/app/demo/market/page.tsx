"use client";

import Link from "next/link";
import { ExternalLink, Store } from "lucide-react";
import { families } from "@/content/catalogue";
import { fmtDate, inr, useDemo } from "@/lib/demo/store";
import { COMMISSION } from "@/lib/demo/seller-session";
import { Btn, Gate, PageTitle, Panel, Table, Tag } from "@/components/demo/ui";

/**
 * The marketplace itself lives on the website (/marketplace, with its own seller
 * login). This is Arihant's side of it: who may sell, what it earns, and every sale.
 */
export default function MarketControl() {
  const { state, dispatch } = useDemo();
  return (
    <Gate module="search">
      {(level) => {
        const canEdit = level === "full";
        const live = state.sellers.filter((s) => s.status === "Live").length;
        const sales = state.marketOrders.reduce((a, o) => a + o.qty * 1000 * o.price, 0);
        const demand = families
          .map((f) => ({
            f,
            asks: state.requirements.filter((r) => state.items.find((i) => i.key === r.itemKey)?.family === f.id).reduce((a, r) => a + r.qty, 0) + state.enquiries.filter((e) => state.items.find((i) => i.key === e.itemKey)?.family === f.id).reduce((a, e) => a + e.qty, 0),
            listed: state.listings.filter((l) => state.items.find((i) => i.key === l.itemKey)?.family === f.id).reduce((a, l) => a + l.stock, 0),
          }))
          .filter((d) => d.asks > 0 || d.listed > 0);
        return (
          <div className="space-y-6">
            <PageTitle title="Marketplace" sub={`The marketplace runs on Arihant's website. Here Arihant decides who sells and sees every sale. ${live} sellers live now.`} />

            <div data-tour="market-open" className="weave-print grid gap-4 p-5 text-on-print md:grid-cols-[1fr_auto] md:items-center md:p-6">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <Store aria-hidden className="size-4" />
                  On the website, under the Marketplace button
                </p>
                <p className="t-h3 mt-2 text-[1.7rem]">Buyers compare and order there. Sellers sign in there.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href="/marketplace" target="_blank" className="inline-flex min-h-12 items-center gap-2 bg-sack px-4 font-semibold text-print hover:bg-sack-2">
                  Open the marketplace
                  <ExternalLink aria-hidden className="size-4" />
                </Link>
                <Link href="/marketplace/sell" target="_blank" className="inline-flex min-h-12 items-center gap-2 border-2 border-sack px-4 font-semibold text-on-print hover:bg-sack hover:text-print">
                  Seller login
                  <ExternalLink aria-hidden className="size-4" />
                </Link>
              </div>
            </div>

            <Panel title="Sellers" tour="market-sellers">
              <Table head={["Seller", "City", "GST", "Rating", "Status", ""]}>
                {state.sellers
                  .filter((s) => s.id !== "arihant")
                  .map((s) => (
                    <tr key={s.id}>
                      <td className="font-semibold">{s.name}</td>
                      <td>{s.city}</td>
                      <td className="font-mono text-xs">{s.gst}</td>
                      <td>{s.rating ? `★ ${s.rating}` : "New"}</td>
                      <td>
                        <Tag tone={s.status === "Live" ? "ok" : s.status === "Pending" ? "warn" : "plain"}>{s.status === "Pending" ? "Awaiting checks" : s.status}</Tag>
                      </td>
                      <td className="space-x-2 text-end">
                        {canEdit && s.status !== "Live" && <Btn onClick={() => dispatch({ type: "sellerStatus", id: s.id, status: "Live" })}>{s.status === "Pending" ? "Approve" : "Resume"}</Btn>}
                        {canEdit && s.status === "Live" && (
                          <Btn variant="line" onClick={() => dispatch({ type: "sellerStatus", id: s.id, status: "Paused" })}>
                            Pause
                          </Btn>
                        )}
                      </td>
                    </tr>
                  ))}
              </Table>
            </Panel>

            <Panel title={`Sales on the marketplace · ${inr(sales)}`} tour="market-orders">
              {state.marketOrders.length === 0 ? (
                <p className="text-ink-2">No orders yet.</p>
              ) : (
                <Table head={["Date", "Buyer", "Seller", "Grade", "Qty", "Value", "Arihant earns", "Status"]}>
                  {state.marketOrders.map((o) => {
                    const it = state.items.find((i) => i.key === o.itemKey);
                    const value = o.qty * 1000 * o.price;
                    return (
                      <tr key={o.id}>
                        <td>{fmtDate(o.date)}</td>
                        <td className="font-semibold">{o.buyerName}</td>
                        <td>{state.sellers.find((s) => s.id === o.sellerId)?.name}</td>
                        <td className="font-bold text-print">{it?.code}</td>
                        <td>{o.qty} t</td>
                        <td>{inr(value)}</td>
                        <td>{o.sellerId === "arihant" ? "Own stock" : inr(value * COMMISSION)}</td>
                        <td>
                          <Tag tone={o.status === "Dispatched" ? "ok" : o.status === "Accepted" ? "warn" : "print"}>{o.status}</Tag>
                        </td>
                      </tr>
                    );
                  })}
                </Table>
              )}
              <p className="mt-3 text-sm text-ink-2">Orders for Arihant&apos;s own stock also land in Enquiries for the sales team.</p>
            </Panel>

            <div className="grid gap-6 lg:grid-cols-2">
              <Panel title="Earning settings (sample values)">
                <ul className="divide-y divide-seam text-sm">
                  {[
                    ["Commission on each sale", `${(COMMISSION * 100).toFixed(1)}%`],
                    ["Seller plan, standard", "₹2,500 / month"],
                    ["Featured listing", "₹1,000 / grade / week"],
                    ["Arihant delivery service", "from ₹0.40 / kg"],
                  ].map(([k, v]) => (
                    <li key={k} className="flex justify-between py-2">
                      <span>{k}</span>
                      <b>{v}</b>
                    </li>
                  ))}
                </ul>
              </Panel>
              <Panel title="Market insight: demand vs listed">
                <ul className="space-y-3 text-sm">
                  {demand.map(({ f, asks, listed }) => (
                    <li key={f.id}>
                      <div className="flex justify-between">
                        <b>{f.short}</b>
                        <span className="text-ink-2">
                          asked {asks} t · listed {listed} t
                        </span>
                      </div>
                      <div className="mt-1 flex h-2 gap-0.5">
                        <div className="bg-print" style={{ width: `${Math.min(100, asks)}%` }} />
                        <div className="bg-ink/40" style={{ width: `${Math.min(100, listed / 4)}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-ink-2">Red: tonnes asked in enquiries and requirements. Grey: tonnes listed (scaled). Gaps show which sellers to bring in.</p>
              </Panel>
            </div>
          </div>
        );
      }}
    </Gate>
  );
}
