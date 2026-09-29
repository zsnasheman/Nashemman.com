import type { Metadata } from "next";
import Link from "next/link";
import { getJournal, formatDate } from "@/lib/content";
import Reveal from "@/components/Reveal";
import Patched from "@/components/Patched";
import Figure from "@/components/Figure";

export const metadata: Metadata = {
  title: "Journal",
  description: "Travel stories, creative influences, conversations and observations.",
};

const SHELVES = ["Travel", "Influences", "Conversations", "Observations"];

export default function JournalPage() {
  const entries = getJournal();

  return (
    <>
      <header className="shell page-head">
        <p className="label">Journal</p>
        <h1 className="page-title">
          In her <Patched text="[[own words]]" tone="butter" />
        </h1>
        <p className="page-dek">Travel stories, creative influences, conversations and observations.</p>
      </header>

      {entries.length > 0 ? (
        <section className="shell" aria-label="Entries">
          <ol className="entries">
            {entries.map((e, i) => (
              <Reveal as="li" key={e.slug} delay={i * 0.06}>
                <Link href={`/journal/${e.slug}`} className="entry">
                  <Figure slot={e.cover} ratio="4/3" sizes="(min-width: 900px) 30vw, 92vw" />
                  <span className="entry__meta label">
                    {e.category} · {formatDate(e.date)}
                    {e.status === "draft" ? <span className="draft-badge">Draft</span> : null}
                  </span>
                  <span className="entry__title">{e.title}</span>
                  <span className="entry__excerpt">{e.excerpt}</span>
                </Link>
              </Reveal>
            ))}
          </ol>
        </section>
      ) : (
        <section className="shell empty" aria-label="No entries yet">
          <ul className="shelves" aria-label="Sections of the journal">
            {SHELVES.map((s, i) => (
              <li key={s} className={`shelf shelf--${i}`}>
                <span className="shelf__name">{s}</span>
              </li>
            ))}
          </ul>
          <p className="empty__text">The first entries are in preparation.</p>
        </section>
      )}
    </>
  );
}
