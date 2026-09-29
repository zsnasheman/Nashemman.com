# For review: facts, sources and boundaries

Nashemman's own account takes priority. This file records what is confirmed, what is deliberately left out, and where the illustration is conceptual.

## 1. Spelling of her name ⚠️
- **Site uses:** Nashemman Sahiba Zargar (as supplied).
- **Public sources use:** "Nasheman" (one *m*) on the studio's About page, LinkedIn and directory listings.
- **Decide** which spelling this site should use. Changing it is one edit in `content/site.yml` plus a search across `content/`.

## 2. LinkedIn: hidden until confirmed ⚠️
- **Supplied:** `linkedin.com/in/nasheman-sahiba-zargar/`
- **A search result shows:** `linkedin.com/in/nasheman-sahhiba-zargar/` (double *h*). A separate `linkedin.com/in/nasheman-zargar/` also exists.
- LinkedIn is blocked from the build environment, so neither could be opened.
- The channel is set to `verified: false` in `content/site.yml`, so it is **not shown on the live site**. Once someone has opened the right link by hand, correct the URL if needed and set `verified: true`.

## 3. Employment history
- **Supplied:** about five years at companies including XBD, Swiss Bureau and DLR Group.
- **Studio About page (search summary):** "XBD Collective, Swiss Bureau Interior Design & Ellington Properties Design". It does not mention DLR Group.
- **Site uses** only the supplied names, with no titles or dates.

## 4. The landing sketch: conceptual, not biographical
- **Left (roots):** Kashmir-inspired forms (a tiered wooden roof, a chinar tree and leaf, latticework). She is from Kashmir: a confirmed fact.
- **Middle (practice):** Dubai forms (a low wall and wind tower, towers, a sail form, a ring). She studied at Amity University Dubai and the studio is Dubai-based (public descriptions of the studio).
- **Right (future):** dotted, unlabelled hints of architecture associated with Riyadh (strongest: a crenellated mud-brick wall and a tall tower with an opening at its crown), then sails by water, a bullet-shaped tower and a flat-roofed cube.
  - These represent **future directions only**. They carry no labels, pins, dates or claims, and no text says she has lived, worked or completed projects in those places.
  - The screen-reader description says only "continue as a dotted line into an open horizon".

## 5. Board imagery
The six board tiles are **illustrated material studies**, labelled "Material study", with a note under the board saying they are not project photographs. A tile switches to "Project" only when an approved photograph is added to its slot.

## 6. Left out until confirmed
- Title "Chief Designer"; "fine arts background"; a 2011 poster design prize
- Client and project names
- Degree subject
- Any memories, motivations, trips, hobbies, talks or quotations
- Any TED or TEDx claim (the content check blocks one without an official link)

## 7. References
The three design references (designbyroar.com/about, picco-template.framer.website, avyron-pro.framer.website) could **not be opened from the build environment**, because its network policy blocks them. The design follows the written brief's description of each reference: an illustrated setting with shaped colour fields and clouds; a closing contact moment; a stack that fans open. No assets, layouts, code or animations were taken from any of them. The "reference image" mentioned in the brief (a dominant image with an overlapping text box, and a project/material board) was not attached, so those compositions follow the written description.
