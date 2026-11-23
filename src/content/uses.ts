/*
 * Where the granules go: the processes Arihant's listed grades are made for,
 * with counts derived from the catalogue. Photos are from Unsplash (Unsplash
 * License: free for commercial use, no attribution required); they show the
 * process in general, not Arihant's customers. Sources in reference/image-credits.md.
 */

import { grades } from "./catalogue";

const count = (re: RegExp) => grades.filter((g) => re.test(g.process)).length;

export const uses = [
  { id: "injection", label: "Injection moulding", q: "injection", count: count(/injection/i), img: "/images/web/use-injection.jpg", alt: "Rows of injection moulding machines on a factory floor", w: 1600, h: 1000 },
  { id: "film", label: "Film and packaging", q: "film", count: count(/film/i), img: "/images/web/use-film.jpg", alt: "Close-up of crumpled clear plastic film", w: 1600, h: 2400 },
  { id: "raffia", label: "Raffia and woven sacks", q: "raffia", count: count(/raffia/i), img: "/images/web/use-raffia.jpg", alt: "Stacks of filled white sacks on pallets", w: 1600, h: 1067 },
  { id: "pipe", label: "Pipe", q: "pipe", count: count(/pipe/i), img: "/images/web/use-pipe.jpg", alt: "Stacked plastic pipes with red ends", w: 1600, h: 1067 },
  { id: "blow", label: "Blow moulding", q: "blow", count: count(/blow/i), img: "/images/web/use-blow.jpg", alt: "Rows of plastic bottles with white caps", w: 1600, h: 1067 },
] as const;

/** Material close-ups (Unsplash), used as texture on the about page. */
export const materialPhotos = {
  natural: { src: "/images/web/pellets-natural.jpg", alt: "A bed of natural white polymer pellets", w: 1600, h: 1200 },
  clear: { src: "/images/web/pellets-clear.jpg", alt: "Clear polymer pellets scattered on black", w: 1600, h: 1067 },
  colour: { src: "/images/web/pellets-colour.jpg", alt: "Close-up of tinted teal polymer granules", w: 1600, h: 1067 },
} as const;
