// Personagens originais do FenixInglês (SVG próprio, sem imagens de terceiros).
import { BigEye } from "./Kittens";
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
.fx-uni-hips { animation: fx-uni-wiggle .5s ease-in-out infinite; transform-box: view-box; transform-origin: 100px 110px; }
.fx-uni-tail { animation: fx-uni-tail .25s ease-in-out infinite; transform-box: view-box; transform-origin: 106px 150px; }
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
        <g className="fx-capi-eye"><BigEye cx={70} cy={58} r={13} iris="#C08A2E" /></g>
        <g className="fx-capi-eye"><BigEye cx={130} cy={58} r={13} iris="#C08A2E" /></g>
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

/** Uni de costas, rebolando a bundinha para animar o aluno depois de um erro. */
export function Uni({ size = 80, dancing = true, className = "" }: { size?: number; dancing?: boolean; className?: string }) {
  const d = dancing;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} role="img" aria-label="Uni, o unicórnio, rebolando de costas">
      <Style />
      {d && <text className="fx-note" x="16" y="70" fontSize="24" fill="#CE82FF">♪</text>}
      {d && <text className="fx-note2" x="172" y="60" fontSize="24" fill="#1CB0F6">♫</text>}
      {d && <text className="fx-note" x="168" y="120" fontSize="18" fill="#FF4FA3">♥</text>}
      <g className={d ? "fx-uni" : undefined}>
        {/* cabeça vista de trás, olhando por cima do ombro */}
        <ellipse cx="100" cy="58" rx="40" ry="36" fill="#F7A8D8" stroke="#D9539E" strokeWidth="3" />
        <path d="M72 30 L66 6 L88 24 Z" fill="#F7A8D8" stroke="#D9539E" strokeWidth="3" strokeLinejoin="round" />
        <path d="M128 30 L134 6 L112 24 Z" fill="#F7A8D8" stroke="#D9539E" strokeWidth="3" strokeLinejoin="round" />
        <path d="M76 26 L72 12 L84 22 Z" fill="#FFD84D" />
        <path d="M124 26 L128 12 L116 22 Z" fill="#FFD84D" />
        <path d="M100 22 L104 -2 L110 24 Z" fill="#FFC800" stroke="#E0A800" strokeWidth="2" />
        {/* crina descendo pelas costas */}
        <path d="M96 22 C84 40 112 56 94 76 C112 86 92 104 104 118" stroke="#FF6FB5" strokeWidth="12" fill="none" strokeLinecap="round" />
        <path d="M104 24 C94 40 118 56 102 76 C118 86 100 104 110 116" stroke="#9C7BFF" strokeWidth="6" fill="none" strokeLinecap="round" />
        {/* olhinho espiando por cima do ombro */}
        <BigEye cx={136} cy={60} r={11} iris="#B57BFF" />
        {/* quadril + bundinha rebolando */}
        <g className={d ? "fx-uni-hips" : undefined}>
          <path d="M100 98 C58 98 40 128 44 152 C48 180 76 186 100 172 C124 186 152 180 156 152 C160 128 142 98 100 98 Z" fill="#F7A8D8" stroke="#D9539E" strokeWidth="3" />
          <path d="M100 132 C100 150 100 162 100 172" stroke="#D9539E" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* manchinhas coloridas de pelúcia */}
          <circle cx="70" cy="132" r="7" fill="#9CDCFF" opacity=".8" />
          <circle cx="132" cy="126" r="6" fill="#FFE27A" opacity=".9" />
          <circle cx="78" cy="160" r="5" fill="#FFE27A" opacity=".9" />
          <circle cx="128" cy="160" r="7" fill="#9CDCFF" opacity=".8" />
          <circle cx="112" cy="110" r="4" fill="#C9A8FF" />
          {/* rabinho arco-íris abanando */}
          <g className={d ? "fx-uni-tail" : undefined}>
            <path d="M100 150 C90 170 96 196 112 198 C104 186 108 172 114 162 C116 176 124 186 134 186 C122 176 120 160 110 148 Z" fill="#FF4FA3" />
            <path d="M104 156 C100 172 104 186 112 192" stroke="#FFC800" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M108 154 C112 168 120 178 128 182" stroke="#7AD7F0" strokeWidth="4" fill="none" strokeLinecap="round" />
          </g>
          {/* cascos dourados */}
          <g className={d ? "fx-uni-leg" : undefined}><ellipse cx="66" cy="182" rx="14" ry="9" fill="#FFC800" stroke="#E0A800" strokeWidth="2" /></g>
          <g className={d ? "fx-uni-leg2" : undefined}><ellipse cx="134" cy="182" rx="14" ry="9" fill="#FFC800" stroke="#E0A800" strokeWidth="2" /></g>
        </g>
      </g>
    </svg>
  );
}

/** Uni de frente (estilo pelúcia zoiuda) para a turma e a trilha. */
export function UniFront({ size = 80, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} role="img" aria-label="Uni, o unicórnio">
      <ellipse cx="100" cy="158" rx="42" ry="34" fill="#F7A8D8" stroke="#D9539E" strokeWidth="3" />
      <circle cx="80" cy="150" r="6" fill="#9CDCFF" opacity=".8" /><circle cx="122" cy="164" r="6" fill="#FFE27A" />
      <ellipse cx="80" cy="188" rx="13" ry="8" fill="#FFC800" stroke="#E0A800" strokeWidth="2" />
      <ellipse cx="120" cy="188" rx="13" ry="8" fill="#FFC800" stroke="#E0A800" strokeWidth="2" />
      <path d="M50 54 L42 18 L80 40 Z" fill="#F7A8D8" stroke="#D9539E" strokeWidth="3" strokeLinejoin="round" />
      <path d="M150 54 L158 18 L120 40 Z" fill="#F7A8D8" stroke="#D9539E" strokeWidth="3" strokeLinejoin="round" />
      <path d="M56 46 L52 28 L72 40 Z" fill="#FFD84D" /><path d="M144 46 L148 28 L128 40 Z" fill="#FFD84D" />
      <ellipse cx="100" cy="86" rx="60" ry="54" fill="#F7A8D8" stroke="#D9539E" strokeWidth="3" />
      <circle cx="62" cy="62" r="7" fill="#9CDCFF" opacity=".8" /><circle cx="140" cy="118" r="6" fill="#FFE27A" />
      <path d="M92 36 L100 2 L108 36 Z" fill="#FFC800" stroke="#E0A800" strokeWidth="2" />
      <path d="M86 34 C96 20 112 24 116 36 C110 30 96 30 86 40 Z" fill="#FF4FA3" />
      <BigEye cx={74} cy={84} r={19} iris="#C08A2E" />
      <BigEye cx={126} cy={84} r={19} iris="#C08A2E" />
      <ellipse cx="100" cy="116" rx="24" ry="17" fill="#FFFFFF" />
      <circle cx="92" cy="114" r="2.5" fill="#E07AA8" /><circle cx="108" cy="114" r="2.5" fill="#E07AA8" />
      <path d="M92 124 q8 6 16 0" stroke="#E07AA8" strokeWidth="3" fill="none" strokeLinecap="round" />
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
