"use client";

/*
 * Main navigation with the current page marked: the active link turns graphite,
 * carries aria-current="page", and a rubine pellet (the dose) sits under it.
 * The pellet slides to the new tab on navigation (motion layoutId, transform only).
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks({ items }: { items: readonly { href: string; label: string }[] }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  return (
    <>
      {items.map((n) => {
        const on = isActive(pathname, n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            aria-current={on ? "page" : undefined}
            className={cn("relative flex min-h-11 items-center px-3.5 text-[0.95rem] font-medium transition-colors", on ? "text-graphite" : "text-graphite-2 hover:text-graphite")}
          >
            {n.label}
            {on && (
              <motion.span
                layoutId="nav-pellet"
                aria-hidden
                className="absolute bottom-1 left-1/2 -ml-[0.31rem] flex"
                transition={reduce ? { duration: 0 } : { type: "tween", duration: 0.55, ease: [0.19, 1, 0.22, 1] }}
              >
                {/* the pellet keeps its own tilt; motion owns the wrapper's transform */}
                <span className="pellet" />
              </motion.span>
            )}
          </Link>
        );
      })}
    </>
  );
}
