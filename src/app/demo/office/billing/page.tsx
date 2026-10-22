"use client";

import { daysBetween, fmtDate, inr, owed, useDemo } from "@/lib/demo/store";
import { TODAY } from "@/lib/demo/seed";
import { roleInfo } from "@/lib/demo/access";
import { Btn, Gate, LevelNote, PageTitle, Panel, Table, Tag } from "@/components/demo/ui";

export default function Billing() {
  const { state, dispatch } = useDemo();
  return (
    <Gate module="billing">
      {(level) => {
        const me = state.role ? roleInfo[state.role].who : "";
        const buyers = level === "own" ? state.buyers.filter((b) => b.salesperson === me) : state.buyers;
        const ids = new Set(buyers.map((b) => b.id));
        const invoices = state.invoices.filter((i) => ids.has(i.buyerId));
        const canRemind = level === "full";
        const unpaid = invoices.filter((i) => !i.paid);
        return (
          <div className="space-y-6">
            <PageTitle title="Payments" sub="Who owes what, and since when. Send a polite WhatsApp reminder in one click.">
              <LevelNote level={level} />
            </PageTitle>

            <div className="grid gap-x-6 sm:grid-cols-3">
              <div className="border-b border-seam py-3">
                <p className="text-sm font-semibold text-ink-2">Outstanding</p>
                <p className="text-3xl font-bold">{inr(unpaid.reduce((a, i) => a + i.amount, 0))}</p>
              </div>
              <div className="border-b border-seam py-3">
                <p className="text-sm font-semibold text-ink-2">Overdue</p>
                <p className="text-3xl font-bold text-print">{inr(unpaid.filter((i) => i.due < TODAY).reduce((a, i) => a + i.amount, 0))}</p>
              </div>
              <div className="border-b border-seam py-3">
                <p className="text-sm font-semibold text-ink-2">Invoices this month</p>
                <p className="text-3xl font-bold">{invoices.filter((i) => daysBetween(i.date, TODAY) <= 31).length}</p>
              </div>
            </div>

            <Panel title="Invoices">
              <Table head={["Buyer", "Amount", "Status", ""]}>
                {invoices.map((inv) => {
                  const b = state.buyers.find((x) => x.id === inv.buyerId);
                  const late = !inv.paid && inv.due < TODAY ? daysBetween(inv.due, TODAY) : 0;
                  return (
                    <tr key={inv.id}>
                      <td>
                        <b>{b?.name}</b>
                        <div className="text-sm text-ink-2">
                          Invoice {inv.id} · {fmtDate(inv.date)}
                        </div>
                      </td>
                      <td className="font-semibold">{inr(inv.amount)}</td>
                      <td>
                        {inv.paid ? (
                          <Tag tone="ok">Paid</Tag>
                        ) : late > 0 ? (
                          <Tag tone={late > 30 ? "print" : "warn"}>{late} days late</Tag>
                        ) : (
                          <Tag>Due {fmtDate(inv.due)}</Tag>
                        )}
                        {inv.reminders > 0 && <span className="ms-2 text-xs text-ink-2">{inv.reminders} reminder{inv.reminders > 1 ? "s" : ""}</span>}
                      </td>
                      <td className="text-end">{canRemind && !inv.paid && late > 0 && <Btn variant="line" onClick={() => dispatch({ type: "remind", invoiceId: inv.id })}>Send reminder</Btn>}</td>
                    </tr>
                  );
                })}
              </Table>
            </Panel>

            <Panel title="Credit by buyer">
              <Table head={["Buyer", "Credit limit", "Owes now", "Used", ""]}>
                {buyers.map((b) => {
                  const o = owed(state, b.id);
                  const pct = Math.round((o / b.creditLimit) * 100);
                  return (
                    <tr key={b.id}>
                      <td>
                        <b>{b.name}</b>
                        <div className="text-sm text-ink-2">{b.creditDays} days credit</div>
                      </td>
                      <td>{inr(b.creditLimit)}</td>
                      <td>{inr(o)}</td>
                      <td className="w-40">
                        <div className="h-2 bg-sack-3">
                          <div className={`h-full ${pct > 80 ? "bg-print" : "bg-ink"}`} style={{ width: `${Math.min(100, pct)}%` }} />
                        </div>
                      </td>
                      <td>{pct}%</td>
                    </tr>
                  );
                })}
              </Table>
            </Panel>
          </div>
        );
      }}
    </Gate>
  );
}
