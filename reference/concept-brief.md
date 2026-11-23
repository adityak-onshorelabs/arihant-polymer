# Arihant Polymer: concept brief "The sample in the light"

Approved 23 Nov 2026. Replaces the "calm premium" redesign, which had drifted into the studio's warm-cream lane: Vision Blend, CEO Rules and Star Asiya all sit there.

## Decisions
- **Concept:** a sample pouch held up to the light. Runner-up was the triplicate challan.
- **Motion:** GSAP stays for scroll-linked effects; Lenis comes out. Scrolling stays native.
- **Accent:** rubine masterbatch, `oklch(50% 0.20 3)`.

## Object
Before an order, a buyer asks for a sample: a handful of granules in a clear polythene pouch with a small printed label. They hold it to the window to check clarity, roundness and how even the pellets are.

## Derivation
| Aspect | Rule |
|---|---|
| Surface | Cool milky white, like natural PE in daylight, never cream. Panels are pouch film: a faint tint and one sheen line. No backdrop blur. |
| Frame | A heat-seal strip across the top of a pouch (a band of fine ribbed lines). This is the only frame. |
| Labels | A white sticker on each pouch, e.g. `MI3530 · Reliance · PP · Injection · MFI 30 · 25 kg bag`. Grade codes always sit on a sticker. |
| Colour | Masterbatch rule: the page is natural, and rubine is dosed at about 3% of the surface. Once per page, a fully coloured band carries the concentrated pellet. |
| Type | Geologica (variable: wght, SHRP, CRSV, slnt). Codes at SHRP 0 (soft, round like a pellet); body text crisp. |
| Numerals | Large, rounded grade codes. A quantity is shown as dots, one per 25 kg bag. |
| Voice | Label voice: grade, producer, quantity, days. No adjectives. |
| Motion | Granules settle into the pouch, the label presses on, colour spreads out from one pellet. Slow, physical, expo ease, no bounce. |

## Tokens (contrast-checked with brand-site contrast.py)
| Token | OKLCH | Role | Contrast |
|---|---|---|---|
| `--natural` | 97.4% 0.005 230 | Page | |
| `--film` | 94.6% 0.009 228 | Pouch panels | |
| `--film-2` | 91.5% 0.012 226 | Deeper wells | |
| `--seal` | 86.5% 0.012 228 | Seal ribs and hairlines (decorative only) | |
| `--graphite` | 23% 0.018 250 | Text | 15.67 on natural |
| `--graphite-2` | 47% 0.018 245 | Secondary text | 6.32 on natural, 5.30 on film-2 |
| `--dose` | 50% 0.20 3 | Rubine accent and the coloured band | 6.24 on natural |
| `--dose-deep` | 40% 0.16 3 | Pressed state, text on the tint | 8.60 on film |
| `--on-dose` | 97.5% 0.01 0 | Text on rubine | 6.23 on dose |

## Signature interaction: "Grade, then how much"
1. **Grade lookup:** the pouch fills with granules and the sticker presses on, showing producer, MFI and the listed delivery time.
2. **Quantity:** tonnes become bag dots, 40 per tonne (from the 25 kg packing). The tool checks the grade's minimum order, then offers "Send this enquiry" with the grade and quantity filled in.

## Page map
| Section | Build | Watermelon (adapted) |
|---|---|---|
| Home hero | Headline and grade search; close-up granule photo in a pouch frame; granules settle on load | `morphing-discovery-bar` |
| Signature | Lookup, then pouch, then bag dots, then enquiry | `scrub-slider` + `stepper` (not `fractional-picker`, which Star Asiya used) |
| Families | Rows, each with a strip of that family's granules; the open row splits away to show producers and top grades | `card-split-accordian` |
| Producers | One sticker line, no ticker | none |
| Proof | Godown and office photos; facts as one label line, not a stats strip | none |
| Closing | Rubine band; the colour spreads from one pellet on scroll | none |
| Products | Family tabs that morph into search; ledger rows with stickers | `morphing-discovery-bar` |
| Grade page | Pouch spec, quantity to bags, enquiry | as above |

## Remove from the current build
Lenis, `Magnetic`, `TiltCard`, `Marquee`, the CountUp stats strip, the glass hero chips, `HorizontalTrack`, and the 3 icon step cards.

## Rejected
- **ui-ux-pro-max suggestion:** navy and blue CTA with Roboto, plus "squishy, bouncy" tactile UI. This is the category default and on PRODUCT.md's anti-reference list.

## Before launch (needs Arihant)
- Vet product photos: some look taken from other websites, and one carries a faint watermark.
- Ideally shoot real sample-pouch photos of their own granules held to the light.
