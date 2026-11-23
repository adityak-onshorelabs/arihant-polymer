import type { ReactNode } from "react";
import { families, familyLook, gradeTitle, packKg, type Grade, type GranuleLook } from "@/content/catalogue";
import { company, terms } from "@/content/site";
import { cn } from "@/lib/utils";
import { GranuleSvg, packPellets } from "./granules";
import { FamilySwatch } from "./bag-face";

/**
 * The site's one container: a clear polythene sample pouch.
 * A heat-seal strip across the top, film body with a single sheen line, and a
 * window that holds granules or a photo. A sticker can be pressed onto it.
 */
export function Pouch({ children, sticker, className, windowClassName }: { children?: ReactNode; sticker?: ReactNode; className?: string; windowClassName?: string }) {
  return (
    <div className={cn("pouch", className)}>
      <div className="seal" aria-hidden />
      <div className={cn("pouch-window relative", windowClassName)}>
        {children}
        {sticker}
      </div>
    </div>
  );
}

/** Granules poured into a pouch window for a grade's family. */
export function PouchFill({ grade, pour = false, delay = 0, fill = 0.62, seed }: { grade: Grade; pour?: boolean; delay?: number; fill?: number; seed?: number }) {
  const W = 400;
  const H = 500;
  const look = familyLook[grade.family];
  const s = seed ?? hash(grade.slug);
  const pellets = packPellets({ width: W, height: H, size: look === "powder" ? 7 : 11, fill, seed: s });
  return <GranuleSvg id={`pf-${grade.slug}`} pellets={pellets} width={W} height={H} look={look} pour={pour} delay={delay} className="absolute inset-0 size-full" />;
}

export function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** The printed label on a sample pouch: grade code first, then the facts a buyer checks. */
export function GradeSticker({ grade, className, press = false, delay = 0, size = "md" }: { grade: Grade; className?: string; press?: boolean; delay?: number; size?: "md" | "lg" }) {
  const fam = families.find((f) => f.id === grade.family)!;
  const title = gradeTitle(grade);
  const long = title.length > 9;
  const kg = packKg(grade);
  return (
    <div
      className={cn("sticker text-graphite", press && "press-on", className)}
      style={{ "--d": `${delay}s`, "--r": "-1deg" } as React.CSSProperties}
      role="group"
      aria-label={`${title}${grade.producer ? `, ${grade.producer}` : ""}, ${grade.type}, ${grade.process}`}
    >
      <div className={cn("px-4 pt-3.5", size === "lg" && "md:px-5 md:pt-4")}>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[0.8rem] text-graphite-2">
          <FamilySwatch family={grade.family} />
          <span className="font-medium text-graphite">{fam.short}</span>
          <span aria-hidden>·</span>
          <span className="truncate">{grade.type}</span>
        </p>
        <p
          className={cn(
            "d-code mt-2 break-words leading-[0.95]",
            size === "lg" ? (long ? "text-[clamp(1.9rem,4.2vw,2.6rem)]" : "text-[clamp(2.4rem,5.4vw,3.5rem)]") : long ? "text-[1.7rem]" : "text-[2.2rem]",
          )}
        >
          {title}
        </p>
        <p className="mt-1 text-graphite-2">{grade.producer ?? "Producer on request"}</p>
      </div>
      <dl className={cn("mt-3 grid grid-cols-3 border-t border-dashed border-seal text-[0.8rem]", size === "lg" && "md:text-[0.85rem]")}>
        {[
          ["MFI", grade.mfi ? `${grade.mfi}` : "On TDS"],
          ["Pack", `${kg} kg bag`],
          ["Delivery", grade.delivery ?? terms.delivery],
        ].map(([k, v], i) => (
          <div key={k} className={cn("px-4 py-2.5", i < 2 && "border-e border-dashed border-seal", size === "lg" && "md:px-5")}>
            <dt className="text-graphite-2">{k}</dt>
            <dd className="mt-0.5 font-medium">{v}</dd>
          </div>
        ))}
      </dl>
      <p className={cn("flex justify-between gap-3 border-t border-seal px-4 py-2 text-[0.72rem] text-graphite-2", size === "lg" && "md:px-5")}>
        <span>{company.name}</span>
        <span>{company.address.short}</span>
      </p>
    </div>
  );
}

/** A small sample pouch for a family: a heap of its granules and a printed label underneath. */
export function MiniPouch({ id, look, fill = 0.6, seed = 7, className, pour = false, delay = 0 }: { id: string; look: GranuleLook; fill?: number; seed?: number; className?: string; pour?: boolean; delay?: number }) {
  const W = 160;
  const H = 120;
  const pellets = packPellets({ width: W, height: H, size: look === "powder" ? 4.5 : 7, fill, mound: 0.1, seed });
  return (
    <span className={cn("pouch block", className)} aria-hidden>
      <span className="seal block !h-2.5" />
      <span className="pouch-window relative block aspect-[4/3]">
        <GranuleSvg id={`mp-${id}`} pellets={pellets} width={W} height={H} look={look} pour={pour} delay={delay} dose={look === "dose" ? [] : [3]} className="absolute inset-0 size-full" />
      </span>
    </span>
  );
}
