# Design System: Arihant Polymer

## 1. Visual Theme & Atmosphere

"The printed 25 kg polymer bag." Every grade Arihant sells leaves the godown in a woven sack with the grade code stencilled large, the producer, the process and the weight printed in one or two inks. The site reads like that bag face and like the stock register behind it: warm woven-white surfaces, bag-print vermilion committed across the hero, footer and every grade code, stitched seams (dashed rules) between sections, stencilled codes, and ledger rows for the catalogue. Imagery is stacked sacks and loaded trucks.

Scene: a purchase manager at a moulding unit in Vapi or Bhiwandi checks a grade on a phone between machine checks, in a bright factory office at midday. Light theme only.

## 2. Color Palette & Roles

Strategy: **Committed.** Vermilion carries the hero slab, the footer, grade codes and primary actions (about 30 percent of the home page). OKLCH is the source of truth (`src/app/globals.css`).

| Token | OKLCH | Role |
|---|---|---|
| `--print` | `oklch(52% 0.19 29)` | Bag-print vermilion. Hero slab, footer, grade codes, primary buttons. |
| `--print-deep` | `oklch(41% 0.15 29)` | Pressed/hover, headings on tint. |
| `--print-tint` | `oklch(94% 0.03 40)` | Selected rows, tags. |
| `--sack` | `oklch(97.6% 0.008 85)` | Page background, woven white tinted warm. |
| `--sack-2` | `oklch(94.2% 0.013 85)` | Alternate bands, inputs, wells. |
| `--seam` | `oklch(82% 0.025 60)` | Rules, stitched seams, borders. |
| `--ink` | `oklch(24% 0.02 35)` | Body text. |
| `--ink-2` | `oklch(44% 0.02 35)` | Secondary text. |
| `--on-print` | `oklch(97.6% 0.01 60)` | Text on vermilion. |

Family bands (data colour, used only as small swatches on bag faces and register rows): PP vermilion, HDPE blue `oklch(48% 0.12 255)`, LLDPE green `oklch(50% 0.11 150)`, LDPE ochre `oklch(58% 0.12 75)`, styrenics plum `oklch(45% 0.1 330)`, PVC slate, PET teal, engineering brown, additives grey.

Rules: no pure black or white. No gradients except photo scrims. Contrast checked with `scripts/contrast.py`.

## 3. Typography

**Big Shoulders** (opsz, wght) for headings, **Big Shoulders Stencil** for grade codes and the wordmark, **Hanken Grotesk** for body and tables. Big Shoulders is a condensed industrial grotesque that matches the stencilled print on polymer sacks; the stencil cut is used only where a bag would carry a stencil. Rejected reflexes: Inter, Plus Jakarta Sans (ui-ux-pro-max's suggestion), Space Grotesk, IBM Plex.

| Role | Setting |
|---|---|
| Display | Big Shoulders 800, opsz 72, uppercase, clamp(3rem, 8vw, 7.5rem), line-height 0.88 |
| Code | Big Shoulders Stencil 800, uppercase, tabular |
| H2 | Big Shoulders 800, uppercase, clamp(2.2rem, 4.5vw, 3.75rem) |
| H3 | Big Shoulders 700, uppercase, 1.6rem |
| Body | Hanken Grotesk 400, 1.0625rem, line-height 1.6, max 68ch |
| Label | Hanken Grotesk 600, 0.78rem, letter-spacing 0.08em, uppercase |

## 4. Components

- **Bag face**: a grade rendered as the print on a sack: family band, stencilled code, producer, process, MFI when stated, standard pack note, stitched top and bottom seams. Used for the lookup result and the grade page. Never nested.
- **Seam**: dashed rule (`.seam`) between sections, like bag stitching.
- **Stock register**: ledger rows grouped by category with a family swatch, code, producer, process. Not tiles.
- **Manifest line**: company facts as a ruled line of label/value pairs, not stat cards.
- **Buttons**: square corners (2px radius), 52px tall, vermilion fill or ink outline.
- **Grade lookup** (signature): adapted from Watermelon `command-search`. Combobox with listbox, arrow keys, Enter selects, result prints the bag face and hands the grade to the rate request.
- **Family bar**: adapted from Watermelon `morphing-discovery-bar` as an ARIA tablist of polymer families plus search.
- **Rate request**: adapted from Watermelon `progressive-input-stack`, three steps with finished steps as editable strips.
- Radii 2px. Shadows none; depth from seams, bands and colour.

## 5. Layout

- 12-column grid, max width 1280px, gutters 16px mobile, 32px desktop.
- Asymmetric, left-aligned compositions. Big code typography breaks the column.
- Section spacing clamp(4rem, 9vw, 8rem); inner groups tight.
- Mobile first; no horizontal page scroll.

## 6. Motion

Barely: a bag face "prints" in (clip reveal), rows rise 12px on enter. motion/react only, ease-out expo, no smooth scroll, all static under reduced motion.

## 7. Demo (product register)

Same tokens, Restrained strategy: sack neutrals, vermilion only for primary actions and selection, dense tables, Hanken Grotesk throughout with Big Shoulders only for page titles.
