import type { Metadata } from "next";
import Link from "next/link";
import { getWork } from "@/lib/content";
import Reveal from "@/components/Reveal";
import Figure from "@/components/Figure";
import InkLine from "@/components/InkLine";

export const metadata: Metadata = {
  title: "Work & Ventures",
  description: "The Scribble Lab, a venture in interior accessories, and the project stories still to be told.",
};

export default function WorkPage() {
  const work = getWork();

  return (
    <div className="threaded">
      <InkLine seed={5} />
      <header className="shell page-intro">
        <p className="eyebrow">02 · Work &amp; Ventures</p>
        <h1 className="page-intro__title">
          Things she <em>builds</em>
        </h1>
        <p className="page-intro__dek">
          Not a catalogue of services. A studio founded in 2022, a venture in development, and room for the project
          stories that deserve more than a thumbnail.
        </p>
      </header>

      <ol className="shell ventures">
        {work.map((w, i) => (
          <Reveal as="li" key={w.slug} className={`venture venture--${i % 2 ? "right" : "left"}`}>
            <Link href={`/work/${w.slug}`} className="venture__link" data-cursor="Open">
              <div className="venture__media">
                <Figure slot={w.cover} ratio={i === 0 ? "16/11" : "4/5"} sizes="(min-width: 900px) 50vw, 92vw" />
              </div>
              <div className="venture__text">
                <p className="venture__meta">
                  <span className="num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="eyebrow">{w.kind}</span>
                  <span className="eyebrow venture__since">{w.since}</span>
                  {w.status === "draft" && <span className="draft-badge">Draft</span>}
                </p>
                <h2 className="venture__title">{w.title}</h2>
                <p className="venture__summary">{w.summary}</p>
                <span className="text-link">Read the chapter →</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </ol>

      <section className="shell future-note" aria-label="Project stories">
        <Reveal>
          <p className="eyebrow">Project stories</p>
          <p className="future-note__text">
            Selected projects from The Scribble Lab will appear here as full stories: the brief, the idea, the difficult
            part, and what it became. <span className="hand">coming soon</span>
          </p>
        </Reveal>
      </section>
    </div>
  );
}
