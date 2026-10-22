"use client";

import { useDemo, rs } from "@/lib/demo/store";
import { officeAccess, officeModules } from "@/lib/demo/access";
import { STAFF, SALES } from "@/lib/demo/seed";
import { Gate, PageTitle, Panel, Table, Tag } from "@/components/demo/ui";

const ROLE_LABEL = { owner: "Owner", sales: "Sales", accounts: "Accounts", godown: "Godown" } as const;

export default function Settings() {
  const { state, dispatch } = useDemo();
  return (
    <Gate module="settings">
      {() => (
        <div className="space-y-6">
          <PageTitle title="Settings" sub="Harsh sets the rules once; the software follows them for everyone." />

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title="Owner rules">
              <label className="block">
                <span className="text-sm font-semibold text-ink-2">Default margin (Rs/kg)</span>
                <input type="number" step="0.25" value={state.margins.default} onChange={(e) => dispatch({ type: "setMargin", value: Number(e.target.value) })} className="mt-1 h-12 w-40 border-2 border-ink bg-sack px-3 text-lg font-bold" />
              </label>
              <p className="mt-3 text-sm text-ink-2">Minimum margin {rs(state.margins.min)}/kg. Quotes below it go to the owner for approval. Orders that take a buyer over the credit limit also need approval.</p>
            </Panel>
            <Panel title="Team">
              <ul className="divide-y divide-seam">
                {[
                  [STAFF.owner, "owner"],
                  [SALES[0], "sales"],
                  [SALES[1], "sales"],
                  [STAFF.accounts, "accounts"],
                  [STAFF.godown, "godown"],
                ].map(([n, r]) => (
                  <li key={n} className="flex items-center justify-between py-2">
                    <span className="font-semibold">{n}</span>
                    <Tag tone="ink">{ROLE_LABEL[r as keyof typeof ROLE_LABEL]}</Tag>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          <Panel title="Who sees what">
            <Table head={["Screen", "Harsh (Owner)", "Rohit (Sales)", "Meena (Accounts)", "Santosh (Godown)"]}>
              {officeModules.map((m) => (
                <tr key={m.id}>
                  <td className="font-semibold">{m.label}</td>
                  {(["owner", "sales", "accounts", "godown"] as const).map((r) => {
                    const l = officeAccess[r][m.id];
                    return (
                      <td key={r}>
                        <Tag tone={l === "full" ? "ink" : l === "none" ? "plain" : "warn"}>{l === "none" ? "Not shown" : l === "own" ? "Own buyers" : l === "view" ? "Can look" : "Full"}</Tag>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </Table>
          </Panel>
        </div>
      )}
    </Gate>
  );
}
