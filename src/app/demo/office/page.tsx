"use client";

import Link from "next/link";
import { ArrowRight, Calculator, Package, Truck } from "lucide-react";
import { families } from "@/content/catalogue";
import { daysBetween, fmtDate, inr, owed, useDemo } from "@/lib/demo/store";
import { TODAY } from "@/lib/demo/seed";
import { roleInfo } from "@/lib/demo/access";
import { Gate, LevelNote, PageTitle, Panel, Stat } from "@/components/demo/ui";

const STEPS = [
  { icon: Calculator, title: "Make a quote", text: "Pick a grade and a buyer. The rate is worked out for you.", href: "/demo/office/quote" },
  { icon: Package, title: "Turn it into an order", text: "One click on the quote. The material is kept aside.", href: "/demo/office/orders" },
  { icon: Truck, title: "Send it out", text: "Move it across the dispatch board. The buyer is told on WhatsApp.", href: "/demo/office/dispatch" },
];

export default function Today() {
  const { state, free } = useDemo();
  return (
    <Gate module="dashboard">
      {(level) => {
        const person = state.role ? roleInfo[state.role] : roleInfo.owner;
        const own = level === "own";
        const buyers = own ? state.buyers.filter((b) => b.salesperson === person.who) : state.buyers;
        const ids = new Set(buyers.map((b) => b.id));
        const orders = state.orders.filter((o) => ids.has(o.buyerId));
        const today = orders.filter((o) => o.date === TODAY);
        const toSend = orders.filter((o) => o.stage === "Confirmed" || o.stage === "Packed");
        const overdue = state.invoices.filter((i) => !i.paid && ids.has(i.buyerId) && daysBetween(i.date, TODAY) > 30);
        const leads = state.enquiries.filter((e) => e.status === "New" && (!own || e.owner === person.who));

        const attention: { text: string; href: string; tone: "print" | "warn" }[] = [];
        if (!own) {
          const approvals = state.orders.filter((o) => o.needsApproval).length + state.quotes.filter((q) => q.status === "Needs approval").length;
          if (approvals) attention.push({ text: `${approvals} quote or order waiting for your OK`, href: "/demo/office/quote", tone: "print" });
          state.buyers
            .filter((b) => owed(state, b.id) > b.creditLimit)
            .slice(0, 2)
            .forEach((b) => attention.push({ text: `${b.name} owes more than their credit limit`, href: "/demo/office/billing", tone: "print" }));
        }
        state.items
          .filter((i) => free(i.key) < i.reorderAt && i.stock.MLD.onHand + i.stock.BHW.onHand > 0)
          .slice(0, 3)
          .forEach((i) => attention.push({ text: `${i.code} (${i.producer}) is running low: ${free(i.key)} tonnes left to sell`, href: "/demo/office/stock", tone: "warn" }));
        buyers
          .filter((b) => daysBetween(b.lastOrder, TODAY) >= b.cycleDays - 3)
          .slice(0, 2)
          .forEach((b) => attention.push({ text: `${b.name} usually orders about now. Give them a call.`, href: "/demo/office/buyers", tone: "warn" }));

        const month = orders.filter((o) => daysBetween(o.date, TODAY) <= 31);
        const top = buyers
          .map((b) => ({ b, t: month.filter((o) => o.buyerId === b.id).reduce((a, o) => a + o.qty, 0) }))
          .filter((x) => x.t > 0)
          .sort((a, b) => b.t - a.t)
          .slice(0, 4);

        return (
          <div className="space-y-8">
            <PageTitle title={`Good morning, ${person.short}`} sub={own ? `${fmtDate(TODAY)}. Only your buyers are shown.` : `${fmtDate(TODAY)}. Here is the business today.`}>
              <LevelNote level={level} />
            </PageTitle>

            <div data-tour="stats" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <Stat label="Orders today" value={today.length} />
              <Stat label="Waiting to be sent" value={toSend.length} note="orders to pack or load" />
              <Stat label="New enquiries" value={leads.length} />
              <Stat label="Overdue over 30 days" value={inr(overdue.reduce((a, i) => a + i.amount, 0))} tone="print" />
            </div>

            <section data-tour="try" className="border border-print/40 bg-print-tint p-5 md:p-6" aria-labelledby="try-title">
              <h2 id="try-title" className="text-lg font-bold">
                Try this: one order, start to finish
              </h2>
              <ol className="mt-4 grid gap-3 md:grid-cols-3">
                {STEPS.map((s, i) => (
                  <li key={s.title}>
                    <Link href={s.href} className="group flex h-full gap-3 border border-seam bg-sack p-4 hover:border-ink">
                      <span className="flex size-9 shrink-0 items-center justify-center bg-print font-bold text-on-print">{i + 1}</span>
                      <span>
                        <span className="flex items-center gap-1.5 font-bold">
                          <s.icon aria-hidden className="size-4" />
                          {s.title}
                        </span>
                        <span className="mt-1 block text-sm text-ink-2">{s.text}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>

            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <Panel title="Needs your attention" tour="attention">
                {attention.length === 0 ? (
                  <p className="text-ink-2">Nothing urgent today.</p>
                ) : (
                  <ul className="divide-y divide-seam">
                    {attention.map((a) => (
                      <li key={a.text}>
                        <Link href={a.href} className="group flex min-h-12 items-center gap-3 py-2">
                          <span aria-hidden className={`size-2.5 shrink-0 ${a.tone === "print" ? "bg-print" : "bg-warn"}`} />
                          <span className="flex-1">{a.text}</span>
                          <ArrowRight aria-hidden className="size-4 text-ink-2 group-hover:text-ink" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </Panel>

              <div className="space-y-6">
                <Panel title="Biggest buyers this month">
                  <ul className="space-y-3">
                    {top.map(({ b, t }) => (
                      <li key={b.id}>
                        <div className="flex justify-between gap-3">
                          <span className="font-semibold">{b.name}</span>
                          <span>{t} tonnes</span>
                        </div>
                        <div className="mt-1 h-2 bg-sack-3">
                          <div className="h-full bg-print" style={{ width: `${(t / top[0].t) * 100}%` }} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </Panel>

                {!own && (
                  <Panel title="Supplier price changes">
                    <ul className="divide-y divide-seam">
                      {state.priceMoves.slice(0, 4).map((p) => (
                        <li key={p.producer + p.family + p.date} className="flex justify-between gap-3 py-2">
                          <span>
                            {p.producer} {families.find((f) => f.id === p.family)?.short}
                            <span className="block text-sm text-ink-2">{fmtDate(p.date)}</span>
                          </span>
                          <span className={`font-bold ${p.change > 0 ? "text-ok" : "text-print"}`}>
                            {p.change > 0 ? "Up" : "Down"} ₹{Math.abs(p.change).toFixed(2)}/kg
                          </span>
                        </li>
                      ))}
                    </ul>
                  </Panel>
                )}
              </div>
            </div>
          </div>
        );
      }}
    </Gate>
  );
}
