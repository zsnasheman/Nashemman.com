import type { Metadata } from "next";
import Link from "next/link";
import { getJournal, formatDate } from "@/lib/content";
import Reveal from "@/components/Reveal";
import Figure from "@/components/Figure";
import InkLine from "@/components/InkLine";

export const metadata: Metadata = {
  title: "Journal",
  description: "Travel stories, process notes, observations and ideas.",
};

export default function JournalPage() {
  const entries = getJournal();
  const [lead, ...rest] = entries;
  const categories = ["Travel", "Process", "Observations", "Ideas"];

  return (
    <div className="threaded">
      <InkLine seed={9} />
      <header className="shell page-intro">
        <p className="eyebrow">03 · Journal</p>
        <h1 className="page-intro__title">
          In the <em>margins</em>
        </h1>
        <p className="page-intro__dek">
          Travel, process, observations and ideas: the parts of a creative life that don&apos;t fit on a project sheet.
        </p>
        <ul className="tag-list" aria-label="What the journal will hold">
          {categories.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </header>

      {lead && (
        <section className="shell" aria-label="Latest entry">
          <Reveal>
            <Link href={`/journal/${lead.slug}`} className="lead-entry" data-cursor="Read">
              <Figure slot={lead.cover} ratio="16/10" sizes="(min-width: 900px) 58vw, 92vw" />
              <div className="lead-entry__text">
                <p className="venture__meta">
                  <span className="eyebrow">{lead.category}</span>
                  <span className="eyebrow">{formatDate(lead.date)}</span>
                  {lead.status === "draft" && <span className="draft-badge">Draft</span>}
                </p>
                <h2 className="lead-entry__title">{lead.title}</h2>
                <p className="venture__summary">{lead.excerpt}</p>
                <span className="text-link">Read · {lead.readingMinutes} min</span>
              </div>
            </Link>
          </Reveal>
        </section>
      )}

      {rest.length > 0 && (
        <section className="shell section" aria-label="More entries">
          <ol className="entry-grid">
            {rest.map((e, i) => (
              <Reveal as="li" key={e.slug} delay={i * 0.08}>
                <Link href={`/journal/${e.slug}`} className="entry-card" data-cursor="Read">
                  <Figure slot={e.cover} ratio="4/3" sizes="(min-width: 900px) 30vw, 92vw" />
                  <p className="venture__meta">
                    <span className="eyebrow">{e.category}</span>
                    {e.status === "draft" && <span className="draft-badge">Draft</span>}
                  </p>
                  <h2 className="entry-card__title">{e.title}</h2>
                  <p className="entry-card__excerpt">{e.excerpt}</p>
                </Link>
              </Reveal>
            ))}
          </ol>
        </section>
      )}

      <section className="shell future-note" aria-label="More to come">
        <p className="future-note__text">
          New entries appear here as Nashemman writes them. <span className="hand">the page is open</span>
        </p>
      </section>
    </div>
  );
}
