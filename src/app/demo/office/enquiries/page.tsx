"use client";

import { useState } from "react";
import { fmtDate, useDemo } from "@/lib/demo/store";
import { TODAY } from "@/lib/demo/seed";
import { roleInfo } from "@/lib/demo/access";
import type { Enquiry } from "@/lib/demo/types";
import { Gate, LevelNote, PageTitle, Panel, Table, Tag } from "@/components/demo/ui";

const SOURCES: (Enquiry["source"] | "All")[] = ["All", "WhatsApp", "Website", "IndiaMART", "Call", "Plastivision QR"];
const STATUSES: Enquiry["status"][] = ["New", "Quoted", "Follow up", "Won", "Lost"];

export default function Enquiries() {
  const { state, dispatch } = useDemo();
  const [src, setSrc] = useState<(typeof SOURCES)[number]>("All");
  return (
    <Gate module="enquiries">
      {(level) => {
        const me = state.role ? roleInfo[state.role].who : "";
        const list = state.enquiries.filter((e) => (src === "All" || e.source === src) && (level !== "own" || e.owner === me));
        const dueToday = list.filter((e) => e.followUp && e.followUp <= TODAY && e.status !== "Won" && e.status !== "Lost");
        return (
          <div className="space-y-6">
            <PageTitle title="Enquiries" sub="Every enquiry in one list, whether it came on WhatsApp, the website, IndiaMART, a call or a trade show.">
              <LevelNote level={level} />
            </PageTitle>

            <div className="flex flex-wrap gap-1" role="group" aria-label="Filter by source">
              {SOURCES.map((s) => (
                <button key={s} type="button" aria-pressed={src === s} onClick={() => setSrc(s)} className={`min-h-10 border-2 border-ink px-3 text-sm font-semibold ${src === s ? "bg-ink text-sack" : "hover:bg-sack-2"}`}>
                  {s} <span className="opacity-60">{s === "All" ? state.enquiries.length : state.enquiries.filter((e) => e.source === s).length}</span>
                </button>
              ))}
            </div>

            {dueToday.length > 0 && (
              <Panel title={`Follow up today · ${dueToday.length}`}>
                <ul className="divide-y divide-seam text-sm">
                  {dueToday.map((e) => (
                    <li key={e.id} className="flex flex-wrap justify-between gap-2 py-2">
                      <span>
                        <b>{e.buyerName}</b>, {e.city}: {e.text}
                      </span>
                      <span className="text-ink-2">{e.owner}</span>
                    </li>
                  ))}
                </ul>
              </Panel>
            )}

            <Panel title="All enquiries">
              <Table head={["Buyer", "What they want", "Came in by", "Status"]}>
                {list.map((e) => {
                  const it = state.items.find((i) => i.key === e.itemKey);
                  return (
                    <tr key={e.id}>
                      <td>
                        <b>{e.buyerName}</b>
                        <div className="text-sm text-ink-2">
                          {e.city} · {fmtDate(e.date)}
                        </div>
                      </td>
                      <td>
                        {it && <b className="me-1">{it.code}</b>}
                        {e.qty} t
                        <div className="text-sm text-ink-2">{e.text}</div>
                      </td>
                      <td>
                        <Tag tone={e.source === "Plastivision QR" ? "print" : "plain"}>{e.source}</Tag>
                        <div className="mt-1 text-sm text-ink-2">{e.owner}</div>
                      </td>
                      <td>
                        {level === "view" ? (
                          <Tag>{e.status}</Tag>
                        ) : (
                          <label>
                            <span className="sr-only">Status for {e.buyerName}</span>
                            <select value={e.status} onChange={(ev) => dispatch({ type: "enquiryStatus", id: e.id, status: ev.target.value as Enquiry["status"] })} className="h-9 border border-ink bg-sack px-1 text-sm font-semibold">
                              {STATUSES.map((s) => (
                                <option key={s}>{s}</option>
                              ))}
                            </select>
                          </label>
                        )}
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
