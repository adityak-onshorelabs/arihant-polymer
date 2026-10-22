"use client";

/*
 * Public marketplace: one search across every live seller's stock, cheapest
 * first, with an order form under each offer. Runs on the shared demo store,
 * so sellers' edits, Arihant's approvals and new orders show up everywhere.
 */

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { ArrowRight, BadgeCheck, Search, Store } from "lucide-react";
import { families, type Family } from "@/content/catalogue";
import { rs, useDemo } from "@/lib/demo/store";
import { FamilySwatch } from "@/components/site/bag-face";

const PAGE = 20;
const field = "h-12 w-full min-w-0 border-2 border-ink bg-sack px-3 font-semibold";

export function MarketBrowse() {
  const { state, dispatch, ready } = useDemo();
  const [q, setQ] = useState("");
  const [fam, setFam] = useState<Family | "ALL">("ALL");
  const [shown, setShown] = useState(PAGE);
  const [open, setOpen] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const all = useMemo(() => {
    const live = new Set(state.sellers.filter((s) => s.status === "Live").map((s) => s.id));
    return state.items
      .map((i) => ({ item: i, offers: state.listings.filter((l) => l.itemKey === i.key && live.has(l.sellerId) && !l.paused && l.stock > 0).sort((a, b) => a.price - b.price) }))
      .filter((g) => g.offers.length > 0);
  }, [state.items, state.listings, state.sellers]);

  const groups = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return all.filter(({ item: i }) => (fam === "ALL" || i.family === fam) && (!ql || `${i.code} ${i.producer} ${i.process}`.toLowerCase().includes(ql)));
  }, [all, q, fam]);

  const famTabs = families.map((f) => ({ ...f, count: all.filter((g) => g.item.family === f.id).length })).filter((f) => f.count > 0);
  const sellersLive = state.sellers.filter((s) => s.status === "Live").length;

  return (
    <>
      <section className="border-b-2 border-ink">
        <div className="frame grid gap-10 py-12 md:py-16 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="t-label text-print">Arihant Marketplace</p>
            <h1 className="t-display mt-3 text-[clamp(2.6rem,6.5vw,5rem)]">Every seller&apos;s price. One search.</h1>
            <p className="t-lead mt-5 max-w-2xl text-ink-2">
              Checked polymer sellers list their stock and rates here. Compare them side by side, order, and pay through the platform. The seller is paid after delivery.
            </p>
            <p className="mt-4 inline-block bg-sack-2 px-3 py-1.5 text-sm font-semibold">Demo: sellers, stock and prices are made-up samples.</p>
          </div>
          <div className="border-2 border-ink p-5 lg:col-span-4">
            <p className="flex items-center gap-2 font-semibold">
              <Store aria-hidden className="size-5 text-print" />
              Selling polymer granules?
            </p>
            <p className="mt-2 text-ink-2">List your stock, set your own prices and get orders from buyers across India.</p>
            <Link href="/marketplace/sell" className="mt-4 inline-flex min-h-12 w-full items-center justify-between gap-3 bg-ink px-4 font-semibold text-sack hover:bg-print">
              Seller login
              <ArrowRight aria-hidden className="size-5 rtl:-scale-x-100" />
            </Link>
          </div>
        </div>
      </section>

      <div className="frame py-10">
        {!ready ? (
          <p className="py-10 text-ink-2">Loading the marketplace…</p>
        ) : (
          <>
            <div className="flex flex-col gap-4 border-b-2 border-ink pb-4 lg:flex-row lg:items-center">
              <label className="flex h-12 min-w-0 flex-1 items-center gap-3 border-2 border-ink bg-sack px-3 focus-within:outline focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-print lg:max-w-md">
                <Search aria-hidden className="size-4 shrink-0 text-ink-2" />
                <span className="sr-only">Search the marketplace</span>
                <input
                  type="search"
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setShown(PAGE);
                  }}
                  placeholder="Grade code, producer or process"
                  className="h-full w-full min-w-0 bg-transparent outline-none placeholder:text-ink-2/70"
                />
              </label>
              <div className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:px-0">
                <div className="flex w-max gap-1" role="group" aria-label="Polymer family">
                  {[{ id: "ALL" as const, short: "All", count: all.length }, ...famTabs].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      aria-pressed={fam === f.id}
                      onClick={() => {
                        setFam(f.id);
                        setShown(PAGE);
                      }}
                      className={`flex min-h-11 items-center gap-2 px-3 font-semibold ${fam === f.id ? "bg-print text-on-print" : "hover:bg-sack-2"}`}
                    >
                      {f.short}
                      <span className={`text-xs ${fam === f.id ? "" : "text-ink-2"}`}>{f.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm text-ink-2" aria-live="polite">
              {groups.length} {groups.length === 1 ? "grade" : "grades"} in stock from {sellersLive} sellers
            </p>

            {done && (
              <p role="status" className="mt-4 border-2 border-ok bg-[oklch(96%_0.03_150)] p-4 font-semibold">
                {done}
              </p>
            )}

            <div className="mt-6 space-y-8">
              {groups.slice(0, shown).map(({ item, offers }) => (
                <section key={item.key} aria-labelledby={`g-${item.key}`}>
                  <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1 border-b-2 border-ink pb-2">
                    <h2 id={`g-${item.key}`} className="flex flex-wrap items-baseline gap-x-3">
                      <span className="t-code text-[2rem] leading-none text-print">{item.code}</span>
                      <span className="text-lg font-bold">{item.producer}</span>
                      <span className="flex items-center gap-1.5 text-ink-2">
                        <FamilySwatch family={item.family} className="size-3" />
                        {item.process}
                      </span>
                    </h2>
                    <p className="text-sm text-ink-2">
                      {offers.length} {offers.length === 1 ? "seller" : "sellers"} · from <b className="text-ink">{rs(offers[0].price)}/kg</b> ·{" "}
                      <Link href={`/products/${item.key}`} className="underline underline-offset-4 hover:text-print">
                        Grade details
                      </Link>
                    </p>
                  </div>
                  <ul>
                    {offers.map((l, k) => {
                      const s = state.sellers.find((x) => x.id === l.sellerId)!;
                      const isOpen = open === l.id;
                      return (
                        <li key={l.id} className="border-b border-seam">
                          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 py-3 md:grid-cols-[minmax(0,1fr)_8rem_6rem_7rem_auto]">
                            <div className="min-w-0">
                              <p className="flex flex-wrap items-center gap-2">
                                <b>{s.name}</b>
                                {s.id === "arihant" ? (
                                  <span className="bg-print px-1.5 py-0.5 text-xs font-bold text-on-print">Arihant Assured</span>
                                ) : (
                                  s.verified && <BadgeCheck aria-label="Checked seller" className="size-4 text-ok" />
                                )}
                                {k === 0 && offers.length > 1 && <span className="bg-sack-2 px-1.5 py-0.5 text-xs font-semibold">Lowest price</span>}
                              </p>
                              <p className="text-sm text-ink-2">
                                {l.location}
                                {s.rating > 0 && ` · ★ ${s.rating}`}
                              </p>
                            </div>
                            <p className="text-end text-xl font-bold tabular-nums md:text-start">
                              {rs(l.price)}
                              <span className="text-sm font-normal text-ink-2">/kg</span>
                            </p>
                            <p className="text-sm md:text-base">
                              <span className="md:hidden">In stock </span>
                              {l.stock} t
                            </p>
                            <p className="text-sm text-ink-2 md:text-base">{l.deliveryDays} days to dispatch</p>
                            <button
                              type="button"
                              aria-expanded={isOpen}
                              onClick={() => setOpen(isOpen ? null : l.id)}
                              className={`col-span-2 mt-2 inline-flex min-h-11 items-center justify-center border-2 border-ink px-4 font-semibold md:col-span-1 md:mt-0 ${isOpen ? "bg-ink text-sack" : "hover:bg-ink hover:text-sack"}`}
                            >
                              {isOpen ? "Close" : "Order"}
                            </button>
                          </div>
                          {isOpen && (
                            <OrderForm
                              max={l.stock}
                              price={l.price}
                              onSubmit={(o) => {
                                dispatch({ type: "marketOrder", listingId: l.id, ...o });
                                setOpen(null);
                                setDone(
                                  s.id === "arihant"
                                    ? `Order sent: ${o.qty} t ${item.code} from Arihant Polymer. Arihant's office will call ${o.buyerName} to confirm dispatch.`
                                    : `Order sent: ${o.qty} t ${item.code} from ${s.name}. The seller confirms it; your payment is held by the platform until delivery.`,
                                );
                              }}
                            />
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>

            {groups.length > shown && (
              <button type="button" onClick={() => setShown((n) => n + PAGE)} className="mt-8 inline-flex min-h-12 items-center border-2 border-ink px-5 font-semibold hover:bg-ink hover:text-sack">
                Show more grades ({groups.length - shown} more)
              </button>
            )}
            {groups.length === 0 && <p className="mt-6 max-w-lg text-lg">No seller lists that right now. Post what you need below and sellers will send their prices.</p>}

            <RequirementForm />
          </>
        )}
      </div>
    </>
  );
}

function OrderForm({ max, price, onSubmit }: { max: number; price: number; onSubmit: (o: { qty: number; buyerName: string; buyerPhone: string; city: string }) => void }) {
  const [qty, setQty] = useState(Math.min(5, max));
  const [err, setErr] = useState<string | null>(null);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const buyerName = String(f.get("company") ?? "").trim();
    const buyerPhone = String(f.get("phone") ?? "").replace(/\D/g, "").slice(-10);
    const city = String(f.get("city") ?? "").trim();
    if (!buyerName || buyerPhone.length !== 10 || !city) {
      setErr("Fill in your company, a 10-digit mobile number and the delivery city.");
      return;
    }
    onSubmit({ qty, buyerName, buyerPhone, city });
  }

  return (
    <form onSubmit={submit} className="mb-4 grid gap-3 bg-sack-2 p-4 sm:grid-cols-2 lg:grid-cols-[8rem_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end">
      <label className="block">
        <span className="text-sm font-semibold">Tonnes</span>
        <input type="number" min={1} max={max} value={qty} onChange={(e) => setQty(Math.max(1, Math.min(max, Number(e.target.value) || 1)))} className={`${field} mt-1`} />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">Your company</span>
        <input name="company" autoComplete="organization" className={`${field} mt-1`} />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">Mobile number</span>
        <input name="phone" type="tel" inputMode="numeric" autoComplete="tel" className={`${field} mt-1`} />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">Deliver to (city)</span>
        <input name="city" className={`${field} mt-1`} />
      </label>
      <button type="submit" className="inline-flex min-h-12 items-center justify-center bg-print px-5 font-semibold text-on-print hover:bg-print-deep">
        Place order
      </button>
      <p className="text-sm text-ink-2 sm:col-span-2 lg:col-span-5">
        {qty} t × {rs(price)}/kg = <b className="text-ink">₹{Math.round(qty * 1000 * price).toLocaleString("en-IN")}</b> before GST. Paid through the platform and released to the seller after delivery.
      </p>
      {err && (
        <p role="alert" className="font-semibold text-print sm:col-span-2 lg:col-span-5">
          {err}
        </p>
      )}
    </form>
  );
}

function RequirementForm() {
  const { state, dispatch } = useDemo();
  const [itemKey, setItemKey] = useState(state.items[0]?.key ?? "");
  const [qty, setQty] = useState(10);
  const [msg, setMsg] = useState<string | null>(null);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const buyerName = String(f.get("company") ?? "").trim();
    const city = String(f.get("city") ?? "").trim();
    if (!buyerName || !city) {
      setMsg("Fill in your company and city.");
      return;
    }
    dispatch({ type: "postRequirement", req: { buyerName, city, itemKey, qty } });
    const it = state.items.find((i) => i.key === itemKey);
    setMsg(`Posted: ${qty} t ${it?.code ?? ""}. Sellers who have it will send their prices.`);
    e.currentTarget.reset();
  }

  return (
    <section aria-labelledby="req-title" className="weave mt-14 border-2 border-ink p-5 md:p-8">
      <h2 id="req-title" className="t-h3">
        Can&apos;t find your grade? Post what you need.
      </h2>
      <p className="mt-2 max-w-2xl text-ink-2">Every seller on the marketplace sees it and can send you a price.</p>
      <form onSubmit={submit} className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_7rem_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end">
        <label className="block">
          <span className="text-sm font-semibold">Grade</span>
          <select value={itemKey} onChange={(e) => setItemKey(e.target.value)} className={`${field} mt-1`}>
            {state.items.map((i) => (
              <option key={i.key} value={i.key}>
                {i.code} · {i.producer} · {i.process}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Tonnes</span>
          <input type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} className={`${field} mt-1`} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Your company</span>
          <input name="company" autoComplete="organization" className={`${field} mt-1`} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">City</span>
          <input name="city" className={`${field} mt-1`} />
        </label>
        <button type="submit" className="inline-flex min-h-12 items-center justify-center bg-ink px-5 font-semibold text-sack hover:bg-print">
          Post requirement
        </button>
      </form>
      {msg && (
        <p role="status" className="mt-3 font-semibold">
          {msg}
        </p>
      )}
    </section>
  );
}
