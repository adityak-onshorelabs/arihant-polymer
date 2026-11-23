import Link from "next/link";
import { YEAR, company, nav } from "@/content/site";
import { MobileMenu } from "./mobile-menu";
import { NavLinks } from "./nav-links";
import { HeaderShell } from "./motion/header-shell";
import { btnPrimary } from "./ui";

export function Wordmark() {
  return (
    <span className="flex items-center gap-2 text-[1.2rem] leading-none tracking-[-0.03em]">
      <span className="pellet" aria-hidden />
      <span className="font-semibold text-graphite">Arihant</span>
      <span className="-ms-0.5 font-normal text-graphite-2">Polymer</span>
    </span>
  );
}

export function SiteHeader() {
  return (
    <HeaderShell>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-graphite focus:px-4 focus:py-2 focus:text-label"
      >
        Skip to content
      </a>
      <div className="frame flex h-[4.5rem] items-center justify-between gap-6">
        <Link href="/" aria-label={`${company.name}, home`} className="flex min-h-11 items-center">
          <Wordmark />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          <NavLinks items={nav} />
          <Link href="/contact" className={`${btnPrimary} ms-4 min-h-11 px-5 text-sm`}>
            Send an enquiry
          </Link>
        </nav>
        <MobileMenu items={nav} />
      </div>
    </HeaderShell>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto overflow-hidden bg-film">
      <div className="seal" aria-hidden />
      <div className="frame pb-10 pt-16 md:pt-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Wordmark />
            <p className="mt-4 max-w-xs text-graphite-2">
              Polymer granules stockist and distributor in {company.address.short}, since {company.since}.
            </p>
          </div>
          <div className="md:col-span-4">
            <p className="meta">Godown and office</p>
            <address className="mt-3 not-italic leading-relaxed">
              {company.address.lines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </address>
            <a
              href={company.address.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex min-h-11 items-center font-medium underline decoration-rim/60 underline-offset-[6px] hover:decoration-graphite"
            >
              Directions
            </a>
          </div>
          <div className="md:col-span-3">
            <p className="meta">Contact</p>
            <p className="mt-3">{company.contactPerson}</p>
            <a href={`tel:${company.phone.tel}`} className="mt-1 inline-flex min-h-11 items-center text-xl font-medium tracking-[-0.01em]">
              {company.phone.display}
            </a>
            <ul className="mt-4 space-y-1">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="inline-flex min-h-9 items-center text-graphite-2 hover:text-graphite">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-wrap justify-between gap-x-6 gap-y-3 border-t border-seal pt-6 text-sm text-graphite-2">
          <span>
            © {YEAR} {company.name} · GST {company.gst}
          </span>
          <span className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/demo" className="hover:text-graphite">
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
    <span className="absolute end-3 top-3 z-10 rounded-full bg-label/90 px-3 py-1 text-xs font-medium text-graphite-2">
      Placeholder photo
    </span>
  );
}
