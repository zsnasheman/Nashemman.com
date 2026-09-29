import Link from "next/link";
import { getJournal, getSite, getWork, renderMarkdown, formatDate } from "@/lib/content";
import HeroName from "@/components/HeroName";
import SketchPad from "@/components/SketchPad";
import InkLine from "@/components/InkLine";
import Reveal from "@/components/Reveal";
import Figure from "@/components/Figure";
import LineMark from "@/components/LineMark";

export default function Home() {
  const site = getSite();
  const { home } = site;
  const studio = getWork().find((w) => w.slug === "the-scribble-lab");
  const journal = getJournal().slice(0, 3);

  return (
    <div className="page-home">
      {/* ── Cover ─────────────────────────────── */}
      <section className="cover" aria-labelledby="cover-name">
        <SketchPad />
        <div className="shell cover__grid">
          <div className="cover__text">
            <p className="eyebrow cover__kicker">
              <span>{site.publication}</span>
              <span aria-hidden="true">·</span>
              <span>{site.issue}</span>
              <span aria-hidden="true">·</span>
              <span>{home.kicker}</span>
            </p>
            <div id="cover-name">
              <HeroName first={site.firstName} last={site.lastNames} />
            </div>
            <p className="cover__standfirst">{home.standfirst}</p>
            <div className="cover__actions">
              <Link href="/story" className="pill pill--solid">
                Read her story{" "}
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </Link>
              <Link href="/journal" className="pill">
                Open the journal
              </Link>
            </div>
          </div>
          <div className="cover__portrait">
            <Figure slot="portrait-hero" priority sizes="(min-width: 900px) 34vw, 90vw" />
            <p className="hand cover__note" aria-hidden="true">
              <svg viewBox="0 0 60 30" width="46" fill="none">
                <path
                  d="M2 26 C 18 24, 34 18, 52 6 M44 5 l9 0 l-3 9"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              {home.annotation}
            </p>
          </div>
        </div>
        <p className="cover__cue eyebrow" aria-hidden="true">
          <span className="cover__cue-line" /> Scroll, the line continues
        </p>
      </section>

      <div className="threaded">
        <InkLine seed={11} />

        {/* ── Profile ───────────────────────────── */}
        <section className="section shell profile" aria-labelledby="profile-h">
          <Reveal className="profile__head">
            <p className="eyebrow">The profile</p>
            <h2 id="profile-h" className="profile__title">
              {home.profileHeading.split(" ").slice(0, -1).join(" ")}{" "}
              <em>{home.profileHeading.split(" ").slice(-1)}</em>
            </h2>
            <LineMark className="profile__mark" />
          </Reveal>
          <Reveal delay={0.1} className="profile__body">
            <div className="prose prose--dropcap" dangerouslySetInnerHTML={{ __html: renderMarkdown(home.profile) }} />
            <Link href="/story" className="text-link" style={{ display: "inline-block", marginTop: "2rem" }}>
              The full story →
            </Link>
          </Reveal>
        </section>

        {/* ── Coordinates: selected visual stories ─ */}
        <section className="section shell coords" aria-labelledby="coords-h">
          <Reveal className="section-head">
            <h2 id="coords-h">
              Three <em>coordinates</em>
            </h2>
            <p className="page-intro__dek" style={{ maxWidth: "24rem" }}>
              A root, a place of practice, and a point still being plotted.
            </p>
          </Reveal>
          <ol className="coords__list">
            {home.coordinates.map((c, i) => (
              <Reveal as="li" key={c.label} delay={i * 0.12} className={`coords__item coords__item--${i + 1}`}>
                <Link href={c.href} className="coords__link" data-cursor="Read">
                  <Figure slot={c.media} sizes="(min-width: 900px) 30vw, 90vw" />
                  <span className="coords__meta">
                    <span className="num">0{i + 1}</span>
                    <span className="eyebrow">{c.label}</span>
                  </span>
                  <span className="coords__place">{c.place}</span>
                  <span className="coords__note">{c.note}</span>
                </Link>
              </Reveal>
            ))}
          </ol>
        </section>
      </div>

      {/* ── The Scribble Lab glimpse ──────────── */}
      {studio && (
        <section className="studio-band" aria-labelledby="studio-h">
          <div className="shell">
            <Reveal className="studio-band__head">
              <p className="eyebrow">A chapter · since {studio.since}</p>
              <h2 id="studio-h" className="studio-band__title">
                The Scribble <em>Lab</em>
              </h2>
              <p className="studio-band__dek">{studio.summary}</p>
            </Reveal>
            <ul className="disciplines" aria-label="What the studio works on">
              {studio.disciplines.map((d, i) => (
                <Reveal as="li" key={d} delay={i * 0.06}>
                  <span className="num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="disciplines__name">{d}</span>
                  <span className="disciplines__stroke" aria-hidden="true" />
                </Reveal>
              ))}
            </ul>
            <div className="studio-band__actions">
              <Link href="/work/the-scribble-lab" className="pill pill--light">
                The studio chapter{" "}
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </Link>
              {studio.url && (
                <a href={studio.url} className="pill pill--ghost-light" target="_blank" rel="noopener noreferrer">
                  Visit thescribblelab.com ↗<span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              )}
            </div>
          </div>
          <div className="marquee" aria-hidden="true">
            <div className="marquee__track">
              {[0, 1].map((k) => (
                <span key={k}>
                  {studio.disciplines.map((d) => (
                    <span key={d}>
                      {d} <em>✳</em>{" "}
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Journal ───────────────────────────── */}
      <section className="section shell home-journal" aria-labelledby="journal-h">
        <Reveal className="section-head">
          <h2 id="journal-h">
            From the <em>journal</em>
          </h2>
          <Link href="/journal" className="text-link">
            All entries →
          </Link>
        </Reveal>
        <ol className="entry-list">
          {journal.map((e, i) => (
            <Reveal as="li" key={e.slug} delay={i * 0.08}>
              <Link href={`/journal/${e.slug}`} className="entry-row" data-cursor="Read">
                <span className="entry-row__cat eyebrow">{e.category}</span>
                <span className="entry-row__title">
                  {e.title} {e.status === "draft" && <span className="draft-badge">Draft</span>}
                </span>
                <span className="entry-row__date num">{formatDate(e.date)}</span>
              </Link>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ── Connect invitation ────────────────── */}
      <section className="shell invite" aria-labelledby="invite-h">
        <Reveal>
          <p className="eyebrow">Talks · collaborations · conversations</p>
          <h2 id="invite-h" className="invite__title">
            <Link href="/connect" data-cursor="Write">
              Start a <em>conversation</em> <span aria-hidden="true">→</span>
            </Link>
          </h2>
        </Reveal>
      </section>
    </div>
  );
}
