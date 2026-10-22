"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from "react";
import { createSeed, TODAY, addDays, STAFF } from "./seed";
import { ORDER_STAGES, type DemoState, type Enquiry, type GodownId, type Listing, type MarketOrder, type Order, type Quote, type Requirement, type Role, type Seller } from "./types";

const KEY = "arihant-demo-v1";
export const SITE_LEADS = "arihant-demo-site-leads";
export type SiteLead = { grade: string; quantity: string; unit: string; deliverTo: string; name: string; company?: string };

type Action =
  | { type: "hydrate"; state: DemoState | null; leads: SiteLead[] }
  | { type: "siteLeads"; leads: SiteLead[] }
  | { type: "reset" }
  | { type: "role"; role: Role | null }
  | { type: "addQuote"; quote: Omit<Quote, "id"> }
  | { type: "quoteToOrder"; quoteId: string }
  | { type: "advanceOrder"; orderId: string }
  | { type: "approveOrder"; orderId: string }
  | { type: "approveQuote"; quoteId: string }
  | { type: "remind"; invoiceId: string }
  | { type: "receivePO"; poId: string }
  | { type: "addEnquiry"; enquiry: Omit<Enquiry, "id" | "date" | "owner" | "status" | "followUp"> }
  | { type: "enquiryStatus"; id: string; status: Enquiry["status"] }
  | { type: "setMargin"; value: number }
  | { type: "updateListing"; id: string; patch: Partial<Pick<Listing, "price" | "stock" | "deliveryDays" | "paused">> }
  | { type: "removeListing"; id: string }
  | { type: "addSeller"; seller: Pick<Seller, "name" | "city" | "gst" | "phone"> }
  | { type: "marketOrderStatus"; id: string; status: MarketOrder["status"] }
  | { type: "addListing"; listing: Omit<Listing, "id"> }
  | { type: "postRequirement"; req: Omit<Requirement, "id" | "date" | "responses"> }
  | { type: "respond"; reqId: string; sellerId: string; price: number; days: number }
  | { type: "sellerStatus"; id: string; status: "Live" | "Paused" }
  | { type: "marketOrder"; listingId: string; qty: number; buyerName: string; buyerPhone?: string; city?: string }
  | { type: "addOrder"; order: Omit<Order, "id" | "date" | "stage"> };

function log(s: DemoState, text: string): DemoState {
  return { ...s, log: [{ at: TODAY, text }, ...s.log].slice(0, 30) };
}

function free(s: DemoState, key: string) {
  const it = s.items.find((i) => i.key === key);
  if (!it) return 0;
  return it.stock.MLD.onHand - it.stock.MLD.promised + it.stock.BHW.onHand - it.stock.BHW.promised;
}

export function owed(s: DemoState, buyerId: string) {
  return s.invoices.filter((i) => i.buyerId === buyerId && !i.paid).reduce((a, i) => a + i.amount, 0);
}

function reserve(s: DemoState, key: string, qty: number): { s: DemoState; godown: GodownId } {
  const it = s.items.find((i) => i.key === key)!;
  const godown: GodownId = it.stock.MLD.onHand - it.stock.MLD.promised >= qty ? "MLD" : it.stock.BHW.onHand - it.stock.BHW.promised >= qty ? "BHW" : "MLD";
  const items = s.items.map((i) =>
    i.key === key ? { ...i, stock: { ...i.stock, [godown]: { ...i.stock[godown], promised: Math.min(i.stock[godown].onHand, i.stock[godown].promised + qty) } } } : i,
  );
  return { s: { ...s, items }, godown };
}

/** Rate requests sent from the public website in this browser land in the inbox. */
function mergeLeads(base: DemoState, leads: SiteLead[]): DemoState {
  if (!leads.length) return base;
  let seq = base.seq;
  const fromSite: Enquiry[] = leads.map((l) => {
    seq += 1;
    const it = base.items.find((i) => l.grade.toUpperCase().startsWith(i.code.toUpperCase()));
    return {
      id: `E${seq}`,
      date: TODAY,
      source: "Website",
      buyerName: l.company || l.name,
      city: l.deliverTo,
      itemKey: it?.key ?? null,
      text: `${l.grade}, ${l.quantity} ${l.unit} (rate request from the website)`,
      qty: l.unit === "tonnes" ? Number(l.quantity) || 0 : Math.round((Number(l.quantity) || 0) * 0.025),
      status: "New",
      owner: "Rohit",
      followUp: TODAY,
    };
  });
  return log({ ...base, seq, enquiries: [...fromSite, ...base.enquiries] }, `${fromSite.length} new rate request${fromSite.length > 1 ? "s" : ""} from the website`);
}

function reducer(s: DemoState, a: Action): DemoState {
  switch (a.type) {
    case "hydrate": {
      // Saved state from an older build may lack newer fields; the seed fills them.
      const merged = mergeLeads(a.state ? { ...s, ...a.state } : s, a.leads);
      const teamRoles = ["owner", "sales", "accounts", "godown"];
      return { ...merged, role: merged.role && teamRoles.includes(merged.role) ? merged.role : "owner", _ready: true };
    }
    case "siteLeads":
      return mergeLeads(s, a.leads);
    case "reset":
      return { ...createSeed(), role: s.role, _ready: true };
    case "role":
      return { ...s, role: a.role };
    case "addOrder": {
      const free0 = free(s, a.order.itemKey);
      const { s: s2, godown } = reserve(s, a.order.itemKey, Math.min(a.order.qty, Math.max(0, free0)));
      const b = s.buyers.find((x) => x.id === a.order.buyerId);
      const id = `O${s.seq + 1}`;
      const overCredit = b ? owed(s, b.id) + a.order.qty * 1000 * a.order.price * 1.18 > b.creditLimit : false;
      return log(
        { ...s2, seq: s.seq + 1, orders: [{ ...a.order, id, date: TODAY, stage: "Confirmed", godown, needsApproval: overCredit }, ...s2.orders] },
        `Order ${id} booked for ${b?.name} (${a.order.source.toLowerCase()})${overCredit ? ", over credit limit, needs owner approval" : ""}`,
      );
    }
    case "setMargin":
      return log({ ...s, margins: { ...s.margins, default: a.value } }, `Default margin set to Rs ${a.value.toFixed(2)}/kg`);
    case "addQuote": {
      const id = `Q${s.seq + 1}`;
      const b = s.buyers.find((x) => x.id === a.quote.buyerId);
      return log({ ...s, seq: s.seq + 1, quotes: [{ ...a.quote, id }, ...s.quotes] }, `${a.quote.by} sent quote ${id} to ${b?.name}`);
    }
    case "approveQuote":
      return log({ ...s, quotes: s.quotes.map((q) => (q.id === a.quoteId ? { ...q, status: "Sent" } : q)) }, `${STAFF.owner} approved quote ${a.quoteId}`);
    case "quoteToOrder": {
      const q = s.quotes.find((x) => x.id === a.quoteId);
      if (!q) return s;
      const b = s.buyers.find((x) => x.id === q.buyerId)!;
      const price = q.inStockQty >= q.qty ? q.inStockPrice : q.toBuyPrice;
      const amount = q.qty * 1000 * price * 1.18;
      const overCredit = owed(s, b.id) + amount > b.creditLimit;
      const { s: s2, godown } = reserve(s, q.itemKey, Math.min(q.qty, free(s, q.itemKey)));
      const order: Order = { id: `O${s.seq + 1}`, date: TODAY, buyerId: q.buyerId, itemKey: q.itemKey, qty: q.qty, price, godown, stage: "Confirmed", source: "Quote", needsApproval: overCredit };
      return log(
        { ...s2, seq: s.seq + 1, orders: [order, ...s2.orders], quotes: s2.quotes.map((x) => (x.id === q.id ? { ...x, status: "Won" } : x)) },
        `Quote ${q.id} became order ${order.id}${overCredit ? " (over credit limit, needs owner approval)" : ""}; stock set aside`,
      );
    }
    case "approveOrder":
      return log({ ...s, orders: s.orders.map((o) => (o.id === a.orderId ? { ...o, needsApproval: false } : o)) }, `${STAFF.owner} approved order ${a.orderId} over credit limit`);
    case "advanceOrder": {
      const o = s.orders.find((x) => x.id === a.orderId);
      if (!o || o.needsApproval) return s;
      const idx = ORDER_STAGES.indexOf(o.stage);
      if (idx >= ORDER_STAGES.length - 1) return s;
      const next = ORDER_STAGES[idx + 1];
      let st: DemoState = s;
      const patch: Partial<Order> = { stage: next };
      if (next === "Dispatched") {
        patch.truck = `MH 04 KT ${5000 + (s.seq % 900)}`;
        patch.driver = "Ramesh";
        st = {
          ...st,
          items: st.items.map((i) =>
            i.key === o.itemKey
              ? { ...i, stock: { ...i.stock, [o.godown]: { onHand: Math.max(0, i.stock[o.godown].onHand - o.qty), promised: Math.max(0, i.stock[o.godown].promised - o.qty) } } }
              : i,
          ),
        };
      }
      if (next === "Delivered") {
        const b = st.buyers.find((x) => x.id === o.buyerId)!;
        const inv = { id: `INV/26-27/${String(st.seq + 1).padStart(4, "0")}`, date: TODAY, orderId: o.id, buyerId: o.buyerId, amount: Math.round(o.qty * 1000 * o.price * 1.18), due: addDays(TODAY, b.creditDays), paid: false, reminders: 0 };
        st = { ...st, seq: st.seq + 1, invoices: [inv, ...st.invoices] };
        patch.invoiceId = inv.id;
      }
      if (next === "Paid" && o.invoiceId) {
        st = { ...st, invoices: st.invoices.map((i) => (i.id === o.invoiceId ? { ...i, paid: true } : i)) };
      }
      return log({ ...st, orders: st.orders.map((x) => (x.id === o.id ? { ...x, ...patch } : x)) }, `Order ${o.id} moved to ${next}${next === "Dispatched" ? ", buyer sent truck details on WhatsApp" : next === "Delivered" ? ", GST invoice raised" : ""}`);
    }
    case "remind":
      return log({ ...s, invoices: s.invoices.map((i) => (i.id === a.invoiceId ? { ...i, reminders: i.reminders + 1 } : i)) }, `Payment reminder sent on WhatsApp for ${a.invoiceId}`);
    case "receivePO": {
      const po = s.purchases.find((p) => p.id === a.poId);
      if (!po || po.received) return s;
      return log(
        {
          ...s,
          purchases: s.purchases.map((p) => (p.id === po.id ? { ...p, received: true } : p)),
          items: s.items.map((i) => (i.key === po.itemKey ? { ...i, rate: po.rate, daysInStock: 0, stock: { ...i.stock, [po.godown]: { ...i.stock[po.godown], onHand: i.stock[po.godown].onHand + po.qty } } } : i)),
        },
        `Goods received: ${po.qty} t against ${po.id} from ${po.producer}`,
      );
    }
    case "addEnquiry": {
      const id = `E${s.seq + 1}`;
      const e: Enquiry = { ...a.enquiry, id, date: TODAY, owner: "Rohit", status: "New", followUp: TODAY };
      return log({ ...s, seq: s.seq + 1, enquiries: [e, ...s.enquiries] }, `New ${e.source} lead from ${e.buyerName} (${e.city})`);
    }
    case "enquiryStatus":
      return { ...s, enquiries: s.enquiries.map((e) => (e.id === a.id ? { ...e, status: a.status } : e)) };
    case "updateListing":
      return { ...s, listings: s.listings.map((l) => (l.id === a.id ? { ...l, ...a.patch } : l)) };
    case "removeListing":
      return { ...s, listings: s.listings.filter((l) => l.id !== a.id) };
    case "addSeller": {
      const id = `S${s.seq + 1}`;
      return log({ ...s, seq: s.seq + 1, sellers: [...s.sellers, { ...a.seller, id, verified: false, rating: 0, status: "Pending" }] }, `${a.seller.name} applied to sell on the marketplace`);
    }
    case "marketOrderStatus":
      return { ...s, marketOrders: s.marketOrders.map((o) => (o.id === a.id ? { ...o, status: a.status } : o)) };
    case "addListing":
      return log({ ...s, listings: [{ ...a.listing, id: `L${s.seq + 1}` }, ...s.listings], seq: s.seq + 1 }, `New listing added to the marketplace`);
    case "postRequirement":
      return log({ ...s, seq: s.seq + 1, requirements: [{ ...a.req, id: `R${s.seq + 1}`, date: TODAY, responses: [] }, ...s.requirements] }, `${a.req.buyerName} posted a requirement`);
    case "respond":
      return {
        ...s,
        requirements: s.requirements.map((r) => (r.id === a.reqId ? { ...r, responses: [...r.responses.filter((x) => x.sellerId !== a.sellerId), { sellerId: a.sellerId, price: a.price, days: a.days }] } : r)),
      };
    case "sellerStatus":
      return log({ ...s, sellers: s.sellers.map((x) => (x.id === a.id ? { ...x, status: a.status, verified: a.status === "Live" ? true : x.verified } : x)) }, `Seller ${s.sellers.find((x) => x.id === a.id)?.name} set to ${a.status}`);
    case "marketOrder": {
      const l = s.listings.find((x) => x.id === a.listingId);
      if (!l) return s;
      const seller = s.sellers.find((x) => x.id === l.sellerId);
      const seq = s.seq + 1;
      const order: MarketOrder = { id: `M${seq}`, date: TODAY, listingId: l.id, sellerId: l.sellerId, itemKey: l.itemKey, qty: a.qty, price: l.price, buyerName: a.buyerName, buyerPhone: a.buyerPhone ?? "", city: a.city ?? "", status: "New" };
      let next: DemoState = { ...s, seq, marketOrders: [order, ...s.marketOrders], listings: s.listings.map((x) => (x.id === l.id ? { ...x, stock: Math.max(0, x.stock - a.qty) } : x)) };
      // Orders for Arihant's own stock reach the office inbox like any other enquiry.
      if (l.sellerId === "arihant") {
        const it = s.items.find((i) => i.key === l.itemKey);
        const e: Enquiry = { id: `E${seq}`, date: TODAY, source: "Website", buyerName: a.buyerName, city: a.city ?? "", itemKey: l.itemKey, text: `${it?.code ?? "Grade"}, ${a.qty} t at ${rs(l.price)}/kg (order on the marketplace)`, qty: a.qty, status: "New", owner: "Rohit", followUp: TODAY };
        next = { ...next, enquiries: [e, ...next.enquiries] };
      }
      return log(next, `${a.buyerName} ordered ${a.qty} t from ${seller?.name} on the marketplace`);
    }
  }
}

type Ctx = { state: DemoState; dispatch: (a: Action) => void; ready: boolean; free: (key: string) => number };
const DemoCtx = createContext<Ctx | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createSeed);
  const ready = state._ready === true;
  // Set when state arrives from another tab, so it is not written straight back.
  const fromOtherTab = useRef(false);

  useEffect(() => {
    let saved: DemoState | null = null;
    let leads: SiteLead[] = [];
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) saved = JSON.parse(raw);
      leads = JSON.parse(localStorage.getItem(SITE_LEADS) ?? "[]");
      localStorage.removeItem(SITE_LEADS);
    } catch {}
    dispatch({ type: "hydrate", state: saved, leads });

    // The website runs in an iframe on the Website screen, and the marketplace may be open
    // in another tab; pick up their rate requests and changes live.
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY && e.newValue) {
        try {
          const next = JSON.parse(e.newValue);
          fromOtherTab.current = true;
          dispatch({ type: "hydrate", state: next, leads: [] });
        } catch {}
        return;
      }
      if (e.key !== SITE_LEADS || !e.newValue) return;
      try {
        const fresh: SiteLead[] = JSON.parse(e.newValue);
        localStorage.removeItem(SITE_LEADS);
        if (fresh.length) dispatch({ type: "siteLeads", leads: fresh });
      } catch {}
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (fromOtherTab.current) {
      fromOtherTab.current = false;
      return;
    }
    try {
      localStorage.setItem(KEY, JSON.stringify({ ...state, _ready: undefined }));
    } catch {}
  }, [state, ready]);

  const freeFn = useCallback((key: string) => free(state, key), [state]);
  const value = useMemo(() => ({ state, dispatch, ready, free: freeFn }), [state, ready, freeFn]);
  return <DemoCtx.Provider value={value}>{children}</DemoCtx.Provider>;
}

export function useDemo() {
  const c = useContext(DemoCtx);
  if (!c) throw new Error("useDemo outside DemoProvider");
  return c;
}

/* ---------- formatting ---------- */
export const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
export const rs = (n: number) => "₹" + n.toFixed(2);
export const fmtDate = (iso: string) => new Date(iso + "T00:00:00Z").toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" });
export const daysBetween = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
