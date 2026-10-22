"use client";

/*
 * Rate request form.
 * Adapted from Watermelon UI `progressive-input-stack`
 * (reference/watermelon/progressive-input-stack.tsx): kept the idea that finished
 * steps stack above the active one as compact strips; rebuilt with real labels,
 * fieldsets, inline errors (aria-describedby), focus moving to the new step
 * heading, editable summary strips, honeypot, and no autoFocus on every step.
 */

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Check, Pencil } from "lucide-react";
import { enquirySchema } from "@/lib/enquiry";
import { company } from "@/content/site";

type Values = {
  grade: string;
  quantity: string;
  unit: "tonnes" | "bags";
  deliverTo: string;
  name: string;
  company: string;
  phone: string;
  note: string;
  website: string;
};

const STEPS = [
  { title: "Grade", fields: ["grade"] },
  { title: "Quantity and delivery", fields: ["quantity", "deliverTo"] },
  { title: "Your details", fields: ["name", "phone"] },
] as const;

export function RateRequest({ initialGrade }: { initialGrade?: string }) {
  const [step, setStep] = useState(initialGrade ? 1 : 0);
  const [v, setV] = useState<Values>({ grade: initialGrade ?? "", quantity: "", unit: "tonnes", deliverTo: "", name: "", company: "", phone: "", note: "", website: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverMsg, setServerMsg] = useState("");
  const prevStep = useRef(step);
  const headRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const id = useId();

  useEffect(() => {
    if (prevStep.current !== step) headRefs.current[step]?.focus();
    prevStep.current = step;
  }, [step]);

  const set = (k: keyof Values) => (e: { target: { value: string } }) => setV((s) => ({ ...s, [k]: e.target.value }));

  function validate(fields: readonly string[]) {
    const r = enquirySchema.safeParse(v);
    const errs: Record<string, string> = {};
    if (!r.success) {
      for (const issue of r.error.issues) {
        const k = String(issue.path[0]);
        if (fields.includes(k) && !errs[k]) errs[k] = issue.message;
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function next(e: FormEvent) {
    e.preventDefault();
    if (!validate(STEPS[step].fields)) return;
    if (step < STEPS.length - 1) setStep(step + 1);
    else submit();
  }

  async function submit() {
    setState("sending");
    try {
      const res = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(v) });
      const data = await res.json();
      if (data.ok) {
        // Demo bridge: show this request in the platform demo's enquiry inbox (same browser only).
        try {
          const k = "arihant-demo-site-leads";
          const list = JSON.parse(localStorage.getItem(k) ?? "[]");
          list.push({ grade: v.grade, quantity: v.quantity, unit: v.unit, deliverTo: v.deliverTo, name: v.name, company: v.company });
          localStorage.setItem(k, JSON.stringify(list));
        } catch {}
        setState("sent");
      }
      else {
        setState("error");
        setServerMsg(data.error ?? "Something went wrong.");
      }
    } catch {
      setState("error");
      setServerMsg("Could not send. Please call us.");
    }
  }

  if (state === "sent") {
    return (
      <div className="border-2 border-ink p-6 md:p-8" role="status">
        <p className="t-label text-print">Sent</p>
        <p className="t-h2 mt-2">Rate request for {v.grade} received.</p>
        <p className="mt-4 max-w-lg text-lg">
          {company.contactPerson} or the Arihant team will come back to you on {v.phone}. For anything urgent call {company.phone.display}.
        </p>
      </div>
    );
  }

  const summary = [v.grade, v.quantity ? `${v.quantity} ${v.unit} to ${v.deliverTo}` : "", v.name ? `${v.name}, ${v.phone}` : ""];

  const field = (k: keyof Values, label: string, props: Record<string, unknown> = {}) => (
    <div>
      <label htmlFor={`${id}-${k}`} className="t-label text-ink-2">
        {label}
      </label>
      <input
        id={`${id}-${k}`}
        value={v[k]}
        onChange={set(k)}
        aria-invalid={Boolean(errors[k])}
        aria-describedby={errors[k] ? `${id}-${k}-err` : undefined}
        className="mt-1 h-13 w-full border-2 border-ink bg-sack px-3 text-lg outline-none focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-print aria-invalid:border-print"
        {...props}
      />
      {errors[k] && (
        <p id={`${id}-${k}-err`} className="mt-1 text-sm font-semibold text-print">
          {errors[k]}
        </p>
      )}
    </div>
  );

  return (
    <form onSubmit={next} noValidate className="border-2 border-ink">
      {STEPS.map((s, i) => {
        if (i < step) {
          return (
            <div key={s.title} className="flex items-center gap-3 border-b-2 border-ink bg-sack-2 px-4 py-3 md:px-6">
              <Check aria-hidden className="size-5 text-ok" />
              <span className="t-label hidden w-40 shrink-0 text-ink-2 sm:block">{s.title}</span>
              <span className="min-w-0 flex-1 truncate font-semibold">{summary[i]}</span>
              <button type="button" onClick={() => setStep(i)} className="flex min-h-11 items-center gap-1 px-2 text-sm font-semibold underline underline-offset-4">
                <Pencil aria-hidden className="size-3.5" />
                Edit<span className="sr-only"> {s.title}</span>
              </button>
            </div>
          );
        }
        if (i > step) {
          return (
            <div key={s.title} className="flex items-center gap-3 border-b border-seam px-4 py-3 text-ink-2 last:border-b-0 md:px-6">
              <span className="t-code text-xl">{i + 1}</span>
              <span className="t-label">{s.title}</span>
            </div>
          );
        }
        return (
          <fieldset key={s.title} className="min-w-0 border-b-2 border-ink px-4 py-6 last:border-b-0 md:px-6">
            <legend className="sr-only">{s.title}</legend>
            <h2
              ref={(el) => {
                headRefs.current[i] = el;
              }}
              tabIndex={-1}
              className="t-h3 flex items-center gap-3 outline-none"
            >
              <span className="t-code text-3xl text-print">{i + 1}</span>
              {s.title}
            </h2>
            <div className="mt-5 grid gap-4">
              {i === 0 && field("grade", "Grade code, producer or product", { placeholder: "e.g. MI3530 Reliance PPCP", autoComplete: "off" })}
              {i === 1 && (
                <>
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
                    {field("quantity", "Quantity", { inputMode: "decimal", placeholder: "e.g. 10" })}
                    <div role="radiogroup" aria-label="Unit" className="flex h-13 border-2 border-ink">
                      {(["tonnes", "bags"] as const).map((u) => (
                        <button
                          key={u}
                          type="button"
                          role="radio"
                          aria-checked={v.unit === u}
                          onClick={() => setV((s) => ({ ...s, unit: u }))}
                          className={`px-4 font-semibold ${v.unit === u ? "bg-ink text-sack" : ""}`}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>
                  {field("deliverTo", "Deliver to (town or industrial area)", { placeholder: "e.g. Vapi GIDC", autoComplete: "address-level2" })}
                </>
              )}
              {i === 2 && (
                <>
                  {field("name", "Your name", { autoComplete: "name" })}
                  {field("company", "Company (optional)", { autoComplete: "organization" })}
                  {field("phone", "Phone or WhatsApp", { type: "tel", autoComplete: "tel", inputMode: "tel" })}
                  <div>
                    <label htmlFor={`${id}-note`} className="t-label text-ink-2">
                      Anything else (optional)
                    </label>
                    <textarea id={`${id}-note`} value={v.note} onChange={set("note")} rows={3} className="mt-1 w-full border-2 border-ink bg-sack p-3 outline-none focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-print" />
                  </div>
                  <div aria-hidden className="absolute -start-[9999px]">
                    <label>
                      Website
                      <input tabIndex={-1} autoComplete="off" value={v.website} onChange={set("website")} />
                    </label>
                  </div>
                </>
              )}
            </div>
            {state === "error" && i === 2 && (
              <p className="mt-4 font-semibold text-print" role="alert">
                {serverMsg}
              </p>
            )}
            <button type="submit" disabled={state === "sending"} className="mt-6 inline-flex min-h-13 items-center bg-print px-6 font-semibold text-on-print hover:bg-print-deep disabled:opacity-60">
              {i < STEPS.length - 1 ? "Next" : state === "sending" ? "Sending" : "Send rate request"}
            </button>
          </fieldset>
        );
      })}
    </form>
  );
}
