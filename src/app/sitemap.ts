import type { MetadataRoute } from "next";
import { gradeSlug, grades } from "@/content/catalogue";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/products", "/about", "/reviews", "/contact"].map((p) => ({ url: `${base}${p}` }));
  return [...pages, ...grades.map((g) => ({ url: `${base}/products/${gradeSlug(g)}` }))];
}
