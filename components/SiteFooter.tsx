import Link from "next/link";
import { getChannels, type Site } from "@/lib/content";

export default function SiteFooter({ site }: { site: Site }) {
  const channels = getChannels();
  return (
    <footer className="footer">
      <div className="shell footer__row">
        <p className="footer__name">{site.name}</p>
        <nav aria-label="Footer">
          <ul className="footer__links">
            {site.nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href}>{n.label}</Link>
              </li>
            ))}
            {channels.map((c) => (
              <li key={c.url}>
                <a href={c.url} target="_blank" rel="noopener noreferrer">
                  {c.label} ↗<span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="footer__small">© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
