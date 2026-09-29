import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque/standard.css";
import "@fontsource-variable/instrument-sans/wdth.css";
import "@fontsource-variable/instrument-sans/wdth-italic.css";
import "@fontsource/dm-mono/400.css";
import "@fontsource/dm-mono/500.css";
import "./globals.css";
import "./sections.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getSite } from "@/lib/content";

const site = getSite();
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: { title: site.name, description: site.description, type: "website", siteName: site.name },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#f4efe7" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Marks JS as available so reveals may hide content first; without JS nothing is hidden. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader name={site.name} nav={site.nav} />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter site={site} />
      </body>
    </html>
  );
}
