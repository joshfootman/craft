const PATTERNS = ["dots", "plus", "vertical-bars", "horizontal-bars", "diagonal"] as const;

const COLORS = [
  { bg: "#fecdd3", fg: "#fda4af" }, // rose
  { bg: "#fbcfe8", fg: "#f9a8d4" }, // pink
  { bg: "#f5d0fe", fg: "#f0abfc" }, // fuchsia
  { bg: "#e9d5ff", fg: "#d8b4fe" }, // purple
  { bg: "#c7d2fe", fg: "#a5b4fc" }, // indigo
  { bg: "#bfdbfe", fg: "#93c5fd" }, // blue
  { bg: "#bae6fd", fg: "#7dd3fc" }, // sky
  { bg: "#a5f3fc", fg: "#67e8f9" }, // cyan
  { bg: "#99f6e4", fg: "#5eead4" }, // teal
  { bg: "#a7f3d0", fg: "#6ee7b7" }, // emerald
  { bg: "#bbf7d0", fg: "#86efac" }, // green
  { bg: "#d9f99d", fg: "#bef264" }, // lime
  { bg: "#fef08a", fg: "#fde047" }, // yellow
  { bg: "#fde68a", fg: "#fcd34d" }, // amber
  { bg: "#fed7aa", fg: "#fdba74" }, // orange
  { bg: "#fecaca", fg: "#fca5a5" }, // red
  { bg: "#e2e8f0", fg: "#cbd5e1" }, // slate
] as const;

const SIZES = [12, 16, 20] as const;

export type Pattern = {
  pattern: (typeof PATTERNS)[number];
  bg: string;
  fg: string;
  size: number;
};

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i);
    h = h | 0;
  }
  return Math.abs(h);
}

export function getPattern(id: string): Pattern {
  const h = hash(id);
  const pattern = PATTERNS[h % PATTERNS.length];
  const color = COLORS[Math.floor(h / PATTERNS.length) % COLORS.length];
  const size = SIZES[Math.floor(h / (PATTERNS.length * COLORS.length)) % SIZES.length];

  return { pattern, bg: color.bg, fg: color.fg, size };
}
