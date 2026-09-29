import type { Metadata } from "next";
import { getStory } from "@/lib/content";
import Reveal from "@/components/Reveal";
import Figure from "@/components/Figure";
import InkLine from "@/components/InkLine";
import LineMark from "@/components/LineMark";
import StoryIndex from "@/components/StoryIndex";

export const metadata: Metadata = {
  title: "Story",
  description:
    "Roots in Kashmir, an education that crossed to Dubai, years inside other studios, and a practice of her own.",
};

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

export default function StoryPage() {
  const story = getStory();

  return (
    <div className="threaded">
      <InkLine seed={3} />
      <header className="shell page-intro story-intro">
        <p className="eyebrow">01 · Story</p>
        <h1 className="page-intro__title">
          The line <em>so far</em>
        </h1>
        <div className="story-intro__row">
          <p className="page-intro__dek">{story.dek}</p>
          <LineMark className="story-intro__mark" />
        </div>
      </header>

      <div className="shell story">
        <aside className="story__aside">
          <StoryIndex items={story.chapters.map(({ id, title, place }) => ({ id, title, place }))} />
          <div className="story__portrait">
            <Figure slot={story.portrait} sizes="(min-width: 900px) 22vw, 80vw" />
          </div>
        </aside>

        <div className="story__chapters">
          {story.chapters.map((ch, i) => (
            <Reveal as="section" key={ch.id} id={ch.id} className="chapter">
              <header className="chapter__head">
                <span className="chapter__num" aria-hidden="true">
                  {ROMAN[i]}
                </span>
                <div>
                  <p className="eyebrow">{ch.place}</p>
                  <h2 className="chapter__title">{ch.title}</h2>
                </div>
              </header>
              <div className="prose" dangerouslySetInnerHTML={{ __html: ch.html }} />
            </Reveal>
          ))}
          <p className="hand story__end" aria-hidden="true">
            …to be continued
          </p>
        </div>
      </div>
    </div>
  );
}
