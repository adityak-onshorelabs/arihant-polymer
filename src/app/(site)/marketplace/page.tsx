import type { Metadata } from "next";
import { MarketBrowse } from "@/components/market/browse";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Compare polymer granule prices from checked sellers in one search, order and pay through the platform. Run by Arihant Polymer, Mumbai.",
  alternates: { canonical: "/marketplace" },
};

export default function MarketplacePage() {
  return <MarketBrowse />;
}
