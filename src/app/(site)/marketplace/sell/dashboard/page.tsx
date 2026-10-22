import type { Metadata } from "next";
import { SellerDashboard } from "@/components/market/seller-dashboard";

export const metadata: Metadata = {
  title: "Seller dashboard",
  robots: { index: false, follow: false },
};

export default function SellerDashboardPage() {
  return <SellerDashboard />;
}
