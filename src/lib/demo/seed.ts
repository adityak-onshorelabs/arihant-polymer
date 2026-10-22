/*
 * Demo seed data. EVERYTHING here except the grade codes and producers is
 * invented for demonstration: buyers, sellers, stock, rates, orders, invoices.
 * It is not Arihant Polymer's data.
 */

import { gradeSlug, grades, type Family } from "@/content/catalogue";
import type { Buyer, DemoState, Enquiry, Invoice, Item, Listing, MarketOrder, Order, PriceMove, PurchaseOrder, Quote, Requirement, Seller } from "./types";

export const TODAY = "2026-10-22";

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function addDays(iso: string, n: number) {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

const BASE: Record<Family, [number, number]> = {
  PP: [94, 108],
  HDPE: [96, 110],
  LLDPE: [94, 106],
  LDPE: [104, 122],
  STYRENICS: [118, 185],
  PVC: [74, 86],
  PET: [84, 96],
  ENGG: [150, 250],
  ADDITIVE: [230, 270],
};

export const SALES = ["Rohit", "Priya"];
export const STAFF = { owner: "Harsh Jain", accounts: "Meena", godown: "Santosh" };

export const GODOWNS = { MLD: "Malad (Kachpada)", BHW: "Bhiwandi" } as const;

export function createSeed(): DemoState {
  const r = rng(1991);
  const round = (n: number, d = 2) => Math.round(n * 10 ** d) / 10 ** d;

  const items: Item[] = grades
    .filter((g) => g.code && g.producer)
    .map((g, i) => {
      const [lo, hi] = BASE[g.family];
      const big = ["Reliance", "GAIL", "IOCL", "HMEL", "OPaL", "Haldia"].includes(g.producer!);
      const mld = big ? Math.round(r() * 38) : Math.round(r() * 12);
      const bhw = big && r() > 0.4 ? Math.round(r() * 25) : 0;
      return {
        key: gradeSlug(g),
        code: g.code!,
        producer: g.producer!,
        family: g.family,
        process: g.process,
        rate: round(lo + r() * (hi - lo)),
        stock: {
          MLD: { onHand: mld, promised: Math.min(mld, Math.round(r() * mld * 0.4)) },
          BHW: { onHand: bhw, promised: Math.min(bhw, Math.round(r() * bhw * 0.3)) },
        },
        reorderAt: big ? 8 : 3,
        daysInStock: Math.round(5 + r() * (i % 7 === 0 ? 90 : 35)),
      };
    });

  const key = (code: string) => items.find((i) => i.code === code)!.key;

  const buyerRows: [string, string, number][] = [
    ["Shree Ganesh Moulders", "Vapi GIDC", 1.4],
    ["Daman Polyfilms", "Daman", 1.45],
    ["Silvassa Raffia Industries", "Silvassa", 1.5],
    ["Umbergaon Pipes", "Umbergaon", 1.35],
    ["Bhiwandi Packaging Works", "Bhiwandi", 0.8],
    ["Vasai Blow Plast", "Vasai", 0.95],
    ["Palghar Injection Works", "Palghar", 1.1],
    ["Tarapur Extrusions", "Tarapur MIDC", 1.2],
    ["Sarigam Poly Pack", "Sarigam GIDC", 1.4],
    ["Valsad Containers", "Valsad", 1.5],
    ["Jalgaon Drip Systems", "Jalgaon", 2.4],
    ["Nashik Moulded Components", "Nashik", 1.6],
    ["Thane Caps and Closures", "Thane", 0.7],
    ["Andheri Household Plastics", "Andheri East", 0.55],
    ["Daman Laminates", "Daman", 1.45],
    ["Ahmedabad Film Converters", "Ahmedabad", 2.2],
    ["Pune Auto Mouldings", "Chakan, Pune", 1.85],
    ["Surat Woven Sacks", "Surat", 1.7],
    ["Kandivali Toys", "Kandivali", 0.5],
    ["Dahisar Crates", "Dahisar", 0.6],
  ];
  const buyers: Buyer[] = buyerRows.map(([name, city, freight], i) => ({
    id: `B${String(i + 1).padStart(2, "0")}`,
    name,
    city,
    freight,
    creditLimit: [1500000, 2500000, 4000000, 6000000][i % 4],
    creditDays: [15, 30, 30, 45][i % 4],
    salesperson: SALES[i % 2],
    cycleDays: [20, 25, 30, 45][i % 4],
    lastOrder: addDays(TODAY, -Math.round(5 + r() * 40)),
  }));

  const enquiryRows: [Enquiry["source"], string, string, string | null, string, number, Enquiry["status"]][] = [
    ["WhatsApp", "Mahavir Plast", "Vapi", key("MI3530"), "Need MI3530 10 MT, delivery Friday", 10, "New"],
    ["Plastivision QR", "Kumar Polytech", "Hyderabad", key("F52H04"), "Met at stall. HM film grade rate pls", 15, "New"],
    ["Website", "Sai Packaging", "Bhiwandi", key("H030SG"), "Raffia grade, 20 tonnes monthly", 20, "Follow up"],
    ["IndiaMART", "R K Industries", "Ludhiana", key("I26A500U"), "GAIL LLDPE moulding rate", 9, "Quoted"],
    ["Call", "Daman Polyfilms", "Daman", key("JF19010"), "Repeat LLDPE film order", 12, "Quoted"],
    ["WhatsApp", "Shree Ganesh Moulders", "Vapi GIDC", key("B120MA"), "B120MA 12 MFI, 6 tonnes", 6, "Won"],
    ["Website", "Nashik Moulded Components", "Nashik", key("50MA180"), "HDPE injection grade for crates", 8, "Follow up"],
    ["IndiaMART", "Balaji Plastics", "Indore", key("SR20NC"), "Random copo blow grade", 5, "New"],
    ["Call", "Vasai Blow Plast", "Vasai", key("B56003"), "B56003 18 MT", 18, "Quoted"],
    ["WhatsApp", "Om Containers", "Silvassa", key("52GB003"), "Blow moulding HDPE", 7, "Lost"],
    ["Plastivision QR", "Al Noor Trading", "Dubai", key("1110MAS"), "Export enquiry, 2 containers", 40, "New"],
    ["Website", "Pune Auto Mouldings", "Chakan, Pune", key("MI3530"), "PPCP for bumpers, sample first", 3, "Follow up"],
  ];
  const enquiries: Enquiry[] = enquiryRows.map(([source, buyerName, city, itemKey, text, qty, status], i) => ({
    id: `E${100 + i}`,
    date: addDays(TODAY, -Math.floor(i / 2)),
    source,
    buyerName,
    city,
    itemKey,
    text,
    qty,
    status,
    owner: SALES[i % 2],
    followUp: status === "Follow up" || status === "New" ? addDays(TODAY, (i % 3) - 1) : null,
  }));

  const quotes: Quote[] = [
    ["B05", "H030SG", 20, "Sent"],
    ["B02", "JF19010", 12, "Sent"],
    ["B06", "B56003", 18, "Sent"],
    ["B01", "B120MA", 6, "Won"],
    ["B12", "50MA180", 8, "Sent"],
    ["B16", "F52H04", 25, "Lost"],
    ["B11", "D22S010A", 10, "Needs approval"],
  ]
    .filter(([, code]) => items.some((i) => i.code === code))
    .map(([buyerId, code, qty, status], i) => {
      const it = items.find((x) => x.code === code)!;
      const b = buyers.find((x) => x.id === buyerId)!;
      const margin = status === "Needs approval" ? 1.5 : 3;
      return {
        id: `Q${200 + i}`,
        date: addDays(TODAY, -i),
        buyerId: b.id,
        itemKey: it.key,
        qty: qty as number,
        inStockQty: Math.max(0, Math.min(qty as number, it.stock.MLD.onHand - it.stock.MLD.promised)),
        inStockPrice: round(it.rate + b.freight + margin),
        toBuyPrice: round(it.rate + 1.2 + b.freight + margin),
        margin,
        status: status as Quote["status"],
        by: b.salesperson,
        validUntil: addDays(TODAY, -i),
      };
    });

  const orderRows: [string, string, number, Order["stage"], Order["source"], number][] = [
    ["B01", "B120MA", 6, "Confirmed", "Quote", 0],
    ["B13", "H350FG", 4, "Confirmed", "Phone", 0],
    ["B07", "MI3530", 9, "Packed", "WhatsApp", -1],
    ["B14", "1110MAS", 3, "Packed", "Website", -1],
    ["B03", "T50A010A", 16, "Dispatched", "Phone", -2],
    ["B08", "46GP003", 20, "Dispatched", "Quote", -3],
    ["B18", "R5410", 22, "Delivered", "Phone", -8],
    ["B19", "SRM100NC", 5, "Delivered", "Website", -12],
    ["B04", "46GP009", 18, "Delivered", "Quote", -36],
    ["B09", "F0120L", 10, "Delivered", "Phone", -41],
    ["B20", "50MA180", 7, "Paid", "Phone", -20],
    ["B10", "B56003", 12, "Paid", "Quote", -27],
    ["B17", "MI3530", 15, "Delivered", "Quote", -52],
  ];
  const orders: Order[] = [];
  const invoices: Invoice[] = [];
  orderRows.forEach(([buyerId, code, qty, stage, source, ago], i) => {
    const it = items.find((x) => x.code === code);
    if (!it) return;
    const b = buyers.find((x) => x.id === buyerId)!;
    const id = `O${300 + i}`;
    const price = round(it.rate + b.freight + 3);
    const o: Order = { id, date: addDays(TODAY, ago), buyerId, itemKey: it.key, qty, price, godown: "MLD", stage, source };
    if (stage !== "Confirmed" && stage !== "Packed") {
      o.truck = `MH 04 ${["KF", "GT", "JU", "HW"][i % 4]} ${4000 + i * 137}`;
      o.driver = ["Ramesh", "Imran", "Sunil", "Baldev"][i % 4];
    }
    if (stage === "Delivered" || stage === "Paid") {
      const inv: Invoice = {
        id: `INV/26-27/${String(410 + i).padStart(4, "0")}`,
        date: addDays(TODAY, ago + 1),
        orderId: id,
        buyerId,
        amount: Math.round(qty * 1000 * price * 1.18),
        due: addDays(TODAY, ago + 1 + b.creditDays),
        paid: stage === "Paid",
        reminders: ago < -40 ? 2 : 0,
      };
      invoices.push(inv);
      o.invoiceId = inv.id;
    }
    orders.push(o);
  });

  const purchases: PurchaseOrder[] = [
    ["Reliance", "MI3530", 25, 3, "MLD"],
    ["GAIL", "I26A500U", 18, 1, "MLD"],
    ["OPaL", "F52H04", 20, 5, "BHW"],
    ["HMEL", "B0155D", 15, 7, "BHW"],
  ]
    .filter(([, code]) => items.some((i) => i.code === code))
    .map(([producer, code, qty, days, godown], i) => {
      const it = items.find((x) => x.code === code)!;
      return { id: `PO${500 + i}`, producer: producer as string, itemKey: it.key, qty: qty as number, rate: round(it.rate + 0.8), expected: addDays(TODAY, days as number), godown: godown as "MLD" | "BHW", received: false };
    });

  const sellers: Seller[] = [
    { id: "arihant", name: "Arihant Polymer", city: "Malad West, Mumbai", verified: true, rating: 4.5, status: "Live", gst: "27AAAFA3846Q1Z3" },
    { id: "S1", name: "Shah Petrochem", city: "Bhiwandi", verified: true, rating: 4.3, status: "Live", gst: "27ABCDE1234F1Z5", phone: "9800011111" },
    { id: "S2", name: "Gujarat Polymer Traders", city: "Ahmedabad", verified: true, rating: 4.1, status: "Live", gst: "24ABCDE2345G1Z6", phone: "9800022222" },
    { id: "S3", name: "Navkar Plastics", city: "Surat", verified: true, rating: 3.9, status: "Live", gst: "24ABCDE3456H1Z7", phone: "9800033333" },
    { id: "S4", name: "Mehta Resins", city: "Pune", verified: false, rating: 0, status: "Pending", gst: "27ABCDE4567J1Z8", phone: "9800044444" },
    { id: "S5", name: "Om Sai Polymers", city: "Vapi", verified: false, rating: 0, status: "Pending", gst: "24ABCDE5678K1Z9", phone: "9800055555" },
  ];

  const listings: Listing[] = [];
  items.forEach((it, i) => {
    const free = it.stock.MLD.onHand - it.stock.MLD.promised + it.stock.BHW.onHand - it.stock.BHW.promised;
    if (free > 0) listings.push({ id: `L${i}A`, sellerId: "arihant", itemKey: it.key, price: round(it.rate + 3.5), stock: free, location: "Malad West, Mumbai", deliveryDays: 2 });
    (["S1", "S2", "S3"] as const).forEach((s, j) => {
      if (r() > 0.72) {
        const city = sellers.find((x) => x.id === s)!.city;
        listings.push({ id: `L${i}${s}`, sellerId: s, itemKey: it.key, price: round(it.rate + 2 + r() * 4), stock: Math.round(5 + r() * 40), location: city, deliveryDays: [2, 3, 4][j] });
      }
    });
  });

  const marketOrders: MarketOrder[] = [
    ["S1", 0, "Kandivali Toys", "Mumbai", 5, "New", 0],
    ["S1", 1, "Daman Polyfilms", "Daman", 8, "Accepted", -1],
    ["S1", 2, "Nashik Crates", "Nashik", 3, "Dispatched", -3],
    ["S2", 0, "Kumar Polytech", "Hyderabad", 10, "New", 0],
  ].flatMap(([seller, n, buyerName, city, qty, status, ago], i) => {
    const l = listings.filter((x) => x.sellerId === seller)[n as number];
    if (!l) return [];
    return [{ id: `M${300 + i}`, date: addDays(TODAY, ago as number), listingId: l.id, sellerId: l.sellerId, itemKey: l.itemKey, qty: qty as number, price: l.price, buyerName: buyerName as string, buyerPhone: "98xxxxxx10", city: city as string, status: status as MarketOrder["status"] }];
  });

  const requirements: Requirement[] = [
    { id: "R1", date: addDays(TODAY, -1), buyerName: "Kumar Polytech", city: "Hyderabad", itemKey: key("F52H04"), qty: 15, responses: [{ sellerId: "S2", price: round(items.find((i) => i.code === "F52H04")!.rate + 4.1), days: 4 }] },
    { id: "R2", date: TODAY, buyerName: "Silvassa Raffia Industries", city: "Silvassa", itemKey: key("H030SG"), qty: 30, responses: [] },
  ];

  const priceMoves: PriceMove[] = [
    { producer: "Reliance", family: "HDPE", date: "2026-10-17", change: 1.5 },
    { producer: "Reliance", family: "LLDPE", date: "2026-10-17", change: 1.0 },
    { producer: "Reliance", family: "PP", date: "2026-10-01", change: -0.75 },
    { producer: "GAIL", family: "LLDPE", date: "2026-10-15", change: 1.25 },
    { producer: "IOCL", family: "PP", date: "2026-10-10", change: -0.5 },
  ];

  return {
    role: "owner",
    items,
    buyers,
    enquiries,
    quotes,
    orders,
    invoices,
    purchases,
    sellers,
    listings,
    requirements,
    marketOrders,
    priceMoves,
    margins: { default: 3, min: 2 },
    log: [
      { at: TODAY, text: "Reliance HDPE price list up Rs 1.50/kg (17 Oct)" },
      { at: TODAY, text: "2 new Plastivision QR leads" },
    ],
    seq: 1000,
  };
}

export function seedLabel() {
  return "Sample data. Buyers, sellers, stock, rates and figures are invented for this demo.";
}
