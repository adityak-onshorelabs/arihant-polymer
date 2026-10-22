"use client";

import { useSyncExternalStore } from "react";

/** Demo sign-in for marketplace sellers: the signed-in seller's id, kept in this browser only. */
const KEY = "arihant-market-seller";
const listeners = new Set<() => void>();

function read(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  const onStorage = (e: StorageEvent) => e.key === KEY && fn();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", onStorage);
  };
}

export function setSellerSession(id: string | null) {
  try {
    if (id) localStorage.setItem(KEY, id);
    else localStorage.removeItem(KEY);
  } catch {}
  listeners.forEach((fn) => fn());
}

/** `undefined` while the page is still rendering on the server, then the seller id or null. */
export function useSellerSession(): string | null | undefined {
  return useSyncExternalStore(subscribe, read, () => undefined);
}

/** The code every demo sign-in accepts; shown on the login screen. */
export const DEMO_CODE = "123456";
export const COMMISSION = 0.015;
