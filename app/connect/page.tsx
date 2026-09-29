import type { Metadata } from "next";
import { getSite } from "@/lib/content";
import Reveal from "@/components/Reveal";
import InkLine from "@/components/InkLine";

export const metadata: Metadata = {
  title: "Connect",
  description: "How to reach Nashemman Sahiba Zargar and The Scribble Lab.",
};

export default function ConnectPage() {
  const site = getSite();
  const { contact, channels } = site;

  return (
    <div className="threaded">
      <InkLine seed={23} />
      <header className="shell page-intro">
        <p className="eyebrow">05 · Connect</p>
        <h1 className="page-intro__title">
          Draw a line <em>to her</em>
        </h1>
        <p className="page-intro__dek">{contact.intro}</p>
      </header>

      <section className="shell connect" aria-label="Ways to connect">
        {contact.email ? (
          <Reveal className="connect__email">
            <p className="eyebrow">Write directly</p>
            <a href={`mailto:${contact.email}`} className="connect__email-link" data-cursor="Write">
              {contact.email}
            </a>
          </Reveal>
        ) : null}

        <ol className="channels">
          {channels.map((c, i) => (
            <Reveal as="li" key={c.url} delay={i * 0.08}>
              <a href={c.url} className="channel" target="_blank" rel="noopener noreferrer" data-cursor="Open">
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                <span className="channel__label">{c.label}</span>
                <span className="channel__desc">{c.description}</span>
                <span className="channel__arrow" aria-hidden="true">
                  ↗
                </span>
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </Reveal>
          ))}
        </ol>

        <Reveal className="connect__topics">
          <p className="eyebrow">Good reasons to get in touch</p>
          <ul className="tag-list">
            <li>Studio projects</li>
            <li>Speaking invitations</li>
            <li>Interviews &amp; press</li>
            <li>Collaborations</li>
            <li>The accessories venture</li>
          </ul>
        </Reveal>
      </section>
    </div>
  );
}
