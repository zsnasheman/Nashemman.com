import type { Metadata } from "next";
import Link from "next/link";
import { getTalks, formatDate, isPublishableTalk } from "@/lib/content";
import Reveal from "@/components/Reveal";
import Patched from "@/components/Patched";

export const metadata: Metadata = {
  title: "Talks",
  description: "Talks, panels, interviews and video, each linked to its source.",
};

export default function TalksPage() {
  const talks = getTalks();
  const published = talks.filter(isPublishableTalk);
  const drafts = talks.filter((t) => !isPublishableTalk(t));

  return (
    <>
      <header className="shell page-head">
        <p className="label">Talks</p>
        <h1 className="page-title">
          Talks &amp; <Patched text="[[conversations]]" tone="sky" />
        </h1>
        <p className="page-dek">Talks, panels, interviews and video. Each one links to its official source.</p>
      </header>

      {published.length > 0 ? (
        <ol className="shell talks">
          {published.map((t, i) => (
            <Reveal as="li" key={t.slug} delay={i * 0.06} className="talk">
              <p className="label">{formatDate(t.date)}</p>
              <div>
                <p className="label">
                  {t.format} · {t.event}
                  {t.location ? ` · ${t.location}` : ""}
                </p>
                <h2 className="talk__title">{t.title}</h2>
                <p>{t.summary}</p>
              </div>
              <a href={t.url} className="btn btn--line" target="_blank" rel="noopener noreferrer">
                Watch or read ↗<span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </Reveal>
          ))}
        </ol>
      ) : (
        <section className="shell empty empty--talks" aria-label="No appearances listed yet">
          <div className="stage" aria-hidden="true">
            <span className="stage__light" />
            <span className="stage__floor" />
            <span className="stage__chair stage__chair--a" />
            <span className="stage__chair stage__chair--b" />
          </div>
          <div>
            <p className="empty__text">No appearances are listed yet.</p>
            <Link href="/connect" className="btn btn--ink">
              Invite Nashemman to speak
            </Link>
          </div>
        </section>
      )}

      {drafts.length > 0 && (
        <section className="shell drafts-panel" aria-label="Unverified entries (local preview only)">
          <p className="draft-badge">Local preview only: unverified</p>
          <ul>
            {drafts.map((t) => (
              <li key={t.slug}>
                <strong>{t.title}</strong> · {t.event} · verified: {String(t.verified)} · link: {t.url || "none"}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
