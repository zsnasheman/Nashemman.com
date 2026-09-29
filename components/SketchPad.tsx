"use client";

import { useEffect, useRef } from "react";

/**
 * A transparent drawing surface behind the cover. A mouse or pen leaves a
 * calligraphic ink trail that fades after a moment, so the page is always
 * clean again. Touch is left alone so scrolling is never hijacked.
 */
export default function SketchPad() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const ctx = canvas.getContext("2d")!;
    const host = canvas.parentElement!;
    const LIFE = 1400;
    type P = { x: number; y: number; t: number; w: number };
    let pts: P[] = [];
    let raf = 0;
    let dpr = 1;
    const color = getComputedStyle(document.documentElement).getPropertyValue("--chinar").trim() || "#a8361a";

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const r = host.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      canvas.style.width = `${r.width}px`;
      canvas.style.height = `${r.height}px`;
    };

    const draw = () => {
      const now = performance.now();
      pts = pts.filter((p) => now - p.t < LIFE);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = "round";
      ctx.strokeStyle = color;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        if (b.t - a.t > 80) continue; // a lift of the pen
        const age = (now - b.t) / LIFE;
        ctx.globalAlpha = Math.max(0, 1 - age) * 0.85;
        ctx.lineWidth = b.w;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      raf = pts.length ? requestAnimationFrame(draw) : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const last = pts[pts.length - 1];
      const speed = last ? Math.hypot(x - last.x, y - last.y) : 0;
      const w = Math.max(0.8, Math.min(4.5, 5 - speed * 0.12));
      pts.push({ x, y, t: performance.now(), w });
      if (!raf) raf = requestAnimationFrame(draw);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    host.addEventListener("pointermove", onMove as EventListener, { passive: true });
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      host.removeEventListener("pointermove", onMove as EventListener);
    };
  }, []);

  return <canvas ref={ref} className="sketchpad" aria-hidden="true" />;
}
