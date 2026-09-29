import { BACK, CLOUDS, DETAILS, FIELDS, FUTURE, FUTURE_LINE, LEAF, LINE_END_X, MAIN_LINE, VIEWBOX } from "./scene";
import SketchLive from "./SketchLive";

const DRAW = 4.6; // seconds for the main line to travel its length
const at = (x: number) => `${((x / LINE_END_X) * DRAW * 0.92).toFixed(2)}s`;

type Props = {
  /** Crop the scene, e.g. "0 380 560 380" for the roots. Defaults to the whole scene. */
  viewBox?: string;
  className?: string;
  /** Scroll parallax (hero only). */
  parallax?: boolean;
  title?: string;
  decorative?: boolean;
  /** Draw the line on first view (hero). Crops elsewhere appear finished. */
  animate?: boolean;
};

/**
 * The signature sketch. Rendered as static SVG on the server, so it is a
 * complete still composition without JavaScript or with reduced motion.
 * SketchLive adds the drawing animation and parallax when allowed.
 */
export default function Sketch({
  viewBox,
  className = "",
  parallax = false,
  title,
  decorative,
  animate = false,
}: Props) {
  const vb = viewBox ?? `0 0 ${VIEWBOX.w} ${VIEWBOX.h}`;
  const label =
    title ??
    "A continuous line drawing: a tiered wooden roof and a chinar tree flow into the low walls, wind tower and towers of Dubai, then continue as a dotted line into an open horizon.";

  return (
    <SketchLive parallax={parallax} animate={animate} className={`sketch ${className}`}>
      <svg
        viewBox={vb}
        preserveAspectRatio="xMidYMid meet"
        role={decorative ? undefined : "img"}
        aria-hidden={decorative ? true : undefined}
        aria-label={decorative ? undefined : label}
      >
        <path d={BACK} className="sk-back" />

        <g className="sk-fields">
          {FIELDS.map((f, i) => (
            <path
              key={f.id}
              d={f.d}
              className={`sk-field sk-field--${f.tone}`}
              style={{ ["--t" as string]: at(i === 0 ? 40 : i === 1 ? 560 : LINE_END_X) }}
            />
          ))}
        </g>

        <g className="sk-clouds">
          {CLOUDS.map((c, i) => (
            <g key={i} className={`sk-cloud sk-cloud--${c.layer}`} style={{ ["--i" as string]: i }}>
              <path d={c.d} transform={`translate(${c.x} ${c.y}) scale(${c.s})`} />
            </g>
          ))}
        </g>

        <line className="sk-ground" x1="0" y1="700" x2="1600" y2="700" />

        <g className="sk-details">
          {DETAILS.map((dt, i) => (
            <path
              key={i}
              d={dt.d}
              pathLength={1}
              className={`sk-detail ${dt.kind === "fine" ? "sk-detail--fine" : ""}`}
              style={{ ["--t" as string]: at(dt.x) }}
            />
          ))}
        </g>

        <path d={MAIN_LINE} pathLength={1} className="sk-main" />

        <g className="sk-future">
          <path d={FUTURE_LINE} className="sk-future-line" />
          {FUTURE.map((f, i) => (
            <path
              key={i}
              d={f.d}
              className={`sk-future-form ${f.kind === "accent" ? "sk-future-form--accent" : ""}`}
              style={{ ["--t" as string]: `${(DRAW + 0.15 + i * 0.18).toFixed(2)}s` }}
            />
          ))}
        </g>

        <circle className="sk-nib" cx={LINE_END_X} cy="700" r="5.5" style={{ ["--t" as string]: `${DRAW}s` }} />

        <g className="sk-leaf" transform="translate(470 470) rotate(-18) scale(1.15)">
          <path d={LEAF} />
        </g>
      </svg>
    </SketchLive>
  );
}
