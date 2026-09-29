import type { Metadata } from "next";
import { getStory, getSite } from "@/lib/content";
import Reveal from "@/components/Reveal";
import Figure, { SKETCH_CROPS } from "@/components/Figure";
import Sketch from "@/components/sketch/Sketch";
import MaterialArt from "@/components/board/MaterialArt";

export const metadata: Metadata = {
  title: "Story",
  description:
    "From Kashmir, educated in Delhi and Dubai, five years in design practice, founder of The Scribble Lab, and building a second business.",
};

function ChapterVisual({ visual }: { visual: string }) {
  if (visual === "board")
    return (
      <div className="chapter-visual chapter-visual--board" aria-hidden="true">
        {["residential", "kinetic", "exhibitions"].map((id) => (
          <span key={id} className={`chapter-visual__piece chapter-visual__piece--${id}`}>
            <MaterialArt id={id} />
          </span>
        ))}
      </div>
    );
  return (
    <div className={`chapter-visual chapter-visual--${visual}`}>
      <Sketch viewBox={SKETCH_CROPS[visual]} decorative />
    </div>
  );
}

export default function StoryPage() {
  const story = getStory();
  const site = getSite();

  return (
    <>
      <header className="shell story-hero">
        <Reveal className="story-hero__text">
          <p className="label">Story</p>
          <h1 className="page-title">{site.name}</h1>
          <p className="page-dek">{story.dek}</p>
        </Reveal>
        <Reveal className="story-hero__portrait" delay={0.1}>
          <Figure slot={story.portrait} ratio="3/4" sizes="(min-width: 900px) 30vw, 80vw" priority />
        </Reveal>
      </header>

      <div className="chapters">
        {story.chapters.map((ch, i) =>
          ch.visual ? (
            <section key={ch.id} id={ch.id} className={`chapter chapter--visual chapter--${i % 2 ? "right" : "left"}`}>
              <div className="shell chapter__grid">
                <Reveal className="chapter__visual">
                  <ChapterVisual visual={ch.visual} />
                </Reveal>
                <Reveal className="chapter__box" delay={0.1}>
                  <p className="label">
                    {String(i + 1).padStart(2, "0")} · {ch.place}
                  </p>
                  <h2 className="chapter__title">{ch.title}</h2>
                  <div className="prose" dangerouslySetInnerHTML={{ __html: ch.html }} />
                </Reveal>
              </div>
            </section>
          ) : (
            <section key={ch.id} id={ch.id} className="chapter chapter--quiet">
              <Reveal className="shell chapter__quiet">
                <p className="label">
                  {String(i + 1).padStart(2, "0")} · {ch.place}
                </p>
                <div>
                  <h2 className="chapter__title">{ch.title}</h2>
                  <div className="prose prose--large" dangerouslySetInnerHTML={{ __html: ch.html }} />
                </div>
              </Reveal>
            </section>
          ),
        )}
      </div>
    </>
  );
}
