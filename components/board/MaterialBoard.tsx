"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import MaterialArt from "./MaterialArt";

export type BoardItem = {
  id: string;
  title: string;
  blurb: string;
  image?: { src: string; alt: string };
};

type Pos = { x: number; y: number; r: number; s: number };
type Layout = {
  h: number;
  /** Board height while a piece is selected, if different. */
  hFocus?: number;
  spread: Pos[];
  gather: (i: number) => Pos;
  active: Pos;
  strip: (k: number) => Pos;
  panel: { x: number; y: number; w: number; h: number };
};

// All units are % of the board's width (cqw), so the composition scales as one.
const WIDE: Layout = {
  h: 68,
  spread: [
    { x: 2, y: 3, r: -2.5, s: 1.12 },
    { x: 33, y: 1, r: 1.8, s: 0.86 },
    { x: 57.5, y: 4, r: -1.5, s: 0.96 },
    { x: 84, y: 24, r: 3, s: 0.6 },
    { x: 34, y: 32, r: 2, s: 0.9 },
    { x: 60.5, y: 38.5, r: -2.5, s: 0.86 },
  ],
  gather: (i) => ({ x: 37 + i * 0.6, y: 14 + i * 0.4, r: [-7, 5, -3, 8, -5, 3][i], s: 0.95 }),
  active: { x: 3, y: 3, r: -1, s: 1.8 },
  strip: (k) => ({ x: 55 + k * 8.3, y: 49, r: 0, s: 0.28 }),
  panel: { x: 55, y: 3, w: 41, h: 42 },
};

const NARROW: Layout = {
  h: 176,
  hFocus: 196,
  spread: [
    { x: 3, y: 2, r: -2.5, s: 1.7 },
    { x: 52.8, y: 6, r: 2, s: 1.7 },
    { x: 3, y: 58, r: 2, s: 1.7 },
    { x: 52.8, y: 62, r: -2, s: 1.7 },
    { x: 3, y: 114, r: -1.5, s: 1.7 },
    { x: 52.8, y: 118, r: 2.5, s: 1.7 },
  ],
  gather: (i) => ({ x: 28 + i * 0.6, y: 40 + i * 0.8, r: [-7, 5, -3, 8, -5, 3][i], s: 1.7 }),
  active: { x: 3, y: 3, r: 0, s: 2.6 },
  strip: (k) => ({ x: 74, y: 3 + k * 17, r: 0, s: 0.5 }),
  panel: { x: 3, y: 92, w: 94, h: 102 },
};

export default function MaterialBoard({ items, studioUrl }: { items: BoardItem[]; studioUrl?: string }) {
  const boardRef = useRef<HTMLDivElement>(null);
  const panelHeading = useRef<HTMLHeadingElement>(null);
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [spread, setSpread] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 699px)");
    const apply = () => setNarrow(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Gather → spread once, when the board first comes into view.
  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSpread(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSpread(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const open = useCallback((i: number) => {
    setSpread(true);
    setActive(i);
    requestAnimationFrame(() => panelHeading.current?.focus({ preventScroll: true }));
  }, []);

  const close = useCallback(() => {
    setActive((cur) => {
      if (cur !== null) requestAnimationFrame(() => tileRefs.current[cur]?.focus({ preventScroll: true }));
      return null;
    });
  }, []);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close]);

  const L = narrow ? NARROW : WIDE;
  const place = (i: number): Pos => {
    if (active !== null) {
      if (i === active) return L.active;
      const k = i < active ? i : i - 1;
      return L.strip(k);
    }
    return spread ? L.spread[i] : L.gather(i);
  };

  const current = active !== null ? items[active] : null;

  return (
    <div className="board-wrap">
      <div
        ref={boardRef}
        className="board"
        data-mode={active !== null ? "focus" : spread ? "spread" : "gathered"}
        style={{ ["--board-h" as string]: active !== null ? (L.hFocus ?? L.h) : L.h }}
        role="group"
        aria-label="The practice, as a material board. Select a discipline to learn more."
      >
        {items.map((it, i) => {
          const p = place(i);
          const isActive = active === i;
          return (
            <button
              key={it.id}
              ref={(el) => {
                tileRefs.current[i] = el;
              }}
              type="button"
              className={`tile tile--${it.id}`}
              aria-pressed={isActive}
              aria-controls="board-panel"
              aria-label={isActive ? `${it.title} (selected)` : `${it.title}: show details`}
              onClick={() => (isActive ? close() : open(i))}
              style={{
                ["--x" as string]: p.x,
                ["--y" as string]: p.y,
                ["--r" as string]: `${p.r}deg`,
                ["--s" as string]: p.s,
                ["--d" as string]: `${active === null ? i * 0.06 : 0}s`,
                zIndex: isActive ? 20 : active !== null ? 10 : spread ? 1 + i : 10 - i,
              }}
            >
              <span className="tile__media">
                {it.image ? (
                  <Image src={it.image.src} alt="" fill sizes="(min-width: 700px) 45vw, 90vw" />
                ) : (
                  <MaterialArt id={it.id} />
                )}
              </span>
              <span className="tile__tag">
                {String(i + 1).padStart(2, "0")} · {it.image ? "Project" : "Material study"}
              </span>
              <span className="tile__title">{it.title}</span>
            </button>
          );
        })}

        <div
          id="board-panel"
          className="board-panel"
          aria-live="polite"
          hidden={!current}
          style={{
            ["--px" as string]: L.panel.x,
            ["--py" as string]: L.panel.y,
            ["--pw" as string]: L.panel.w,
            ["--ph" as string]: L.panel.h,
          }}
        >
          {current && (
            <>
              <p className="label">
                {String((active ?? 0) + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </p>
              <h3 ref={panelHeading} tabIndex={-1} className="board-panel__title">
                {current.title}
              </h3>
              <p className="board-panel__text">{current.blurb}</p>
              <div className="board-panel__actions">
                <button type="button" className="btn btn--ink" onClick={close}>
                  ← Back to the whole board
                </button>
                {studioUrl && (
                  <a className="btn btn--line" href={studioUrl} target="_blank" rel="noopener noreferrer">
                    The Scribble Lab ↗<span className="visually-hidden"> (opens in a new tab)</span>
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <p className="board-note">
        Illustrated material studies, not project photographs. The studio&apos;s portfolio lives on its own website.
      </p>
    </div>
  );
}
