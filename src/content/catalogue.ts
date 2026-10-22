/*
 * Arihant Polymer product register.
 *
 * Source: every category page of arihantpolymer.in (Arihant's IndiaMART-hosted
 * catalogue), crawled 22 Oct 2026: 236 products with their spec tables,
 * descriptions, minimum order, packing, delivery time and photos. Photos are
 * Arihant's own (bags and granules shot in their godown), resized into
 * /public/images/products. Grade code, producer, polymer family, type and
 * process are derived from the listed product name and spec table only.
 * The old site shows "Rs 100/Kg" on most products, which is a placeholder, so
 * no prices are published. Stock levels are not public.
 */

import data from "./catalogue.data.json";

export type Family =
  | "PP"
  | "HDPE"
  | "LLDPE"
  | "LDPE"
  | "STYRENICS"
  | "PVC"
  | "PET"
  | "ENGG"
  | "ADDITIVE";

export const families: { id: Family; label: string; short: string }[] = [
  { id: "PP", label: "Polypropylene", short: "PP" },
  { id: "HDPE", label: "High density polyethylene", short: "HDPE" },
  { id: "LLDPE", label: "Linear low density polyethylene", short: "LLDPE" },
  { id: "LDPE", label: "Low density polyethylene", short: "LDPE" },
  { id: "STYRENICS", label: "Polystyrene and ABS", short: "PS / ABS" },
  { id: "PVC", label: "PVC resin", short: "PVC" },
  { id: "PET", label: "PET resin", short: "PET" },
  { id: "ENGG", label: "Polycarbonate and EVA", short: "PC / EVA" },
  { id: "ADDITIVE", label: "Additives", short: "Additives" },
];

export interface GradeImage {
  src: string;
  w: number;
  h: number;
}

export interface Grade {
  slug: string;
  /** Grade code as printed by the producer, or null for generic listings. */
  code: string | null;
  /** Product name exactly as listed on the old site. */
  listed: string;
  producer: string | null;
  family: Family;
  /** Polymer type, e.g. "Impact copolymer". */
  type: string;
  /** Process or end use stated in the listing. */
  process: string;
  /** Melt flow index, only when stated in the listing (g/10 min). */
  mfi?: string | null;
  /** Category on the old site. */
  category: string;
  moq?: string | null;
  packing?: string | null;
  delivery?: string | null;
  color?: string | null;
  application?: string | null;
  /** Spec table rows as listed. */
  specs: string[][];
  description: string;
  images: GradeImage[];
}

export const grades: Grade[] = data as Grade[];

export function gradeSlug(g: Grade): string {
  return g.slug;
}

export function gradeTitle(g: Grade): string {
  return g.code ?? g.listed;
}

export const producers = Array.from(new Set(grades.map((g) => g.producer).filter((p): p is string => Boolean(p))));

/** Producers in order of how many listed grades Arihant carries from them. */
export const producersByCount = producers
  .map((p) => ({ name: p, count: grades.filter((g) => g.producer === p).length }))
  .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

export const categories = Array.from(new Set(grades.map((g) => g.category)));

export function searchGrades(query: string, list: Grade[] = grades): Grade[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  const terms = q.split(/\s+/);
  return list
    .map((g) => {
      const hay = [g.code, g.producer, g.type, g.process, g.family, g.category, g.listed, g.application, g.mfi ? `${g.mfi} mfi` : ""]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!terms.every((t) => hay.includes(t))) return null;
      const code = (g.code ?? "").toLowerCase();
      const score = code === q ? 0 : code.startsWith(q) ? 1 : (g.producer ?? "").toLowerCase().startsWith(q) ? 2 : 3;
      return { g, score };
    })
    .filter((x): x is { g: Grade; score: number } => x !== null)
    .sort((a, b) => a.score - b.score)
    .map((x) => x.g);
}
