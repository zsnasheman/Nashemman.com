"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Starts the sketch drawing once it is on screen and, for the hero, feeds a
 * 0–1 scroll value (--p) to CSS for restrained parallax. Nothing runs under
 * reduced motion; the static drawing is already complete.
 */
export default function SketchLive({
  children,
  className,
  parallax,
  animate,
}: {
  children: ReactNode;
  className: string;
  parallax: boolean;
  animate: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-still");
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("is-live");
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);

    if (!parallax) return () => io.disconnect();
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
      el.style.setProperty("--p", p.toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [parallax, animate]);

  return (
    <div ref={ref} className={animate ? className : `${className} is-still`}>
      {children}
    </div>
  );
}
