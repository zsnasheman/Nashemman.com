"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A small ink dot that follows fine pointers. Over anything with a
 * data-cursor="label" attribute it swells into a labelled disc.
 * The native cursor stays visible; this is a companion, not a replacement.
 */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    const el = ref.current!;
    let x = -100,
      y = -100,
      cx = -100,
      cy = -100,
      raf = 0;

    const tick = () => {
      cx += (x - cx) * 0.22;
      cy += (y - cy) * 0.22;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.3 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      x = e.clientX;
      y = e.clientY;
      el.dataset.hidden = "false";
      const target = (e.target as Element | null)?.closest<HTMLElement>("[data-cursor]");
      const next = target?.dataset.cursor ?? "";
      el.dataset.active = next ? "true" : "false";
      setLabel(next);
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onLeave = () => (el.dataset.hidden = "true");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className="cursor" aria-hidden="true" data-hidden="true">
      <div className="cursor__dot">
        <span className="cursor__label">{label}</span>
      </div>
    </div>
  );
}
