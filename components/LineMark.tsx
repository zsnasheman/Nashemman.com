/**
 * The site's signature diagram: one line, three points.
 * Kashmir (root) → Dubai (practice) → an open end (next).
 * Not a map; latitudes are the only coordinates given.
 */
export default function LineMark({ className = "" }: { className?: string }) {
  return (
    <svg className={`linemark ${className}`} viewBox="0 0 600 180" role="img" aria-labelledby="linemark-title">
      <title id="linemark-title">
        A single drawn line from Kashmir to Dubai, continuing as a dotted line towards a point not yet named.
      </title>
      <path
        className="linemark__done"
        d="M40 60 C 110 10, 170 150, 250 110 S 330 40, 360 120"
        fill="none"
        stroke="url(#lm-grad)"
        strokeWidth="2.4"
        strokeLinecap="round"
        pathLength={1}
      />
      <path
        className="linemark__next"
        d="M360 120 C 390 180, 470 150, 500 90 S 560 40, 566 70"
        fill="none"
        stroke="var(--ink)"
        strokeOpacity="0.55"
        strokeWidth="1.6"
        strokeDasharray="2 7"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="lm-grad" x1="40" x2="360" y1="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--chinar)" />
          <stop offset="1" stopColor="var(--blue)" />
        </linearGradient>
      </defs>
      <g className="linemark__pt" style={{ ["--d" as string]: "0.1s" }}>
        <circle cx="40" cy="60" r="6" fill="var(--chinar)" />
        <text x="40" y="100" textAnchor="middle">
          Kashmir
        </text>
        <text x="40" y="118" textAnchor="middle" className="linemark__sub">
          34° N · root
        </text>
      </g>
      <g className="linemark__pt" style={{ ["--d" as string]: "1.1s" }}>
        <circle cx="360" cy="120" r="6" fill="var(--blue)" />
        <text x="360" y="160" textAnchor="middle">
          Dubai
        </text>
        <text x="360" y="176" textAnchor="middle" className="linemark__sub">
          25° N · practice
        </text>
      </g>
      <g className="linemark__pt" style={{ ["--d" as string]: "1.7s" }}>
        <circle cx="566" cy="70" r="6" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <text x="566" y="40" textAnchor="middle">
          Next
        </text>
        <text x="566" y="24" textAnchor="middle" className="linemark__sub">
          — ° —
        </text>
      </g>
    </svg>
  );
}
