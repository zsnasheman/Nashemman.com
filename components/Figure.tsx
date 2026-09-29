import Image from "next/image";
import { getMediaSlot } from "@/lib/content";
import Tilt from "./Tilt";
import VideoLoop from "./VideoLoop";

type Props = {
  slot?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  caption?: string;
  cursor?: string;
  ratio?: string;
};

/**
 * Every image and video on the site goes through this component.
 * It reads the slot from content/media.yml. With no file supplied yet,
 * it renders a clearly labelled editorial placeholder instead.
 */
export default function Figure({
  slot,
  className = "",
  sizes = "(min-width: 900px) 40vw, 100vw",
  priority,
  caption,
  cursor,
  ratio,
}: Props) {
  const m = getMediaSlot(slot);
  const aspect = ratio ?? m?.ratio ?? "4/5";
  const hasFile = !!m?.src;

  return (
    <Tilt className={className}>
      <figure className="figure" data-cursor={cursor}>
        <div className="figure__stack" style={{ ["--ratio" as string]: aspect }}>
          <div className="figure__media">
            {hasFile && m?.type === "video" ? (
              <VideoLoop src={m.src} poster={m.poster} label={m.alt || m.label} />
            ) : hasFile ? (
              <Image src={m!.src} alt={m!.alt} fill sizes={sizes} priority={priority} />
            ) : (
              <Placeholder
                label={m?.label ?? "Image to come"}
                brief={m?.brief}
                slot={slot}
                video={m?.type === "video"}
              />
            )}
          </div>
        </div>
        {(caption || (hasFile && m?.credit)) && (
          <figcaption>
            <span>{caption}</span>
            {hasFile && m?.credit ? <span>{m.credit}</span> : null}
          </figcaption>
        )}
      </figure>
    </Tilt>
  );
}

function Placeholder({ label, brief, slot, video }: { label: string; brief?: string; slot?: string; video?: boolean }) {
  return (
    <div
      className="placeholder"
      role="img"
      aria-label={`Placeholder: ${label}. ${video ? "Video" : "Image"} to be supplied.`}
    >
      <span className="placeholder__tag">{video ? "Video to come" : "Image to come"}</span>
      <svg className="placeholder__mark" viewBox="0 0 120 90" fill="none" aria-hidden="true">
        <path
          d="M6 70 C 20 20, 38 18, 44 46 S 70 84, 82 42 S 108 10, 114 30"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="6" cy="70" r="3" fill="currentColor" />
        <path d="M110 24 l6 6 m-6 0 l6 -6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <div>
        <p className="placeholder__label" style={{ margin: 0 }}>
          {label}
        </p>
        {brief ? (
          <p className="placeholder__brief" style={{ margin: "0.4rem 0 0.6rem" }}>
            {brief}
          </p>
        ) : null}
        {slot ? <span className="placeholder__slot">media: {slot}</span> : null}
      </div>
    </div>
  );
}
