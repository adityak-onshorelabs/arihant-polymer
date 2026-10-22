# Arihant Polymer: website and platform demo

Two things in one Next.js app, built by Onshore Labs:

1. **The website** (`/`, `/products`, `/products/[grade]`, `/about`, `/reviews`, `/contact`): Arihant Polymer's own site, rebuilt from the content of its IndiaMART-hosted listing (arihantpolymer.in). 236 real grades crawled from every category page (spec tables, descriptions, minimum order, packing, delivery) with Arihant's own photos, searchable, with a rate request on every grade.
2. **The platform demo** (`/demo`): a clickable, front-end-only demo of the three systems in the proposal, with role-based access and **invented sample data**:
   - System 1, Website and Marketplace: Visitor, Buyer, Seller, Arihant admin.
   - System 2, Arihant Business System: Owner, Sales, Accounts, Godown (Quick Quote, enquiries, orders and dispatch, stock and purchases, billing and credit, owner's dashboard, settings).
   - System 3, WhatsApp AI assistant (scripted chat that saves a lead into the enquiry inbox).

Demo changes are kept in the browser (localStorage) until **Reset demo** is clicked.

## Run

```bash
npm install
npm run dev            # http://localhost:3000
# or a production build
npm run build && npm start
```

Copy `.env.example` to `.env.local`. Locally, `ENQUIRY_LOG_ONLY=1` makes rate requests print to the server console instead of emailing.

## Design

- `PRODUCT.md`: users, purpose, personality, principles (impeccable format).
- `DESIGN.md`: concept ("the printed 25 kg polymer bag"), tokens, type, components.
- Stack: Next.js 16 (App Router, Cache Components), Tailwind v4, shadcn base, Motion. No GSAP, no smooth scroll.
- Watermelon UI sources that were adapted live untouched in `reference/watermelon/` (excluded from tsc and eslint): `command-search` → grade lookup, `morphing-discovery-bar` → family tabs, `progressive-input-stack` → rate request, `stepper` → Quick Quote quantity, `status-picker` → order stages, `continuous-tabs` → demo role switcher.

## Where things live

| What | File |
|---|---|
| Company facts, reviews, photos | `src/content/site.ts` |
| Product register (236 grades, generated data) | `src/content/catalogue.data.json`, typed in `src/content/catalogue.ts` |
| Product photos (Arihant's own, from the old site) | `public/images/products/` |
| Godown, office and building photos | `public/images/arihant/` |
| Website pages | `src/app/(site)/` |
| Site components (bag face, lookup, register, form) | `src/components/site/` |
| Rate request API | `src/app/api/enquiry/route.ts`, `src/lib/enquiry.ts` |
| Demo seed data (invented) | `src/lib/demo/seed.ts` |
| Demo state and actions | `src/lib/demo/store.tsx` |
| Role access matrix | `src/lib/demo/access.ts` |
| Demo pages | `src/app/demo/` |

## Before launch (needs Arihant)

- **Direct phone number.** 080 4730 5878 is the number on the IndiaMART listing.
- **WhatsApp number and email** (none published). WhatsApp buttons are left out until we have the number.
- **Logo.** The wordmark is typeset in Big Shoulders Stencil, not Arihant's mark.
- **Photos.** All photos are Arihant's own, taken from the old IndiaMART site (product bags and granules, godown, office, building). Newer or higher-resolution shots would help the hero.
- **Grade list.** Confirm the 236 grades are current. Codes, producers, polymer family and process were derived from the listed names and spec tables.
- **Prices.** None shown (the old site's Rs 100/kg is a placeholder).
- **Turnover** (IndiaMART says Rs 100 to 500 Cr) is deliberately not shown.
- **Resend** (or another mail service) keys and the inbox for rate requests; remove `ENQUIRY_LOG_ONLY`.
- Domain and `NEXT_PUBLIC_SITE_URL`.
- Update `YEAR` in `src/content/site.ts` each year (prerendered pages don't read the clock).
