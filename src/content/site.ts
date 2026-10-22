/*
 * Company facts and site copy.
 *
 * Sources (read 22 Oct 2026):
 * - arihantpolymer.in/profile.html and home page (IndiaMART-hosted listing)
 * - arihantpolymer.in/testimonial.html (IndiaMART ratings)
 * Contact person confirmed by Onshore Labs: Harsh Jain.
 *
 * Needs confirmation from Arihant before launch (see README):
 * - Direct phone number. 080 4730 5878 is the number on the IndiaMART listing.
 * - WhatsApp number and email address (none published).
 * - Logo. The wordmark here is typeset, not Arihant's mark.
 * - Turnover band (listed as Rs 100 to 500 Cr) is not shown on the site.
 */

/** Year the site copy is written for (prerendered pages can't read the clock). Update yearly. */
export const YEAR = 2026;

export const company = {
  name: "Arihant Polymer",
  since: 1991,
  legal: "Partnership",
  nature: "Trader and distributor of polymer granules, with warehouse and depot",
  contactPerson: "Harsh Jain",
  phone: { display: "080 4730 5878", tel: "+918047305878", note: "Number listed on IndiaMART; direct line to be confirmed" },
  whatsapp: null as string | null,
  email: null as string | null,
  address: {
    lines: ["K/23, Sonal Heavy Industrial Estate", "Kachpada, Ramchandra Lane Extension", "Malad West, Mumbai 400064", "Maharashtra, India"],
    short: "Malad West, Mumbai",
    mapsUrl: "https://maps.google.com/?q=19.18957200,72.83919800",
  },
  gst: "27AAAFA3846Q1Z3",
  gstSince: "1 July 2017",
  payment: ["Cash", "Cheque", "Demand draft", "Credit card"],
  shipping: "By road",
  bank: "Kotak Mahindra Bank",
} as const;

export const nav = [
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
] as const;

export const reviews = {
  source: "IndiaMART",
  average: 4.5,
  count: 186,
  distribution: [
    { stars: 5, pct: 59 },
    { stars: 4, pct: 15 },
    { stars: 3, pct: 9 },
    { stars: 2, pct: 5 },
    { stars: 1, pct: 12 },
  ],
  satisfaction: [
    { label: "Response", pct: 79 },
    { label: "Quality", pct: 77 },
    { label: "Delivery", pct: 72 },
  ],
  recent: [
    { name: "Mahesuni Devdas", city: "Sirsilla, Telangana", date: "8 Oct 2026", product: "Haldia Petrochemicals plastic granules" },
    { name: "Manjulata", city: "Greater Noida, Uttar Pradesh", date: "1 Oct 2026", product: "HDPE granules" },
    { name: "Durgesh Patil", city: "Jalgaon, Maharashtra", date: "18 Sep 2026", product: "SRX100NC Reliance PP random copolymer" },
    { name: "Subhaan", city: "Mumbai, Maharashtra", date: "12 Sep 2026", product: "Polystyrene granules" },
    { name: "Raja", city: "Tanuku, Andhra Pradesh", date: "26 Aug 2026", product: "Polypropylene homopolymer" },
    { name: "Yogesh Goel", city: "New Delhi, Delhi", date: "26 Aug 2026", product: "LDPE granule" },
    { name: "Vipal Kashyap", city: "Bhiwani, Haryana", date: "12 Aug 2026", product: "Polypropylene homopolymer" },
    { name: "Balwinder Singh", city: "Ludhiana, Punjab", date: "3 Aug 2026", product: "Arihant Polymer" },
    { name: "Nilesh Jaysukhlal Mehta", city: "Mumbai, Maharashtra", date: "1 Aug 2026", product: "Polyethylene" },
    { name: "Sonu Thomas Paul", city: "Kochi, Kerala", date: "24 Jul 2026", product: "Not stated" },
    { name: "Soumya", city: "Pune, Maharashtra", date: "23 Jul 2026", product: "Polypropylene random copolymer" },
    { name: "Amit Goswami", city: "Mumbai, Maharashtra", date: "21 Jul 2026", product: "PP granules" },
    { name: "Tushar Detroja", city: "Morbi, Gujarat", date: "11 Jul 2026", product: "Low density polyethylene" },
    { name: "Tanvi", city: "Mumbai, Maharashtra", date: "1 Jul 2026", product: "Natural PP granule" },
    { name: "Avinash Kumar", city: "Suchindrum, Tamil Nadu", date: "9 Jun 2026", product: "PP raffia granules" },
    { name: "S", city: "Hospet, Karnataka", date: "8 May 2026", product: "LLDPE granule" },
    { name: "Yuvaraj E", city: "Chennai, Tamil Nadu", date: "13 Apr 2026", product: "LLDPE granule" },
    { name: "Gautam Khunt", city: "Gondal, Gujarat", date: "8 Mar 2026", product: "PP granules" },
    { name: "Javed Fraaz", city: "Kolkata, West Bengal", date: "12 Mar 2026", product: "Polypropylene homopolymer" },
    { name: "Dev Trading", city: "Ahmedabad, Gujarat", date: "12 Mar 2026", product: "LLDPE granule" },
  ],
} as const;

/** Distinct states that recent reviewers buy from, derived from `reviews.recent`. */
export const reviewStates = Array.from(new Set(reviews.recent.map((r) => r.city.split(", ")[1])));

export const photos = {
  sacks: { src: "/images/photos/sacks-stacked.jpg", alt: "Pallets of white polymer sacks stacked three high against a grey wall", placeholder: true },
  pallets: { src: "/images/photos/bags-pallets.jpg", alt: "Two pallets of woven sacks waiting to load outside a godown", placeholder: true },
  truck: { src: "/images/photos/truck-bags.jpg", alt: "A loaded truck with white sacks stacked inside, the driver resting on the tailgate", placeholder: true },
} as const;
