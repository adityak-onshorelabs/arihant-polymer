import { GranuleSvg, packPellets } from "./granules";

/*
 * First-visit loader: "the sample is filled".
 * A small sample pouch fills with natural granules in layers, one rubine
 * masterbatch pellet drops on top, the wordmark appears, and the pouch is lifted
 * away (the overlay clips upward) to reveal the page.
 *
 * Pure CSS, server-rendered, so it shows on the very first paint and never waits
 * for JavaScript. An inline script marks the session after the first visit
 * (`intro-seen` on <html>), so it plays once per session; `IntroClock` adds the
 * class once the timeline ends, so later client navigations aren't delayed.
 * Hidden entirely under reduced motion. Page entrances wait for it via `--intro`.
 */

const W = 160;
const H = 200;
const pellets = packPellets({ width: W, height: H, size: 9, fill: 0.72, mound: 0.1, seed: 1991 });

/** Runs before first paint: skip the loader if it already played this session. */
export const introScript = `try{var d=document.documentElement;if(sessionStorage.getItem("ap-intro")||matchMedia("(prefers-reduced-motion: reduce)").matches){d.classList.add("intro-seen")}else{sessionStorage.setItem("ap-intro","1")}}catch(e){document.documentElement.classList.add("intro-seen")}`;

export function Loader() {
  return (
    <div className="loader" aria-hidden>
      <div className="loader-inner">
        <div className="pouch loader-pouch">
          <div className="seal" />
          <div className="pouch-window relative aspect-[4/5]">
            <GranuleSvg id="loader" pellets={pellets} width={W} height={H} look="milky" pour delay={0.05} className="absolute inset-0 size-full" />
            <span className="loader-dose" />
          </div>
        </div>
        <p className="loader-mark">
          <span className="pellet" />
          <span className="font-semibold text-graphite">Arihant</span>
          <span className="text-graphite-2">Polymer</span>
        </p>
      </div>
    </div>
  );
}
