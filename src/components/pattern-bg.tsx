import type { Pattern } from "~/lib/patterns";

function pattern_elements(pattern: Pattern["pattern"], size: number, fg: string) {
  const id = `p-${pattern}-${size}`;
  const half = size / 2;

  switch (pattern) {
    case "dots":
      return {
        id,
        size,
        element: <circle cx={half} cy={half} r={size * 0.12} fill={fg} />,
      };
    case "plus":
      return {
        id,
        size,
        element: (
          <path
            d={`M${half - size * 0.15} ${half}h${size * 0.3}M${half} ${half - size * 0.15}v${size * 0.3}`}
            stroke={fg}
            strokeWidth={size * 0.08}
            strokeLinecap="round"
          />
        ),
      };
    case "vertical-bars":
      return {
        id,
        size,
        element: (
          <line
            x1={half}
            y1={0}
            x2={half}
            y2={size}
            stroke={fg}
            strokeWidth={size * 0.08}
          />
        ),
      };
    case "horizontal-bars":
      return {
        id,
        size,
        element: (
          <line
            x1={0}
            y1={half}
            x2={size}
            y2={half}
            stroke={fg}
            strokeWidth={size * 0.08}
          />
        ),
      };
    case "diagonal":
      return {
        id,
        size,
        element: (
          <line
            x1={0}
            y1={size}
            x2={size}
            y2={0}
            stroke={fg}
            strokeWidth={size * 0.08}
          />
        ),
      };
  }
}

export function PatternBg({ pattern }: { pattern: Pattern }) {
  const { id, size, element } = pattern_elements(pattern.pattern, pattern.size, pattern.fg);

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
      style={{ backgroundColor: pattern.bg }}
    >
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          {element}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
