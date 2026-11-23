"use client";

import { useEffect } from "react";

/** Ends the first-visit intro: after the loader's timeline, mark the session so client navigations don't wait for it. */
export function IntroClock() {
  useEffect(() => {
    const d = document.documentElement;
    if (d.classList.contains("intro-seen")) return;
    const t = window.setTimeout(() => d.classList.add("intro-seen"), 4500);
    return () => window.clearTimeout(t);
  }, []);
  return null;
}
