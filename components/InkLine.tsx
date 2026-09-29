"use client";

import { useEffect, useRef } from "react";

/**
 * The thread that runs down every page: a faint pencil guide, and an ink
 * line drawn over it as the reader scrolls. It starts in chinar (roots)
 * and turns to drafting blue (practice). Decorative only.
 */

function buildPath(seed: number) {
  let s = seed;
  const rand = () => (s = (s * 16807) % 2147483647) / 2147483647;
  let d = "M20 0";
  let y = 0;
  while (y < 1000) {
    const step = 40 + rand() * 60;
    const x1 = 4 + rand() * 32;
    const x2 = 4 + rand() * 32;
    const x = 8 + rand() * 24;
    d += ` C${x1.toFixed(1)} ${(y + step * 0.33).toFixed(1)} ${x2.toFixed(1)} ${(y + step * 0.66).toFixed(1)} ${x.toFixed(1)} ${Math.min(1000, y + step).toFixed(1)}`;
    y += step;
  }
  return d;
}

export default function InkLine({ seed = 7 }: { seed?: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  const ink = useRef<SVGPathElement>(null);
  const d = buildPath(seed);
  const gid = `ink-grad-${seed}`;

  useEffect(() => {
    const host = wrap.current?.parentElement;
    const path = ink.current;
    if (!host || !path) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      path.style.strokeDashoffset = "0";
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = host.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.75 - r.top) / r.height));
      path.style.strokeDashoffset = String(1 - p);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={wrap} className="inkline" aria-hidden="true">
      <svg viewBox="0 0 40 1000" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1000" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="var(--chinar)" />
            <stop offset="0.55" stopColor="var(--blue)" />
            <stop offset="1" stopColor="var(--ink)" />
          </linearGradient>
        </defs>
        <path
          d={d}
          fill="none"
          stroke="var(--ink)"
          strokeOpacity="0.14"
          strokeWidth="1"
          strokeDasharray="3 5"
          vectorEffect="non-scaling-stroke"
        />
        <path
          ref={ink}
          d={d}
          fill="none"
          stroke={`url(#${gid})`}
          strokeWidth="2"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
