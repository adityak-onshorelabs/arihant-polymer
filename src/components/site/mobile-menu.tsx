"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { isActive } from "./nav-links";
import { btnPrimary } from "./ui";

export function MobileMenu({ items }: { items: readonly { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const id = useId();
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={btn}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="flex size-11 items-center justify-center rounded-full border border-rim/60 text-graphite"
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
      </button>
      {open && (
        <nav id={id} aria-label="Main" className="absolute inset-x-0 top-full border-b border-seal bg-film">
          <ul className="frame py-3">
            {items.map((n) => (
              <li key={n.href} className="border-b border-seal last:border-b-0">
                <Link
                  href={n.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(pathname, n.href) ? "page" : undefined}
                  className={`flex min-h-14 items-center justify-between text-lg font-medium ${isActive(pathname, n.href) ? "text-graphite" : "text-graphite-2"}`}
                >
                  {n.label}
                  {isActive(pathname, n.href) && <span className="pellet" aria-hidden />}
                </Link>
              </li>
            ))}
            <li className="pb-2 pt-4">
              <Link href="/contact" onClick={() => setOpen(false)} className={`${btnPrimary} w-full`}>
                Send an enquiry
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
