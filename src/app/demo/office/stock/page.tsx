"use client";

import { useMemo, useState } from "react";
import { families, type Family } from "@/content/catalogue";
import { fmtDate, inr, rs, useDemo } from "@/lib/demo/store";
import { GODOWNS } from "@/lib/demo/seed";
import { Btn, Gate, LevelNote, PageTitle, Panel, Table, Tag } from "@/components/demo/ui";

export default function Stock() {
  const { state, dispatch, free } = useDemo();
  const [fam, setFam] = useState<Family | "ALL">("ALL");
  const [q, setQ] = useState("");
  const rows = useMemo(
    () => state.items.filter((i) => (fam === "ALL" || i.family === fam) && (!q || `${i.code} ${i.producer} ${i.process}`.toLowerCase().includes(q.toLowerCase()))),
    [state.items, fam, q],
  );
  return (
    <Gate module="stock">
      {(level) => {
        const role = state.role!;
        const showValue = role === "owner" || role === "accounts";
        const canReceive = role === "owner" || role === "godown";
        const total = state.items.reduce((a, i) => a + i.stock.MLD.onHand + i.stock.BHW.onHand, 0);
        return (
          <div className="space-y-6">
            <PageTitle title="Stock" sub={`${total} tonnes in the two godowns. "Available to sell" is what is not already kept for an order.`}>
              <LevelNote level={level} />
            </PageTitle>

            <Panel title="Material on the way from producers">
              <Table head={["PO", "Producer", "Grade", "Qty", "Rate", "Expected", "Godown", ""]}>
                {state.purchases.map((p) => {
                  const it = state.items.find((i) => i.key === p.itemKey);
                  return (
                    <tr key={p.id}>
                      <td className="font-semibold">{p.id}</td>
                      <td>{p.producer}</td>
                      <td>
                        <b>{it?.code}</b>
                      </td>
                      <td>{p.qty} t</td>
                      <td>{role === "sales" ? "-" : rs(p.rate)}</td>
                      <td>{fmtDate(p.expected)}</td>
                      <td>{GODOWNS[p.godown]}</td>
                      <td className="text-end">
                        {p.received ? <Tag tone="ok">Received</Tag> : canReceive ? <Btn variant="line" onClick={() => dispatch({ type: "receivePO", poId: p.id })}>Goods received</Btn> : <Tag>On the way</Tag>}
                      </td>
                    </tr>
                  );
                })}
              </Table>
            </Panel>

            <Panel
              title="In the godowns"
              action={
                <label className="flex items-center gap-2 text-sm">
                  <span className="sr-only">Search stock</span>
                  <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search code or producer" className="h-9 w-48 border border-ink bg-sack px-2" />
                </label>
              }
            >
              <div className="mb-3 flex flex-wrap gap-1" role="group" aria-label="Polymer family">
                {(["ALL", ...families.map((f) => f.id)] as const).map((f) => (
                  <button key={f} type="button" aria-pressed={fam === f} onClick={() => setFam(f)} className={`min-h-9 border border-ink px-2.5 text-xs font-semibold ${fam === f ? "bg-ink text-sack" : "hover:bg-sack-2"}`}>
                    {f === "ALL" ? "All" : families.find((x) => x.id === f)?.short}
                  </button>
                ))}
              </div>
              <Table head={["Grade", "Producer", "Process", "Malad", "Bhiwandi", "Kept for orders", "Available to sell", ...(showValue ? ["Rate", "Value"] : []), "Flags"]}>
                {rows.map((i) => {
                  const onHand = i.stock.MLD.onHand + i.stock.BHW.onHand;
                  const promised = i.stock.MLD.promised + i.stock.BHW.promised;
                  const f = free(i.key);
                  return (
                    <tr key={i.key}>
                      <td className="font-bold text-print">{i.code}</td>
                      <td>{i.producer}</td>
                      <td className="text-ink-2">{i.process}</td>
                      <td>{i.stock.MLD.onHand} t</td>
                      <td>{i.stock.BHW.onHand} t</td>
                      <td>{promised} t</td>
                      <td className="font-semibold">{f} t</td>
                      {showValue && <td>{rs(i.rate)}</td>}
                      {showValue && <td>{inr(onHand * 1000 * i.rate)}</td>}
                      <td className="space-x-1">
                        {f < i.reorderAt && onHand > 0 && <Tag tone="warn">Running low</Tag>}
                        {onHand === 0 && <Tag>None left</Tag>}
                        {i.daysInStock > 60 && onHand > 0 && <Tag tone="print">{i.daysInStock} days old</Tag>}
                      </td>
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
