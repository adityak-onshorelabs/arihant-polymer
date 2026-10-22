import type { OfficeRole, Role } from "./types";

/** Access levels mirror the "Who sees what" tables in the proposal. */
export type Level = "full" | "own" | "view" | "none";

/** Sidebar sections, in plain words. `match` lists the routes that light up the item. */
export const modules = [
  { id: "dashboard", group: "team", href: "/demo/office", label: "Today", match: ["/demo/office"] },
  { id: "quote", group: "team", href: "/demo/office/quote", label: "Rates and quotes", match: ["/demo/office/quote"] },
  { id: "enquiries", group: "team", href: "/demo/office/enquiries", label: "Enquiries", match: ["/demo/office/enquiries"] },
  { id: "orders", group: "team", href: "/demo/office/orders", label: "Orders", match: ["/demo/office/orders", "/demo/office/dispatch", "/demo/office/new-order"] },
  { id: "stock", group: "team", href: "/demo/office/stock", label: "Stock", match: ["/demo/office/stock"] },
  { id: "billing", group: "team", href: "/demo/office/billing", label: "Payments", match: ["/demo/office/billing"] },
  { id: "buyers", group: "team", href: "/demo/office/buyers", label: "Buyers", match: ["/demo/office/buyers"] },
  { id: "website", group: "online", href: "/demo/website", label: "Your website", match: ["/demo/website"] },
  { id: "search", group: "online", href: "/demo/market", label: "Marketplace", match: ["/demo/market", "/demo/market/requirements", "/demo/market/seller", "/demo/market/admin"] },
  { id: "whatsapp", group: "online", href: "/demo/whatsapp", label: "WhatsApp assistant", match: ["/demo/whatsapp"] },
  { id: "settings", group: "bottom", href: "/demo/office/settings", label: "Settings", match: ["/demo/office/settings"] },
] as const;

export type ModuleId = (typeof modules)[number]["id"];
export type OfficeModule = ModuleId;
export type MarketModule = ModuleId;

const N: Level = "none";
const team = (o: Partial<Record<ModuleId, Level>>): Record<ModuleId, Level> => ({
  dashboard: N, quote: N, enquiries: N, orders: N, stock: N, billing: N, buyers: N, website: "view", search: N, whatsapp: N, settings: N, ...o,
});

export const access: Record<Role, Record<ModuleId, Level>> = {
  owner: team({ dashboard: "full", quote: "full", enquiries: "full", orders: "full", stock: "full", billing: "full", buyers: "full", website: "full", search: "full", whatsapp: "full", settings: "full" }),
  sales: team({ dashboard: "own", quote: "full", enquiries: "own", orders: "full", stock: "view", billing: "own", buyers: "own", search: "view", whatsapp: "full" }),
  accounts: team({ quote: "view", enquiries: "view", orders: "view", stock: "view", billing: "full", buyers: "view" }),
  godown: team({ orders: "full", stock: "full" }),
  // Marketplace roles are shown as tabs inside the Marketplace screen, not as logins here.
  visitor: team({}),
  buyer: team({ search: "full" }),
  seller: team({ search: "view" }),
  admin: team({ search: "full", website: "full" }),
};

export const officeModules = modules.filter((m) => m.group !== "online");
export const officeAccess = access as Record<OfficeRole, Record<ModuleId, Level>>;

export const roleInfo: Record<Role, { label: string; who: string; system: "office" | "market"; home: string; short: string }> = {
  owner: { label: "Owner", who: "Harsh Jain", short: "Harsh", system: "office", home: "/demo/office" },
  sales: { label: "Sales", who: "Rohit", short: "Rohit", system: "office", home: "/demo/office/quote" },
  accounts: { label: "Accounts", who: "Meena", short: "Meena", system: "office", home: "/demo/office/billing" },
  godown: { label: "Godown", who: "Santosh", short: "Santosh", system: "office", home: "/demo/office/dispatch" },
  visitor: { label: "Visitor", who: "Anyone", short: "Visitor", system: "market", home: "/demo/website" },
  buyer: { label: "Buyer", who: "Shree Ganesh Moulders", short: "Buyer", system: "market", home: "/demo/market" },
  seller: { label: "Seller", who: "Shah Petrochem", short: "Seller", system: "market", home: "/demo/market/seller" },
  admin: { label: "Arihant admin", who: "Arihant team", short: "Admin", system: "market", home: "/demo/market/admin" },
};

export const TEAM: OfficeRole[] = ["owner", "sales", "accounts", "godown"];

export function isOffice(r: Role): r is OfficeRole {
  return r === "owner" || r === "sales" || r === "accounts" || r === "godown";
}

export function levelFor(role: Role | null, module: ModuleId): Level {
  return access[role ?? "owner"][module] ?? "none";
}
