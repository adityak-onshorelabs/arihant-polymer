"use client";

/*
 * Demo app shell, kept plain for a non-technical owner: a short sidebar in
 * everyday words with icons, a "whose screen" switch with four team members,
 * and the website called out as built.
 */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  Calculator,
  ExternalLink,
  Globe,
  House,
  Inbox,
  IndianRupee,
  Lock,
  Menu,
  MessageCircle,
  Package,
  RotateCcw,
  Settings,
  Store,
  Users,
  Warehouse,
  X,
  type LucideIcon,
} from "lucide-react";
import { useDemo } from "@/lib/demo/store";
import { levelFor, modules, roleInfo, TEAM, type ModuleId } from "@/lib/demo/access";
import { TourButton } from "./tour";

const ICONS: Record<ModuleId, LucideIcon> = {
  dashboard: House,
  quote: Calculator,
  enquiries: Inbox,
  orders: Package,
  stock: Warehouse,
  billing: IndianRupee,
  buyers: Users,
  website: Globe,
  search: Store,
  whatsapp: MessageCircle,
  settings: Settings,
};

function NavList({ group, onNavigate }: { group: "team" | "online" | "bottom"; onNavigate?: () => void }) {
  const { state } = useDemo();
  const path = usePathname();
  const role = state.role ?? "owner";
  return (
    <ul className="space-y-1">
      {modules
        .filter((m) => m.group === group)
        .map((m) => {
          const Icon = ICONS[m.id];
          const level = levelFor(role, m.id);
          const on = (m.match as readonly string[]).includes(path);
          const isSite = m.id === "website";
          if (level === "none")
            return (
              <li key={m.id}>
                <span className="flex min-h-12 items-center gap-3 px-3 text-[0.95rem] text-sack/35" title={`Not on ${roleInfo[role].short}'s screen`}>
                  <Icon aria-hidden className="size-5" />
                  <span className="flex-1">{m.label}</span>
                  <Lock aria-label="Not on this person's screen" className="size-3.5" />
                </span>
              </li>
            );
          return (
            <li key={m.id}>
              <Link
                href={m.href}
                onClick={onNavigate}
                aria-current={on ? "page" : undefined}
                className={`flex min-h-12 items-center gap-3 px-3 text-[0.95rem] font-semibold ${on ? "bg-print text-on-print" : "text-sack/90 hover:bg-sack/10 hover:text-sack"}`}
              >
                <Icon aria-hidden className="size-5" />
                <span className="flex-1">{m.label}</span>
                {isSite && <span className={`px-1.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider ${on ? "bg-on-print text-print" : "bg-print text-on-print"}`}>Ready</span>}
              </Link>
            </li>
          );
        })}
    </ul>
  );
}

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Screens" className="flex h-full flex-col">
      <Link href="/demo/office" onClick={onNavigate} className="block px-5 pb-6 pt-6">
        <span className="t-code block text-3xl text-on-print">Arihant</span>
        <span className="mt-1 block text-xs font-semibold text-sack/60">Polymer · software demo</span>
      </Link>
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <div data-tour="nav-office">
          <p className="px-3 pb-2 text-xs font-semibold text-sack/50">Office</p>
          <NavList group="team" onNavigate={onNavigate} />
        </div>
        <div data-tour="nav-online" className="mt-6">
          <p className="px-3 pb-2 text-xs font-semibold text-sack/50">Online</p>
          <NavList group="online" onNavigate={onNavigate} />
        </div>
      </div>
      <div className="border-t border-sack/15 px-3 py-3">
        <NavList group="bottom" onNavigate={onNavigate} />
      </div>
    </nav>
  );
}

export function DemoShell({ children }: { children: ReactNode }) {
  const { state, dispatch, ready } = useDemo();
  const [armed, setArmed] = useState(false);
  const [menu, setMenu] = useState(false);
  const router = useRouter();
  const role = state.role ?? "owner";

  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip bg-sack">
      <div className="bg-ink px-4 py-1.5 text-center text-xs text-sack">Demo with made-up sample data. Built by Onshore Labs for Arihant Polymer.</div>
      <div className="flex flex-1">
        <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 bg-ink lg:block">
          <Sidebar />
        </aside>

        {menu && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="flex w-72 flex-col bg-ink">
              <div className="flex justify-end p-2">
                <button type="button" onClick={() => setMenu(false)} className="flex size-11 items-center justify-center text-sack" aria-label="Close menu">
                  <X aria-hidden className="size-5" />
                </button>
              </div>
              <div className="min-h-0 flex-1">
                <Sidebar onNavigate={() => setMenu(false)} />
              </div>
            </div>
            <button type="button" aria-label="Close menu" className="flex-1 bg-ink/50" onClick={() => setMenu(false)} />
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="z-30 border-b border-seam bg-sack lg:sticky lg:top-0">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 md:px-8">
              <button type="button" data-tour="menu-btn" onClick={() => setMenu(true)} className="flex size-11 items-center justify-center border-2 border-ink lg:hidden" aria-label="Open menu">
                <Menu aria-hidden className="size-5" />
              </button>
              <div data-tour="roles" className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-ink-2">Showing the screen of</span>
                <div role="radiogroup" aria-label="Whose screen" className="flex flex-wrap gap-1">
                  {TEAM.map((r) => {
                    const on = role === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => {
                          dispatch({ type: "role", role: r });
                          router.push(roleInfo[r].home);
                        }}
                        className={`min-h-10 px-3 text-sm ${on ? "bg-ink font-semibold text-sack" : "border border-seam bg-sack hover:border-ink"}`}
                      >
                        {roleInfo[r].short} <span className={on ? "text-sack/70" : "text-ink-2"}>· {roleInfo[r].label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="ms-auto flex flex-wrap items-center gap-2">
                {ready && <TourButton />}
                <Link href="/" target="_blank" className="inline-flex min-h-10 items-center gap-1.5 bg-print px-3 text-sm font-semibold text-on-print hover:bg-print-deep">
                  <Globe aria-hidden className="size-4" />
                  Open the website
                  <ExternalLink aria-hidden className="size-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    if (armed) {
                      dispatch({ type: "reset" });
                      setArmed(false);
                    } else setArmed(true);
                  }}
                  onBlur={() => setArmed(false)}
                  className={`inline-flex min-h-10 items-center gap-1.5 px-3 text-sm ${armed ? "bg-print font-semibold text-on-print" : "text-ink-2 hover:text-ink"}`}
                >
                  <RotateCcw aria-hidden className="size-3.5" />
                  {armed ? "Click again to start over" : "Start over"}
                </button>
              </div>
            </div>
          </header>
          <main id="main" className="mx-auto w-full min-w-0 max-w-[80rem] flex-1 p-4 md:px-8 md:py-8">
            {ready ? children : <p className="py-10 text-ink-2">Loading…</p>}
          </main>
        </div>
      </div>
    </div>
  );
}
