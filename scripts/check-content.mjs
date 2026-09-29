// Content check: validates the Markdown/YAML in /content before publishing.
//   npm run check:content
// Fails on missing required fields, unknown media slots, unverified talks
// marked as published, and any "TED"/"TEDx" label without a verified link.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { load } from "js-yaml";

const ROOT = path.join(process.cwd(), "content");
const errors = [];
const warnings = [];

const media = load(fs.readFileSync(path.join(ROOT, "media.yml"), "utf8"));
const site = load(fs.readFileSync(path.join(ROOT, "site.yml"), "utf8"));

const checkSlot = (where, id) => {
  if (id && !media[id]) errors.push(`${where}: media slot "${id}" is not defined in content/media.yml`);
};

for (const [id, m] of Object.entries(media)) {
  if (m.src && !m.alt) errors.push(`media.yml ${id}: has a file but no alt text`);
  if (m.src && m.src.startsWith("/media/") && !fs.existsSync(path.join("public", m.src)))
    errors.push(`media.yml ${id}: file public${m.src} not found`);
  if (m.src && !m.credit) warnings.push(`media.yml ${id}: no credit recorded`);
}
site.board.forEach((b) => checkSlot("site.yml board", b.media));
for (const c of site.channels) if (c.verified !== true && c.verified !== false) errors.push(`site.yml channel ${c.label}: set verified: true or false`);

const collection = (dir, required) =>
  fs
    .readdirSync(path.join(ROOT, dir))
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const { data } = matter(fs.readFileSync(path.join(ROOT, dir, f), "utf8"));
      const where = `${dir}/${f}`;
      if (!["published", "draft"].includes(data.status)) errors.push(`${where}: status must be "published" or "draft"`);
      for (const k of required) if (!data[k]) errors.push(`${where}: missing "${k}"`);
      checkSlot(where, data.cover);
      (data.gallery ?? []).forEach((g) => checkSlot(where, g));
      return { where, data };
    });

collection("journal", ["title", "date", "category", "excerpt"]);
collection("work", ["title", "kind", "summary"]);
for (const { where, data } of collection("talks", ["title", "event", "date"])) {
  const ted = /\bTED(x)?\b/i.test(`${data.title} ${data.event}`);
  if (data.status === "published" && (!data.verified || !data.url))
    errors.push(`${where}: published talks need verified: true and a url`);
  if (ted && (!data.verified || !/ted\.com|youtube\.com|youtu\.be/.test(data.url ?? "")))
    errors.push(`${where}: TED/TEDx label without a verified official link`);
}

warnings.forEach((w) => console.log(`! ${w}`));
if (errors.length) {
  console.log(`\n✗ ${errors.length} content error(s):\n  ${errors.join("\n  ")}`);
  process.exit(1);
}
const empty = Object.values(media).filter((m) => !m.src).length;
console.log(`✓ Content OK. ${empty} of ${Object.keys(media).length} media slots still use placeholders.`);
