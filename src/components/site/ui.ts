/** Shared class strings for the marketing site ("the sample in the light", see DESIGN.md). */

const base =
  "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 text-[0.95rem] font-medium transition-colors duration-200 ease-out";

/** Graphite pill. The one primary action per view. */
export const btnPrimary = `${base} bg-graphite text-label hover:bg-graphite/85`;

/** The dose: rubine pill, kept for the single enquiry action a section leads to. */
export const btnDose = `${base} bg-dose text-on-dose hover:bg-dose-deep`;

/** Hairline pill for the secondary action. */
export const btnSecondary = `${base} border border-rim/60 text-graphite hover:border-graphite hover:bg-film`;

/** Pills for the rubine band. */
export const btnOnDose = `${base} bg-label text-dose-deep hover:bg-dose-tint`;
export const btnOnDoseSecondary = `${base} border border-on-dose/40 text-on-dose hover:border-on-dose hover:bg-on-dose/10`;

/** Small hairline pill, for row-level actions. */
export const btnSmall =
  "inline-flex min-h-11 items-center justify-center rounded-full border border-rim/60 px-4 text-sm font-medium text-graphite transition-colors duration-200 hover:border-graphite hover:bg-graphite hover:text-label";

/** Quiet underlined text link. */
export const textLink =
  "inline-flex min-h-11 items-center gap-1.5 font-medium text-graphite underline decoration-rim/60 underline-offset-[6px] transition-colors hover:decoration-graphite";

/** Text input / search field. */
export const field =
  "w-full rounded-xl border border-rim/70 bg-label px-4 text-[1.05rem] text-graphite transition-colors placeholder:text-graphite-2/70 hover:border-graphite-2 focus-visible:border-graphite focus-visible:outline-none";
