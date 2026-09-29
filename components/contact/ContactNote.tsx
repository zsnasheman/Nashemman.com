"use client";

import { useEffect, useRef, useState } from "react";

export type ContactChannel = { label: string; url: string; description?: string };

/**
 * The closing moment: a folded note opens while material samples and a
 * drawn sprig gather around it. The note's contents are always in the DOM
 * and reachable by keyboard; the folding flaps are decorative.
 */
export default function ContactNote({
  heading,
  intro,
  email,
  channels,
  headingLevel = 2,
}: {
  heading: string;
  intro: string;
  email?: string;
  channels: ContactChannel[];
  headingLevel?: 1 | 2;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOpen(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const H = headingLevel === 1 ? "h1" : "h2";

  return (
    <div ref={ref} className="note-scene" data-open={open} onFocus={() => setOpen(true)}>
      <div className="note-scene__field" aria-hidden="true" />

      {/* Material samples gathering on the desk */}
      <div className="samples" aria-hidden="true">
        <span className="sample sample--terrazzo" />
        <span className="sample sample--oak" />
        <span className="sample sample--linen" />
        <span className="sample sample--brass" />
        <span className="sample sample--sky" />
        <span className="sample sample--chinar" />
      </div>

      {/* A drawn sprig */}
      <svg className="sprig" viewBox="0 0 160 260" aria-hidden="true">
        <path
          pathLength={1}
          d="M80 256 C78 200 84 150 78 96 C74 60 82 30 90 6 M79 170 C60 160 40 150 22 128 M80 120 C100 108 122 100 140 76 M78 80 C62 70 50 56 44 36"
        />
        <path
          className="sprig__leaf"
          d="M22 128 c-10 -8 -14 -22 -6 -30 c8 6 12 18 6 30 z M140 76 c12 -4 18 -18 12 -28 c-10 4 -16 16 -12 28 z M44 36 c-10 -6 -12 -20 -4 -26 c8 6 10 16 4 26 z M90 6 c6 -2 10 2 8 8"
        />
      </svg>

      <div className="note">
        <div className="note__paper">
          <p className="label">A note for Nashemman</p>
          <H className="note__title">{heading}</H>
          <p className="note__intro">{intro}</p>
          <ul className="note__actions">
            {email ? (
              <li>
                <a className="btn btn--ink" href={`mailto:${email}`}>
                  Write to {email}
                </a>
              </li>
            ) : null}
            {channels.map((c, i) => (
              <li key={c.url}>
                <a
                  className={`btn ${i === 0 && !email ? "btn--ink" : "btn--line"}`}
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {c.label} ↗<span className="visually-hidden"> (opens in a new tab)</span>
                </a>
                {c.description ? <span className="note__hint">{c.description}</span> : null}
              </li>
            ))}
          </ul>
        </div>
        <span className="note__flap note__flap--top" aria-hidden="true" />
        <span className="note__flap note__flap--bottom" aria-hidden="true" />
      </div>
    </div>
  );
}
