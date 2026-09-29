"use client";

import { createElement, useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type Props = {
  as?: keyof React.JSX.IntrinsicElements;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  id?: string;
  children: ReactNode;
};

/**
 * Fades content up as it enters the viewport. Content is only hidden when
 * JavaScript is running and the reader hasn't asked for reduced motion
 * (see .reveal in globals.css), so nothing is ever lost.
 */
export default function Reveal({ as = "div", delay = 0, className = "", style, id, children }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return createElement(
    as,
    {
      ref,
      id,
      className: `reveal ${className}`.trim(),
      style: { ...style, "--delay": `${delay}s` } as CSSProperties,
    },
    children,
  );
}
