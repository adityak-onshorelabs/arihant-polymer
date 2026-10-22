"use client";

/*
 * Guided tours with driver.js. Nothing starts on its own: the "Take the tour"
 * button offers a walk through the whole demo (it moves between screens) or a
 * guide to the screen that is open. Steps point at `data-tour` hooks in the
 * shell and pages; a hook that is hidden (desktop sidebar on a phone) is skipped.
 */

import "driver.js/dist/driver.css";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Compass, Map as MapIcon, ScanSearch } from "lucide-react";
import type { DriveStep } from "driver.js";
import { useDemo } from "@/lib/demo/store";
import { roleInfo } from "@/lib/demo/access";

type Step = { on?: string; route?: string; title: string; text: string; side?: "top" | "right" | "bottom" | "left" };

/** First visible element for a hook, so hidden copies (closed menu, desktop-only sidebar) are passed over. */
function hook(name: string) {
  return () => [...document.querySelectorAll(`[data-tour="${name}"]`)].find((el) => el.getClientRects().length > 0) as Element;
}

function walkthrough(wide: boolean): Step[] {
  return [
    {
      route: "/demo/office",
      title: "Welcome to Arihant's software",
      text: "This is a working demo of what we will build for Arihant. Every name and number here is a made-up sample, so click anything freely. The tour takes about two minutes and shows Harsh's screen.",
    },
    { on: "roles", title: "Whose screen you are seeing", text: "Each person in the team sees only their own part. Click Rohit, Meena or Santosh any time to see exactly what they would see.", side: "bottom" },
    ...(wide
      ? ([
          { on: "nav-office", title: "The office system", text: "What the team uses every day: today's summary, rates and quotes, enquiries, orders, stock, payments and buyers.", side: "right" },
          { on: "nav-online", title: "Online", text: "Your website (already built, so it says Ready), the marketplace and the WhatsApp assistant.", side: "right" },
        ] satisfies Step[])
      : ([
          { on: "menu-btn", title: "All the screens", text: "Open this menu to move around. Office has what the team uses every day. Online has your website, the marketplace and the WhatsApp assistant.", side: "bottom" },
        ] satisfies Step[])),
    { on: "stats", route: "/demo/office", title: "Today, at a glance", text: "The first screen every morning: orders booked today, what is waiting to go out, new enquiries and money overdue.", side: "bottom" },
    { on: "try", route: "/demo/office", title: "Try one order yourself", text: "After the tour, these three steps take you through one order: give a rate, book it, send it out.", side: "top" },
    { on: "quote-build", route: "/demo/office/quote", title: "Give a rate in seconds", text: "Pick the grade, the buyer and the quantity.", side: "right" },
    { on: "quote-price", route: "/demo/office/quote", title: "The rate is worked out for you", text: "From the last purchase price, freight and your margin. If a salesperson goes below your minimum margin, it comes to Harsh for approval first. Then one click sends it on WhatsApp.", side: "left" },
    { on: "order-filter", route: "/demo/office/orders", title: "Every order, start to finish", text: "From booking to payment. Click a stage to see only those orders.", side: "bottom" },
    { on: "order-card", route: "/demo/office/orders", title: "Move an order along", text: "One button moves it to the next stage, and the buyer gets a WhatsApp message each time.", side: "top" },
    { on: "site-banner", route: "/demo/website", title: "Your website is already built", text: "This is the real website with all 236 grades and Arihant's own photos, not a picture of one. Rate requests from it land in Enquiries.", side: "bottom" },
    { on: "market-open", route: "/demo/market", title: "The marketplace", text: "It lives on the website, under the Marketplace button: buyers compare every seller's price there, and sellers sign in there to manage their products. This screen is Arihant's side: who may sell, and every sale.", side: "bottom" },
    { on: "wa-phone", route: "/demo/whatsapp", title: "The WhatsApp assistant", text: "Type here as if you were a buyer. At any hour it asks for the grade, quantity and delivery city, checks stock, and hands the rate request to the team.", side: "right" },
    { on: "tour-btn", title: "Any time you need help", text: "Click here again for this tour, or for a guide to the screen you are on. Start over puts all the sample data back.", side: "bottom" },
  ];
}

/** Guides for single screens. Screens not listed get one step on their title. */
const SCREENS: Record<string, Step[]> = {
  "/demo/office": [
    { on: "stats", title: "Today, at a glance", text: "Orders booked today, orders waiting to go out, new enquiries and money overdue by more than 30 days.", side: "bottom" },
    { on: "try", title: "Try one order", text: "Three steps that take you through one order from rate to dispatch.", side: "top" },
    { on: "attention", title: "Needs your attention", text: "Quotes waiting for your OK, buyers over their credit limit, grades running low, and buyers who usually order about now. Click a line to go straight to it.", side: "top" },
  ],
  "/demo/office/quote": [
    { on: "quote-build", title: "Build a quote", text: "Pick the grade, the buyer and the quantity. The margin is set for you and can be changed.", side: "right" },
    { on: "quote-price", title: "Your price", text: "Worked out from the last purchase price, freight and margin, split into what is in stock and what has to be bought. Send it on WhatsApp in one click.", side: "left" },
    { on: "quote-list", title: "Quotes", text: "Every quote given, who gave it, and whether it was won or lost.", side: "top" },
  ],
  "/demo/office/orders": [
    { on: "order-tabs", title: "Three ways to see orders", text: "The list, the godown's board for the day, and a form to book a new order.", side: "bottom" },
    { on: "order-filter", title: "Filter by stage", text: "See only the orders at one stage, or everything not yet paid.", side: "bottom" },
    { on: "order-card", title: "One order", text: "The buyer, grade, quantity and stage. The button moves it to the next stage and messages the buyer on WhatsApp.", side: "top" },
  ],
  "/demo/website": [
    { on: "site-banner", title: "Built and working", text: "This is the real website with Arihant's catalogue and photos. Open it in a new tab with the button on the right.", side: "bottom" },
    { on: "site-tabs", title: "Two views", text: "What a customer sees, and what Arihant sees: rate requests and which grades people look at.", side: "bottom" },
    { on: "site-preview", title: "Click around the site", text: "The website runs right here. Use the buttons above it to jump to a page.", side: "top" },
    { on: "site-built", title: "What is built", text: "Everything on the website that already works.", side: "left" },
  ],
  "/demo/market": [
    { on: "market-open", title: "The marketplace is on the website", text: "Open it to see what buyers see, or open the seller login to sign in as a sample seller and manage products.", side: "bottom" },
    { on: "market-sellers", title: "Who may sell", text: "Every seller who applied. Arihant checks their GST, then approves, pauses or resumes them.", side: "top" },
    { on: "market-orders", title: "Every sale", text: "All orders placed on the marketplace and what Arihant earns on each. Orders for Arihant's own stock also go to Enquiries.", side: "top" },
  ],
  "/demo/whatsapp": [
    { on: "wa-phone", title: "Try it as a buyer", text: "Type the grade you need, as a buyer would. It asks for the quantity and city, then passes the request to the team.", side: "right" },
    { on: "wa-chips", title: "Quick replies", text: "Or tap one of these to see a typical conversation.", side: "top" },
  ],
};

const SCREEN_NOTES: Record<string, string> = {
  "/demo/office/enquiries": "Every enquiry in one list, wherever it came from: WhatsApp, the website, IndiaMART, a call or a trade show.",
  "/demo/office/dispatch": "The godown's day on one board. Moving a card sends the buyer a WhatsApp message.",
  "/demo/office/new-order": "Write down a phone or WhatsApp order in under a minute. The material is kept aside as soon as it is booked.",
  "/demo/office/stock": "What is in both godowns, and how much is free to sell after what is kept for orders.",
  "/demo/office/billing": "Who owes what and since when. Send a polite WhatsApp reminder in one click.",
  "/demo/office/buyers": "Each buyer's orders, quotes, money owed and when they usually order again.",
  "/demo/office/settings": "Harsh sets the rules once (minimum margin, the team, who sees what) and the software follows them for everyone.",
};

function toDrive(steps: Step[], wait: boolean): DriveStep[] {
  return steps.map((s) => ({
    element: s.on ? hook(s.on) : undefined,
    waitForElement: wait && s.on ? 5000 : 0,
    data: { route: s.route },
    popover: { title: s.title, description: s.text, side: s.side, align: "start" },
  }));
}

export function TourButton() {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const path = usePathname();
  const { state, dispatch } = useDemo();

  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  async function run(steps: DriveStep[], crossScreens: boolean) {
    setOpen(false);
    const { driver } = await import("driver.js");
    // Before moving to a step on another screen, open that screen; the step waits for its element.
    const go = (target: DriveStep | undefined) => {
      const route = target?.data?.route as string | undefined;
      if (crossScreens && route && route !== window.location.pathname) router.push(route);
    };
    const d = driver({
      steps,
      showProgress: steps.length > 1,
      progressText: "{{current}} of {{total}}",
      nextBtnText: "Next",
      prevBtnText: "Back",
      doneBtnText: "Done",
      closeBtnLabel: "Close the tour",
      overlayColor: "oklch(22% 0.02 40)",
      overlayOpacity: 0.72,
      stagePadding: 6,
      stageRadius: 0,
      popoverOffset: 12,
      smoothScroll: true,
      skipMissingElement: true,
      disableActiveInteraction: crossScreens,
      popoverClass: "arihant-tour",
      onNextClick: (_el, _step, { driver: dr }) => {
        go(steps[(dr.getActiveIndex() ?? 0) + 1]);
        dr.moveNext();
      },
      onPrevClick: (_el, _step, { driver: dr }) => {
        go(steps[(dr.getActiveIndex() ?? 0) - 1]);
        dr.movePrevious();
      },
    });
    d.drive();
  }

  function walk() {
    if (state.role !== "owner") dispatch({ type: "role", role: "owner" });
    if (path !== "/demo/office") router.push("/demo/office");
    run(toDrive(walkthrough(window.matchMedia("(min-width: 1024px)").matches), true), true);
  }

  function explain() {
    const listed = SCREENS[path]?.filter((s) => s.on && hook(s.on)());
    const title = document.querySelector("[data-tour=page] h1")?.textContent ?? "This screen";
    const fallback: Step = SCREEN_NOTES[path]
      ? { on: "page", title, text: SCREEN_NOTES[path], side: "bottom" }
      : { title, text: `This screen is not on ${roleInfo[state.role ?? "owner"].short}'s screen. Switch to Harsh at the top to see it.` };
    run(toDrive(listed?.length ? listed : [fallback], false), false);
  }

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        data-tour="tour-btn"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex min-h-10 items-center gap-1.5 border-2 border-ink px-3 text-sm font-semibold hover:bg-ink hover:text-sack"
      >
        <Compass aria-hidden className="size-4" />
        Take the tour
        <ChevronDown aria-hidden className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div role="menu" className="absolute end-0 top-full z-40 mt-1 w-72 max-w-[calc(100vw-2rem)] border-2 border-ink bg-sack shadow-[4px_4px_0_var(--ink)]">
          <button type="button" role="menuitem" onClick={walk} className="flex w-full gap-3 p-3 text-start hover:bg-sack-2">
            <MapIcon aria-hidden className="mt-0.5 size-5 shrink-0 text-print" />
            <span>
              <span className="block font-semibold">Walk me through the demo</span>
              <span className="block text-sm text-ink-2">About two minutes, screen by screen</span>
            </span>
          </button>
          <button type="button" role="menuitem" onClick={explain} className="flex w-full gap-3 border-t border-seam p-3 text-start hover:bg-sack-2">
            <ScanSearch aria-hidden className="mt-0.5 size-5 shrink-0 text-print" />
            <span>
              <span className="block font-semibold">Explain this screen</span>
              <span className="block text-sm text-ink-2">What each part of this page does</span>
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
