# Design System: Arihant Polymer

## 1. Visual Theme & Atmosphere

**"The sample in the light."** Before a buyer orders, they hold a handful of granules up to the window in a clear polythene pouch with a small printed label, and check clarity, roundness and how even the pellets are. The site is that pouch:
- **Surface:** cool milky white like natural PE granules in daylight.
- **Containers:** pouch film with a heat-seal strip.
- **Labels:** grade codes on pressed-on stickers.
- **Accent:** one rubine "masterbatch" dose.

Granules are drawn (SVG), so they stay crisp at any size. Arihant's own photographs carry the proof.

Scene: a purchase manager at a moulding unit in Vapi or Bhiwandi checks a grade on a phone between machine checks, in a bright factory office at midday. Light theme only.

History:
- The "printed 25 kg bag" concept (vermilion slabs, stencil) was retired as too loud.
- A "calm premium" pass (warm paper, brick dot, generic GSAP effects) was retired on 23 Nov 2026 because it fell into the studio's warm-cream lane (Vision Blend, CEO Rules, Star Asiya) and had no concept.

The full brief is in `reference/concept-brief.md`.

## 2. Color Palette & Roles

Strategy: **Restrained with a literal dose.** Masterbatch colours natural granules at a let-down of a few percent, so:
- **Rubine** covers about 3% of a page: the pellet in the wordmark and eyebrows, the enquiry action, and the below-minimum warning.
- **One section per page** may be the concentrated pellet: a fully rubine band (`DoseBand`).
- **Neutrals** are cool, never cream.

OKLCH is the source of truth (`src/app/globals.css`). Tokens are scoped under `.site` so `/demo` keeps its own palette.

| Token | OKLCH | Role | Contrast |
|---|---|---|---|
| `--natural` | 97.4% 0.005 230 | Page | |
| `--film` | 94.6% 0.009 228 | Pouch body, footer, scrolled header | |
| `--film-2` | 91.5% 0.012 226 | Pouch window, wells, bar tracks | |
| `--seal` | 86.5% 0.012 228 | Seal ribs, hairlines (decorative only) | |
| `--rim` | 62% 0.016 235 | Input and pill borders | about 3:1 on natural |
| `--label` | 99.3% 0.002 230 | Sticker paper, inputs | |
| `--graphite` | 23% 0.018 250 | Text, primary pills, bag dots | 15.7 on natural |
| `--graphite-2` | 47% 0.018 245 | Secondary text | 6.3 on natural, 5.3 on film-2 |
| `--dose` | 50% 0.20 3 | Rubine: pellet, enquiry pill, band | 6.2 on natural |
| `--dose-deep` | 40% 0.16 3 | Hover, warning text | 8.6 on film |
| `--on-dose` | 97.5% 0.01 0 | Text on rubine | 6.2 on dose |

Family markers are small pellets in low-chroma data colours. Additives are masterbatch, so they carry the dose.

Rules:
- No pure black or white.
- Gradients are allowed only as light: the pouch sheen, the pellet's own shading.
- No glass or backdrop blur.

## 3. Typography

**Geologica** (variable: wght and SHRP, sharpness), one family. It's not on impeccable's reject list and no other studio site uses it.
- Grade codes and numerals are set soft (SHRP 0), like a pellet.
- Headings sit at SHRP 40.
- Sentence case. No mono, no uppercase body.

| Role | Class | Setting |
|---|---|---|
| Hero | `.d-hero` | 380, clamp(2.5rem, 5.4vw, 4.6rem), tracking -0.04em |
| Page title | `.d-h1` | 400, clamp(2.2rem, 4.4vw, 3.7rem) |
| Section title | `.d-h2` | 420, clamp(1.8rem, 3.1vw, 2.6rem) |
| Sub-head | `.d-h3` | 560, 1.15rem |
| Grade code / numerals | `.d-code` | 640, SHRP 0, tabular |
| Eyebrow | `.eyebrow` | 500, 0.85rem, rubine pellet before |
| Meta | `.meta` | 500, 0.8rem, graphite-2 |
| Lead | `.lead` | clamp(1.075rem, 1.3vw, 1.18rem), line-height 1.65 |

Voice is the label's: grade, producer, quantity, days. No adjectives doing the selling. No em dashes.

## 4. Components

- **Pouch** (`pouch.tsx`), the one container. It has three parts:
  - `.pouch`: film body, 1px seal border, radius 0.4rem at the top and 1.1rem at the bottom.
  - `.seal`: a heat-seal strip of 1px ribs every 4px, with a tear notch.
  - `.pouch-window`: holds granules or a photo, with a single sheen diagonal.

  Photos of the godown and office sit in pouches too. Never nest pouches.
- **Granules** (`granules.tsx`): seeded SVG pellets, so the server and client match.
  - Looks: milky (PP/PE), clear (PS, PET, PC), opaque, powder (PVC resin), dose (masterbatch).
  - `packPellets` builds a heap; `stripPellets` builds a row strip.
- **Grade sticker** (`GradeSticker`): label paper, 0.4rem radius, soft drop. It shows family pellet, type, code, producer, then MFI, pack and delivery in a dashed grid, and a footer line with "Arihant Polymer · Malad West".
- **Signature, "grade, then how much"** (`grade-lookup.tsx` + `quantity.tsx`):
  1. A combobox picks a grade. The pouch pours, then the sticker presses on.
  2. `QuantityToBags` turns tonnes into bag dots (one per bag, one row per tonne), checks the listed minimum order, shows the listed delivery time, and links to `/contact?grade=…&qty=…&unit=tonnes`.

  Bag weight comes from the listed packing (25 kg, or 1100 kg jumbo).
- **Family rows** (`family-rows.tsx`): disclosure rows with a granule strip and one rubine pellet. The open row becomes a sealed pouch panel and expands with `grid-template-rows`.
- **DoseBand** (`dose-band.tsx`): the single rubine band. Its colour spreads from an oval pellet as it scrolls in.
- **Buttons** (`ui.ts`): 48px pills.
  - `btnPrimary`: graphite.
  - `btnDose`: rubine, used only for the enquiry a section leads to.
  - `btnSecondary`: rim hairline.
  - `btnOnDose`: for the rubine band.
- **Stock register, "the sample shelf":** family tabs are mini pouches (`MiniPouch`) filled to the family's size, with a terms label above and ledger rows below (Enquire pill per row).
- **Uses strip** (`uses-strip.tsx`): five process photos in pouch windows, each labelled with the number of listed grades for that process; links to the filtered register.
- **Reviews:** the rating distribution as pellet strips (one pellet = 5%) and satisfaction as pouches filled to the percentage.
- **Enquiry form:** a sealed pouch. Finished steps become editable strips. It accepts `qty` and `unit` from the URL.

## 5. Layout

- Max width 80rem, gutters 1rem, 2rem and 3rem. 12-column grids always include `grid-cols-1`.
- Asymmetric and left-aligned. The hero puts the headline and search on 7 columns and the pouch on 5.
- Section spacing `.section` = clamp(4.5rem, 10vw, 8rem).
- Photos are small (500–1000px). Keep them at or below native size, inside pouch windows.
- Mobile first. No horizontal scroll, checked at 390px.

## 6. Motion

**GSAP everywhere, with Lenis smooth scroll on GSAP's ticker** (`SmoothScroll` in the site layout; the user asked for "GSAP smoothness all over the website" on 23 Nov 2026). Lenis keeps `position: sticky` working, unlike ScrollSmoother. Scrollable inner areas carry `data-lenis-prevent`. Easing is expo-out and nothing bounces. Motion follows the material:

- **Pour (pure CSS, replays on remount):** a heap falls in as up to 6 pre-drawn layers, bottom first (`.drop-layer`), then the label presses on (`.press-on`). Never animate individual pellets: that repaints the whole SVG every frame and made scrolling stutter. `PourOnView` holds the pour until the block is on screen (the about tray, the review pouches).
- **Settle:** headings and blocks drop a few pixels from above and come to rest. Hero words use `SettleWords` (CSS); sections use `Settle` (GSAP ScrollTrigger, once). Every page also settles in on client navigation (`(site)/template.tsx`, skipped on first load).
- **Drift:** photos slide slowly inside their pouch windows (`DriftImage`, scrubbed, loaded eagerly so decoding never lands mid-scroll). The process strip only settles in once; nested scrubbed transforms there read as lag.
- **Disperse:** the rubine band's clip-path grows from an oval pellet, scrubbed (`DoseBand`).
- **Small moves:**
  - Bag dots fade and scale in.
  - Register rows get a film band sliding in behind them on hover.
  - Shelf pouches lift when selected.
  - The header hides on scroll down and returns on scroll up.

Performance rules:
- CSS entrance animations use fill-mode `backwards`, never `forwards` or `both`, so finished elements drop their GPU layers.
- Lenis runs first in each GSAP tick (`gsap.ticker.add(tick, false, true)`, `lagSmoothing(0)`), so scrubbed animations read the current frame's scroll.
- The header only updates on state changes.

Everything runs inside `gsap.matchMedia("(prefers-reduced-motion: no-preference)")`. Under reduced motion, Lenis is off and keyframes end immediately.

Banned here: magnetic buttons, tilt cards, tickers, count-up stat strips, pinned sideways galleries, glass chips.

## 6a. Loader and scrollbar

- **First-visit loader** (`loader.tsx`): a small sample pouch fills with granules in layers, one rubine pellet drops on top, the wordmark settles, then the overlay clips upward (the pouch is lifted away).
  - Pure CSS and server-rendered, so it shows on first paint without waiting for JavaScript.
  - Plays once per session (`intro-seen` on `<html>`, set by an inline script and by `IntroClock`). Never shown under reduced motion.
  - Page entrances wait for it through `--intro`.
- **No browser scrollbar** on the site (`html:has(.site)`). A slim graphite pellet on the right edge (`ScrollPellet`) shows position while scrolling and fades when still.

## 6b. Imagery

- **Arihant's own photos** (`public/images/arihant`, `public/images/products`) are the proof: godown, office, entrance, product bags and granules. They are captioned as Arihant's.
- **Internet photos** (`public/images/web`, Unsplash License, sources in `reference/image-credits.md`) show only materials and processes: natural, clear and tinted pellets; injection moulding, film, raffia sacks, pipe, blow moulding. They are always captioned "Photo: Unsplash" and never presented as Arihant's premises, stock or customers.
- **Drawn granules** (SVG) fill every sample pouch, so the concept never depends on low-resolution photos.

## 7. Demo (product register)

The `/demo` platform mock still uses the original tokens (`--print`, `--sack`, `--seam`) and Big Shoulders. The website redesign deliberately leaves it unchanged.
