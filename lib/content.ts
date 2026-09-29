import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { load as loadYaml } from "js-yaml";
import { Marked } from "marked";

/**
 * Content layer. Everything editable lives in /content as Markdown or YAML;
 * pages only ever call the functions below.
 *
 * Draft entries (status: "draft") and <aside class="draft-note"> blocks are
 * visible on the local dev server only. A production build (including
 * Vercel previews) never includes them, unless SHOW_DRAFTS=1 is set.
 */

const ROOT = path.join(process.cwd(), "content");
export const SHOW_DRAFTS = process.env.NODE_ENV !== "production" || process.env.SHOW_DRAFTS === "1";

/* ── Types ─────────────────────────────────────────────── */

export type NavItem = { href: string; label: string };
export type Channel = { label: string; description: string; url: string; verified?: boolean };
export type Fact = { label: string; value: string };
export type BoardEntry = { id: string; title: string; blurb: string; media?: string };

export type Site = {
  name: string;
  firstName: string;
  lastNames: string;
  monogram: string;
  description: string;
  home: { kicker: string; intro: string; statement: string; facts: Fact[] };
  studio: { name: string; since: string; url: string; lead: string; body: string };
  venture: { label: string; title: string; body: string };
  board: BoardEntry[];
  nav: NavItem[];
  channels: Channel[];
  contact: { email: string; heading: string; intro: string };
};

export type MediaSlot = {
  id: string;
  label: string;
  brief: string;
  priority: number;
  ratio: string;
  type?: "image" | "video";
  src: string;
  poster?: string;
  alt: string;
  credit: string;
};

type Status = "published" | "draft";

export type JournalEntry = {
  slug: string;
  title: string;
  category: string;
  date: string;
  status: Status;
  cover?: string;
  excerpt: string;
  html: string;
  readingMinutes: number;
};

export type Talk = {
  slug: string;
  title: string;
  event: string;
  date: string;
  format: string;
  location?: string;
  url?: string;
  verified: boolean;
  status: Status;
  summary: string;
  html: string;
};

export type StoryChapter = { id: string; title: string; place: string; visual?: string; html: string };

/* ── Markdown ──────────────────────────────────────────── */

const marked = new Marked({
  gfm: true,
  renderer: {
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const external = /^https?:\/\//.test(href);
      const t = title ? ` title="${title}"` : "";
      return external
        ? `<a href="${href}"${t} target="_blank" rel="noopener noreferrer">${text}<span class="visually-hidden"> (opens in a new tab)</span></a>`
        : `<a href="${href}"${t}>${text}</a>`;
    },
  },
});

function prepare(md: string): string {
  let out = md.replace(/<!--[\s\S]*?-->/g, "");
  if (!SHOW_DRAFTS) out = out.replace(/<aside class="draft-note">[\s\S]*?<\/aside>/g, "");
  return out;
}

export function renderMarkdown(md: string): string {
  return marked.parse(prepare(md), { async: false }) as string;
}

function readingMinutes(md: string) {
  return Math.max(1, Math.round(md.split(/\s+/).filter(Boolean).length / 220));
}

/* ── Loaders ───────────────────────────────────────────── */

function readYaml<T>(file: string): T {
  return loadYaml(fs.readFileSync(path.join(ROOT, file), "utf8")) as T;
}

function readCollection(dir: string) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(full, f), "utf8"));
      const slug = f.replace(/\.md$/, "").replace(/^_/, "");
      return { slug, data: data as Record<string, unknown>, content };
    });
}

const visible = (status: unknown) => status === "published" || (SHOW_DRAFTS && status === "draft");
const str = (v: unknown, fallback = "") => (v == null ? fallback : String(v));
const dateStr = (v: unknown) => (v instanceof Date ? v.toISOString().slice(0, 10) : str(v));

let siteCache: Site | undefined;
export function getSite(): Site {
  return (siteCache ??= readYaml<Site>("site.yml"));
}

let mediaCache: Record<string, MediaSlot> | undefined;
export function getMedia(): Record<string, MediaSlot> {
  if (!mediaCache) {
    const raw = readYaml<Record<string, Omit<MediaSlot, "id">>>("media.yml");
    mediaCache = Object.fromEntries(
      Object.entries(raw).map(([id, m]) => [
        id,
        { id, ...m, src: m.src ?? "", alt: m.alt ?? "", credit: m.credit ?? "" },
      ]),
    );
  }
  return mediaCache;
}

export function getMediaSlot(id?: string): MediaSlot | undefined {
  return id ? getMedia()[id] : undefined;
}

export function getJournal(): JournalEntry[] {
  return readCollection("journal")
    .filter((e) => visible(e.data.status))
    .map(({ slug, data, content }) => ({
      slug,
      title: str(data.title),
      category: str(data.category, "Journal"),
      date: dateStr(data.date),
      status: data.status as Status,
      cover: data.cover ? str(data.cover) : undefined,
      excerpt: str(data.excerpt),
      html: renderMarkdown(content),
      readingMinutes: readingMinutes(content),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** A talk is publishable only when it is approved, verified and linked. */
export function isPublishableTalk(t: Pick<Talk, "status" | "verified" | "url">) {
  return t.status === "published" && t.verified && !!t.url;
}

export function getTalks(): Talk[] {
  return readCollection("talks")
    .map(({ slug, data, content }) => ({
      slug,
      title: str(data.title),
      event: str(data.event),
      date: dateStr(data.date),
      format: str(data.format, "Talk"),
      location: data.location ? str(data.location) : undefined,
      url: data.url ? str(data.url) : undefined,
      verified: data.verified === true,
      status: data.status as Status,
      summary: str(data.summary),
      html: renderMarkdown(content),
    }))
    .filter((t) => isPublishableTalk(t) || (SHOW_DRAFTS && t.status === "draft"))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getStory() {
  const { data, content } = matter(fs.readFileSync(path.join(ROOT, "story.md"), "utf8"));
  const body = content.replace(/<!--[\s\S]*?-->/g, "");
  const chapters: StoryChapter[] = body
    .split(/^## /m)
    .slice(1)
    .map((block) => {
      const nl = block.indexOf("\n");
      const heading = block.slice(0, nl).trim();
      const m = heading.match(/^(.*?)\s*\{#([\w-]+)\s*\|\s*([^|}]*?)\s*(?:\|\s*([\w-]+)\s*)?\}\s*$/);
      const title = m ? m[1] : heading;
      return {
        id: m ? m[2] : title.toLowerCase().replace(/\W+/g, "-"),
        title,
        place: m ? m[3] : "",
        visual: m?.[4],
        html: renderMarkdown(block.slice(nl + 1)),
      };
    });
  return { title: str(data.title), dek: str(data.dek), portrait: str(data.portrait), chapters };
}

export function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

/** Channels safe to show publicly: verified ones (all of them on the local preview). */
export function getChannels(): Channel[] {
  return getSite().channels.filter((c) => c.verified || SHOW_DRAFTS);
}

/** Splits "text [[patched]] text" into parts for colour-patch rendering. */
export function splitPatches(text: string): { text: string; patch: boolean }[] {
  return text
    .split(/(\[\[.*?\]\])/)
    .filter(Boolean)
    .map((t) => (t.startsWith("[[") ? { text: t.slice(2, -2), patch: true } : { text: t, patch: false }));
}
