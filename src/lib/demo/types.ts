import type { Family } from "@/content/catalogue";

export type OfficeRole = "owner" | "sales" | "accounts" | "godown";
export type MarketRole = "visitor" | "buyer" | "seller" | "admin";
export type Role = OfficeRole | MarketRole;

export type GodownId = "MLD" | "BHW";

export interface Item {
  key: string; // grade slug
  code: string;
  producer: string;
  family: Family;
  process: string;
  rate: number; // last purchase rate, Rs/kg
  stock: Record<GodownId, { onHand: number; promised: number }>; // tonnes
  reorderAt: number; // tonnes
  daysInStock: number;
}

export interface Buyer {
  id: string;
  name: string;
  city: string;
  freight: number; // Rs/kg
  creditLimit: number; // Rs
  creditDays: number;
  salesperson: string;
  cycleDays: number; // usual reorder cycle
  lastOrder: string; // ISO date
}

export type EnquirySource = "WhatsApp" | "Website" | "IndiaMART" | "Call" | "Plastivision QR";
export type EnquiryStatus = "New" | "Quoted" | "Follow up" | "Won" | "Lost";

export interface Enquiry {
  id: string;
  date: string;
  source: EnquirySource;
  buyerName: string;
  city: string;
  itemKey: string | null;
  text: string;
  qty: number; // tonnes
  status: EnquiryStatus;
  owner: string;
  followUp: string | null;
}

export interface Quote {
  id: string;
  date: string;
  buyerId: string;
  itemKey: string;
  qty: number;
  inStockQty: number;
  inStockPrice: number;
  toBuyPrice: number;
  margin: number;
  status: "Sent" | "Won" | "Lost" | "Needs approval";
  by: string;
  validUntil: string;
}

export const ORDER_STAGES = ["Confirmed", "Packed", "Dispatched", "Delivered", "Paid"] as const;
export type OrderStage = (typeof ORDER_STAGES)[number];

export interface Order {
  id: string;
  date: string;
  buyerId: string;
  itemKey: string;
  qty: number;
  price: number; // Rs/kg ex GST
  godown: GodownId;
  stage: OrderStage;
  source: "Quote" | "Website" | "WhatsApp" | "Phone";
  truck?: string;
  driver?: string;
  invoiceId?: string;
  needsApproval?: boolean;
}

export interface Invoice {
  id: string;
  date: string;
  orderId: string;
  buyerId: string;
  amount: number; // incl. GST
  due: string;
  paid: boolean;
  reminders: number;
}

export interface PurchaseOrder {
  id: string;
  producer: string;
  itemKey: string;
  qty: number;
  rate: number;
  expected: string;
  godown: GodownId;
  received: boolean;
}

export interface Seller {
  id: string;
  name: string;
  city: string;
  verified: boolean;
  rating: number;
  status: "Live" | "Pending" | "Paused";
  gst: string;
}

export interface Listing {
  id: string;
  sellerId: string; // "arihant" for Arihant's own stock
  itemKey: string;
  price: number;
  stock: number; // tonnes
  location: string;
  deliveryDays: number;
}

export interface Requirement {
  id: string;
  date: string;
  buyerName: string;
  city: string;
  itemKey: string;
  qty: number;
  responses: { sellerId: string; price: number; days: number }[];
}

export interface PriceMove {
  producer: string;
  family: Family;
  date: string;
  change: number; // Rs/kg
}

export interface DemoState {
  role: Role | null;
  items: Item[];
  buyers: Buyer[];
  enquiries: Enquiry[];
  quotes: Quote[];
  orders: Order[];
  invoices: Invoice[];
  purchases: PurchaseOrder[];
  sellers: Seller[];
  listings: Listing[];
  requirements: Requirement[];
  priceMoves: PriceMove[];
  margins: { default: number; min: number };
  log: { at: string; text: string }[];
  seq: number;
  /** Transient: true once browser storage has been read. Not persisted. */
  _ready?: boolean;
}
