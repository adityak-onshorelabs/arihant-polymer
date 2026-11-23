import type { ReactNode } from "react";
import { Settle } from "./motion/effects";

/** Eyebrow (with the rubine pellet), a heading and an optional lead line, settling in on first view. */
export function SectionHead({ label, title, children, className }: { label: string; title: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <Settle stagger className={className ?? "max-w-2xl"}>
      <p className="eyebrow">{label}</p>
      <h2 className="d-h2 mt-5">{title}</h2>
      {children ? <div className="lead mt-5">{children}</div> : null}
    </Settle>
  );
}
