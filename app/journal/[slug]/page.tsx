import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJournal, formatDate } from "@/lib/content";
import Figure from "@/components/Figure";
import InkLine from "@/components/InkLine";
import ReadingProgress from "@/components/ReadingProgress";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getJournal().map((e) => ({ slug: e.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const e = getJournal().find((x) => x.slug === slug);
  return e ? { title: e.title, description: e.excerpt } : {};
}

export default async function JournalEntryPage({ params }: Params) {
  const { slug } = await params;
  const all = getJournal();
  const idx = all.findIndex((e) => e.slug === slug);
  if (idx < 0) notFound();
  const e = all[idx];
  const newer = all[idx - 1];
  const older = all[idx + 1];

  return (
    <article className="threaded article">
      <ReadingProgress />
      <InkLine seed={idx + 21} />
      <header className="shell article__head">
        <p className="eyebrow">
          <Link href="/journal">03 · Journal</Link> / {e.category}
        </p>
        {e.status === "draft" && (
          <p>
            <span className="draft-badge">Draft · local preview only · not published</span>
          </p>
        )}
        <h1 className="article__title">{e.title}</h1>
        <p className="article__dek">{e.excerpt}</p>
        <p className="article__meta">
          <time dateTime={e.date}>{formatDate(e.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{e.readingMinutes} min read</span>
        </p>
      </header>

      <div className="shell article__cover">
        <Figure slot={e.cover} ratio="16/9" sizes="92vw" priority />
      </div>

      <div className="shell article__body">
        <div className="prose prose--dropcap" dangerouslySetInnerHTML={{ __html: e.html }} />
      </div>

      <nav className="shell article__pager" aria-label="More from the journal">
        {older ? (
          <Link href={`/journal/${older.slug}`} className="pager-link" data-cursor="Older">
            <span className="eyebrow">← Older</span>
            <span className="pager-link__title">{older.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {newer ? (
          <Link href={`/journal/${newer.slug}`} className="pager-link pager-link--right" data-cursor="Newer">
            <span className="eyebrow">Newer →</span>
            <span className="pager-link__title">{newer.title}</span>
          </Link>
        ) : (
          <Link href="/journal" className="pager-link pager-link--right">
            <span className="eyebrow">All entries →</span>
            <span className="pager-link__title">Back to the journal</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
