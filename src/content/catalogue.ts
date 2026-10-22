/*
 * Arihant Polymer product register.
 *
 * Source: arihantpolymer.in (IndiaMART-hosted catalogue), category page
 * /plastic-granules.html, read 22 Oct 2026. Grade codes, producers, MFI and
 * process are taken from the listed product names only; nothing is added.
 * Duplicates on the old site (I26A500U, F46003E, 203EL / SC 203 EL) are merged.
 * The old site shows "Rs 100/Kg" on every product, which is a placeholder, so no
 * prices are published here. Stock levels are not public.
 */

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

export interface Grade {
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
  mfi?: string;
  /** Category on the old site. */
  category: string;
}

export const grades: Grade[] = [
  // PPCP impact copolymer, injection moulding
  { code: "MI3530", listed: "MI3530 Reliance PP Impact Copolymer Injection Moulding Granules", producer: "Reliance", family: "PP", type: "Impact copolymer", process: "Injection moulding", category: "PPCP impact copolymer" },
  { code: "B120MA", listed: "B120MA Reliance 12MFI PP Impact Copolymer Injection Moulding Granules", producer: "Reliance", family: "PP", type: "Impact copolymer", process: "Injection moulding", mfi: "12", category: "PPCP impact copolymer" },
  { code: "B030MG", listed: "B030MG Reliance 3.3MFI PP Impact Copolymer Injection Moulding Granules", producer: "Reliance", family: "PP", type: "Impact copolymer", process: "Injection moulding", mfi: "3.3", category: "PPCP impact copolymer" },
  // PP random copolymer
  { code: "SR20NC", listed: "SR20NC Reliance PP Random Copolymer Blow Moulding Granules", producer: "Reliance", family: "PP", type: "Random copolymer", process: "Blow moulding", category: "PP random copolymer" },
  { code: "SRM100NC", listed: "SRM100NC Reliance PP Random Copolymer Injection Moulding Granules", producer: "Reliance", family: "PP", type: "Random copolymer", process: "Injection moulding", category: "PP random copolymer" },
  { code: "HM012CT", listed: "HM012CT MRPL PP Random Copolymer Injection Moulding Granules", producer: "MRPL", family: "PP", type: "Random copolymer", process: "Injection moulding", category: "PP random copolymer" },
  // PP injection moulding
  { code: "1110MAS", listed: "1110MAS IOCL PP Injection Moulding Granule", producer: "IOCL", family: "PP", type: "Polypropylene", process: "Injection moulding", category: "PP injection moulding" },
  { code: "HE125MO", listed: "HE125MO Borouge PP Injection Moulding Granule", producer: "Borouge", family: "PP", type: "Polypropylene", process: "Injection moulding", category: "PP injection moulding" },
  { code: "1304E3", listed: "1304E3 Exxon Mobil PP Injection Moulding Granule", producer: "ExxonMobil", family: "PP", type: "Polypropylene", process: "Injection moulding", category: "PP injection moulding" },
  // HDPE film
  { code: "F52H04", listed: "F52H04 Opal HDPE HM-HDPE Film Granules", producer: "OPaL", family: "HDPE", type: "HM-HDPE", process: "Film", category: "HDPE HM-HDPE film" },
  { code: "F0146D", listed: "HMEL F0146D HDPE FILM", producer: "HMEL", family: "HDPE", type: "HDPE", process: "Film", category: "HDPE HM-HDPE film" },
  { code: "FB1520", listed: "FB1520 Borouge HDPE HM-HDPE Film Granules", producer: "Borouge", family: "HDPE", type: "HM-HDPE", process: "Film", category: "HDPE HM-HDPE film" },
  // LLDPE film
  { code: "F0120L", listed: "HMEL F0120L LLDPE Blown Film", producer: "HMEL", family: "LLDPE", type: "LLDPE", process: "Blown film", category: "LLDPE film" },
  { code: "JF19010", listed: "JF19010 Reliance LLDPE Film Granules", producer: "Reliance", family: "LLDPE", type: "LLDPE", process: "Film", category: "LLDPE film" },
  { code: "F19010", listed: "F19010 Reliance LLDPE Film Granules", producer: "Reliance", family: "LLDPE", type: "LLDPE", process: "Film", category: "LLDPE film" },
  { code: "F2001S", listed: "F2001S OPAL LLDPE Film Granules", producer: "OPaL", family: "LLDPE", type: "LLDPE", process: "Film", category: "LLDPE film" },
  // PP granules
  { code: "HR003", listed: "HR003 Mangpol PP Granule", producer: "Mangpol", family: "PP", type: "Polypropylene", process: "General purpose", category: "PP granules" },
  { code: "M12RR", listed: "M12RR PP Homopolymer Granule", producer: null, family: "PP", type: "Homopolymer", process: "General purpose", category: "PP granules" },
  { code: "2120MC", listed: "2120 MC Propel PP Random Granule", producer: "Propel", family: "PP", type: "Random copolymer", process: "General purpose", category: "PP granules" },
  // PP raffia
  { code: "H030SG", listed: "H030SG Reliance PP Raffia Granules", producer: "Reliance", family: "PP", type: "Homopolymer", process: "Raffia", category: "PP raffia" },
  { code: "HP456J", listed: "Moplen HP456J Lyondell Basell PP Raffia Granules", producer: "LyondellBasell", family: "PP", type: "Homopolymer", process: "Raffia", category: "PP raffia" },
  { code: "H1030", listed: "H1030 Tasnee PP Raffia Granules", producer: "Tasnee", family: "PP", type: "Homopolymer", process: "Raffia", category: "PP raffia" },
  { code: "NSY114G", listed: "NSY114G NSRP PP Raffia Granules", producer: "NSRP", family: "PP", type: "Polypropylene", process: "Raffia", category: "PP raffia" },
  // HDPE raffia
  { code: "R5410", listed: "R5410 OPAL HDPE Raffia Granules", producer: "OPaL", family: "HDPE", type: "HDPE", process: "Raffia", category: "HDPE raffia" },
  { code: "T9", listed: "T9 Haldia HDPE Raffia Granules", producer: "Haldia", family: "HDPE", type: "HDPE", process: "Raffia", category: "HDPE raffia" },
  { code: "T50A010A", listed: "T50A010A Gail HDPE Raffia Granules", producer: "GAIL", family: "HDPE", type: "HDPE", process: "Raffia", category: "HDPE raffia" },
  // HDPE granules and pipe
  { code: "M5618", listed: "M5618 High Density Polyethylene", producer: null, family: "HDPE", type: "HDPE", process: "General purpose", category: "HDPE granules" },
  { code: "46GP009", listed: "Reliance 46gp009 Hdpe For Pipe Extrusion", producer: "Reliance", family: "HDPE", type: "HDPE", process: "Pipe extrusion", category: "HDPE granules" },
  { code: "46GP003", listed: "Reliance 46Gp003 High Density Polyethylene For Pipe Extrusion", producer: "Reliance", family: "HDPE", type: "HDPE", process: "Pipe extrusion", category: "HDPE granules" },
  { code: "P4609", listed: "reliance p4609", producer: "Reliance", family: "HDPE", type: "HDPE", process: "General purpose", category: "HDPE granules" },
  { code: "F46003E", listed: "RELIANCE HDPE BLOW F46003E", producer: "Reliance", family: "HDPE", type: "HDPE", process: "Blown film", category: "HDPE granules" },
  // LLDPE granules and moulding
  { code: "I26A500U", listed: "I26A500U Gail LLDPE Injection Moulding Granules", producer: "GAIL", family: "LLDPE", type: "LLDPE", process: "Injection moulding", category: "LLDPE moulding" },
  { code: "500M24A", listed: "500M24A IOCL LLDPE Injection Moulding Granules", producer: "IOCL", family: "LLDPE", type: "LLDPE", process: "Injection moulding", category: "LLDPE moulding" },
  { code: "M2550", listed: "M2550 Opal LLDPE Injection Moulding Granules", producer: "OPaL", family: "LLDPE", type: "LLDPE", process: "Injection moulding", category: "LLDPE moulding" },
  { code: "M26500", listed: "M26500 Reliance LLDPE Injection Moulding Granules", producer: "Reliance", family: "LLDPE", type: "LLDPE", process: "Injection moulding", category: "LLDPE moulding" },
  { code: "R36A050U", listed: "R36A050U LLDPE for Rotomoulding", producer: null, family: "LLDPE", type: "LLDPE", process: "Rotomoulding", category: "LLDPE moulding" },
  { code: "D22S010A", listed: "D22S010 A LLDPE for Drip Irrigation Extrusion Pipe", producer: null, family: "LLDPE", type: "LLDPE", process: "Drip irrigation pipe", category: "LLDPE moulding" },
  // PP homopolymer
  { code: "T03NR", listed: "HMEL T03Nr Polypropylene Homopolymer Thermoforming", producer: "HMEL", family: "PP", type: "Homopolymer", process: "Thermoforming", category: "PP homopolymer" },
  { code: "HP2106N", listed: "Luban HP2106N Polypropylene Homopolymer Granules", producer: "Luban", family: "PP", type: "Homopolymer", process: "General purpose", category: "PP homopolymer" },
  { code: "H350FG", listed: "Reliance H350FG POLYPROPLENE HOMOPOLYMER", producer: "Reliance", family: "PP", type: "Homopolymer", process: "General purpose", category: "PP homopolymer" },
  { code: "H350EC", listed: "Reliance H350EC Homopolymer", producer: "Reliance", family: "PP", type: "Homopolymer", process: "General purpose", category: "PP homopolymer" },
  { code: "MH13A", listed: "Opal Pp Mh13A Injection Moulding Granules", producer: "OPaL", family: "PP", type: "Polypropylene", process: "Injection moulding", category: "PP injection moulding" },
  // HDPE injection moulding
  { code: "50MA180", listed: "50Ma180 Reliance Hdpe Injection Moulding Granules", producer: "Reliance", family: "HDPE", type: "HDPE", process: "Injection moulding", category: "HDPE injection moulding" },
  { code: "M2050S", listed: "HMEL M2050S HDPE Injection Moulding", producer: "HMEL", family: "HDPE", type: "HDPE", process: "Injection moulding", category: "HDPE injection moulding" },
  { code: "M5018L", listed: "M5018L Haldia HDPE Injection Moulding Granules", producer: "Haldia", family: "HDPE", type: "HDPE", process: "Injection moulding", category: "HDPE injection moulding" },
  // PP TQ film
  { code: "H100EY", listed: "H100EY Reliance PP TQ Film Granules", producer: "Reliance", family: "PP", type: "Homopolymer", process: "TQ film", category: "PP TQ film" },
  { code: "F10SR", listed: "HMEL F10Sr Polypropylene Homopolymer PP TQ Films", producer: "HMEL", family: "PP", type: "Homopolymer", process: "TQ film", category: "PP TQ film" },
  { code: "1100N", listed: "Advanced PP 1100N Propylene Homopolymer", producer: "Advanced", family: "PP", type: "Homopolymer", process: "TQ film", category: "PP TQ film" },
  // PP copolymer, Borouge
  { code: "BE961MO", listed: "Borouge BE961MO 12MFI POLYPROPYLENE COPOLYMER FOR INJECTION MOULDING", producer: "Borouge", family: "PP", type: "Copolymer", process: "Injection moulding", mfi: "12", category: "PP copolymer" },
  { code: "BH975MO", listed: "Borouge BH975MO 38MFI POLYPROPYLENE COPOLYMER FOR INJECTION MOULDING", producer: "Borouge", family: "PP", type: "Copolymer", process: "Injection moulding", mfi: "38", category: "PP copolymer" },
  { code: "BJ368MO", listed: "Borouge BJ368MO 70MFI POLYPROPYLENE COPOLYMER FOR INJECTION MOULDING", producer: "Borouge", family: "PP", type: "Copolymer", process: "Injection moulding", mfi: "70", category: "PP copolymer" },
  { code: "HOE111NP", listed: "HOE 111NP BOROUGE 8-10MFI PP INJECTION MOUDLING", producer: "Borouge", family: "PP", type: "Polypropylene", process: "Injection moulding", mfi: "8 to 10", category: "PP copolymer" },
  { code: "MN70", listed: "Ppr Mn70 Pp Random Copolymer", producer: null, family: "PP", type: "PPR random copolymer", process: "Pipe fittings", category: "PP random copolymer" },
  // GPPS and HIPS
  { code: "203EL", listed: "203EL Supreme GPPS Injection Moulding Granules", producer: "Supreme", family: "STYRENICS", type: "GPPS", process: "Injection moulding", category: "Polystyrene" },
  { code: "206", listed: "206 Supreme GPPS Injection Moulding Granules", producer: "Supreme", family: "STYRENICS", type: "GPPS", process: "Injection moulding", category: "Polystyrene" },
  { code: "1115", listed: "1115 Petro Paak GPPS Injection Moulding Granules", producer: "Petro Paak", family: "STYRENICS", type: "GPPS", process: "Injection moulding", category: "Polystyrene" },
  { code: "SH03", listed: "Supreme HIPS Injection Molding 10 MFI SH03", producer: "Supreme", family: "STYRENICS", type: "HIPS", process: "Injection moulding", mfi: "10", category: "Polystyrene" },
  { code: "SH300", listed: "Supreme SH300 HIPS (High Impact Polystyrene)", producer: "Supreme", family: "STYRENICS", type: "HIPS", process: "General purpose", category: "Polystyrene" },
  { code: "SH450", listed: "Supreme SH450 HIPS (High Impact Polystyrene)", producer: "Supreme", family: "STYRENICS", type: "HIPS", process: "General purpose", category: "Polystyrene" },
  // ABS
  { code: "700", listed: "Absolac 700 ABS Virgin Granule", producer: "Absolac", family: "STYRENICS", type: "ABS", process: "General purpose", category: "ABS" },
  { code: "GA850", listed: "Polimaxx GA850 Acrylonitrile Butadiene Styrene (ABS)", producer: "Polimaxx", family: "STYRENICS", type: "ABS", process: "General purpose", category: "ABS" },
  { code: "5000W", listed: "Taitalac 5000W ABS (Acrylonitrile Butadiene Styrene)", producer: "Taitalac", family: "STYRENICS", type: "ABS", process: "General purpose", category: "ABS" },
  // LDPE
  { code: "J24FS040", listed: "J24FS040 Reliance LDPE Film Granules", producer: "Reliance", family: "LDPE", type: "LDPE", process: "Film", category: "LDPE film" },
  { code: "24FS040", listed: "24FS040 Reliance LDPE Film Granules", producer: "Reliance", family: "LDPE", type: "LDPE", process: "Film", category: "LDPE film" },
  { code: "1005FY20", listed: "Reliance 1005FY20 LDPE FILM GRADE", producer: "Reliance", family: "LDPE", type: "LDPE", process: "Film", category: "LDPE film" },
  { code: "19N430", listed: "19N430 INEOS LDPE Lamination Extrusion Coating Granules", producer: "INEOS", family: "LDPE", type: "LDPE", process: "Lamination and extrusion coating", category: "LDPE extrusion coating" },
  { code: "D777C", listed: "D777C SCG LDPE Lamination Extrusion Coating Granules", producer: "SCG", family: "LDPE", type: "LDPE", process: "Lamination and extrusion coating", category: "LDPE extrusion coating" },
  { code: "801YY", listed: "801YY Titan LDPE Lamination Extrusion Coating Granules", producer: "Titan", family: "LDPE", type: "LDPE", process: "Lamination and extrusion coating", category: "LDPE extrusion coating" },
  { code: "16MA400", listed: "Reliance 16MA400 LDPE FOR INJECTION MOULDING", producer: "Reliance", family: "LDPE", type: "LDPE", process: "Injection moulding", category: "LDPE moulding" },
  { code: "2025NN", listed: "Sabic Ldpe 2025Nn", producer: "Sabic", family: "LDPE", type: "LDPE", process: "General purpose", category: "LDPE granules" },
  { code: null, listed: "White LDPE Granule", producer: null, family: "LDPE", type: "LDPE", process: "General purpose", category: "LDPE granules" },
  // HDPE blow moulding
  { code: "B0155D", listed: "HMEL B0155D HDPE Blow Moulding", producer: "HMEL", family: "HDPE", type: "HDPE", process: "Blow moulding", category: "HDPE blow moulding" },
  { code: "54GB012", listed: "Reliance 54GB012 HDPE FOR SMALL VOLUME BLOW MOULDING", producer: "Reliance", family: "HDPE", type: "HDPE", process: "Small volume blow moulding", category: "HDPE blow moulding" },
  { code: "52GB003", listed: "Reliance 52gb003 Hdpe Blow Moulding", producer: "Reliance", family: "HDPE", type: "HDPE", process: "Blow moulding", category: "HDPE blow moulding" },
  { code: "B56003", listed: "Reliance B56003 Hdpe Blow Moulding", producer: "Reliance", family: "HDPE", type: "HDPE", process: "Blow moulding", category: "HDPE blow moulding" },
  { code: "52GB002", listed: "reliance 52gb002 hdpe", producer: "Reliance", family: "HDPE", type: "HDPE", process: "Blow moulding", category: "HDPE blow moulding" },
  { code: null, listed: "Natural HD Plastic Granules", producer: null, family: "HDPE", type: "HDPE", process: "General purpose", category: "HDPE granules" },
  // PVC
  { code: "LS100", listed: "LG PVC LS100", producer: "LG Chem", family: "PVC", type: "PVC resin", process: "General purpose", category: "PVC resin" },
  { code: "SP660", listed: "SCG SP660 PVC Resin General Grade", producer: "SCG", family: "PVC", type: "PVC resin", process: "General purpose", category: "PVC resin" },
  { code: "S65D", listed: "Formosa S65D PVC Resin", producer: "Formosa", family: "PVC", type: "PVC resin", process: "General purpose", category: "PVC resin" },
  // PET
  { code: "WK801", listed: "Wankai Pet Resin Wk 801", producer: "Wankai", family: "PET", type: "PET resin", process: "General purpose", category: "PET resin" },
  { code: "RAMAPET N1", listed: "Indorama Pet 0.8 Iv Ramapet N1", producer: "Indorama", family: "PET", type: "PET resin, 0.8 IV", process: "General purpose", category: "PET resin" },
  { code: "RAMAPET S1", listed: "Indorama Ramapet S1", producer: "Indorama", family: "PET", type: "PET resin", process: "General purpose", category: "PET resin" },
  // Engineering
  { code: null, listed: "White Polycarbonate Granules", producer: null, family: "ENGG", type: "Polycarbonate", process: "General purpose", category: "Polycarbonate" },
  { code: null, listed: "Polycarbonate Virgin Granule", producer: null, family: "ENGG", type: "Polycarbonate, virgin", process: "General purpose", category: "Polycarbonate" },
  { code: null, listed: "Ethylene Vinyl Acetate Granules", producer: null, family: "ENGG", type: "EVA", process: "General purpose", category: "EVA" },
  // Additives
  { code: "FINASTAT 9500", listed: "GMS FINE ORGANICS FINASTAT 9500", producer: "Fine Organics", family: "ADDITIVE", type: "GMS additive", process: "Additive", category: "Additives" },
];

export function gradeSlug(g: Grade): string {
  const base = [g.code ?? g.listed, g.producer ?? ""].join(" ");
  return base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function gradeTitle(g: Grade): string {
  return g.code ?? g.listed;
}

export const producers = Array.from(
  new Set(grades.map((g) => g.producer).filter((p): p is string => Boolean(p))),
);

/** Producers in order of how many listed grades Arihant carries from them. */
export const producersByCount = producers
  .map((p) => ({ name: p, count: grades.filter((g) => g.producer === p).length }))
  .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

export function searchGrades(query: string, list: Grade[] = grades): Grade[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  const terms = q.split(/\s+/);
  return list
    .map((g) => {
      const hay = [g.code, g.producer, g.type, g.process, g.family, g.category, g.listed, g.mfi ? `${g.mfi} mfi` : ""]
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
