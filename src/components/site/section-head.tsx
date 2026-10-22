import type { ReactNode } from "react";

/** Section header printed like a bag panel label: number, seam, title. */
export function SectionHead({ no, label, title, children }: { no: string; label: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="max-w-3xl">
      <p className="t-label flex items-center gap-3 text-print">
        <span className="t-code text-2xl">{no}</span>
        <span>{label}</span>
      </p>
      <h2 className="t-h2 mt-3">{title}</h2>
      {children ? <div className="t-lead mt-4 text-ink-2">{children}</div> : null}
    </div>
  );
}
