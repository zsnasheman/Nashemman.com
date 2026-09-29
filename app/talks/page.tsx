import type { Metadata } from "next";
import Link from "next/link";
import { getTalks, formatDate, isPublishableTalk } from "@/lib/content";
import Reveal from "@/components/Reveal";
import InkLine from "@/components/InkLine";

export const metadata: Metadata = {
  title: "Talks & Appearances",
  description: "Talks, interviews, panels and video. Verified entries only.",
};

export default function TalksPage() {
  const talks = getTalks();
  const published = talks.filter(isPublishableTalk);
  const drafts = talks.filter((t) => !isPublishableTalk(t));

  return (
    <div className="threaded">
      <InkLine seed={17} />
      <header className="shell page-intro">
        <p className="eyebrow">04 · Talks &amp; Appearances</p>
        <h1 className="page-intro__title">
          On the <em>record</em>
        </h1>
        <p className="page-intro__dek">Talks, interviews, panels and video. Every entry here links to its source.</p>
      </header>

      {published.length > 0 ? (
        <ol className="shell talk-list">
          {published.map((t, i) => (
            <Reveal as="li" key={t.slug} delay={i * 0.06} className="talk">
              <p className="num talk__date">{formatDate(t.date)}</p>
              <div>
                <p className="eyebrow">
                  {t.format} · {t.event}
                  {t.location ? ` · ${t.location}` : ""}
                </p>
                <h2 className="talk__title">{t.title}</h2>
                <p>{t.summary}</p>
              </div>
              <a href={t.url} className="pill" target="_blank" rel="noopener noreferrer">
                Watch / read ↗<span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </Reveal>
          ))}
        </ol>
      ) : (
        <section className="shell talks-empty" aria-labelledby="talks-empty-h">
          <Reveal className="talks-empty__stage">
            <div className="talks-empty__mic" aria-hidden="true">
              <svg viewBox="0 0 200 200" fill="none">
                <circle cx="100" cy="100" r="92" stroke="currentColor" strokeDasharray="3 7" />
                <circle className="talks-empty__pulse" cx="100" cy="100" r="60" stroke="var(--chinar)" />
                <rect x="84" y="52" width="32" height="62" rx="16" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M70 100 a30 30 0 0 0 60 0 M100 130 v18 M84 148 h32"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <h2 id="talks-empty-h" className="talks-empty__title">
                The stage is <em>set</em>.
              </h2>
              <p className="talks-empty__text">
                No appearances are listed yet. This page is reserved for talks, interviews and panels, and each one will
                appear with a link to the recording or event.
              </p>
              <Link href="/connect" className="pill pill--solid">
                Invite Nashemman to speak{" "}
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </Reveal>
        </section>
      )}

      {drafts.length > 0 && (
        <section className="shell drafts-panel" aria-label="Draft entries (local preview only)">
          <p className="draft-badge">Local preview only: unverified entries</p>
          <ul>
            {drafts.map((t) => (
              <li key={t.slug}>
                <strong>{t.title}</strong> · {t.event} · verified: {String(t.verified)} · link: {t.url || "none"}
                <br />
                <span style={{ color: "var(--ink-soft)" }}>{t.summary}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
