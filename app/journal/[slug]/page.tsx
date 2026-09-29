import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJournal, formatDate } from "@/lib/content";
import Figure from "@/components/Figure";
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
  const older = all[idx + 1];

  return (
    <article className="article">
      <ReadingProgress />
      <header className="shell article__head">
        <p className="label">
          <Link href="/journal">Journal</Link> · {e.category}
          {e.status === "draft" ? <span className="draft-badge">Draft · local preview only</span> : null}
        </p>
        <h1 className="page-title">{e.title}</h1>
        <p className="page-dek">{e.excerpt}</p>
        <p className="label">
          <time dateTime={e.date}>{formatDate(e.date)}</time> · {e.readingMinutes} min read
        </p>
      </header>
      <div className="shell">
        <Figure slot={e.cover} ratio="16/9" sizes="92vw" priority />
      </div>
      <div className="shell article__body">
        <div className="prose" dangerouslySetInnerHTML={{ __html: e.html }} />
      </div>
      <nav className="shell article__pager" aria-label="More from the journal">
        {older ? (
          <Link href={`/journal/${older.slug}`} className="btn btn--line">
            Next: {older.title}
          </Link>
        ) : null}
        <Link href="/journal" className="btn btn--ink">
          All entries
        </Link>
      </nav>
    </article>
  );
}
