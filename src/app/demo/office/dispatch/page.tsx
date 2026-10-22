"use client";

import { Truck } from "lucide-react";
import { fmtDate, useDemo } from "@/lib/demo/store";
import { GODOWNS } from "@/lib/demo/seed";
import type { OrderStage } from "@/lib/demo/types";
import { Btn, Gate, LevelNote, ORDER_TABS, PageTitle, SubTabs } from "@/components/demo/ui";

const COLS: { stage: OrderStage; title: string; action?: string }[] = [
  { stage: "Confirmed", title: "To pack", action: "Packed" },
  { stage: "Packed", title: "Ready to load", action: "Dispatched" },
  { stage: "Dispatched", title: "On the road", action: "Delivered" },
  { stage: "Delivered", title: "Delivered, awaiting payment" },
];

export default function DispatchBoard() {
  const { state, dispatch } = useDemo();
  return (
    <Gate module="orders">
      {(level) => {
        const canMove = level === "full";
        return (
          <div className="space-y-6">
            <PageTitle title="Orders" sub="The godown's day on one board. Moving a card sends the buyer a WhatsApp message.">
              <LevelNote level={level} />
            </PageTitle>
            <SubTabs items={ORDER_TABS} />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {COLS.map((c) => {
                const list = state.orders.filter((o) => o.stage === c.stage);
                const tonnes = list.reduce((a, o) => a + o.qty, 0);
                return (
                  <section key={c.stage} className="flex min-w-0 flex-col border border-seam bg-[oklch(98.8%_0.004_85)]">
                    <div className="flex items-baseline justify-between border-b border-seam px-3 py-3">
                      <h2 className="text-sm font-semibold">{c.title}</h2>
                      <span className="text-sm text-ink-2">
                        {list.length} · {tonnes} t
                      </span>
                    </div>
                    <ul className="flex-1 space-y-2 p-2">
                      {list.length === 0 && <li className="p-2 text-sm text-ink-2">Nothing here.</li>}
                      {list.map((o) => {
                        const b = state.buyers.find((x) => x.id === o.buyerId);
                        const it = state.items.find((x) => x.key === o.itemKey);
                        return (
                          <li key={o.id} className="border border-seam bg-sack p-3 text-sm">
                            <div className="flex items-baseline justify-between gap-2">
                              <b className="t-code text-xl text-print">{it?.code}</b>
                              <span className="font-bold">{o.qty} t</span>
                            </div>
                            <p className="font-semibold">{b?.name}</p>
                            <p className="text-ink-2">
                              {b?.city} · {GODOWNS[o.godown]} · {o.id} · {fmtDate(o.date)}
                            </p>
                            {o.truck && (
                              <p className="mt-1 flex items-center gap-1 text-xs text-ink-2">
                                <Truck aria-hidden className="size-3.5" /> {o.truck} · {o.driver}
                              </p>
                            )}
                            {o.needsApproval && <p className="mt-1 text-xs font-semibold text-print">Waiting for owner approval</p>}
                            {canMove && c.action && !o.needsApproval && (
                              <Btn variant="line" className="mt-2 w-full" onClick={() => dispatch({ type: "advanceOrder", orderId: o.id })}>
                                Mark {c.action.toLowerCase()}
                              </Btn>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                );
              })}
            </div>
          </div>
        );
      }}
    </Gate>
  );
}
