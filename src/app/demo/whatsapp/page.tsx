"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { FileText, Send } from "lucide-react";
import { searchGrades, grades, gradeSlug } from "@/content/catalogue";
import { useDemo } from "@/lib/demo/store";
import { PageTitle } from "@/components/demo/ui";

type Msg = { from: "bot" | "me"; text: string; file?: string };
type Step = "grade" | "qty" | "city" | "name" | "done";

export default function WhatsAppDemo() {
  const { state, dispatch, free } = useDemo();
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "bot", text: "Namaste! This is Arihant Polymer, Malad West. Thanks for scanning our QR at Plastivision." },
    { from: "bot", text: "Which grade are you looking for? A grade code, producer or process is fine (e.g. MI3530, Reliance raffia)." },
  ]);
  const [step, setStep] = useState<Step>("grade");
  const [input, setInput] = useState("");
  const [lead, setLead] = useState<{ itemKey: string | null; label: string; qty: number; city: string; name: string }>({ itemKey: null, label: "", qty: 0, city: "", name: "" });
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (box.current) box.current.scrollTop = box.current.scrollHeight;
  }, [msgs]);

  const say = (m: Msg[]) => setMsgs((x) => [...x, ...m]);

  function handle(text: string) {
    const t = text.trim();
    if (!t) return;
    say([{ from: "me", text: t }]);
    setInput("");

    if (step === "grade") {
      const g = searchGrades(t, grades)[0];
      if (!g) {
        say([{ from: "bot", text: "I couldn't find that in our listed range. I'll note it and our team will check. How many tonnes do you need?" }]);
        setLead((l) => ({ ...l, itemKey: null, label: t }));
      } else {
        const key = gradeSlug(g);
        const item = state.items.find((i) => i.key === key);
        const f = item ? free(key) : 0;
        say([
          { from: "bot", text: `${g.code ?? g.listed}${g.producer ? ` (${g.producer})` : ""}: ${g.type}, ${g.process.toLowerCase()}.` },
          { from: "bot", text: f > 0 ? `Yes, we have about ${f} tonnes ready in the godown.` : "Not in the godown today, but we can arrange it from the producer." },
          { from: "bot", text: "Here is our catalogue.", file: "Arihant-Polymer-catalogue.pdf" },
          { from: "bot", text: "How many tonnes do you need?" },
        ]);
        setLead((l) => ({ ...l, itemKey: item?.key ?? null, label: g.code ?? g.listed }));
      }
      setStep("qty");
    } else if (step === "qty") {
      const n = Number(t.replace(/[^\d.]/g, "")) || 0;
      setLead((l) => ({ ...l, qty: n }));
      say([{ from: "bot", text: "Where should it be delivered? Town or industrial area." }]);
      setStep("city");
    } else if (step === "city") {
      setLead((l) => ({ ...l, city: t }));
      say([{ from: "bot", text: "Last thing: your name and company?" }]);
      setStep("name");
    } else if (step === "name") {
      const full = { ...lead, name: t };
      setLead(full);
      dispatch({
        type: "addEnquiry",
        enquiry: { source: "Plastivision QR", buyerName: t, city: full.city, itemKey: full.itemKey, text: `${full.label}, ${full.qty} t (via WhatsApp assistant)`, qty: full.qty },
      });
      say([
        { from: "bot", text: `Thank you, ${t.split(/[ ,]/)[0]}. Our team will send your rate for ${full.label}, ${full.qty} t to ${full.city}, shortly.` },
        { from: "bot", text: "If you'd like to talk to someone now, reply CALL and a salesperson will join this chat." },
      ]);
      setStep("done");
    } else {
      say([{ from: "bot", text: t.toUpperCase().includes("CALL") ? "Rohit from our sales team will join this chat in a moment." : "Noted. Our team has your request." }]);
    }
  }

  const chips = step === "grade" ? ["MI3530", "Reliance raffia", "GAIL LLDPE"] : step === "qty" ? ["5 tonnes", "10 tonnes", "20 tonnes"] : step === "city" ? ["Vapi GIDC", "Daman", "Bhiwandi"] : [];

  return (
    <div className="space-y-6">
      <PageTitle title="WhatsApp assistant" sub="Try it as a buyer who scanned Arihant's QR code at a trade show. Type in the phone on the left." />
      <div className="grid gap-8 lg:grid-cols-[22rem_1fr]">
        <div data-tour="wa-phone" className="mx-auto w-full max-w-[22rem] border-[6px] border-ink bg-[oklch(95%_0.012_150)]" style={{ borderRadius: 28 }}>
          <div className="flex items-center gap-3 bg-[oklch(42%_0.08_160)] px-4 py-3 text-sack" style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
            <span className="flex size-9 items-center justify-center bg-sack font-bold text-print" style={{ borderRadius: 999 }}>
              A
            </span>
            <div>
              <p className="font-semibold leading-tight">Arihant Polymer</p>
              <p className="text-xs opacity-80">Business account · replies instantly</p>
            </div>
          </div>
          <div ref={box} className="h-[30rem] space-y-2 overflow-y-auto p-3" aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-3 py-2 text-sm shadow-sm ${m.from === "me" ? "bg-[oklch(90%_0.06_140)]" : "bg-sack"}`} style={{ borderRadius: 10 }}>
                  {m.file ? (
                    <span className="flex items-center gap-2">
                      <FileText aria-hidden className="size-5 text-print" />
                      <span className="font-semibold">{m.file}</span>
                    </span>
                  ) : (
                    m.text
                  )}
                </div>
              </div>
            ))}
          </div>
          {chips.length > 0 && (
            <div data-tour="wa-chips" className="flex flex-wrap gap-1 px-3 pb-2">
              {chips.map((c) => (
                <button key={c} type="button" onClick={() => handle(c)} className="min-h-9 border border-[oklch(42%_0.08_160)] bg-sack px-2.5 text-xs font-semibold" style={{ borderRadius: 999 }}>
                  {c}
                </button>
              ))}
            </div>
          )}
          <form
            onSubmit={(e: FormEvent) => {
              e.preventDefault();
              handle(input);
            }}
            className="flex gap-2 p-3"
          >
            <label className="flex-1">
              <span className="sr-only">Message</span>
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message" className="h-11 w-full bg-sack px-3 text-sm outline-none" style={{ borderRadius: 999 }} />
            </label>
            <button type="submit" aria-label="Send" className="flex size-11 items-center justify-center bg-[oklch(42%_0.08_160)] text-sack" style={{ borderRadius: 999 }}>
              <Send aria-hidden className="size-4" />
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="border-2 border-ink p-5">
            <p className="text-sm font-semibold text-ink-2">What the team sees</p>
            {step === "done" ? (
              <>
                <p className="t-h3 mt-2">Lead saved to the enquiry inbox.</p>
                <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
                  <dt className="text-ink-2">Source</dt>
                  <dd className="font-semibold">Plastivision QR</dd>
                  <dt className="text-ink-2">Buyer</dt>
                  <dd className="font-semibold">{lead.name}</dd>
                  <dt className="text-ink-2">Need</dt>
                  <dd className="font-semibold">
                    {lead.label}, {lead.qty} t
                  </dd>
                  <dt className="text-ink-2">Deliver to</dt>
                  <dd className="font-semibold">{lead.city}</dd>
                  <dt className="text-ink-2">Assigned to</dt>
                  <dd className="font-semibold">Rohit (sales)</dd>
                </dl>
                <Link
                  href="/demo/office/enquiries"
                  onClick={() => dispatch({ type: "role", role: "sales" })}
                  className="mt-4 inline-flex min-h-11 items-center bg-print px-4 font-semibold text-on-print"
                >
                  Open the inbox as Sales
                </Link>
              </>
            ) : (
              <p className="mt-2 text-ink-2">As the buyer answers, the assistant fills in grade, quantity, delivery point and name. When the chat ends, the lead lands in the enquiry inbox with a follow-up date, ready for Quick Quote.</p>
            )}
          </div>
          <p className="text-sm text-ink-2">Answers about stock come from the same demo register the godown sees ({state.items.length} grades).</p>
        </div>
      </div>
    </div>
  );
}
