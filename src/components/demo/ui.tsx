"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useDemo } from "@/lib/demo/store";
import { levelFor, roleInfo, type Level, type ModuleId } from "@/lib/demo/access";

/** Page heading in plain sentence case, with one line saying what the screen is for. */
export function PageTitle({ title, sub, children }: { no?: string; title: string; sub?: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 pb-2 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-[1.9rem] font-bold leading-tight tracking-tight md:text-[2.2rem]">{title}</h1>
        {sub && <p className="mt-1 max-w-2xl text-[1.05rem] text-ink-2">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

/** Tabs that link between screens of one section (e.g. Orders: list, dispatch, new). */
export function SubTabs({ items }: { items: { href: string; label: string }[] }) {
  const path = usePathname();
  return (
    <nav aria-label="Section" className="flex gap-6 overflow-x-auto border-b border-seam">
      {items.map((t) => {
        const on = path === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={on ? "page" : undefined}
            className={`-mb-px flex min-h-11 shrink-0 items-center border-b-[3px] text-[0.98rem] font-semibold ${on ? "border-print text-ink" : "border-transparent text-ink-2 hover:text-ink"}`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}

export const ORDER_TABS = [
  { href: "/demo/office/orders", label: "All orders" },
  { href: "/demo/office/dispatch", label: "Dispatch board" },
  { href: "/demo/office/new-order", label: "+ New order" },
];

export const MARKET_TABS = [
  { href: "/demo/market", label: "Find material" },
  { href: "/demo/market/requirements", label: "Buyer requests" },
  { href: "/demo/market/seller", label: "A seller's screen" },
  { href: "/demo/market/admin", label: "Arihant's control" },
];

export function Btn({ variant = "solid", className, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "solid" | "line" | "quiet" }) {
  return (
    <button
      type="button"
      {...p}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50",
        variant === "solid" && "bg-print text-on-print hover:bg-print-deep",
        variant === "line" && "border border-ink bg-sack hover:bg-ink hover:text-sack",
        variant === "quiet" && "underline underline-offset-4 hover:text-print",
        className,
      )}
    />
  );
}

export function Panel({ title, action, children, className }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("border border-seam bg-[oklch(98.8%_0.004_85)]", className)}>
      {title && (
        <div className="flex items-center justify-between gap-3 px-5 pt-4">
          <h2 className="text-[1.05rem] font-bold">{title}</h2>
          {action}
        </div>
      )}
      <div className="p-5 pt-3">{children}</div>
    </section>
  );
}

export function Tag({ tone = "plain", children }: { tone?: "plain" | "print" | "ok" | "warn" | "ink"; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap px-2 py-0.5 text-xs font-semibold",
        tone === "plain" && "bg-sack-3 text-ink",
        tone === "print" && "bg-print-tint text-print-deep",
        tone === "ok" && "bg-[oklch(93%_0.04_150)] text-ok",
        tone === "warn" && "bg-[oklch(94%_0.05_80)] text-warn",
        tone === "ink" && "bg-ink text-sack",
      )}
    >
      {children}
    </span>
  );
}

export function Table({ head, children, className }: { head: ReactNode[]; children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative -mx-5 overflow-x-auto px-5", className)}>
      <table className="w-full min-w-[36rem] border-collapse text-[0.95rem]">
        <thead>
          <tr className="border-b border-ink text-start">
            {head.map((h, i) => (
              <th key={i} scope="col" className="px-2 py-2 text-start text-sm font-semibold text-ink-2 first:ps-0">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&>tr]:border-b [&>tr]:border-seam [&_td]:px-2 [&_td]:py-3 [&_td:first-child]:ps-0">{children}</tbody>
      </table>
    </div>
  );
}

export function Stat({ label, value, note, tone }: { label: string; value: ReactNode; note?: ReactNode; tone?: "print" }) {
  return (
    <div className="border border-seam bg-[oklch(98.8%_0.004_85)] p-5">
      <p className="text-sm font-semibold text-ink-2">{label}</p>
      <p className={cn("mt-1 text-[2rem] font-bold leading-tight tabular-nums", tone === "print" && "text-print")}>{value}</p>
      {note && <p className="mt-1 text-sm text-ink-2">{note}</p>}
    </div>
  );
}

/** Wraps a screen: shows a plain notice when this person's screen doesn't include it. */
export function Gate({ module, children }: { module: ModuleId; children: (level: Level) => ReactNode }) {
  const { state, ready } = useDemo();
  if (!ready) return <p className="py-10 text-ink-2">Loading…</p>;
  const role = state.role ?? "owner";
  const level = levelFor(role, module);
  if (level === "none")
    return (
      <div className="max-w-lg py-16">
        <p className="text-2xl font-bold">This screen is not on {roleInfo[role].short}&apos;s login.</p>
        <p className="mt-2 text-ink-2">
          Each person only sees what their job needs. Switch to Harsh (Owner) at the top to see everything.
        </p>
        <Link href={roleInfo[role].home} className="mt-5 inline-flex min-h-11 items-center bg-print px-4 font-semibold text-on-print">
          Go to {roleInfo[role].short}&apos;s first screen
        </Link>
      </div>
    );
  return <>{children(level)}</>;
}

export function LevelNote({ level }: { level: Level }) {
  if (level === "full") return null;
  return <Tag tone="warn">{level === "view" ? "Can look, cannot change" : "Only their own buyers"}</Tag>;
}
