import Link from "next/link";
import Image from "next/image";
import { getChannels, getMediaSlot, getSite } from "@/lib/content";
import Sketch from "@/components/sketch/Sketch";
import Reveal from "@/components/Reveal";
import Patched from "@/components/Patched";
import Figure, { PortraitComposition } from "@/components/Figure";
import MaterialBoard from "@/components/board/MaterialBoard";
import ContactNote from "@/components/contact/ContactNote";

export default function Home() {
  const site = getSite();
  const { home, studio, venture, contact } = site;
  const portrait = getMediaSlot("portrait-hero");
  const board = site.board.map((b) => {
    const m = getMediaSlot(b.media);
    return { id: b.id, title: b.title, blurb: b.blurb, image: m?.src ? { src: m.src, alt: m.alt } : undefined };
  });

  return (
    <>
      {/* ── First screen: the sketch, and a panel that introduces her ── */}
      <section className="hero" aria-labelledby="hero-name">
        <div className="hero__stage">
          <Sketch parallax animate viewBox="0 110 1600 640" className="hero__sketch" />
        </div>

        <div className="hero__panel">
          <div className="hero__portrait">
            {portrait?.src ? (
              <Image src={portrait.src} alt={portrait.alt} fill priority sizes="(min-width: 900px) 22vw, 40vw" />
            ) : (
              <PortraitComposition />
            )}
          </div>
          <div className="hero__text">
            <p className="label">{home.kicker}</p>
            <h1 id="hero-name" className="hero__name">
              {site.firstName} <span>{site.lastNames}</span>
            </h1>
            <p className="hero__intro">{home.intro}</p>
            <div className="hero__actions">
              <Link href="/story" className="btn btn--ink">
                Her story
              </Link>
              <Link href="/work" className="btn btn--line">
                The work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Statement and facts: quiet, editorial ── */}
      <section className="shell statement" aria-labelledby="statement-h">
        <Reveal>
          <h2 id="statement-h" className="statement__text">
            <Patched text={home.statement} />
          </h2>
        </Reveal>
        <Reveal as="dl" className="facts" delay={0.1}>
          {home.facts.map((f) => (
            <div key={f.label} className="facts__row">
              <dt className="label">{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </Reveal>
      </section>

      {/* ── The practice: interactive material board ── */}
      <section className="practice" aria-labelledby="practice-h">
        <div className="shell">
          <Reveal className="section-head">
            <p className="label">The practice</p>
            <h2 id="practice-h" className="section-title">
              Six ways of <Patched text="[[making space]]" tone="sky" />
            </h2>
            <p className="section-dek">
              The range of The Scribble Lab, laid out as a material board. Choose a piece to bring it forward.
            </p>
          </Reveal>
          <MaterialBoard items={board} studioUrl={studio.url} />
        </div>
      </section>

      {/* ── The Scribble Lab: a dominant image with an overlapping text box ── */}
      <section className="feature shell" aria-labelledby="studio-h">
        <Reveal className="feature__image">
          <Figure slot="studio-feature" ratio="3/2" sizes="(min-width: 900px) 70vw, 100vw" />
        </Reveal>
        <Reveal className="feature__box" delay={0.12}>
          <p className="label">Founder · since {studio.since}</p>
          <h2 id="studio-h" className="feature__title">
            {studio.name}
          </h2>
          <p className="feature__lead">{studio.lead}</p>
          <p>{studio.body}</p>
          <a className="btn btn--ink" href={studio.url} target="_blank" rel="noopener noreferrer">
            Visit the studio ↗<span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </Reveal>
      </section>

      {/* ── What comes next ── */}
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

      {/* ── Beyond the work ── */}
      <section className="shell beyond" aria-labelledby="beyond-h">
        <Reveal className="section-head">
          <p className="label">Beyond the work</p>
          <h2 id="beyond-h" className="section-title">
            Travel, influences, <Patched text="[[conversations]]" tone="butter" />
          </h2>
        </Reveal>
        <div className="beyond__grid">
          <Reveal>
            <Link href="/journal" className="door door--journal">
              <span className="label">Journal</span>
              <span className="door__title">Stories and observations, in her words</span>
              <span className="door__arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </Reveal>
          <Reveal delay={0.08}>
            <Link href="/talks" className="door door--talks">
              <span className="label">Talks</span>
              <span className="door__title">Talks, panels and interviews</span>
              <span className="door__arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Closing: the note ── */}
      <section className="closing" aria-label="Contact">
        <ContactNote heading={contact.heading} intro={contact.intro} email={contact.email} channels={getChannels()} />
      </section>
    </>
  );
}
