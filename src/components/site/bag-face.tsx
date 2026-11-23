import type { Grade } from "@/content/catalogue";
import { cn } from "@/lib/utils";

/** A family marker: one small pellet in the family's data colour. (Also used by the marketplace demo.) */
export function FamilySwatch({ family, className }: { family: Grade["family"]; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(`fam-${family} inline-block h-[0.42rem] w-[0.58rem] shrink-0 -rotate-12 rounded-[50%]`, className)}
      style={{ background: "var(--fam)" }}
    />
  );
}
