import type { Metadata } from "next";
import { SellerLogin } from "@/components/market/seller-login";

export const metadata: Metadata = {
  title: "Seller login",
  description: "Sell polymer granules on the Arihant Marketplace: list your grades, set your prices and get orders from buyers across India.",
  alternates: { canonical: "/marketplace/sell" },
};

export default function SellerLoginPage() {
  return <SellerLogin />;
}
