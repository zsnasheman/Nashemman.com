import Link from "next/link";
import type { Site } from "@/lib/content";

export default function SiteFooter({ site }: { site: Site }) {
  return (
    <footer className="colophon">
      <div className="shell">
        <p className="colophon__sign" aria-hidden="true">
          still <em>drawing</em>.
        </p>
        <div className="colophon__grid">
          <div>
            <p className="eyebrow">{site.publication}</p>
            <p style={{ maxWidth: "26rem", marginTop: "0.75rem" }}>{site.description}</p>
          </div>
          <div>
            <p className="eyebrow">Contents</p>
            <ul>
              {site.nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href}>{n.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">Elsewhere</p>
            <ul>
              {site.channels.map((c) => (
                <li key={c.url}>
                  <a href={c.url} target="_blank" rel="noopener noreferrer">
                    {c.label}
                    <span className="visually-hidden"> (opens in a new tab)</span> ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="colophon__small">
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
          <span>
            {site.publication} · {site.issue}
          </span>
        </div>
      </div>
    </footer>
  );
}
