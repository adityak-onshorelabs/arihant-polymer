"use client";

import { families } from "@/content/catalogue";
import { useDemo } from "@/lib/demo/store";
import { Btn, Gate, MARKET_TABS, PageTitle, Panel, SubTabs, Table, Tag } from "@/components/demo/ui";

export default function ControlCentre() {
  const { state, dispatch } = useDemo();
  return (
    <Gate module="search">
      {() => {
        const live = state.sellers.filter((s) => s.status === "Live").length;
        const demand = families
          .map((f) => ({
            f,
            asks: state.requirements.filter((r) => state.items.find((i) => i.key === r.itemKey)?.family === f.id).reduce((a, r) => a + r.qty, 0) + state.enquiries.filter((e) => state.items.find((i) => i.key === e.itemKey)?.family === f.id).reduce((a, e) => a + e.qty, 0),
            listed: state.listings.filter((l) => state.items.find((i) => i.key === l.itemKey)?.family === f.id).reduce((a, l) => a + l.stock, 0),
          }))
          .filter((d) => d.asks > 0 || d.listed > 0);
        return (
          <div className="space-y-6">
            <PageTitle title="Marketplace" sub={`Arihant decides who sells and how it earns. ${live} sellers live now.`} />
            <SubTabs items={MARKET_TABS} />

            <Panel title="Sellers">
              <Table head={["Seller", "City", "GST", "Rating", "Status", ""]}>
                {state.sellers
                  .filter((s) => s.id !== "arihant")
                  .map((s) => (
                    <tr key={s.id}>
                      <td className="font-semibold">{s.name}</td>
                      <td>{s.city}</td>
                      <td className="font-mono text-xs">{s.gst}</td>
                      <td>{s.rating ? `★ ${s.rating}` : "New"}</td>
                      <td>
                        <Tag tone={s.status === "Live" ? "ok" : s.status === "Pending" ? "warn" : "plain"}>{s.status === "Pending" ? "Awaiting checks" : s.status}</Tag>
                      </td>
                      <td className="space-x-2 text-end">
                        {s.status !== "Live" && <Btn onClick={() => dispatch({ type: "sellerStatus", id: s.id, status: "Live" })}>{s.status === "Pending" ? "Approve" : "Resume"}</Btn>}
                        {s.status === "Live" && (
                          <Btn variant="line" onClick={() => dispatch({ type: "sellerStatus", id: s.id, status: "Paused" })}>
                            Pause
                          </Btn>
                        )}
                      </td>
                    </tr>
                  ))}
              </Table>
            </Panel>

            <div className="grid gap-6 lg:grid-cols-2">
              <Panel title="Earning settings (sample values)">
                <ul className="divide-y divide-seam text-sm">
                  {[
                    ["Commission on each sale", "1.5%"],
                    ["Seller plan, standard", "₹2,500 / month"],
                    ["Featured listing", "₹1,000 / grade / week"],
                    ["Arihant delivery service", "from ₹0.40 / kg"],
                  ].map(([k, v]) => (
                    <li key={k} className="flex justify-between py-2">
                      <span>{k}</span>
                      <b>{v}</b>
                    </li>
                  ))}
                </ul>
              </Panel>
              <Panel title="Market insight: demand vs listed">
                <ul className="space-y-3 text-sm">
                  {demand.map(({ f, asks, listed }) => (
                    <li key={f.id}>
                      <div className="flex justify-between">
                        <b>{f.short}</b>
                        <span className="text-ink-2">
                          asked {asks} t · listed {listed} t
                        </span>
                      </div>
                      <div className="mt-1 flex h-2 gap-0.5">
                        <div className="bg-print" style={{ width: `${Math.min(100, asks)}%` }} />
                        <div className="bg-ink/40" style={{ width: `${Math.min(100, listed / 4)}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-ink-2">Red: tonnes asked in enquiries and requirements. Grey: tonnes listed (scaled). Gaps show which sellers to bring in.</p>
              </Panel>
            </div>
          </div>
        );
      }}
    </Gate>
  );
}
