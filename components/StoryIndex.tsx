"use client";

import { useEffect, useState } from "react";

type Item = { id: string; title: string; place: string };

/** Sticky chapter index for the Story page; highlights the chapter in view. */
export default function StoryIndex({ items }: { items: Item[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav className="story-index" aria-label="Chapters">
      <ol>
        {items.map((it, i) => (
          <li key={it.id}>
            <a href={`#${it.id}`} aria-current={active === it.id ? "true" : undefined}>
              <span className="num">{String(i + 1).padStart(2, "0")}</span>
              <span className="story-index__title">{it.title}</span>
              <span className="story-index__place">{it.place}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
