import Image from "next/image";
import { getMediaSlot, getSite, SHOW_DRAFTS } from "@/lib/content";
import VideoLoop from "./VideoLoop";
import Sketch from "./sketch/Sketch";
import MaterialArt from "./board/MaterialArt";

type Props = {
  slot?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  ratio?: string;
};

/** Crops of the landing sketch, reused as chapter visuals. */
export const SKETCH_CROPS: Record<string, string> = {
  roots: "0 360 540 380",
  practice: "500 110 660 640",
  future: "1168 250 432 480",
};

/**
 * Every photo and video goes through this component, reading its slot from
 * content/media.yml. Without a file it renders an intentional illustrated
 * composition. Internal slot notes appear only on the local preview.
 */
export default function Figure({
  slot,
  className = "",
  sizes = "(min-width: 900px) 45vw, 100vw",
  priority,
  ratio,
}: Props) {
  const m = getMediaSlot(slot);
  const aspect = ratio ?? m?.ratio ?? "4/5";
  const hasFile = !!m?.src;

  return (
    <figure className={`figure ${className}`} style={{ ["--ratio" as string]: aspect }}>
      <div className="figure__media">
        {hasFile && m?.type === "video" ? (
          <VideoLoop src={m.src} poster={m.poster} label={m.alt || m.label} />
        ) : hasFile ? (
          <Image src={m!.src} alt={m!.alt} fill sizes={sizes} priority={priority} />
        ) : (
          <Fallback slot={slot} />
        )}
      </div>
      {hasFile && m?.credit ? <figcaption className="figure__credit">{m.credit}</figcaption> : null}
      {!hasFile && SHOW_DRAFTS && m ? (
        <span className="dev-tag" title={m.brief}>
          missing asset · {slot}
        </span>
      ) : null}
    </figure>
  );
}

function Fallback({ slot = "" }: { slot?: string }) {
  if (slot.startsWith("portrait")) return <PortraitComposition />;
  if (slot === "roots-kashmir")
    return (
      <div className="art-fill art-fill--paper">
        <Sketch viewBox={SKETCH_CROPS.roots} decorative />
      </div>
    );
  if (slot === "studio-feature")
    return (
      <div className="art-collage" aria-hidden="true">
        {["kinetic", "residential", "brand"].map((id) => (
          <span key={id} className={`art-collage__piece art-collage__piece--${id}`}>
            <MaterialArt id={id} />
          </span>
        ))}
      </div>
    );
  return <div className="art-fill art-fill--patches" aria-hidden="true" />;
}

/**
 * Stand-in for the portrait until a real photograph is supplied: a composed
 * monogram on colour fields. Never a face, never a stock person.
 */
export function PortraitComposition() {
  const site = getSite();
  return (
    <div className="portrait-comp" aria-hidden="true">
      <span className="portrait-comp__field portrait-comp__field--a" />
      <span className="portrait-comp__field portrait-comp__field--b" />
      <span className="portrait-comp__mono">{site.monogram}</span>
      <svg className="portrait-comp__line" viewBox="0 0 200 120" fill="none">
        <path d="M0 96 C40 96 50 40 90 44 S140 100 200 20" />
      </svg>
    </div>
  );
}
