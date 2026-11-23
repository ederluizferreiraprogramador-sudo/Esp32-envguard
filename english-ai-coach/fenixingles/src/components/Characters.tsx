// Personagens originais do FenixInglês (SVG próprio, sem imagens de terceiros).
// Capi (capivara): comemora acertos. Uni (unicórnio): aparece nos erros com uma dancinha.

const CSS = `
@keyframes fx-capi-hop { 0%,100% { transform: translateY(0) rotate(0) } 30% { transform: translateY(-14%) rotate(-6deg) } 60% { transform: translateY(0) rotate(5deg) } }
@keyframes fx-capi-blink { 0%,90%,100% { transform: scaleY(1) } 95% { transform: scaleY(.1) } }
@keyframes fx-uni-bounce { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6%) } }
@keyframes fx-uni-wiggle { 0%,100% { transform: rotate(0) } 25% { transform: rotate(14deg) } 75% { transform: rotate(-14deg) } }
@keyframes fx-uni-tail { 0%,100% { transform: rotate(-10deg) } 50% { transform: rotate(25deg) } }
@keyframes fx-uni-legs { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-4px) } }
@keyframes fx-note { 0% { opacity: 0; transform: translate(0,0) } 30% { opacity: 1 } 100% { opacity: 0; transform: translate(10px,-30px) } }
.fx-capi { animation: fx-capi-hop .9s ease-in-out infinite; transform-origin: 50% 100%; }
.fx-capi-eye { animation: fx-capi-blink 3s infinite; transform-box: fill-box; transform-origin: center; }
.fx-uni { animation: fx-uni-bounce .5s ease-in-out infinite; }
.fx-uni-hips { animation: fx-uni-wiggle .5s ease-in-out infinite; transform-box: view-box; transform-origin: 120px 150px; }
.fx-uni-tail { animation: fx-uni-tail .25s ease-in-out infinite; transform-box: view-box; transform-origin: 165px 118px; }
.fx-uni-leg { animation: fx-uni-legs .5s ease-in-out infinite; }
.fx-uni-leg2 { animation: fx-uni-legs .5s ease-in-out infinite .25s; }
.fx-note { animation: fx-note 1.2s ease-out infinite; }
.fx-note2 { animation: fx-note 1.2s ease-out infinite .6s; }
@media (prefers-reduced-motion: reduce) { .fx-capi,.fx-uni,.fx-uni-hips,.fx-uni-tail,.fx-uni-leg,.fx-uni-leg2,.fx-note,.fx-note2 { animation: none } }
`;
const Style = () => <style>{CSS}</style>;

/** Capi, a capivara que comemora acertos. */
export function Capi({ size = 80, dancing = true, className = "" }: { size?: number; dancing?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} role="img" aria-label="Capi, a capivara, comemorando">
      <Style />
      <g className={dancing ? "fx-capi" : undefined}>
        {/* corpo */}
        <ellipse cx="100" cy="135" rx="62" ry="55" fill="#B07A4A" />
        <ellipse cx="100" cy="148" rx="40" ry="34" fill="#C9965F" />
        {/* pés */}
        <ellipse cx="70" cy="186" rx="16" ry="9" fill="#6B3F22" />
        <ellipse cx="130" cy="186" rx="16" ry="9" fill="#6B3F22" />
        {/* cabeça */}
        <rect x="44" y="30" width="112" height="90" rx="32" fill="#B07A4A" />
        {/* orelhas */}
        <ellipse cx="56" cy="36" rx="9" ry="7" fill="#8A5A33" />
        <ellipse cx="144" cy="36" rx="9" ry="7" fill="#8A5A33" />
        {/* chaminha de fênix no topo (marca do app) */}
        <path d="M100 6 C108 18 116 22 112 34 C120 30 122 24 121 20 C130 32 124 44 112 46 L88 46 C76 44 72 32 80 22 C80 28 84 32 88 34 C84 22 94 16 100 6 Z" fill="#FF9600" />
        <path d="M100 20 C104 28 108 30 106 38 L94 38 C92 32 96 28 100 20 Z" fill="#FFC800" />
        {/* olhos felizes */}
        <path className="fx-capi-eye" d="M62 62 q9 -10 18 0" stroke="#3B2414" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path className="fx-capi-eye" d="M120 62 q9 -10 18 0" stroke="#3B2414" strokeWidth="5" fill="none" strokeLinecap="round" />
        {/* bochechas */}
        <ellipse cx="54" cy="78" rx="8" ry="5" fill="#FF8FA3" opacity=".7" />
        <ellipse cx="146" cy="78" rx="8" ry="5" fill="#FF8FA3" opacity=".7" />
        {/* focinho */}
        <rect x="62" y="74" width="76" height="44" rx="20" fill="#7A4A28" />
        <ellipse cx="84" cy="88" rx="5" ry="3" fill="#2B170B" />
        <ellipse cx="116" cy="88" rx="5" ry="3" fill="#2B170B" />
        <path d="M90 102 q10 10 20 0" stroke="#2B170B" strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* braços segurando o pirulito */}
        <ellipse cx="58" cy="130" rx="12" ry="16" fill="#8A5A33" transform="rotate(-25 58 130)" />
        <line x1="142" y1="150" x2="160" y2="104" stroke="#58CC02" strokeWidth="6" strokeLinecap="round" />
        <circle cx="163" cy="92" r="20" fill="#89E219" stroke="#58A700" strokeWidth="3" />
        <path d="M163 92 m-12 0 a12 12 0 1 1 12 12 a8 8 0 1 1 -8 -8 a4 4 0 1 1 4 4" stroke="#58A700" strokeWidth="3" fill="none" />
        <ellipse cx="142" cy="140" rx="12" ry="16" fill="#8A5A33" transform="rotate(25 142 140)" />
      </g>
    </svg>
  );
}

/** Uni, o unicórnio que aparece nos erros rebolando para animar o aluno. */
export function Uni({ size = 80, dancing = true, className = "" }: { size?: number; dancing?: boolean; className?: string }) {
  const d = dancing;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} role="img" aria-label="Uni, o unicórnio, dançando">
      <Style />
      {/* notinhas musicais */}
      {d && <text className="fx-note" x="22" y="60" fontSize="22" fill="#CE82FF">♪</text>}
      {d && <text className="fx-note2" x="170" y="50" fontSize="22" fill="#1CB0F6">♫</text>}
      <g className={d ? "fx-uni" : undefined}>
        {/* patas (dançando alternado) */}
        <g className={d ? "fx-uni-leg" : undefined}>
          <rect x="76" y="150" width="16" height="34" rx="8" fill="#FFFFFF" stroke="#E5E5E5" strokeWidth="2" />
          <rect x="76" y="176" width="16" height="10" rx="5" fill="#FF86C8" />
        </g>
        <g className={d ? "fx-uni-leg2" : undefined}>
          <rect x="132" y="150" width="16" height="34" rx="8" fill="#FFFFFF" stroke="#E5E5E5" strokeWidth="2" />
          <rect x="132" y="176" width="16" height="10" rx="5" fill="#FF86C8" />
        </g>
        {/* quadril + rabo rebolando */}
        <g className={d ? "fx-uni-hips" : undefined}>
          <g className={d ? "fx-uni-tail" : undefined}>
            <path d="M160 116 C190 100 196 130 186 146 C180 156 170 150 174 140 C178 130 168 128 160 132 Z" fill="#FF86C8" />
            <path d="M162 124 C184 118 186 136 178 142 C184 130 172 128 164 132 Z" fill="#7AD7F0" />
            <path d="M163 128 C176 128 178 138 172 144" stroke="#FFC800" strokeWidth="4" fill="none" strokeLinecap="round" />
          </g>
          <ellipse cx="120" cy="138" rx="48" ry="30" fill="#FFFFFF" stroke="#E5E5E5" strokeWidth="2" />
          {/* coraçõezinhos no bumbum */}
          <path d="M146 128 c3 -5 9 -1 5 4 l-5 5 l-5 -5 c-4 -5 2 -9 5 -4 Z" fill="#FF86C8" />
          <circle cx="140" cy="142" r="2.5" fill="#FFC800" />
          <circle cx="152" cy="140" r="2" fill="#CE82FF" />
        </g>
        {/* cabeça */}
        <ellipse cx="66" cy="92" rx="38" ry="36" fill="#FFFFFF" stroke="#E5E5E5" strokeWidth="2" />
        <ellipse cx="48" cy="108" rx="18" ry="13" fill="#FFE1F0" />
        <circle cx="44" cy="106" r="2" fill="#E07AA8" />
        {/* chifre */}
        <path d="M70 58 L82 18 L90 60 Z" fill="#FFC800" stroke="#E0A800" strokeWidth="2" />
        <path d="M74 50 L86 46 M77 40 L87 36 M80 30 L86 27" stroke="#E0A800" strokeWidth="2" />
        {/* orelha */}
        <path d="M92 64 L104 44 L106 70 Z" fill="#FFFFFF" stroke="#E5E5E5" strokeWidth="2" />
        <path d="M96 64 L103 52 L104 66 Z" fill="#FFB3D9" />
        {/* crina */}
        <path d="M88 60 C112 56 122 76 112 92 C126 96 124 116 108 118 C114 106 104 98 96 104 C104 90 96 74 84 72 Z" fill="#FF86C8" />
        <path d="M94 66 C108 68 112 80 104 90 C112 92 112 104 104 108" stroke="#7AD7F0" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M90 62 C76 60 62 66 58 74 C70 70 80 72 86 78 Z" fill="#CE82FF" />
        {/* olho grande brilhante (piscadinha de "tudo bem!") */}
        <ellipse cx="62" cy="88" rx="11" ry="13" fill="#2B2B52" />
        <ellipse cx="62" cy="90" rx="7" ry="8" fill="#1CB0F6" />
        <circle cx="58" cy="84" r="4" fill="#FFFFFF" />
        <circle cx="65" cy="94" r="2" fill="#FFFFFF" />
        <path d="M52 76 L48 72 M58 74 L56 69 M64 74 L64 69" stroke="#2B2B52" strokeWidth="2" strokeLinecap="round" />
        {/* bochecha e sorriso */}
        <ellipse cx="80" cy="104" rx="7" ry="4" fill="#FF86C8" opacity=".6" />
        <path d="M52 116 q8 6 16 0" stroke="#E07AA8" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** Ícone do app (também salvo como public/icon.svg). */
export function AppIcon({ size = 48 }: { size?: number }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label="FenixInglês">
      <rect width="200" height="200" rx="44" fill="#58CC02" />
      <g transform="translate(10 18) scale(.9)">
        <path d="M100 6 C108 18 116 22 112 34 C120 30 122 24 121 20 C130 32 124 44 112 46 L88 46 C76 44 72 32 80 22 C80 28 84 32 88 34 C84 22 94 16 100 6 Z" fill="#FF9600" />
        <path d="M100 20 C104 28 108 30 106 38 L94 38 C92 32 96 28 100 20 Z" fill="#FFC800" />
        <rect x="34" y="36" width="132" height="108" rx="38" fill="#B07A4A" />
        <ellipse cx="50" cy="46" rx="12" ry="10" fill="#8A5A33" />
        <ellipse cx="150" cy="46" rx="12" ry="10" fill="#8A5A33" />
        <path d="M58 78 q10 -11 20 0 M122 78 q10 -11 20 0" stroke="#3B2414" strokeWidth="6" fill="none" strokeLinecap="round" />
        <ellipse cx="58" cy="102" rx="10" ry="7" fill="#FF8FA3" opacity=".7" />
        <ellipse cx="142" cy="102" rx="10" ry="7" fill="#FF8FA3" opacity=".7" />
        <rect x="56" y="92" width="88" height="48" rx="22" fill="#7A4A28" />
        <ellipse cx="88" cy="108" rx="5" ry="4" fill="#2B170B" />
        <ellipse cx="112" cy="108" rx="5" ry="4" fill="#2B170B" />
        <path d="M88 122 q12 11 24 0" stroke="#2B170B" strokeWidth="5" fill="none" strokeLinecap="round" />
      </g>
      <text x="100" y="188" textAnchor="middle" fontFamily="Nunito, Arial, sans-serif" fontWeight="800" fontSize="30" fill="#FFFFFF">EN</text>
    </svg>
  );
}
