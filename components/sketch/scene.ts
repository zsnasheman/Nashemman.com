/**
 * The landing sketch, as data. One continuous ink line runs along a single
 * horizon: Kashmir-inspired forms on the left, Dubai's architecture in the
 * middle, and an open, dotted future on the right. Future forms are hints
 * only and are deliberately never labelled.
 *
 * viewBox: 0 0 1600 900. Horizon at y = 700.
 * `x` on each detail is where the main line passes it, so details appear as
 * the line reaches them, keeping the drawing continuous rather than a
 * sequence of landmarks.
 */

export const VIEWBOX = { w: 1600, h: 900 };
export const HORIZON = 700;
/** Where the solid line ends and the open, dotted future begins. */
export const LINE_END_X = 1130;

// ── The single continuous line: roots → practice ─────────────────────────
export const MAIN_LINE = [
  "M0 700 H130",
  // Tiered roof (Kashmiri wooden architecture, abstracted)
  "V600 H112 L150 562 H162 V532 H146 L176 502 H191 V482 L211 440 V396 L211 440 L231 482 V502 H246 L276 532 H260 V562 H272 L310 600 H292 V700",
  // Chinar tree: trunk, crown, trunk
  "H395 C398 672 397 652 392 634",
  "C350 632 338 592 366 572 C350 540 380 510 410 520 C426 490 470 498 472 530 C502 536 506 576 482 592 C494 616 466 640 430 634",
  "C426 652 424 674 428 700",
  // Old Dubai: low wall and a wind tower
  "H530 V642 H604 V566 H598 V556 H650 V566 H644 V642 H688 V700",
  // Skyline
  "H708 V470 H744 V700",
  "H762 V404 Q850 468 832 700",
  "H852 V522 H888 V700",
  "H912 V560 H922 V470 H933 V362 H943 V252 L951 150 L959 252 V362 H969 V470 H980 V560 H990 V700",
  "H1010 V522 Q1030 482 1050 522 V700",
  "H1062 V624 H1102 V700",
  `H${LINE_END_X}`,
].join(" ");

// ── Colour fields, behind the drawing ────────────────────────────────────
export const FIELDS = [
  {
    id: "roots",
    tone: "chinar",
    d: "M40 700 C30 610 70 520 150 486 C230 452 320 468 380 520 C430 562 470 620 486 700 Z",
  },
  {
    id: "practice",
    tone: "sky",
    d: "M520 700 C512 560 560 400 690 318 C800 250 960 214 1060 290 C1140 350 1150 520 1132 700 Z",
  },
  {
    id: "future",
    tone: "butter",
    d: "M1150 700 C1146 610 1170 500 1214 430 C1250 372 1300 356 1338 392 C1380 432 1400 520 1398 600 C1398 640 1392 672 1386 700 Z",
  },
];

// ── Back layer: drawn beneath the colour fields ──────────────────────────
export const BACK = "M0 612 L58 548 L104 584 L176 480 L234 548 L296 506 L336 552";

// ── Detail strokes (x = where the main line reaches them) ─────────────────
type Detail = { d: string; x: number; kind?: "fine" | "accent" };

export const DETAILS: Detail[] = [
  // Latticed window in the tiered building
  { d: "M190 620 H232 V690 H190 Z M190 643 H232 M190 666 H232 M204 620 V690 M218 620 V690", x: 200 },
  { d: "M190 620 L232 690 M232 620 L190 690", x: 205, kind: "fine" },
  // Water lines at the foot of the roots
  { d: "M20 728 H110 M60 744 H170 M300 730 H380", x: 150, kind: "fine" },
  // Arched openings in the low wall
  { d: "M542 700 V668 Q554 652 566 668 V700 M574 700 V668 Q586 652 598 668 V700", x: 560 },
  // Wind tower slots
  { d: "M612 572 V600 M624 572 V600 M636 572 V600", x: 620 },
  // Tower and sail detailing
  { d: "M708 510 H744 M708 550 H744 M708 590 H744 M708 630 H744", x: 720, kind: "fine" },
  { d: "M762 470 Q806 500 818 560 M762 540 Q800 560 812 620", x: 790, kind: "fine" },
  { d: "M951 150 V120", x: 955 },
  // A ring form beside the low building
  { d: "M1082 604 m-30 0 a30 22 0 1 0 60 0 a30 22 0 1 0 -60 0", x: 1080 },
];

// ── The future: dotted, unlabelled hints ─────────────────────────────────
// The strongest form sits closest to the present; the others recede.
export const FUTURE_LINE = `M${LINE_END_X} 700 H1600`;

export const FUTURE: Detail[] = [
  // Crenellated mud-brick wall with triangular openings (strongest)
  {
    d: "M1172 700 V632 L1180 620 L1188 632 L1196 620 L1204 632 L1212 620 L1220 632 V700 M1188 668 l6 -10 l6 10 Z M1206 668 l6 -10 l6 10 Z",
    x: 1180,
    kind: "accent",
  },
  // Tall tower with an opening at its crown (strongest)
  {
    d: "M1236 700 L1244 340 Q1247 314 1258 300 Q1272 372 1286 300 Q1297 314 1300 340 L1308 700 M1262 328 H1282",
    x: 1250,
    kind: "accent",
  },
  { d: "M1320 700 V618 H1350 V700", x: 1320, kind: "accent" },
  // Sails by water
  { d: "M1388 700 Q1400 640 1440 628 Q1424 660 1428 700 M1420 700 Q1436 650 1470 640 Q1456 670 1460 700", x: 1400 },
  // Bullet-shaped tower
  { d: "M1492 700 V600 Q1492 540 1510 520 Q1528 540 1528 600 V700 M1496 640 L1524 600 M1496 600 L1524 640", x: 1490 },
  // Flat-roofed cube with a ribbon window
  { d: "M1546 700 V630 H1596 V700 M1552 650 H1590", x: 1540 },
];

// ── Clouds (layered for parallax) ────────────────────────────────────────
export const CLOUDS = [
  {
    d: "M0 0 c10 -22 42 -26 56 -8 c16 -16 48 -10 52 12 c18 2 22 26 4 30 h-116 c-18 -4 -14 -30 4 -34 z",
    x: 180,
    y: 250,
    s: 1.2,
    layer: 1,
  },
  {
    d: "M0 0 c8 -18 34 -20 46 -6 c14 -14 40 -8 42 10 c14 2 18 22 2 24 h-94 c-14 -2 -12 -24 4 -28 z",
    x: 640,
    y: 180,
    s: 1,
    layer: 2,
  },
  {
    d: "M0 0 c10 -22 42 -26 56 -8 c16 -16 48 -10 52 12 c18 2 22 26 4 30 h-116 c-18 -4 -14 -30 4 -34 z",
    x: 1010,
    y: 330,
    s: 0.8,
    layer: 3,
  },
  {
    d: "M0 0 c8 -18 34 -20 46 -6 c14 -14 40 -8 42 10 c14 2 18 22 2 24 h-94 c-14 -2 -12 -24 4 -28 z",
    x: 1330,
    y: 200,
    s: 1.3,
    layer: 1,
  },
];

/** A five-lobed leaf, a quiet signature for the roots. Centred at 0,0. */
export const LEAF =
  "M0 28 C-2 18 -4 10 -8 6 C-18 10 -26 4 -28 -4 C-20 -6 -16 -10 -18 -18 C-10 -16 -6 -20 -4 -30 C-2 -24 2 -24 4 -30 C6 -20 10 -16 18 -18 C16 -10 20 -6 28 -4 C26 4 18 10 8 6 C4 10 2 18 0 28 Z M0 28 V-18";
