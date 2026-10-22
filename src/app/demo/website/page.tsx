"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, ExternalLink, Globe, RefreshCw } from "lucide-react";
import { grades } from "@/content/catalogue";
import { fmtDate, useDemo } from "@/lib/demo/store";
import { Gate, PageTitle, Panel, Table, Tag } from "@/components/demo/ui";

const PAGES = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "Grade page", path: "/products/mi3530-reliance" },
  { label: "About", path: "/about" },
  { label: "Reviews", path: "/reviews" },
  { label: "Rate request", path: "/contact?grade=mi3530-reliance" },
  { label: "Marketplace", path: "/marketplace" },
  { label: "Seller login", path: "/marketplace/sell" },
];

const BUILT = [
  ["Home with grade lookup", "Type a code, producer or process; the grade prints as a bag label"],
  [`Product register, ${grades.length} grades`, "Real grades from Arihant's current listing, filter by polymer, search"],
  ["A page for every grade", "Producer, type, process, MFI where listed, related grades"],
  ["Rate request", "Grade, quantity and delivery point in three steps; lands in the enquiry inbox"],
  ["About and reviews", "Firm details, GST, address, IndiaMART rating 4.5 from 186 buyers"],
  ["Marketplace", "Every seller's price for a grade in one search, an order form under each offer, post a requirement"],
  ["Seller login and dashboard", "Mobile number and code sign-in; sellers manage their products, orders and buyer requests"],
  ["Search-ready", "Page titles, sitemap and business details for Google"],
];

export default function WebsiteSection() {
  const { state } = useDemo();
  const [tab, setTab] = useState<"customer" | "shop">("customer");
  const [page, setPage] = useState(PAGES[0].path);
  const [nonce, setNonce] = useState(0);
  const siteLeads = state.enquiries.filter((e) => e.source === "Website");

  return (
    <Gate module="website">
      {() => (
        <div className="space-y-6">
          <PageTitle title="Your website" sub="Arihant's own website, replacing the IndiaMART page." />

          <div data-tour="site-banner" className="weave-print grid gap-4 p-5 text-on-print md:grid-cols-[1fr_auto] md:items-center md:p-6">
            <div>
              <p className="text-sm font-semibold flex items-center gap-2">
                <Globe aria-hidden className="size-4" />
                Built and working
              </p>
              <p className="t-h3 mt-2 text-[1.9rem]">This is the real website, not a mock-up.</p>
              <p className="mt-2 max-w-2xl">It runs in this same project, with Arihant&apos;s real catalogue of 236 grades and Arihant&apos;s own photos.</p>
            </div>
            <Link href="/" target="_blank" className="inline-flex min-h-12 items-center justify-center gap-2 bg-sack px-5 font-semibold text-print hover:bg-sack-2">
              Open the full website
              <ExternalLink aria-hidden className="size-4" />
            </Link>
          </div>

          <div data-tour="site-tabs" role="tablist" aria-label="Website views" className="flex gap-6 border-b-2 border-ink">
            {(
              [
                ["customer", "Customer view"],
                ["shop", "What Arihant sees"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                role="tab"
                type="button"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={`-mb-0.5 min-h-11 border-b-4 px-1 font-semibold ${tab === id ? "border-print text-ink" : "border-transparent text-ink-2 hover:text-ink"}`}
              >
                {label}
                {id === "shop" && siteLeads.length > 0 && <span className="ms-2 bg-print px-1.5 text-xs text-on-print">{siteLeads.length}</span>}
              </button>
            ))}
          </div>

          {tab === "customer" ? (
            <div className="grid gap-6 xl:grid-cols-[1fr_18rem]">
              <div data-tour="site-preview" className="min-w-0 border-2 border-ink bg-sack-2">
                <div className="flex flex-wrap items-center gap-3 border-b-2 border-ink px-3 py-2">
                  <span className="flex gap-1.5" aria-hidden>
                    <span className="size-3 rounded-full bg-print" />
                    <span className="size-3 rounded-full bg-warn" />
                    <span className="size-3 rounded-full bg-ok" />
                  </span>
                  <span className="min-w-0 flex-1 truncate border border-seam bg-sack px-3 py-1 text-center text-xs text-ink-2">arihantpolymer.in{page === "/" ? "" : page}</span>
                  <button type="button" onClick={() => setNonce((n) => n + 1)} aria-label="Reload page" className="flex size-8 items-center justify-center hover:bg-sack">
                    <RefreshCw aria-hidden className="size-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1 border-b border-seam bg-sack px-3 py-2" role="group" aria-label="Go to page">
                  {PAGES.map((p) => (
                    <button key={p.path} type="button" aria-pressed={page === p.path} onClick={() => setPage(p.path)} className={`min-h-9 px-3 text-xs font-semibold ${page === p.path ? "bg-ink text-sack" : "border border-ink hover:bg-sack-2"}`}>
                      {p.label}
                    </button>
                  ))}
                </div>
                <iframe key={`${page}-${nonce}`} src={page} title="Arihant Polymer website" className="block h-[78vh] min-h-[36rem] w-full bg-sack" />
              </div>

              <Panel title="What is built" tour="site-built">
                <ul className="space-y-3 text-sm">
                  {BUILT.map(([t, d]) => (
                    <li key={t} className="flex gap-2">
                      <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-ok" />
                      <span>
                        <b>{t}</b>
                        <span className="block text-ink-2">{d}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 border-t border-seam pt-3 text-sm text-ink-2">
                  Arihant&apos;s side of the marketplace (approving sellers, every sale) is under{" "}
                  <Link href="/demo/market" className="font-semibold text-ink underline underline-offset-4">
                    Marketplace
                  </Link>{" "}
                  in this demo.
                </p>
              </Panel>
            </div>
          ) : (
            <div className="space-y-6">
              <Panel title="Rate requests from the website">
                {siteLeads.length === 0 ? (
                  <p className="text-ink-2">
                    None yet. Send one from the{" "}
                    <button type="button" onClick={() => { setTab("customer"); setPage("/contact?grade=mi3530-reliance"); }} className="font-semibold text-ink underline underline-offset-4">
                      rate request page
                    </button>{" "}
                    and it will appear here and in the enquiry inbox.
                  </p>
                ) : (
                  <Table head={["Date", "Buyer", "Request", "Deliver to", "Owner", "Status"]}>
                    {siteLeads.map((e) => (
                      <tr key={e.id}>
                        <td>{fmtDate(e.date)}</td>
                        <td className="font-semibold">{e.buyerName}</td>
                        <td>{e.text}</td>
                        <td>{e.city}</td>
                        <td>{e.owner}</td>
                        <td>
                          <Tag tone={e.status === "New" ? "print" : "plain"}>{e.status}</Tag>
                        </td>
                      </tr>
                    ))}
                  </Table>
                )}
                <p className="mt-3 text-xs text-ink-2">Tip: requests you send from the website in this browser show up here after you return to the demo.</p>
              </Panel>

              <div className="grid gap-6 lg:grid-cols-2">
                <Panel title="Most viewed grades this week (sample)">
                  <ul className="space-y-3 text-sm">
                    {[
                      ["MI3530", "Reliance", 412],
                      ["H030SG", "Reliance", 288],
                      ["F52H04", "OPaL", 251],
                      ["I26A500U", "GAIL", 197],
                      ["1110MAS", "IOCL", 163],
                    ].map(([c, p, n]) => (
                      <li key={c as string}>
                        <div className="flex justify-between">
                          <span>
                            <b className="text-print">{c}</b> {p}
                          </span>
                          <span>{n} views</span>
                        </div>
                        <div className="mt-1 h-2 bg-sack-3">
                          <div className="h-full bg-print" style={{ width: `${((n as number) / 412) * 100}%` }} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </Panel>
                <Panel title="How buyers found the site (sample)">
                  <ul className="divide-y divide-seam text-sm">
                    {[
                      ["Google search for a grade code", "54%"],
                      ["Plastivision QR code", "18%"],
                      ["WhatsApp rate broadcast", "15%"],
                      ["Typed the address", "13%"],
                    ].map(([k, v]) => (
                      <li key={k} className="flex justify-between py-2">
                        <span>{k}</span>
                        <b>{v}</b>
                      </li>
                    ))}
                  </ul>
                </Panel>
              </div>
            </div>
          )}
        </div>
      )}
    </Gate>
  );
}
