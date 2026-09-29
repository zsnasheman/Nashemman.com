/**
 * Original illustrated material studies, one per discipline. They are
 * conceptual (not project photography) and are labelled as studies on the board.
 * viewBox 0 0 400 500.
 */

const INK = "#15151a";

function Residential() {
  return (
    <>
      <rect width="400" height="500" fill="#efe4d3" />
      {/* oak panel */}
      <rect x="0" y="0" width="210" height="500" fill="#c8955f" />
      {Array.from({ length: 14 }, (_, i) => (
        <path
          key={i}
          d={`M${8 + i * 15} 0 C${14 + i * 15} 120 ${2 + i * 15} 240 ${12 + i * 15} 360 S${6 + i * 15} 470 ${10 + i * 15} 500`}
          stroke="#a8743f"
          strokeWidth="1.4"
          fill="none"
          opacity="0.7"
        />
      ))}
      <ellipse cx="96" cy="210" rx="14" ry="30" fill="none" stroke="#8d5d2f" strokeWidth="1.5" />
      {/* linen swatch */}
      <g transform="translate(170 250) rotate(-6)">
        <rect width="200" height="210" fill="#e9dfcf" />
        {Array.from({ length: 20 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 10.5} x2="200" y2={i * 10.5} stroke="#cdbfa8" strokeWidth="1" />
        ))}
        {Array.from({ length: 19 }, (_, i) => (
          <line key={`v${i}`} x1={i * 10.5} y1="0" x2={i * 10.5} y2="210" stroke="#d8ccb7" strokeWidth="1" />
        ))}
      </g>
      {/* arched opening */}
      <path d="M250 230 V110 A60 60 0 0 1 370 110 V230" fill="#f6efe4" stroke={INK} strokeWidth="2" />
      <circle cx="58" cy="400" r="34" fill="#f3cf5a" />
    </>
  );
}

function Commercial() {
  const dots = Array.from({ length: 70 }, (_, i) => {
    const x = (i * 97) % 400;
    const y = 250 + ((i * 53) % 250);
    const r = 3 + ((i * 7) % 6);
    const c = ["#d2502c", "#15151a", "#b8913a", "#f4efe7", "#8aa6c7"][i % 5];
    return <circle key={i} cx={x} cy={y} r={r} fill={c} opacity="0.9" />;
  });
  return (
    <>
      <rect width="400" height="500" fill="#d9d4cc" />
      {/* ceiling grid */}
      <g stroke="#9c958a" strokeWidth="1.2">
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`g${i}`} x1={i * 50} y1="0" x2={i * 50} y2="240" />
        ))}
        {Array.from({ length: 5 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 60} x2="400" y2={i * 60} />
        ))}
      </g>
      <rect x="0" y="240" width="400" height="260" fill="#cfc8bc" />
      {dots}
      {/* brass rail and desk */}
      <rect x="40" y="228" width="320" height="10" rx="5" fill="#b8913a" />
      <rect x="120" y="150" width="160" height="70" fill="#15151a" />
      <rect x="130" y="160" width="140" height="6" fill="#f3cf5a" />
    </>
  );
}

function Brand() {
  return (
    <>
      <rect width="400" height="500" fill="#f3cf5a" />
      <rect x="0" y="300" width="400" height="200" fill="#d2502c" />
      <path d="M40 300 L120 120 L200 300 Z" fill="#15151a" />
      <circle cx="280" cy="170" r="84" fill="#f4efe7" />
      <circle cx="280" cy="170" r="84" fill="none" stroke="#15151a" strokeWidth="3" strokeDasharray="10 8" />
      <rect x="230" y="330" width="130" height="130" fill="#15151a" transform="rotate(8 295 395)" />
      <path
        d="M60 420 H190 M160 390 L190 420 L160 450"
        stroke="#f4efe7"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      />
    </>
  );
}

function Kinetic() {
  return (
    <>
      <rect width="400" height="500" fill="#bcd3ec" />
      <rect x="40" y="40" width="320" height="380" fill="#f4efe7" stroke="#15151a" strokeWidth="4" />
      <g className="art-louvres">
        {Array.from({ length: 8 }, (_, i) => (
          <rect
            key={i}
            x={56 + i * 37}
            y="60"
            width="26"
            height="340"
            fill={i % 3 === 0 ? "#d2502c" : i % 3 === 1 ? "#15151a" : "#f3cf5a"}
            style={{ transformOrigin: `${69 + i * 37}px 230px`, ["--k" as string]: i }}
          />
        ))}
      </g>
      <rect x="0" y="440" width="400" height="60" fill="#15151a" />
      <line x1="40" y1="470" x2="360" y2="470" stroke="#f4efe7" strokeWidth="2" strokeDasharray="4 10" />
    </>
  );
}

function Exhibitions() {
  return (
    <>
      <rect width="400" height="500" fill="#e8e1d6" />
      <path d="M120 0 L40 330 H200 Z" fill="#fff8e6" opacity="0.9" />
      <path d="M300 0 L220 330 H380 Z" fill="#fff8e6" opacity="0.9" />
      <rect x="60" y="330" width="120" height="170" fill="#f4efe7" stroke="#15151a" strokeWidth="2" />
      <rect x="240" y="370" width="120" height="130" fill="#15151a" />
      <circle cx="120" cy="300" r="28" fill="#d2502c" />
      <path d="M270 370 V310 L300 280 L330 310 V370" fill="#bcd3ec" stroke="#15151a" strokeWidth="2" />
      <rect x="150" y="90" width="100" height="130" fill="#f4efe7" stroke="#15151a" strokeWidth="2" />
      <path d="M160 200 L185 150 L205 180 L220 160 L240 200 Z" fill="#b8913a" />
    </>
  );
}

function Events() {
  const bulbs = Array.from({ length: 11 }, (_, i) => {
    const x = 20 + i * 36;
    const y = 90 + Math.sin((i / 10) * Math.PI) * 60;
    return (
      <circle
        key={i}
        cx={x}
        cy={y + 12}
        r="9"
        fill={i % 2 ? "#f3cf5a" : "#f4efe7"}
        stroke="#15151a"
        strokeWidth="1.5"
      />
    );
  });
  return (
    <>
      <rect width="400" height="500" fill="#15151a" />
      <path d="M20 90 Q200 210 380 90" stroke="#f4efe7" strokeWidth="2" fill="none" />
      {bulbs}
      <path d="M60 500 V300 A140 140 0 0 1 340 300 V500" fill="#d2502c" />
      <path d="M100 500 V310 A100 100 0 0 1 300 310 V500" fill="#15151a" />
      <rect x="40" y="430" width="320" height="70" fill="#bcd3ec" />
      <rect x="40" y="430" width="320" height="10" fill="#f4efe7" />
    </>
  );
}

const ART: Record<string, () => React.JSX.Element> = {
  residential: Residential,
  commercial: Commercial,
  brand: Brand,
  kinetic: Kinetic,
  exhibitions: Exhibitions,
  events: Events,
};

export default function MaterialArt({ id }: { id: string }) {
  const Art = ART[id] ?? Residential;
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className="material-art">
      <Art />
    </svg>
  );
}
