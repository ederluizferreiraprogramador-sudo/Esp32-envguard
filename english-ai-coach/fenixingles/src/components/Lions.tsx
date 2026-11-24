// Leões originais do FenixInglês, no estilo desenho animado (contorno marrom, cores chapadas).
// Juba: leão com juba espetada. Lili: filhotinha de leão.
const O = "#5a3410"; // contorno
const CSS = `@keyframes fx-lion-tail{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(10deg)}}
@keyframes fx-lion-blink{0%,93%,100%{transform:scaleY(1)}96%{transform:scaleY(.1)}}
.fx-lion-tail{animation:fx-lion-tail 1.6s ease-in-out infinite;transform-box:view-box;transform-origin:150px 170px}
.fx-lion-eye{animation:fx-lion-blink 4s infinite;transform-box:fill-box;transform-origin:center}
@media (prefers-reduced-motion: reduce){.fx-lion-tail,.fx-lion-eye{animation:none}}`;

function Eye({ cx, cy, iris }: { cx: number; cy: number; iris: string }) {
  return (
    <g className="fx-lion-eye">
      <ellipse cx={cx} cy={cy} rx="11" ry="13" fill="#fff" stroke={O} strokeWidth="3" />
      <ellipse cx={cx + 1} cy={cy + 2} rx="7" ry="8.5" fill={iris} />
      <circle cx={cx + 1} cy={cy + 3} r="4.5" fill="#24130a" />
      <circle cx={cx - 2} cy={cy - 2} r="2.6" fill="#fff" />
    </g>
  );
}

function Body({ fur, belly, tuft }: { fur: string; belly: string; tuft: string }) {
  return (
    <g>
      <g className="fx-lion-tail">
        <path d="M146 176 C176 172 184 150 176 130" fill="none" stroke={O} strokeWidth="11" strokeLinecap="round" />
        <path d="M146 176 C176 172 184 150 176 130" fill="none" stroke={fur} strokeWidth="6" strokeLinecap="round" />
        <path d="M176 130 C166 120 168 104 182 98 C186 110 196 112 192 124 C190 132 182 134 176 130 Z" fill={tuft} stroke={O} strokeWidth="3" strokeLinejoin="round" />
      </g>
      <path d="M52 198 C46 158 66 124 100 122 C134 124 154 158 148 198 Z" fill={fur} stroke={O} strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M80 198 C78 170 88 146 100 142 C112 146 122 170 120 198 Z" fill={belly} />
      <ellipse cx="78" cy="196" rx="16" ry="10" fill={belly} stroke={O} strokeWidth="3" />
      <ellipse cx="122" cy="196" rx="16" ry="10" fill={belly} stroke={O} strokeWidth="3" />
      <path d="M72 194 v5 M78 193 v6 M84 194 v5 M116 194 v5 M122 193 v6 M128 194 v5" stroke={O} strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

/** Juba, o leão: juba laranja espetada e risada aberta. */
export function Juba({ size = 120, className = "" }: { size?: number; className?: string }) {
  const fur = "#f6b13b", mane = "#d9691f", maneDark = "#b4501a", belly = "#fde3a7";
  const tufts = Array.from({ length: 12 }, (_, i) => {
    const ang = (i / 12) * Math.PI * 2 - Math.PI / 2;
    return { x: 100 + Math.cos(ang) * 50, y: 80 + Math.sin(ang) * 50 };
  });
  return (
    <svg viewBox="0 0 200 212" width={size} height={size} className={className} role="img" aria-label="Juba, o leão">
      <style>{CSS}</style>
      <Body fur={fur} belly={belly} tuft={mane} />
      {/* juba em tufos */}
      <g fill={mane} stroke={O} strokeWidth="3">{tufts.map((t, i) => <circle key={i} cx={t.x} cy={t.y} r="20" />)}</g>
      <circle cx="100" cy="80" r="52" fill={mane} />
      <circle cx="100" cy="84" r="44" fill={maneDark} opacity=".3" />
      {/* orelhas */}
      <circle cx="60" cy="40" r="15" fill={fur} stroke={O} strokeWidth="3" /><circle cx="60" cy="41" r="8" fill="#ffb3b3" />
      <circle cx="140" cy="40" r="15" fill={fur} stroke={O} strokeWidth="3" /><circle cx="140" cy="41" r="8" fill="#ffb3b3" />
      {/* rosto */}
      <ellipse cx="100" cy="86" rx="42" ry="39" fill={fur} stroke={O} strokeWidth="3" />
      <path d="M84 60 q-8 -6 -14 0 M116 60 q8 -6 14 0" stroke={O} strokeWidth="3" fill="none" strokeLinecap="round" />
      <Eye cx={84} cy={76} iris="#7a4a1c" />
      <Eye cx={116} cy={76} iris="#7a4a1c" />
      <ellipse cx="100" cy="104" rx="22" ry="15" fill={belly} />
      <ellipse cx="72" cy="96" rx="7" ry="4.5" fill="#ff8a7a" opacity=".6" />
      <ellipse cx="128" cy="96" rx="7" ry="4.5" fill="#ff8a7a" opacity=".6" />
      <path d="M92 94 h16 l-8 8 Z" fill="#e8735a" stroke={O} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M84 106 q16 26 32 0 Z" fill="#7a1f1f" stroke={O} strokeWidth="3" strokeLinejoin="round" />
      <path d="M90 118 q10 8 20 0 q-10 -6 -20 0 Z" fill="#ff8aa0" />
    </svg>
  );
}

/** Lili, a filhotinha de leão: sem juba, bochechas rosadas e laço de folha. */
export function Lili({ size = 120, className = "" }: { size?: number; className?: string }) {
  const fur = "#f8c35a", belly = "#fff0c9", tuft = "#c9742e";
  return (
    <svg viewBox="0 0 200 212" width={size} height={size} className={className} role="img" aria-label="Lili, a filhotinha de leão">
      <style>{CSS}</style>
      <Body fur={fur} belly={belly} tuft={tuft} />
      {/* orelhas */}
      <circle cx="58" cy="44" r="18" fill={fur} stroke={O} strokeWidth="3" /><circle cx="58" cy="46" r="10" fill="#ffb3b3" />
      <circle cx="142" cy="44" r="18" fill={fur} stroke={O} strokeWidth="3" /><circle cx="142" cy="46" r="10" fill="#ffb3b3" />
      {/* cabeça redonda */}
      <ellipse cx="100" cy="82" rx="54" ry="50" fill={fur} stroke={O} strokeWidth="3.5" />
      <path d="M92 34 q4 -10 8 0 q4 -12 10 -2" fill="none" stroke={tuft} strokeWidth="5" strokeLinecap="round" />
      {/* folhinha no cabelo */}
      <path d="M128 40 q16 -14 26 0 q-12 12 -26 0 Z" fill="#58cc02" stroke={O} strokeWidth="2.5" />
      <path d="M86 58 q-8 -6 -14 0 M114 58 q8 -6 14 0" stroke={O} strokeWidth="3" fill="none" strokeLinecap="round" />
      <Eye cx={80} cy={78} iris="#2b7fd6" />
      <Eye cx={120} cy={78} iris="#2b7fd6" />
      <ellipse cx="100" cy="104" rx="24" ry="16" fill={belly} />
      <ellipse cx="66" cy="98" rx="9" ry="6" fill="#ff8aa0" opacity=".65" />
      <ellipse cx="134" cy="98" rx="9" ry="6" fill="#ff8aa0" opacity=".65" />
      <ellipse cx="100" cy="98" rx="8" ry="6" fill="#ff7a8a" stroke={O} strokeWidth="2.5" />
      <path d="M90 108 q10 14 20 0" fill="#7a1f1f" stroke={O} strokeWidth="3" strokeLinejoin="round" />
      <path d="M95 113 q5 4 10 0" stroke="#ff8aa0" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}
