# Nashemman Sahiba Zargar

The personal website of Nashemman Sahiba Zargar: an art-directed portrait of a designer, founder and entrepreneur, written about her in the third person.

Built with **Next.js (Node.js)** and deployed on **Vercel**. There is no database: every word, link and image on the site is in the `content/` folder.

---

## Run it locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev          # http://localhost:3000 (shows drafts and "For Nashemman" notes)
```

To see exactly what the live site will show (drafts hidden):

```bash
npm run build
npm start            # http://localhost:3000
```

## Checks

| Command | What it does |
|---|---|
| `npm run typecheck` | TypeScript check |
| `npm run check:content` | Validates `content/`: required fields, media slots, alt text, talk verification, the TED/TEDx rule |
| `npm run check:site` | With `npm start` running: crawls every page, checks internal links and anchors, runs axe accessibility checks, catches console errors, mobile overflow and small tap targets, verifies nothing is hidden under reduced motion, checks the 404 page, and saves desktop and mobile screenshots to `check-output/` |

`check:site` needs a Chromium browser. Set `CHROMIUM_PATH` if it can't find one (`npx playwright install chromium` provides one).

---

## Editing the site (no code needed)

| To change… | Edit |
|---|---|
| Name, home page text, statement, facts, The Scribble Lab, the venture, the six board disciplines, navigation, contact channels, email | `content/site.yml` |
| The Story page | `content/story.md` (each `## ` heading is a chapter; add `| roots`, `| practice`, `| future` or `| board` to make it image-led) |
| Project stories (future) | `content/work/_project-story-template.md` |
| Journal entries | `content/journal/*.md` (one file per entry) |
| Talks & appearances | `content/talks/*.md` (one file per talk) |
| Photos and video | `content/media.yml` + files in `public/media/` |

### Drafts
Every entry has `status: "draft"` or `status: "published"`.
- **Drafts** appear only on the local preview (`npm run dev`), marked with a red **Draft** badge. They are never built into the live site or Vercel previews.
- Notes written as `<aside class="draft-note"> … </aside>` inside any Markdown file are also local-only. Use them for questions and reminders.

### Writing a journal entry
Copy `content/journal/travel-story-draft.md`, rename it (the file name becomes the web address), fill in the front matter and write in Markdown. Set `status: "published"` once Nashemman has approved it.

### Adding a talk
Copy `content/talks/_talk-template.md`. A talk is shown only when **all three** are true: `status: "published"`, `verified: true`, and `url` links to the recording or event page. `check:content` refuses any talk labelled TED or TEDx that has no verified official link. While there are no approved talks, the Talks page shows an invitation instead of empty cards.

### Replacing a placeholder image
1. Put the file in `public/media/` (for example `public/media/portrait.jpg`).
2. In `content/media.yml`, find the slot (for example `portrait-hero`) and set `src: "/media/portrait.jpg"`, a real `alt` description, and the `credit`.
3. Run `npm run check:content`.

Only use images you have the rights to. See `ASSETS.md` for the prioritised list.

### Contact channels
Each channel in `content/site.yml` has `verified: true/false`. Only verified channels appear on the live site; all of them show on the local preview. Set `contact.email` only to an address Nashemman has supplied.

### Colour patches
In `home.statement` (and the page titles), wrap words in `[[double brackets]]` to place a colour patch behind them. Use one or two per heading at most.

### The landing sketch
The drawing is data in `components/sketch/scene.ts`: one continuous line (roots → practice), colour fields, details, clouds, and dotted, unlabelled future forms. Keep the future forms unlabelled.

## Design system
- **Type:** Bricolage Grotesque (display, set condensed and heavy), Instrument Sans (text and interface), DM Mono (labels). See `docs/review/type-specimen.png`.
- **Colour:** paper and ink, plus three fields: apricot (roots, warmth), sky (practice), butter (what's next, highlights). Chinar red is reserved for small marks in drawings.
- **Motion:** the landing sketch draws once, the board gathers and spreads once, the contact note opens once. Clouds drift slowly. Everything is static under `prefers-reduced-motion`, and nothing is hidden without JavaScript.

---

## Deployment status

- **Vercel project:** `nashemman` (Hobby), connected to this repository via Git integration.
- **Production branch:** `main`. Deploys to the project's `*.vercel.app` address only; no custom domain is attached.
- **Working branch:** `claude/great-gates-j9e9us`. Every push creates a **preview** deployment with its own URL.
- Nothing merges into `main` until the site is approved.

## Deploying on Vercel (free Hobby plan)

1. Sign in at vercel.com with GitHub → **Add New… → Project** → import `zsnasheman/Nashemman.com`.
2. Framework preset: **Next.js**. No settings or environment variables are needed.
3. Under **Settings → Git**, make sure the **Production Branch** is `main`. Every other branch deploys as a **Preview** URL. Whether a preview needs a login is set under **Settings → Deployment Protection**; `noindex` does not make it private.
4. Optional: set `NEXT_PUBLIC_SITE_URL` (for example `https://nashemman.com`) once a domain is attached, so the sitemap and social previews use it.

Preview deployments are set to `noindex` automatically (see `app/robots.ts`).

## Project structure

```
app/          pages (one folder per section), global styles
components/   sketch/ (landing drawing), board/ (material board), contact/ (closing note), figures
content/      ALL editable copy, entries and media slots
lib/          content loader (Markdown + YAML → pages)
public/media/ images and video
scripts/      content and site checks
```

See also: `SOURCES.md` (research log), `ASSETS.md` (what's needed from Nashemman), `REVIEW.md` (facts to confirm).
