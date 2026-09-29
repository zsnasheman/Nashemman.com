import type { MetadataRoute } from "next";
import { getJournal, getWork } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const pages = ["", "/story", "/work", "/journal", "/talks", "/connect"];
  return [
    ...pages.map((p) => ({ url: `${base}${p}` })),
    ...getWork().map((w) => ({ url: `${base}/work/${w.slug}` })),
    ...getJournal().map((e) => ({ url: `${base}/journal/${e.slug}`, lastModified: e.date })),
  ];
}
