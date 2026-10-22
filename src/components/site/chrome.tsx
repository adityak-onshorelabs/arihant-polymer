import Link from "next/link";
import { Store } from "lucide-react";
import { YEAR, company, nav } from "@/content/site";
import { MobileMenu } from "./mobile-menu";

export function Wordmark({ onPrint = false }: { onPrint?: boolean }) {
  return (
    <span className="flex items-baseline gap-2 leading-none">
      <span className={`t-code text-[1.9rem] ${onPrint ? "text-on-print" : "text-print"}`}>Arihant</span>
      <span className={`t-label ${onPrint ? "text-on-print" : "text-ink"}`}>Polymer</span>
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-sack">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:z-50 focus:bg-print focus:px-4 focus:py-2 focus:text-on-print">
        Skip to content
      </a>
      <div className="frame flex h-16 items-center justify-between gap-6">
        <Link href="/" aria-label={`${company.name}, home`} className="flex min-h-11 items-center">
          <Wordmark />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="flex min-h-11 items-center px-3 font-semibold hover:text-print">
              {n.label}
            </Link>
          ))}
          <Link href="/demo" className="ms-2 hidden min-h-11 items-center px-3 text-sm font-semibold text-ink-2 hover:text-print xl:flex">
            Platform demo
          </Link>
          <Link href="/marketplace" className="ms-3 inline-flex min-h-11 items-center gap-2 border-2 border-ink px-3 font-semibold hover:bg-ink hover:text-sack">
            <Store aria-hidden className="size-4" />
            Marketplace
          </Link>
          <Link href="/contact" className="ms-2 inline-flex min-h-11 items-center bg-print px-4 font-semibold text-on-print hover:bg-print-deep">
            Request a rate
          </Link>
        </nav>
        <MobileMenu items={[...nav, { href: "/marketplace", label: "Marketplace" }, { href: "/marketplace/sell", label: "Seller login" }, { href: "/demo", label: "Platform demo" }]} />
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="weave-print mt-auto text-on-print">
      <div className="frame py-14">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Wordmark onPrint />
            <p className="mt-4 max-w-sm">
              Polymer granules stockist and distributor, {company.address.short}. Since {company.since}.
            </p>
          </div>
          <div className="md:col-span-4">
            <p className="t-label">Godown and office</p>
            <address className="mt-2 not-italic">
              {company.address.lines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </address>
            <a href={company.address.mapsUrl} className="mt-2 inline-block font-semibold underline underline-offset-4" target="_blank" rel="noreferrer">
              Directions
            </a>
          </div>
          <div className="md:col-span-3">
            <p className="t-label">Contact</p>
            <p className="mt-2">{company.contactPerson}</p>
            <a href={`tel:${company.phone.tel}`} className="mt-1 block text-2xl font-bold">
              {company.phone.display}
            </a>
            <p className="mt-4 text-sm">GST {company.gst}</p>
          </div>
        </div>
        <hr className="seam seam-print mt-12" />
        <div className="mt-5 flex flex-wrap justify-between gap-3 text-sm">
          <span>© {YEAR} {company.name}</span>
          <span className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/marketplace/sell" className="underline underline-offset-4">
              Seller login
            </Link>
            <Link href="/demo" className="underline underline-offset-4">
              Platform demo
            </Link>
            <span>Website by Onshore Labs</span>
          </span>
        </div>
      </div>
    </footer>
  );
}

export function PlaceholderTag() {
  return (
    <span className="absolute end-2 top-2 z-10 bg-ink/80 px-2 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-sack">
      Placeholder photo
    </span>
  );
}
