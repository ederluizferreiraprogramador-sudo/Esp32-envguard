// Cenários desenhados em SVG (originais) para a conversa e a casa da turma.
export type SceneName = "espaco" | "campo" | "quarto";

function Stars({ n = 40 }: { n?: number }) {
  const s = Array.from({ length: n }, (_, i) => ({ x: (i * 97) % 400, y: (i * 53) % 170, r: (i % 3) + 1, d: (i % 5) * 0.4 }));
  return <g>{s.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={p.r * 0.8} fill="#fff" className="anim-twinkle" style={{ animationDelay: `${p.d}s` }} />)}</g>;
}

export function Scene({ name, className = "" }: { name: SceneName; className?: string }) {
  return (
    <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden>
      {name === "espaco" && <>
        <defs>
          <linearGradient id="sc-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1d1450" /><stop offset=".6" stopColor="#5b3fb8" /><stop offset="1" stopColor="#c7a9ff" /></linearGradient>
          <radialGradient id="sc-planet" cx=".35" cy=".35" r=".8"><stop offset="0" stopColor="#c9f2ff" /><stop offset=".6" stopColor="#7aa8ff" /><stop offset="1" stopColor="#4a3fb0" /></radialGradient>
        </defs>
        <rect width="400" height="260" fill="url(#sc-sky)" />
        <Stars />
        <circle cx="320" cy="80" r="58" fill="url(#sc-planet)" />
        <ellipse cx="320" cy="84" rx="86" ry="14" fill="none" stroke="#ffd6f5" strokeOpacity=".7" strokeWidth="4" />
        <path d="M0 200 L60 140 L110 190 L170 120 L240 200 L300 150 L400 210 V260 H0 Z" fill="#7d63d6" />
        <path d="M0 230 Q100 200 200 228 T400 224 V260 H0 Z" fill="#e9e2ff" />
      </>}
      {name === "campo" && <>
        <defs><linearGradient id="sc-day" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7fd3ff" /><stop offset="1" stopColor="#e8f8ff" /></linearGradient></defs>
        <rect width="400" height="260" fill="url(#sc-day)" />
        <circle cx="330" cy="50" r="26" fill="#ffe27a" />
        <path d="M0 150 L70 90 L140 150 L210 80 L290 150 L360 100 L400 130 V260 H0 Z" fill="#b8d4f5" />
        <path d="M0 180 Q120 140 220 175 T400 170 V260 H0 Z" fill="#7bd66a" />
        <path d="M0 215 Q140 190 260 215 T400 210 V260 H0 Z" fill="#5cc24e" />
        <rect x="58" y="110" width="14" height="80" rx="6" fill="#8a5a33" />
        <circle cx="65" cy="100" r="40" fill="#3fa34d" /><circle cx="40" cy="120" r="26" fill="#4fb85c" /><circle cx="92" cy="118" r="28" fill="#4fb85c" />
        {[30, 120, 170, 240, 300, 350].map((x, i) => <g key={x}><circle cx={x} cy={228 + (i % 2) * 10} r="5" fill={["#ff6fd0", "#ffc93c", "#fff", "#ff9a3c"][i % 4]} /><circle cx={x} cy={228 + (i % 2) * 10} r="2" fill="#ffe27a" /></g>)}
      </>}
      {name === "quarto" && <>
        <rect width="400" height="260" fill="#f7efe6" />
        {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${i * 50} 0 L${i * 50 + 25} 40 L${i * 50 + 50} 0`} fill="none" stroke="#eadfce" strokeWidth="2" />)}
        <circle cx="200" cy="110" r="78" fill="#fff" />
        <circle cx="200" cy="110" r="70" fill="#8fdcff" />
        <path d="M130 140 Q200 120 270 140 L270 180 L130 180 Z" fill="#45c7c0" />
        <rect x="196" y="92" width="6" height="50" fill="#8a5a33" /><path d="M199 92 q-24 -6 -34 6 M199 92 q24 -8 34 4 M199 92 q-10 -16 -26 -14 M199 92 q12 -16 26 -12" stroke="#3fa34d" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M0 210 H400 V260 H0 Z" fill="#e8d9c4" />
        <ellipse cx="200" cy="230" rx="70" ry="14" fill="#d9a865" />
        <rect x="20" y="170" width="110" height="44" rx="12" fill="#ffc93c" stroke="#e5a500" strokeWidth="3" />
        <rect x="270" y="176" width="100" height="38" rx="10" fill="#ffc93c" stroke="#e5a500" strokeWidth="3" />
        <path d="M352 120 q20 -40 0 -80 q30 30 18 80 Z" fill="#3fa34d" /><rect x="345" y="150" width="34" height="40" rx="8" fill="#c9a77a" />
      </>}
    </svg>
  );
}
