"use client";

/*
 * A signed-in seller's own screen: their products (price, stock, dispatch time,
 * show or hide), orders from buyers, and open buyer requirements to quote on.
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { BadgeCheck, LogOut, Plus } from "lucide-react";
import { fmtDate, inr, rs, useDemo } from "@/lib/demo/store";
import { COMMISSION, setSellerSession, useSellerSession } from "@/lib/demo/seller-session";
import type { MarketOrder } from "@/lib/demo/types";

const input = "h-11 w-full min-w-0 border-2 border-ink bg-sack px-2 font-semibold tabular-nums";
type Tab = "products" | "orders" | "requests";

export function SellerDashboard() {
  const { state, ready } = useDemo();
  const session = useSellerSession();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("products");
  const seller = state.sellers.find((s) => s.id === session);

  if (!ready || session === undefined) return <p className="frame py-16 text-ink-2">Loading…</p>;
  if (!seller)
    return (
      <div className="frame py-16">
        <h1 className="t-h2">Sign in to see your dashboard</h1>
        <Link href="/marketplace/sell" className="mt-6 inline-flex min-h-12 items-center bg-print px-5 font-semibold text-on-print hover:bg-print-deep">
          Seller login
        </Link>
      </div>
    );

  const mine = state.listings.filter((l) => l.sellerId === seller.id);
  const orders = state.marketOrders.filter((o) => o.sellerId === seller.id);
  const due = orders.filter((o) => o.status !== "New").reduce((a, o) => a + o.qty * 1000 * o.price * (1 - COMMISSION), 0);
  const newOrders = orders.filter((o) => o.status === "New").length;
  const openReqs = state.requirements.filter((r) => !r.responses.some((x) => x.sellerId === seller.id)).length;

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: "products", label: "Products", badge: mine.length },
    { id: "orders", label: "Orders", badge: newOrders || undefined },
    { id: "requests", label: "Buyer requests", badge: openReqs || undefined },
  ];

  return (
    <>
      <section className="border-b-2 border-ink bg-sack-2">
        <div className="frame flex flex-col gap-4 py-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="t-label text-print">Seller dashboard</p>
            <h1 className="t-h2 mt-2 flex flex-wrap items-center gap-3">
              {seller.name}
              {seller.verified && <BadgeCheck aria-label="Checked seller" className="size-7 text-ok" />}
            </h1>
            <p className="mt-1 text-ink-2">
              {seller.city} · GST {seller.gst}
              {seller.rating > 0 && ` · ★ ${seller.rating}`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/marketplace" className="inline-flex min-h-11 items-center border-2 border-ink px-4 font-semibold hover:bg-ink hover:text-sack">
              View the marketplace
            </Link>
            <button
              type="button"
              onClick={() => {
                setSellerSession(null);
                router.push("/marketplace/sell");
              }}
              className="inline-flex min-h-11 items-center gap-2 px-3 font-semibold hover:text-print"
            >
              <LogOut aria-hidden className="size-4" />
              Sign out
            </button>
          </div>
        </div>
      </section>

      <div className="frame py-8">
        {seller.status !== "Live" && (
          <p className="mb-6 border-2 border-warn bg-[oklch(94%_0.05_80)] p-4 font-semibold">
            {seller.status === "Pending"
              ? "Arihant is checking your GST. You can add products now; buyers see them once your account is approved."
              : "Arihant has paused your account. Your products are hidden from buyers until it is resumed."}
          </p>
        )}

        <dl className="grid grid-cols-2 border-y-2 border-ink md:grid-cols-4">
          {[
            ["Products listed", mine.filter((l) => !l.paused).length],
            ["Stock listed", `${mine.filter((l) => !l.paused).reduce((a, l) => a + l.stock, 0)} t`],
            ["New orders", newOrders],
            ["Payout after commission", inr(due)],
          ].map(([k, v], i) => (
            <div key={k} className={`py-4 pe-4 ${i < 2 ? "border-b border-seam md:border-b-0" : ""}`}>
              <dt className="text-sm font-semibold text-ink-2">{k}</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>

        <div role="tablist" aria-label="Seller sections" className="mt-8 flex gap-6 overflow-x-auto border-b-2 border-ink">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`-mb-0.5 flex min-h-12 shrink-0 items-center gap-2 border-b-4 font-semibold ${tab === t.id ? "border-print" : "border-transparent text-ink-2 hover:text-ink"}`}
            >
              {t.label}
              {t.badge !== undefined && <span className={`px-1.5 text-xs ${tab === t.id ? "bg-print text-on-print" : "bg-sack-3"}`}>{t.badge}</span>}
            </button>
          ))}
        </div>

        <div role="tabpanel" className="pt-6">
          {tab === "products" && <Products sellerId={seller.id} city={seller.city} />}
          {tab === "orders" && <Orders orders={orders} />}
          {tab === "requests" && <Requests sellerId={seller.id} />}
        </div>
      </div>
    </>
  );
}

function Products({ sellerId, city }: { sellerId: string; city: string }) {
  const { state, dispatch } = useDemo();
  const mine = state.listings.filter((l) => l.sellerId === sellerId);
  const [adding, setAdding] = useState(mine.length === 0);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-ink-2">Change a price or stock and it shows to buyers straight away.</p>
        {!adding && (
          <button type="button" onClick={() => setAdding(true)} className="inline-flex min-h-11 items-center gap-2 bg-print px-4 font-semibold text-on-print hover:bg-print-deep">
            <Plus aria-hidden className="size-4" />
            Add a product
          </button>
        )}
      </div>
      {adding && <AddProduct sellerId={sellerId} city={city} onClose={() => setAdding(false)} />}

      {mine.length === 0 ? (
        <p className="mt-6 text-lg">No products yet. Add your first grade above.</p>
      ) : (
        <ul className="mt-4 border-t-2 border-ink">
          {mine.map((l) => {
            const it = state.items.find((i) => i.key === l.itemKey);
            return (
              <li key={l.id} className={`grid grid-cols-2 gap-3 border-b border-seam py-4 sm:grid-cols-3 lg:grid-cols-[minmax(0,1.5fr)_8rem_7rem_7rem_auto] lg:items-end ${l.paused ? "opacity-60" : ""}`}>
                <div className="col-span-2 sm:col-span-3 lg:col-span-1 lg:self-center">
                  <p>
                    <span className="t-code text-2xl text-print">{it?.code}</span> <b>{it?.producer}</b>
                  </p>
                  <p className="text-sm text-ink-2">
                    {it?.process} · {l.location} · {l.paused ? "Hidden from buyers" : l.stock > 0 ? "Showing to buyers" : "Sold out"}
                  </p>
                </div>
                <Num label="Price ₹/kg" value={l.price} step={0.25} onChange={(v) => dispatch({ type: "updateListing", id: l.id, patch: { price: v } })} />
                <Num label="Stock (t)" value={l.stock} onChange={(v) => dispatch({ type: "updateListing", id: l.id, patch: { stock: Math.max(0, v) } })} />
                <Num label="Dispatch (days)" value={l.deliveryDays} onChange={(v) => dispatch({ type: "updateListing", id: l.id, patch: { deliveryDays: Math.max(1, v) } })} />
                <div className="col-span-2 flex gap-2 sm:col-span-3 lg:col-span-1">
                  <button type="button" onClick={() => dispatch({ type: "updateListing", id: l.id, patch: { paused: !l.paused } })} className="inline-flex min-h-11 items-center border-2 border-ink px-3 text-sm font-semibold hover:bg-ink hover:text-sack">
                    {l.paused ? "Show" : "Hide"}
                  </button>
                  <button type="button" onClick={() => dispatch({ type: "removeListing", id: l.id })} className="inline-flex min-h-11 items-center px-3 text-sm font-semibold text-print underline underline-offset-4">
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Num({ label, value, step = 1, onChange }: { label: string; value: number; step?: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-ink-2">{label}</span>
      <input type="number" step={step} min={0} value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} className={`${input} mt-1`} />
    </label>
  );
}

function AddProduct({ sellerId, city, onClose }: { sellerId: string; city: string; onClose: () => void }) {
  const { state, dispatch } = useDemo();
  const taken = new Set(state.listings.filter((l) => l.sellerId === sellerId).map((l) => l.itemKey));
  const options = state.items.filter((i) => !taken.has(i.key));
  const [itemKey, setItemKey] = useState(options[0]?.key ?? "");
  const item = state.items.find((i) => i.key === itemKey);
  const [err, setErr] = useState<string | null>(null);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const price = Number(f.get("price"));
    const stock = Number(f.get("stock"));
    const days = Number(f.get("days"));
    if (!itemKey || !(price > 0) || !(stock > 0) || !(days > 0)) return setErr("Pick a grade and enter a price, stock and dispatch days above zero.");
    dispatch({ type: "addListing", listing: { sellerId, itemKey, price, stock, location: city, deliveryDays: days } });
    onClose();
  }

  return (
    <form onSubmit={submit} noValidate className="mt-4 grid gap-3 border-2 border-ink bg-sack-2 p-4 sm:grid-cols-3 lg:grid-cols-[minmax(0,2fr)_8rem_7rem_7rem_auto] lg:items-end">
      <label className="block sm:col-span-3 lg:col-span-1">
        <span className="text-xs font-semibold text-ink-2">Grade</span>
        <select value={itemKey} onChange={(e) => setItemKey(e.target.value)} className={`${input} mt-1`}>
          {options.map((i) => (
            <option key={i.key} value={i.key}>
              {i.code} · {i.producer} · {i.process}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-xs font-semibold text-ink-2">Price ₹/kg</span>
        <input key={itemKey} name="price" type="number" step={0.25} min={0} defaultValue={item ? Math.round((item.rate + 3) * 4) / 4 : ""} className={`${input} mt-1`} />
      </label>
      <label className="block">
        <span className="text-xs font-semibold text-ink-2">Stock (t)</span>
        <input name="stock" type="number" min={1} defaultValue={10} className={`${input} mt-1`} />
      </label>
      <label className="block">
        <span className="text-xs font-semibold text-ink-2">Dispatch (days)</span>
        <input name="days" type="number" min={1} defaultValue={3} className={`${input} mt-1`} />
      </label>
      <div className="flex gap-2 sm:col-span-3 lg:col-span-1">
        <button type="submit" className="inline-flex min-h-11 items-center bg-print px-4 font-semibold text-on-print hover:bg-print-deep">
          Add
        </button>
        <button type="button" onClick={onClose} className="inline-flex min-h-11 items-center px-3 font-semibold underline underline-offset-4">
          Cancel
        </button>
      </div>
      {err && (
        <p role="alert" className="font-semibold text-print sm:col-span-3 lg:col-span-5">
          {err}
        </p>
      )}
    </form>
  );
}

const NEXT: Record<MarketOrder["status"], { to: MarketOrder["status"]; label: string } | null> = {
  New: { to: "Accepted", label: "Accept order" },
  Accepted: { to: "Dispatched", label: "Mark dispatched" },
  Dispatched: null,
};

function Orders({ orders }: { orders: MarketOrder[] }) {
  const { state, dispatch } = useDemo();
  if (orders.length === 0) return <p className="text-lg">No orders yet. They appear here as soon as a buyer orders one of your products.</p>;
  return (
    <ul className="border-t-2 border-ink">
      {orders.map((o) => {
        const it = state.items.find((i) => i.key === o.itemKey);
        const value = o.qty * 1000 * o.price;
        const next = NEXT[o.status];
        return (
          <li key={o.id} className="grid gap-3 border-b border-seam py-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] md:items-center">
            <div>
              <p className="flex flex-wrap items-center gap-2">
                <b>{o.buyerName}</b>
                <span className="text-ink-2">{o.city}</span>
                <StatusTag status={o.status} />
              </p>
              <p className="text-sm text-ink-2">
                {o.id} · {fmtDate(o.date)}
              </p>
            </div>
            <p>
              <span className="t-code text-xl text-print">{it?.code}</span> {o.qty} t × {rs(o.price)}/kg
              <span className="block text-sm text-ink-2">
                {inr(value)} · you receive {inr(value * (1 - COMMISSION))} after {(COMMISSION * 100).toFixed(1)}% commission
              </span>
            </p>
            <div>
              {next ? (
                <button type="button" onClick={() => dispatch({ type: "marketOrderStatus", id: o.id, status: next.to })} className="inline-flex min-h-11 items-center bg-print px-4 font-semibold text-on-print hover:bg-print-deep">
                  {next.label}
                </button>
              ) : (
                <span className="text-sm text-ink-2">Paid out after the buyer confirms delivery</span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function StatusTag({ status }: { status: MarketOrder["status"] }): ReactNode {
  const tone = status === "New" ? "bg-print-tint text-print-deep" : status === "Accepted" ? "bg-[oklch(94%_0.05_80)] text-warn" : "bg-[oklch(93%_0.04_150)] text-ok";
  return <span className={`px-2 py-0.5 text-xs font-semibold ${tone}`}>{status}</span>;
}

function Requests({ sellerId }: { sellerId: string }) {
  const { state, dispatch } = useDemo();
  const [draft, setDraft] = useState<Record<string, { price: string; days: string }>>({});
  if (state.requirements.length === 0) return <p className="text-lg">No open buyer requests right now.</p>;
  return (
    <div>
      <p className="text-ink-2">Buyers who could not find a grade posted what they need. Send your price; the buyer sees every seller&apos;s reply.</p>
      <ul className="mt-4 border-t-2 border-ink">
        {state.requirements.map((r) => {
          const it = state.items.find((i) => i.key === r.itemKey);
          const mine = r.responses.find((x) => x.sellerId === sellerId);
          const d = draft[r.id] ?? { price: it ? String(Math.round((it.rate + 3) * 4) / 4) : "", days: "3" };
          return (
            <li key={r.id} className="grid gap-3 border-b border-seam py-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-end">
              <div>
                <p>
                  <span className="t-code text-xl text-print">{it?.code}</span> <b>{it?.producer}</b> · {r.qty} t
                </p>
                <p className="text-sm text-ink-2">
                  {r.buyerName}, {r.city} · posted {fmtDate(r.date)} · {r.responses.length} {r.responses.length === 1 ? "price" : "prices"} sent so far
                </p>
              </div>
              {mine ? (
                <p className="font-semibold">
                  You sent {rs(mine.price)}/kg, dispatch in {mine.days} days.
                </p>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const price = Number(d.price);
                    const days = Number(d.days);
                    if (price > 0 && days > 0) dispatch({ type: "respond", reqId: r.id, sellerId, price, days });
                  }}
                  className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-end gap-2"
                >
                  <label className="block">
                    <span className="text-xs font-semibold text-ink-2">Your price ₹/kg</span>
                    <input type="number" step={0.25} value={d.price} onChange={(e) => setDraft({ ...draft, [r.id]: { ...d, price: e.target.value } })} className={`${input} mt-1`} />
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold text-ink-2">Dispatch (days)</span>
                    <input type="number" min={1} value={d.days} onChange={(e) => setDraft({ ...draft, [r.id]: { ...d, days: e.target.value } })} className={`${input} mt-1`} />
                  </label>
                  <button type="submit" className="inline-flex min-h-11 items-center bg-print px-4 font-semibold text-on-print hover:bg-print-deep">
                    Send price
                  </button>
                </form>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
