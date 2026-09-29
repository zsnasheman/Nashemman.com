import type { Metadata } from "next";
import { getMediaSlot, getSite } from "@/lib/content";
import Reveal from "@/components/Reveal";
import Patched from "@/components/Patched";
import Figure from "@/components/Figure";
import Sketch from "@/components/sketch/Sketch";
import MaterialBoard from "@/components/board/MaterialBoard";

export const metadata: Metadata = {
  title: "Work & Ventures",
  description:
    "The Scribble Lab, founded in 2022: interiors, brand activations, kinetic window displays, exhibitions and events. And a second business in development.",
};

export default function WorkPage() {
  const site = getSite();
  const { studio, venture } = site;
  const board = site.board.map((b) => {
    const m = getMediaSlot(b.media);
    return { id: b.id, title: b.title, blurb: b.blurb, image: m?.src ? { src: m.src, alt: m.alt } : undefined };
  });

  return (
    <>
      <header className="shell page-head">
        <p className="label">Work &amp; Ventures</p>
        <h1 className="page-title">
          One studio. <Patched text="[[Another venture]]" tone="butter" /> in the making.
        </h1>
      </header>

      <section className="feature shell" aria-labelledby="studio-h">
        <Reveal className="feature__image">
          <Figure slot="studio-feature" ratio="3/2" sizes="(min-width: 900px) 70vw, 100vw" priority />
        </Reveal>
        <Reveal className="feature__box" delay={0.12}>
          <p className="label">Founder · since {studio.since}</p>
          <h2 id="studio-h" className="feature__title">
            {studio.name}
          </h2>
          <p className="feature__lead">{studio.lead}</p>
          <p>{studio.body}</p>
          <a className="btn btn--ink" href={studio.url} target="_blank" rel="noopener noreferrer">
            Projects and enquiries ↗<span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </Reveal>
      </section>

      <section className="practice" aria-labelledby="practice-h">
        <div className="shell">
          <Reveal className="section-head">
            <p className="label">The range</p>
            <h2 id="practice-h" className="section-title">
              The material <Patched text="[[board]]" tone="sky" />
            </h2>
            <p className="section-dek">Six disciplines the studio works across. Choose one to bring it forward.</p>
          </Reveal>
          <MaterialBoard items={board} studioUrl={studio.url} />
        </div>
      </section>

      <section className="next" aria-labelledby="next-h">
        <div className="shell next__inner">
          <Reveal className="next__sketch">
            <Sketch viewBox="1168 250 432 480" decorative />
          </Reveal>
          <Reveal className="next__text" delay={0.1}>
            <p className="label">{venture.label}</p>
            <h2 id="next-h" className="next__title">
              {venture.title}
            </h2>
            <p>{venture.body}</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
