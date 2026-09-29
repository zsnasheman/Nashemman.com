"use client";

import { useEffect, useRef, useState } from "react";

/** Silent looping video with a visible pause control; never autoplays under reduced motion. */
export default function VideoLoop({ src, poster, label }: { src: string; poster?: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  }, []);

  const toggle = () => {
    const v = ref.current!;
    if (v.paused) v.play().then(() => setPlaying(true));
    else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <video
        ref={ref}
        src={src}
        poster={poster || undefined}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
      />
      <button
        type="button"
        onClick={toggle}
        className="pill"
        style={{
          position: "absolute",
          left: 12,
          bottom: 12,
          minHeight: 36,
          background: "var(--paper)",
          fontSize: "0.8rem",
        }}
      >
        {playing ? "Pause" : "Play"}
        <span className="visually-hidden"> video</span>
      </button>
    </>
  );
}
