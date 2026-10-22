"use client";

/*
 * Seller login for the marketplace. Sign-in is by mobile number and a one-time
 * code, the way most traders already log in to apps. In this demo no code is
 * sent: the screen shows the code, and the listed sample sellers can be picked.
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { useDemo } from "@/lib/demo/store";
import { COMMISSION, DEMO_CODE, setSellerSession, useSellerSession } from "@/lib/demo/seller-session";

const field = "mt-1 h-12 w-full min-w-0 border-2 border-ink bg-sack px-3 text-lg font-semibold";
const GST = /^\d{2}[A-Z]{5}\d{4}[A-Z][A-Z\d]Z[A-Z\d]$/;

const digits = (v: string) => v.replace(/\D/g, "").slice(-10);
const pretty = (p: string) => `+91 ${p.slice(0, 5)} ${p.slice(5)}`;

export function SellerLogin() {
  const { state, ready } = useDemo();
  const session = useSellerSession();
  const [tab, setTab] = useState<"in" | "apply">("in");
  const signedIn = session ? state.sellers.find((s) => s.id === session) : undefined;

  return (
    <div className="frame grid gap-12 py-12 md:py-16 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <p className="t-label text-print">Arihant Marketplace · Sellers</p>
        <h1 className="t-display mt-3 text-[clamp(2.4rem,5.5vw,4.25rem)]">Sell your stock to buyers across India.</h1>
        <ul className="mt-8 border-t-2 border-ink">
          {[
            "List each grade with your own price and stock",
            "Buyers compare and order online; you confirm",
            "Payment is held by the platform and paid to you after delivery",
            `Commission of ${(COMMISSION * 100).toFixed(1)}% on each sale (sample rate)`,
            "Arihant checks every seller's GST before they go live",
          ].map((t) => (
            <li key={t} className="flex items-start gap-3 border-b border-seam py-3 text-lg">
              <Check aria-hidden className="mt-1 size-5 shrink-0 text-print" />
              {t}
            </li>
          ))}
        </ul>
        <Link href="/marketplace" className="mt-6 inline-flex min-h-11 items-center font-semibold underline underline-offset-4">
          See the marketplace as a buyer
        </Link>
      </div>

      <div className="lg:col-span-6 lg:col-start-7">
        <div className="border-2 border-ink bg-[oklch(98.8%_0.004_85)] shadow-[6px_6px_0_var(--ink)]">
          <div role="tablist" aria-label="Seller account" className="grid grid-cols-2 border-b-2 border-ink">
            {(
              [
                ["in", "Sign in"],
                ["apply", "Apply to sell"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                role="tab"
                type="button"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={`min-h-14 font-semibold ${tab === id ? "bg-ink text-sack" : "hover:bg-sack-2"}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="p-5 md:p-8">
            {!ready || session === undefined ? (
              <p className="text-ink-2">Loading…</p>
            ) : signedIn ? (
              <div>
                <p className="text-lg">
                  Signed in as <b>{signedIn.name}</b>.
                </p>
                <Link href="/marketplace/sell/dashboard" className="mt-4 inline-flex min-h-12 items-center gap-3 bg-print px-5 font-semibold text-on-print hover:bg-print-deep">
                  Go to your dashboard
                  <ArrowRight aria-hidden className="size-5 rtl:-scale-x-100" />
                </Link>
                <button type="button" onClick={() => setSellerSession(null)} className="ms-4 min-h-12 font-semibold underline underline-offset-4">
                  Sign out
                </button>
              </div>
            ) : tab === "in" ? (
              <SignIn />
            ) : (
              <Apply onDone={() => setTab("in")} />
            )}
          </div>
        </div>
        <p className="mt-4 text-sm text-ink-2">Demo sign-in: there are no real accounts or passwords, and no code is sent.</p>
      </div>
    </div>
  );
}

function SignIn() {
  const { state } = useDemo();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [code, setCode] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const seller = state.sellers.find((s) => s.phone && s.phone === digits(phone));
  const samples = state.sellers.filter((s) => s.phone && s.id !== "arihant");

  function sendCode(e: FormEvent) {
    e.preventDefault();
    if (digits(phone).length !== 10) return setErr("Enter your 10-digit mobile number.");
    if (!seller) return setErr("No seller account uses this number. Apply to sell, or pick a sample seller below.");
    setErr(null);
    setStep("code");
  }

  function verify(e: FormEvent) {
    e.preventDefault();
    if (code.trim() !== DEMO_CODE) return setErr("That code is not right. Check the code and try again.");
    setSellerSession(seller!.id);
    router.push("/marketplace/sell/dashboard");
  }

  if (step === "code")
    return (
      <form onSubmit={verify} noValidate>
        <p>
          Code sent by SMS to <b>{pretty(digits(phone))}</b> for {seller?.name}.
        </p>
        <label className="mt-5 block">
          <span className="font-semibold">6-digit code</span>
          <input value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" autoComplete="one-time-code" maxLength={6} className={`${field} tracking-[0.4em]`} autoFocus />
        </label>
        <p className="mt-2 bg-sack-2 px-3 py-2 text-sm">
          Demo code: <b className="tracking-widest">{DEMO_CODE}</b>
        </p>
        {err && (
          <p role="alert" className="mt-3 font-semibold text-print">
            {err}
          </p>
        )}
        <button type="submit" className="mt-5 inline-flex min-h-12 w-full items-center justify-center bg-print px-5 font-semibold text-on-print hover:bg-print-deep">
          Sign in
        </button>
        <button
          type="button"
          onClick={() => {
            setStep("phone");
            setCode("");
            setErr(null);
          }}
          className="mt-3 min-h-11 font-semibold underline underline-offset-4"
        >
          Use a different number
        </button>
      </form>
    );

  return (
    <form onSubmit={sendCode} noValidate>
      <label className="block">
        <span className="font-semibold">Mobile number</span>
        <span className="mt-1 flex">
          <span className="flex h-12 items-center border-2 border-e-0 border-ink bg-sack-2 px-3 font-semibold">+91</span>
          <input
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setErr(null);
            }}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            className="h-12 w-full min-w-0 border-2 border-ink bg-sack px-3 text-lg font-semibold"
          />
        </span>
      </label>
      {err && (
        <p role="alert" className="mt-3 font-semibold text-print">
          {err}
        </p>
      )}
      <button type="submit" className="mt-5 inline-flex min-h-12 w-full items-center justify-center bg-print px-5 font-semibold text-on-print hover:bg-print-deep">
        Send code
      </button>
      <div className="mt-8 border-t border-seam pt-5">
        <p className="text-sm font-semibold text-ink-2">Sample sellers for this demo</p>
        <ul className="mt-2 space-y-1">
          {samples.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => {
                  setPhone(s.phone!);
                  setErr(null);
                }}
                className="flex min-h-11 w-full items-center justify-between gap-3 px-2 text-start hover:bg-sack-2"
              >
                <span>
                  <b>{s.name}</b> <span className="text-sm text-ink-2">{s.city}</span>
                </span>
                <span className="text-sm tabular-nums text-ink-2">
                  {pretty(s.phone!)}
                  {s.status !== "Live" && <span className="ms-2 bg-[oklch(94%_0.05_80)] px-1.5 text-xs font-semibold text-warn">{s.status === "Pending" ? "Awaiting checks" : s.status}</span>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </form>
  );
}

function Apply({ onDone }: { onDone: () => void }) {
  const { state, dispatch } = useDemo();
  const [err, setErr] = useState<string | null>(null);
  const [sent, setSent] = useState<string | null>(null);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    const city = String(f.get("city") ?? "").trim();
    const gst = String(f.get("gst") ?? "").trim().toUpperCase();
    const phone = digits(String(f.get("phone") ?? ""));
    if (!name || !city) return setErr("Fill in your firm name and city.");
    if (!GST.test(gst)) return setErr("Enter a 15-character GST number, for example 27AAAFA3846Q1Z3.");
    if (phone.length !== 10) return setErr("Enter your 10-digit mobile number.");
    if (state.sellers.some((s) => s.phone === phone)) return setErr("A seller account already uses this number. Sign in instead.");
    dispatch({ type: "addSeller", seller: { name, city, gst, phone } });
    setErr(null);
    setSent(phone);
  }

  if (sent)
    return (
      <div role="status">
        <p className="text-lg font-semibold">Application received.</p>
        <p className="mt-2 text-ink-2">
          Arihant checks your GST before your products show to buyers. You can sign in now with {pretty(sent)} and add your products.
        </p>
        <button type="button" onClick={onDone} className="mt-5 inline-flex min-h-12 items-center bg-print px-5 font-semibold text-on-print hover:bg-print-deep">
          Go to sign in
        </button>
      </div>
    );

  return (
    <form onSubmit={submit} noValidate className="grid gap-4">
      <label className="block">
        <span className="font-semibold">Firm name</span>
        <input name="name" autoComplete="organization" className={field} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="font-semibold">City</span>
          <input name="city" autoComplete="address-level2" className={field} />
        </label>
        <label className="block">
          <span className="font-semibold">Mobile number</span>
          <input name="phone" type="tel" inputMode="numeric" autoComplete="tel-national" className={field} />
        </label>
      </div>
      <label className="block">
        <span className="font-semibold">GST number</span>
        <input name="gst" autoCapitalize="characters" maxLength={15} className={`${field} uppercase`} />
      </label>
      {err && (
        <p role="alert" className="font-semibold text-print">
          {err}
        </p>
      )}
      <button type="submit" className="inline-flex min-h-12 items-center justify-center bg-print px-5 font-semibold text-on-print hover:bg-print-deep">
        Send application
      </button>
    </form>
  );
}
