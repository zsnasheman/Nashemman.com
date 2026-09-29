// Site check: crawls a running site, checks every internal link, runs axe
// accessibility checks, looks for horizontal overflow on mobile and console
// errors, and saves desktop + mobile screenshots.
//
//   npm run build && npm start          (in one terminal)
//   npm run check:site                  (in another)
//
// Options (env): BASE_URL (default http://localhost:3000),
//                CHROMIUM_PATH (defaults to the Playwright browser if found),
//                OUT_DIR (default ./check-output)

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";
import { AxeBuilder } from "@axe-core/playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = process.env.OUT_DIR ?? "check-output";
const guess = ["/opt/pw-browsers/chromium-1194/chrome-linux/chrome", "/opt/pw-browsers/chromium/chrome-linux/chrome"];
const executablePath = process.env.CHROMIUM_PATH ?? guess.find((p) => fs.existsSync(p));

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath });
const viewports = {
  desktop: { viewport: { width: 1440, height: 900 } },
  mobile: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
};

const seen = new Set(["/"]);
const queue = ["/"];
const external = new Set();
const problems = [];
const report = [];

const ctx = await browser.newContext({ viewport: viewports.desktop.viewport });
while (queue.length) {
  const route = queue.shift();
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  const res = await page.goto(BASE + route, { waitUntil: "networkidle" });
  const status = res?.status() ?? 0;
  if (status >= 400) problems.push(`${route} → HTTP ${status}`);

  const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")));
  for (const h of hrefs) {
    if (!h) continue;
    if (/^https?:/.test(h)) external.add(h);
    else if (h.startsWith("/") && !h.startsWith("//")) {
      const clean = h.split("#")[0] || "/";
      if (!seen.has(clean)) {
        seen.add(clean);
        queue.push(clean);
      }
    }
  }

  // Fragment links must point at an element on the target page.
  const frags = hrefs.filter((h) => h && h.startsWith("#") && h.length > 1);
  for (const f of frags) {
    const exists = await page.$(`[id="${f.slice(1)}"]`);
    if (!exists) problems.push(`${route}: missing anchor ${f}`);
  }

  // Reduced motion off: scroll through so reveals run before the a11y scan.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForTimeout(1200);

  const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  const violations = axe.violations.map((v) => `${v.id} (${v.impact}) ×${v.nodes.length}: ${v.help}`);
  violations.forEach((v) => problems.push(`${route}: axe ${v}`));
  errors.forEach((e) => problems.push(`${route}: console ${e}`));

  const slug = route === "/" ? "home" : route.slice(1).replace(/\//g, "_");
  await page.screenshot({ path: path.join(OUT, `${slug}-desktop.png`) });
  await page.evaluate(() => document.querySelectorAll(".reveal").forEach((e) => e.classList.add("is-in")));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT, `${slug}-desktop-full.png`), fullPage: true });
  report.push({ route, status, axe: violations.length, consoleErrors: errors.length });
  await page.close();
}

// Mobile pass: overflow + screenshots.
const mctx = await browser.newContext(viewports.mobile);
for (const route of seen) {
  const page = await mctx.newPage();
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 1) problems.push(`${route}: horizontal overflow on mobile (${overflow}px)`);
  const tooSmall = await page.$$eval("a, button", (els) =>
    els.filter((e) => {
      const r = e.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && r.height < 24 && getComputedStyle(e).display !== "inline";
    }).length,
  );
  if (tooSmall) problems.push(`${route}: ${tooSmall} tap target(s) under 24px tall on mobile`);
  await page.waitForTimeout(1600);
  const slug = route === "/" ? "home" : route.slice(1).replace(/\//g, "_");
  await page.screenshot({ path: path.join(OUT, `${slug}-mobile.png`) });
  await page.evaluate(() => document.querySelectorAll(".reveal").forEach((e) => e.classList.add("is-in")));
  await page.waitForTimeout(1000);
  await page.evaluate(() => document.querySelectorAll(".reveal").forEach((e) => e.classList.add("is-in")));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT, `${slug}-mobile-full.png`), fullPage: true });
  await page.close();
}

// Reduced-motion pass: every page's main content must be visible without animation.
const rctx = await browser.newContext({ ...viewports.desktop, reducedMotion: "reduce" });
for (const route of seen) {
  const page = await rctx.newPage();
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  const hidden = await page.$$eval(".reveal", (els) => els.filter((e) => getComputedStyle(e).opacity === "0").length);
  if (hidden) problems.push(`${route}: ${hidden} element(s) hidden under reduced motion`);
  await page.close();
}

// 404 check.
const p404 = await ctx.newPage();
const r404 = await p404.goto(BASE + "/this-page-does-not-exist");
if (r404?.status() !== 404) problems.push(`404 page returned ${r404?.status()}`);

await browser.close();

console.table(report);
console.log(`\nInternal pages checked: ${seen.size}`);
console.log(`External links found (not fetched):\n  ${[...external].join("\n  ")}`);
console.log(`\nScreenshots: ${path.resolve(OUT)}`);
if (problems.length) {
  console.log(`\n✗ ${problems.length} problem(s):\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log("\n✓ No problems found.");
