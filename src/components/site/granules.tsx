import type { GranuleLook } from "@/content/catalogue";

/*
 * Drawn polymer granules. Deterministic (seeded), so server and client render the
 * same SVG. Each pellet is a small ellipse with a translucent body, a rim and a
 * highlight; the look follows the material (milky PE/PP, clear PS/PET/PC, ABS
 * opaque, PVC resin as powder, masterbatch in the rubine dose).
 */

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Pellet {
  x: number;
  y: number;
  rx: number;
  ry: number;
  rot: number;
  row: number;
}

/**
 * Packs pellets from the bottom up, like granules poured into a pouch.
 * `fill` is how high the heap reaches (0 to 1). `mound` raises the middle.
 */
export function packPellets({ width, height, size = 10, fill = 0.7, mound = 0.12, seed = 1 }: { width: number; height: number; size?: number; fill?: number; mound?: number; seed?: number }): Pellet[] {
  const r = rng(seed);
  const out: Pellet[] = [];
  const rowH = size * 1.32;
  const rows = Math.ceil((height * fill) / rowH) + 2;
  for (let row = 0; row < rows; row++) {
    const offset = row % 2 ? size * 1.05 : 0;
    for (let x = size * 0.6 + offset; x < width - size * 0.4; x += size * 2.05) {
      const u = x / width;
      const surface = height - height * fill - Math.sin(u * Math.PI) * height * mound;
      const y = height - size * 0.75 - row * rowH + (r() - 0.5) * size * 0.5;
      if (y < surface + (r() - 0.5) * size * 1.6) continue;
      out.push({
        x: x + (r() - 0.5) * size * 0.7,
        y,
        rx: size * (0.82 + r() * 0.3),
        ry: size * (0.6 + r() * 0.24),
        rot: r() * 180,
        row,
      });
    }
  }
  return out;
}

/** A loose single-layer strip of pellets, for family rows. */
export function stripPellets({ width, height, size = 7, density = 0.55, seed = 1 }: { width: number; height: number; size?: number; density?: number; seed?: number }): Pellet[] {
  const r = rng(seed);
  const n = Math.round(((width * height) / (size * size * 4.2)) * density);
  return Array.from({ length: n }, () => ({
    x: r() * width,
    y: size + r() * (height - size * 2),
    rx: size * (0.85 + r() * 0.25),
    ry: size * (0.65 + r() * 0.2),
    rot: r() * 180,
    row: 0,
  }));
}

const LOOKS: Record<GranuleLook, { body: [string, string]; rim: string; hi: string }> = {
  milky: { body: ["oklch(98.5% 0.004 230 / 0.97)", "oklch(86% 0.014 228 / 0.94)"], rim: "oklch(66% 0.016 235 / 0.55)", hi: "oklch(100% 0 0 / 0.9)" },
  clear: { body: ["oklch(99% 0.004 220 / 0.5)", "oklch(84% 0.02 220 / 0.55)"], rim: "oklch(55% 0.02 230 / 0.6)", hi: "oklch(100% 0 0 / 0.95)" },
  opaque: { body: ["oklch(96% 0.02 85)", "oklch(88% 0.03 80)"], rim: "oklch(62% 0.03 70 / 0.5)", hi: "oklch(100% 0 0 / 0.7)" },
  powder: { body: ["oklch(98% 0.003 230)", "oklch(92% 0.008 230)"], rim: "oklch(72% 0.012 235 / 0.4)", hi: "oklch(100% 0 0 / 0.6)" },
  dose: { body: ["oklch(68% 0.17 5)", "oklch(44% 0.17 3)"], rim: "oklch(35% 0.12 3 / 0.7)", hi: "oklch(100% 0 0 / 0.55)" },
};

function Defs({ id, L, D }: { id: string; L: (typeof LOOKS)[GranuleLook]; D: (typeof LOOKS)[GranuleLook] }) {
  return (
    <defs>
      <radialGradient id={`${id}-b`} cx="38%" cy="32%" r="70%">
        <stop offset="0" stopColor={L.body[0]} />
        <stop offset="1" stopColor={L.body[1]} />
      </radialGradient>
      <radialGradient id={`${id}-d`} cx="38%" cy="32%" r="70%">
        <stop offset="0" stopColor={D.body[0]} />
        <stop offset="1" stopColor={D.body[1]} />
      </radialGradient>
    </defs>
  );
}

function PelletShape({ p, isDose, look, id }: { p: Pellet; isDose: boolean; look: GranuleLook; id: string }) {
  const L = LOOKS[look];
  if (look === "powder" && !isDose) {
    return (
      <g transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`}>
        <circle r={(p.rx * 0.32).toFixed(2)} fill={L.body[1]} />
        <circle cx={(p.rx * 0.55).toFixed(1)} cy={(-p.ry * 0.3).toFixed(1)} r={(p.rx * 0.22).toFixed(2)} fill={L.body[0]} />
        <circle cx={(-p.rx * 0.5).toFixed(1)} cy={(p.ry * 0.35).toFixed(1)} r={(p.rx * 0.18).toFixed(2)} fill={L.rim} />
      </g>
    );
  }
  const S = isDose ? LOOKS.dose : L;
  return (
    <g transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`}>
      {/* soft contact shadow, down and right, so pellets sit on one another */}
      <ellipse cx={(p.rx * 0.14).toFixed(2)} cy={(p.ry * 0.3).toFixed(2)} rx={p.rx.toFixed(2)} ry={p.ry.toFixed(2)} transform={`rotate(${p.rot.toFixed(0)})`} fill="oklch(23% 0.018 250 / 0.13)" />
      <ellipse rx={p.rx.toFixed(2)} ry={p.ry.toFixed(2)} transform={`rotate(${p.rot.toFixed(0)})`} fill={`url(#${id}-${isDose ? "d" : "b"})`} stroke={S.rim} strokeWidth={0.7} />
      {/* light always comes from the top left, whatever way the pellet lies */}
      <ellipse cx={(-p.rx * 0.3).toFixed(2)} cy={(-p.ry * 0.38).toFixed(2)} rx={(p.rx * 0.22).toFixed(2)} ry={(p.ry * 0.13).toFixed(2)} transform="rotate(-20)" fill={S.hi} />
    </g>
  );
}

/**
 * Renders pellets as SVG. Powder renders as fine dust instead of pellets.
 *
 * With `pour`, the heap is split into a few horizontal layers (bottom rows
 * first), each its own SVG that the browser rasterises once and then slides in
 * on the GPU (`.drop-layer`). Animating individual pellets made the page repaint
 * the whole heap every frame and stutter while scrolling.
 */
export function GranuleSvg({
  pellets,
  width,
  height,
  look = "milky",
  id,
  className,
  dose = [],
  pour = false,
  delay = 0,
}: {
  pellets: Pellet[];
  width: number;
  height: number;
  look?: GranuleLook;
  id: string;
  className?: string;
  /** Indexes of pellets drawn as rubine masterbatch among natural ones. */
  dose?: number[];
  /** Pour the heap in on mount, layer by layer (pure CSS). Remount with a new key to pour again. */
  pour?: boolean;
  /** Seconds before the first layer lands. */
  delay?: number;
}) {
  const L = LOOKS[look];
  const D = LOOKS.dose;
  const doseSet = new Set(dose);
  const vb = `0 0 ${width} ${height}`;

  if (!pour) {
    return (
      <svg viewBox={vb} className={className} aria-hidden focusable="false" preserveAspectRatio="xMidYMax slice">
        <Defs id={id} L={L} D={D} />
        {pellets.map((p, i) => (
          <PelletShape key={i} p={p} isDose={doseSet.has(i)} look={look} id={id} />
        ))}
      </svg>
    );
  }

  const maxRow = pellets.reduce((m, p) => Math.max(m, p.row), 0);
  const LAYERS = Math.min(6, maxRow + 1);
  const per = Math.ceil((maxRow + 1) / LAYERS);
  const layers = Array.from({ length: LAYERS }, (_, k) => pellets.map((p, i) => ({ p, i })).filter(({ p }) => Math.floor(p.row / per) === k));
  return (
    <span className={className} aria-hidden>
      {layers.map((list, k) =>
        list.length ? (
          <svg
            key={k}
            viewBox={vb}
            focusable="false"
            preserveAspectRatio="xMidYMax slice"
            className="drop-layer absolute inset-0 size-full"
            style={{ "--t": `${(delay + k * 0.17).toFixed(2)}s` } as React.CSSProperties}
          >
            <Defs id={`${id}-${k}`} L={L} D={D} />
            {list.map(({ p, i }) => (
              <PelletShape key={i} p={p} isDose={doseSet.has(i)} look={look} id={`${id}-${k}`} />
            ))}
          </svg>
        ) : null,
      )}
    </span>
  );
}
