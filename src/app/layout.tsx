import type { Metadata } from "next";
import { Big_Shoulders, Big_Shoulders_Stencil, Hanken_Grotesk } from "next/font/google";
import { company } from "@/content/site";
import "./globals.css";

const shoulders = Big_Shoulders({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-shoulders",
});

const stencil = Big_Shoulders_Stencil({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-stencil-face",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: `${company.name} | Polymer granules stockist in Mumbai since ${company.since}`,
    template: `%s | ${company.name}`,
  },
  description:
    "PP, HDPE, LLDPE, LDPE, polystyrene, PVC and PET granules from Reliance, GAIL, IOCL, HMEL, OPaL and other producers. Stockist and distributor in Malad West, Mumbai since 1991.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${shoulders.variable} ${stencil.variable} ${hanken.variable} antialiased`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
