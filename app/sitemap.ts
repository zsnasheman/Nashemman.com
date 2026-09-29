import type { MetadataRoute } from "next";
import { getJournal } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const pages = ["", "/story", "/work", "/journal", "/talks", "/connect"];
  return [
    ...pages.map((p) => ({ url: `${base}${p}` })),
    ...getJournal().map((e) => ({ url: `${base}/journal/${e.slug}`, lastModified: e.date })),
  ];
}
