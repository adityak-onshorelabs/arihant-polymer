import { families, gradeTitle, type Grade } from "@/content/catalogue";
import { company } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * A grade printed like the face of a polymer sack: family band, stencilled
 * code, producer, process. Concept object for the whole site (DESIGN.md).
 */
export function BagFace({ grade, size = "md", className }: { grade: Grade; size?: "md" | "lg"; className?: string }) {
  const fam = families.find((f) => f.id === grade.family)!;
  const title = gradeTitle(grade);
  const long = title.length > 9;
  return (
    <figure
      className={cn(
        `fam-${grade.family} relative isolate overflow-hidden border-2 border-ink bg-sack text-ink`,
        className,
      )}
      aria-label={`${title}${grade.producer ? `, ${grade.producer}` : ""}, ${grade.type}, ${grade.process}`}
    >
      <div className="seam mx-3 mt-2" aria-hidden />
      <div className="mt-2 flex items-center justify-between gap-3 px-4 py-2 text-on-print" style={{ background: "var(--fam)" }}>
        <span className="t-label">{fam.short}</span>
        <span className="t-label truncate">{grade.type}</span>
      </div>

      <div className={cn("px-4 pt-5", size === "lg" ? "pb-6 md:px-7" : "pb-5")}>
        <p className="t-label text-ink-2">Grade</p>
        <p
          className={cn(
            "t-code mt-1 break-words text-print",
            size === "lg"
              ? long
                ? "text-[clamp(2.6rem,7vw,4.5rem)]"
                : "text-[clamp(3.6rem,10vw,7rem)]"
              : long
                ? "text-[clamp(2.2rem,6vw,3.2rem)]"
                : "text-[clamp(3rem,9vw,4.75rem)]",
          )}
        >
          {title}
        </p>
        <p className={cn("t-h3 mt-3", size === "lg" && "md:text-[2rem]")}>{grade.producer ?? "Producer on request"}</p>

        <dl className="mt-5 grid grid-cols-2 border-t-2 border-ink text-sm">
          <div className="border-e border-b border-seam py-2 pe-3">
            <dt className="t-label text-ink-2">Process</dt>
            <dd className="mt-0.5 font-semibold">{grade.process}</dd>
          </div>
          <div className="border-b border-seam py-2 ps-3">
            <dt className="t-label text-ink-2">MFI</dt>
            <dd className="mt-0.5 font-semibold">{grade.mfi ? `${grade.mfi} g/10 min` : "See producer TDS"}</dd>
          </div>
          <div className="border-e border-seam py-2 pe-3">
            <dt className="t-label text-ink-2">Polymer</dt>
            <dd className="mt-0.5 font-semibold">{fam.label}</dd>
          </div>
          <div className="py-2 ps-3">
            <dt className="t-label text-ink-2">Pack</dt>
            <dd className="mt-0.5 font-semibold">{grade.packing && /25\s*kg/i.test(grade.packing) ? "25 kg bag" : "Producer bag"}</dd>
          </div>
        </dl>
      </div>

      <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-seam bg-sack-2 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-ink-2">
        <span>{company.name}</span>
        <span>Stockist since {company.since} · {company.address.short}</span>
      </figcaption>
      <div className="seam mx-3 mb-2 mt-0" aria-hidden />
    </figure>
  );
}

export function FamilySwatch({ family, className }: { family: Grade["family"]; className?: string }) {
  return <span aria-hidden className={cn(`fam-${family} inline-block size-3 shrink-0`, className)} style={{ background: "var(--fam)" }} />;
}
