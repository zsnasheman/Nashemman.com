"use client";

import { useEffect, useRef } from "react";

/**
 * The name, set large, as live type. Letters near the pointer grow heavier
 * and softer, as if pressed by a nib. On touch, a tap blooms the letters
 * around it. With reduced motion the name is simply set, still.
 */
export default function HeroName({ first, last }: { first: string; last: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const h = ref.current;
    if (!h) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const letters = Array.from(h.querySelectorAll<HTMLElement>("[data-l]"));
    const zone = h.closest("section") ?? h;
    let centers: { x: number; y: number }[] = [];
    let raf = 0;
    let px = -9999,
      py = -9999;

    const measure = () => {
      centers = letters.map((l) => {
        const r = l.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
    };
    const paint = () => {
      raf = 0;
      const radius = Math.max(160, window.innerWidth * 0.16);
      letters.forEach((l, i) => {
        const c = centers[i];
        const dist = Math.hypot(px - c.x, py - c.y);
        const f = Math.max(0, 1 - dist / radius);
        const e = f * f * (3 - 2 * f);
        l.style.setProperty("--w", (340 + e * 560).toFixed(0));
        l.style.setProperty("--s", (e * 100).toFixed(0));
        l.style.setProperty("--lift", `${(-e * 0.06).toFixed(3)}em`);
      });
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      measure();
      px = e.clientX;
      py = e.clientY;
      request();
    };
    const onLeave = () => {
      px = py = -9999;
      request();
    };
    let tapTimer: number | undefined;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "touch") return;
      measure();
      px = e.clientX;
      py = e.clientY;
      request();
      window.clearTimeout(tapTimer);
      tapTimer = window.setTimeout(onLeave, 900);
    };

    zone.addEventListener("pointermove", onMove as EventListener, { passive: true });
    zone.addEventListener("pointerleave", onLeave);
    zone.addEventListener("pointerdown", onDown as EventListener, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(tapTimer);
      zone.removeEventListener("pointermove", onMove as EventListener);
      zone.removeEventListener("pointerleave", onLeave);
      zone.removeEventListener("pointerdown", onDown as EventListener);
    };
  }, []);

  let n = 0;
  const split = (word: string) =>
    Array.from(word).map((ch, i) => {
      const idx = n++;
      return ch === " " ? (
        <span key={i} className="hero-name__space">
          {" "}
        </span>
      ) : (
        <span key={i} data-l className="hero-name__l" style={{ ["--i" as string]: idx }}>
          {ch}
        </span>
      );
    });

  return (
    <h1 ref={ref} className="hero-name">
      <span className="visually-hidden">
        {first} {last}
      </span>
      <span aria-hidden="true" className="hero-name__first">
        {split(first)}
      </span>
      <span aria-hidden="true" className="hero-name__last">
        {split(last)}
      </span>
    </h1>
  );
}
