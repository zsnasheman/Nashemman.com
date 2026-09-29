import { splitPatches } from "@/lib/content";

const TONES = ["butter", "sky", "chinar"] as const;

/**
 * Renders "text [[phrase]] text", placing an irregular colour patch behind
 * each bracketed phrase. Tones rotate through the palette unless fixed.
 */
export default function Patched({ text, tone }: { text: string; tone?: (typeof TONES)[number] }) {
  let n = 0;
  return (
    <>
      {splitPatches(text).map((part, i) =>
        part.patch ? (
          <span key={i} className={`patch patch--${tone ?? TONES[n % TONES.length]} patch--s${n++ % 3}`}>
            {part.text}
          </span>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </>
  );
}
