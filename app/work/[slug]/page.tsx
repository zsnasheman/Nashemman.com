import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getWork } from "@/lib/content";
import Reveal from "@/components/Reveal";
import Figure from "@/components/Figure";
import InkLine from "@/components/InkLine";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getWork().map((w) => ({ slug: w.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const w = getWork().find((x) => x.slug === slug);
  return w ? { title: w.title, description: w.summary } : {};
}

export default async function WorkEntryPage({ params }: Params) {
  const { slug } = await params;
  const all = getWork();
  const idx = all.findIndex((w) => w.slug === slug);
  if (idx < 0) notFound();
  const w = all[idx];
  const next = all[(idx + 1) % all.length];

  return (
    <article className="threaded">
      <InkLine seed={idx + 13} />
      <header className="shell page-intro">
        <p className="eyebrow">
          <Link href="/work">02 · Work &amp; Ventures</Link> / {w.kind}
        </p>
        <h1 className="page-intro__title">{w.title}</h1>
        <p className="venture__meta" style={{ marginTop: "0.5rem" }}>
          <span className="eyebrow">{w.kind}</span>
          <span className="eyebrow venture__since">{w.since}</span>
          {w.status === "draft" && <span className="draft-badge">Draft · local preview only</span>}
        </p>
        <p className="page-intro__dek">{w.summary}</p>
      </header>

      <div className="shell">
        <Reveal>
          <Figure slot={w.cover} ratio="16/9" sizes="92vw" priority />
        </Reveal>
      </div>

      <div className="shell work-body">
        <Reveal className="prose prose--dropcap">
          <div dangerouslySetInnerHTML={{ __html: w.html }} />
        </Reveal>
        <aside className="work-body__side">
          {w.disciplines.length > 0 && (
            <>
              <p className="eyebrow">Works across</p>
              <ul className="tag-list">
                {w.disciplines.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </>
          )}
          {w.url && (
            <a href={w.url} className="pill pill--solid" target="_blank" rel="noopener noreferrer">
              Visit the studio ↗<span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          )}
        </aside>
      </div>

      {w.gallery.length > 0 && (
        <section className="shell gallery" aria-label={`${w.title}: images`}>
          {w.gallery.map((g, i) => (
            <Reveal key={g} delay={i * 0.1} className={`gallery__item gallery__item--${i + 1}`}>
              <Figure slot={g} sizes="(min-width: 900px) 33vw, 92vw" />
            </Reveal>
          ))}
        </section>
      )}

      {next && next.slug !== w.slug && (
        <nav className="shell next-link" aria-label="Next chapter">
          <p className="eyebrow">Next</p>
          <Link href={`/work/${next.slug}`} data-cursor="Next">
            {next.title} <span aria-hidden="true">→</span>
          </Link>
        </nav>
      )}
    </article>
  );
}
