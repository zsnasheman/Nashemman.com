import type { Metadata } from "next";
import { getChannels, getSite } from "@/lib/content";
import ContactNote from "@/components/contact/ContactNote";

export const metadata: Metadata = {
  title: "Connect",
  description: "Talks, interviews, collaborations and studio projects: how to reach Nashemman Sahiba Zargar.",
};

export default function ConnectPage() {
  const { contact } = getSite();
  return (
    <section className="closing closing--page" aria-label="Contact">
      <ContactNote
        heading={contact.heading}
        intro={contact.intro}
        email={contact.email}
        channels={getChannels()}
        headingLevel={1}
      />
    </section>
  );
}
