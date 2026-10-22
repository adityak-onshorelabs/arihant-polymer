"use client";

/*
 * Orders and dispatch (module 2.3). The stage control adapts Watermelon UI
 * `status-picker` (reference/watermelon/status-picker.tsx): kept the idea of a
 * single control showing the current state and moving to the next; rebuilt as a
 * stage rail with one "move to next stage" button per role.
 */

import { useState } from "react";
import { Check } from "lucide-react";
import { fmtDate, inr, rs, useDemo } from "@/lib/demo/store";
import { GODOWNS } from "@/lib/demo/seed";
import { ORDER_STAGES, type OrderStage } from "@/lib/demo/types";
import { Btn, Gate, LevelNote, ORDER_TABS, PageTitle, Panel, SubTabs, Tag } from "@/components/demo/ui";

/** Which next stage each role may set. Godown packs and dispatches; accounts marks paid. */
const CAN_MOVE: Record<string, OrderStage[]> = {
  owner: ["Packed", "Dispatched", "Delivered", "Paid"],
  sales: ["Delivered"],
  godown: ["Packed", "Dispatched", "Delivered"],
  accounts: ["Paid"],
};

export default function Orders() {
  const { state, dispatch } = useDemo();
  const [filter, setFilter] = useState<OrderStage | "Open" | "All">("Open");
  return (
    <Gate module="orders">
      {(level) => {
        const role = state.role!;
        const list = state.orders.filter((o) => (filter === "All" ? true : filter === "Open" ? o.stage !== "Paid" : o.stage === filter));
        return (
          <div className="space-y-6">
            <PageTitle title="Orders" sub="Every order from the day it is booked to the day it is paid. The buyer gets a WhatsApp message at each step.">
              <LevelNote level={level} />
            </PageTitle>

            <SubTabs items={ORDER_TABS} tour="order-tabs" />
            <div data-tour="order-filter" className="flex flex-wrap gap-1" role="group" aria-label="Filter orders">
              {(["Open", ...ORDER_STAGES, "All"] as const).map((s) => (
                <button key={s} type="button" aria-pressed={filter === s} onClick={() => setFilter(s)} className={`min-h-10 border-2 border-ink px-3 text-sm font-semibold ${filter === s ? "bg-ink text-sack" : "hover:bg-sack-2"}`}>
                  {s === "Open" ? "Not yet paid" : s}{" "}
                  <span className="opacity-60">
                    {s === "All" ? state.orders.length : s === "Open" ? state.orders.filter((o) => o.stage !== "Paid").length : state.orders.filter((o) => o.stage === s).length}
                  </span>
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {list.map((o, i) => {
                const b = state.buyers.find((x) => x.id === o.buyerId)!;
                const it = state.items.find((x) => x.key === o.itemKey);
                const idx = ORDER_STAGES.indexOf(o.stage);
                const next = ORDER_STAGES[idx + 1];
                const mayMove = next && (CAN_MOVE[role] ?? []).includes(next) && !o.needsApproval;
                return (
                  <Panel key={o.id} tour={i === 0 ? "order-card" : undefined}>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                      <div className="min-w-0 lg:w-80">
                        <p className="text-sm text-ink-2">
                          {o.id} · {fmtDate(o.date)} · via {o.source}
                        </p>
                        <p className="font-bold">{b.name}</p>
                        <p className="text-sm">
                          <b className="text-print">{it?.code}</b> {it?.producer} · {o.qty} t · {rs(o.price)}/kg · {GODOWNS[o.godown]}
                        </p>
                        {role !== "godown" && <p className="text-sm text-ink-2">Value {inr(o.qty * 1000 * o.price * 1.18)} incl. GST</p>}
                      </div>

                      <ol className="flex flex-1 items-center gap-1" aria-label={`Stage: ${o.stage}`}>
                        {ORDER_STAGES.map((s, i) => (
                          <li key={s} className="flex flex-1 flex-col items-center gap-1 text-center">
                            <span className={`flex size-7 items-center justify-center border-2 ${i <= idx ? "border-ink bg-ink text-sack" : "border-seam text-ink-2"}`}>{i < idx ? <Check aria-hidden className="size-4" /> : i + 1}</span>
                            <span className={`text-[0.7rem] font-semibold uppercase tracking-wide ${i === idx ? "text-print" : "text-ink-2"}`}>{s}</span>
                          </li>
                        ))}
                      </ol>

                      <div className="flex flex-col items-start gap-2 lg:w-56 lg:items-end">
                        {o.needsApproval && <Tag tone="print">Over credit limit</Tag>}
                        {o.needsApproval && role === "owner" && <Btn onClick={() => dispatch({ type: "approveOrder", orderId: o.id })}>Approve order</Btn>}
                        {o.truck && (
                          <p className="text-xs text-ink-2">
                            Truck {o.truck} · {o.driver}
                          </p>
                        )}
                        {o.invoiceId && <p className="text-xs text-ink-2">Invoice {o.invoiceId}</p>}
                        {mayMove && <Btn onClick={() => dispatch({ type: "advanceOrder", orderId: o.id })}>Mark {next.toLowerCase()}</Btn>}
                        {!mayMove && next && !o.needsApproval && <span className="text-xs text-ink-2">Next: {next} ({next === "Paid" ? "accounts" : next === "Delivered" ? "godown or sales" : "godown"})</span>}
                      </div>
                    </div>
                  </Panel>
                );
              })}
              {list.length === 0 && <p className="text-ink-2">No orders here.</p>}
            </div>
          </div>
        );
      }}
    </Gate>
  );
}
