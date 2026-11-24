// Avatar do aluno, desenhado em SVG a partir das escolhas do criador de avatar.
import { HEROES, type AvatarConfig } from "@/lib/student";
import { castSrc } from "@/lib/cast";
import { Pet } from "./Pet";

const darker = (hex: string, f = 0.75) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v * f)));
  return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => c(v).toString(16).padStart(2, "0")).join("")}`;
};

function Eyes({ a }: { a: AvatarConfig }) {
  const L = 80, R = 120, Y = 96;
  switch (a.eyes) {
    case "feliz": return <path d={`M${L - 9} ${Y + 2} q9 -11 18 0 M${R - 9} ${Y + 2} q9 -11 18 0`} stroke="#2B2B3A" strokeWidth="5" fill="none" strokeLinecap="round" />;
    case "piscando": return <g><path d={`M${L - 9} ${Y} q9 -9 18 0`} stroke="#2B2B3A" strokeWidth="5" fill="none" strokeLinecap="round" />
      <circle cx={R} cy={Y} r="12" fill="#fff" /><circle cx={R} cy={Y} r="8" fill={a.eyeColor} /><circle cx={R} cy={Y} r="4.5" fill="#1E1E2E" /><circle cx={R - 3} cy={Y - 4} r="3" fill="#fff" /></g>;
    case "estrela": return <g>{[L, R].map((x) => <path key={x} d={`M${x} ${Y - 12} l3.5 8 8.5 1 -6.5 6 2 8.5 -7.5 -4.5 -7.5 4.5 2 -8.5 -6.5 -6 8.5 -1 Z`} fill={a.eyeColor} stroke="#2B2B3A" strokeWidth="2" />)}</g>;
    default: return <g>{[L, R].map((x) => <g key={x}><circle cx={x} cy={Y} r="14" fill={a.eyeColor} /><circle cx={x} cy={Y} r="10" fill="#1E1E2E" /><circle cx={x - 4} cy={Y - 5} r="4.5" fill="#fff" /><circle cx={x + 4} cy={Y + 4} r="2" fill="#fff" /></g>)}</g>;
  }
}

function Hair({ a, back }: { a: AvatarConfig; back?: boolean }) {
  const c = a.hairColor, d = darker(c);
  if (back) {
    if (a.hair === "longo") return <path d="M48 92 C44 150 60 176 74 176 L126 176 C140 176 156 150 152 92 Z" fill={c} stroke={d} strokeWidth="3" />;
    if (a.hair === "rabo") return <path d="M146 70 C176 80 178 128 160 146 C166 120 158 98 144 92 Z" fill={c} stroke={d} strokeWidth="3" />;
    return null;
  }
  switch (a.hair) {
    case "careca": return <ellipse cx="86" cy="58" rx="10" ry="5" fill="#fff" opacity=".35" />;
    case "moicano": return <path d="M88 52 L92 18 L100 44 L104 14 L110 44 L118 20 L114 54 Z" fill={c} stroke={d} strokeWidth="3" strokeLinejoin="round" />;
    case "cacheado": return <g fill={c} stroke={d} strokeWidth="2.5">{([[60, 66], [74, 52], [92, 46], [110, 46], [128, 52], [142, 66], [52, 84], [148, 84]] as const).map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="16" />)}</g>;
    default: return <path d="M50 92 C46 50 78 36 100 38 C126 38 156 52 150 92 C140 74 120 64 100 66 C80 64 62 72 50 92 Z" fill={c} stroke={d} strokeWidth="3" />;
  }
}

function Mustache({ a }: { a: AvatarConfig }) {
  const c = a.hairColor;
  switch (a.mustache) {
    case "classico": return <path d="M84 120 C90 112 98 114 100 118 C102 114 110 112 116 120 C108 124 102 122 100 120 C98 122 92 124 84 120 Z" fill={c} />;
    case "enrolado": return <path d="M100 118 C92 112 82 114 78 122 C74 128 66 124 70 118 M100 118 C108 112 118 114 122 122 C126 128 134 124 130 118" stroke={c} strokeWidth="6" fill="none" strokeLinecap="round" />;
    case "fino": return <path d="M86 119 Q100 112 114 119" stroke={c} strokeWidth="3.5" fill="none" strokeLinecap="round" />;
    default: return null;
  }
}


const BODY = "M40 200 C42 164 66 148 100 148 C134 148 158 164 160 200 Z";
/** Trajes dos heróis 3D desenhados no avatar (dá para misturar com cabelo, olhos etc.). */
function Suit({ outfit }: { outfit: string }) {
  switch (outfit) {
    case "traje-nova": return <g><path d={BODY} fill="#F4F7FA" stroke="#2B3A44" strokeWidth="3" />
      <path d="M70 152 L86 200 M130 152 L114 200" stroke="#2B3A44" strokeWidth="6" opacity=".8" />
      <ellipse cx="56" cy="172" rx="16" ry="12" fill="#2BB5A8" stroke="#1B7F76" strokeWidth="3" /><ellipse cx="144" cy="172" rx="16" ry="12" fill="#2BB5A8" stroke="#1B7F76" strokeWidth="3" />
      <path d="M100 166 l10 6 v12 l-10 6 l-10 -6 v-12 Z" fill="#7FF5FF" stroke="#36E0C4" strokeWidth="3" className="avatar-glow" /></g>;
    case "traje-tita": return <g><path d={BODY} fill="#1F2A6B" stroke="#121848" strokeWidth="3" />
      <path d="M66 156 C80 150 120 150 134 156 L118 200 L82 200 Z" fill="#FF7A45" stroke="#C94D1E" strokeWidth="3" />
      <ellipse cx="52" cy="176" rx="18" ry="14" fill="#FF7A45" stroke="#C94D1E" strokeWidth="3" /><ellipse cx="148" cy="176" rx="18" ry="14" fill="#FF7A45" stroke="#C94D1E" strokeWidth="3" />
      <path d="M100 160 l5 10 11 1 -8 7 3 11 -11 -6 -11 6 3 -11 -8 -7 11 -1 Z" fill="#FFD43B" stroke="#1F2A6B" strokeWidth="2" /></g>;
    case "traje-raio": return <g><path d={BODY} fill="#6B3FC9" stroke="#3E1F8A" strokeWidth="3" />
      <path d="M78 150 Q100 166 122 150" stroke="#D7D9E6" strokeWidth="6" fill="none" />
      <path d="M58 168 L74 200 M142 168 L126 200" stroke="#D7D9E6" strokeWidth="5" />
      <path d="M104 162 L92 180 H101 L96 196 L110 174 H101 Z" fill="#FFD43B" stroke="#E0A800" strokeWidth="1.5" /></g>;
    case "traje-fenix": return <g><path d={BODY} fill="#D9341E" stroke="#8E1E0F" strokeWidth="3" />
      <path d="M66 156 L100 182 L134 156" stroke="#FFB020" strokeWidth="6" fill="none" strokeLinejoin="round" />
      <path d="M100 168 C108 176 112 184 106 194 C104 188 100 186 100 186 C100 186 96 188 94 194 C88 184 92 176 100 168 Z" fill="#FFD43B" stroke="#E07A00" strokeWidth="2" /></g>;
    case "traje-astra": return <g><path d={BODY} fill="#FBF7FC" stroke="#B9A9C6" strokeWidth="3" />
      <ellipse cx="56" cy="174" rx="14" ry="11" fill="#FF6FD0" /><ellipse cx="144" cy="174" rx="14" ry="11" fill="#FF6FD0" />
      <rect x="60" y="188" width="80" height="8" rx="4" fill="#FF6FD0" opacity=".85" />
      <circle cx="100" cy="172" r="8" fill="#B07CFF" /><ellipse cx="100" cy="172" rx="14" ry="4" fill="none" stroke="#FF6FD0" strokeWidth="2.5" /></g>;
    case "traje-onda": return <g><path d={BODY} fill="#1E5FD6" stroke="#123E91" strokeWidth="3" />
      <path d="M46 186 C60 176 70 196 84 186 M116 186 C130 176 140 196 154 186 M60 166 C70 158 78 172 88 164 M112 164 C122 172 130 158 140 166" stroke="#7FE3FF" strokeWidth="5" fill="none" strokeLinecap="round" />
      <circle cx="100" cy="176" r="11" fill="#7FE3FF" /><path d="M92 178 C94 168 106 166 108 174 C104 172 100 174 100 180" stroke="#1E5FD6" strokeWidth="3" fill="none" /></g>;
    default: return null;
  }
}
/** Capa (Raio) e asas (Fênix) ficam atrás do corpo. */
function SuitBack({ outfit }: { outfit: string }) {
  if (outfit === "traje-raio") return <path d="M14 200 L62 150 L138 150 L186 200 Z" fill="#B79CFF" stroke="#7D5BD6" strokeWidth="3" />;
  if (outfit === "traje-fenix") return <g fill="#FFB020" stroke="#E0600A" strokeWidth="2.5" strokeLinejoin="round">
    <path d="M74 158 C40 150 14 118 10 80 C26 104 40 112 54 116 C38 100 30 82 32 62 C46 90 64 104 84 150 Z" />
    <path d="M126 158 C160 150 186 118 190 80 C174 104 160 112 146 116 C162 100 170 82 168 62 C154 90 136 104 116 150 Z" />
    <path d="M70 150 C48 140 34 124 30 104 C44 120 58 128 72 132 Z M130 150 C152 140 166 124 170 104 C156 120 142 128 128 132 Z" fill="#FFE27A" /></g>;
  return null;
}

function Outfit({ a }: { a: AvatarConfig }) {
  if (a.outfit.startsWith("traje-")) return <Suit outfit={a.outfit} />;
  const c = a.outfitColor, d = darker(c);
  switch (a.outfit) {
    case "moletom": return <g><path d="M38 200 C40 162 64 146 100 146 C136 146 160 162 162 200 Z" fill={c} stroke={d} strokeWidth="3" /><path d="M76 150 C84 166 116 166 124 150" stroke={d} strokeWidth="5" fill="none" /><rect x="80" y="178" width="40" height="18" rx="6" fill={d} opacity=".5" /></g>;
    case "vestido": return <g><path d="M34 200 L60 150 C80 144 120 144 140 150 L166 200 Z" fill={c} stroke={d} strokeWidth="3" /><circle cx="78" cy="176" r="4" fill="#fff" opacity=".7" /><circle cx="120" cy="184" r="4" fill="#fff" opacity=".7" /><circle cx="100" cy="166" r="4" fill="#fff" opacity=".7" /></g>;
    case "jaqueta": return <g><path d="M38 200 C40 162 64 146 100 146 C136 146 160 162 162 200 Z" fill={c} stroke={d} strokeWidth="3" /><path d="M100 148 V200" stroke={d} strokeWidth="4" /><path d="M86 148 L100 170 L114 148" fill="#fff" stroke={d} strokeWidth="3" /></g>;
    default: return <g><path d="M40 200 C42 164 66 148 100 148 C134 148 158 164 160 200 Z" fill={c} stroke={d} strokeWidth="3" /><path d="M86 150 Q100 162 114 150" stroke={d} strokeWidth="3" fill="none" /></g>;
  }
}

function Costume({ a }: { a: AvatarConfig }) {
  switch (a.costume) {
    case "dino": return <g>
      <path d="M40 104 C34 40 70 22 100 22 C130 22 166 40 160 104 C152 80 130 66 100 66 C70 66 48 80 40 104 Z" fill="#58CC02" stroke="#3A8A00" strokeWidth="3" />
      {([[70, 30], [100, 18], [130, 30]] as const).map(([x, y]) => <path key={x} d={`M${x - 8} ${y + 8} L${x} ${y - 8} L${x + 8} ${y + 8} Z`} fill="#FF86C8" />)}
      <circle cx="70" cy="40" r="12" fill="#fff" stroke="#3A8A00" strokeWidth="2" /><circle cx="72" cy="40" r="5" fill="#2B2B3A" />
      <circle cx="130" cy="40" r="12" fill="#fff" stroke="#3A8A00" strokeWidth="2" /><circle cx="132" cy="40" r="5" fill="#2B2B3A" /></g>;
    case "gatinho": return <g>
      <path d="M42 104 C36 46 70 30 100 30 C130 30 164 46 158 104 C150 80 128 68 100 68 C72 68 50 80 42 104 Z" fill="#C9CCD6" stroke="#7E8494" strokeWidth="3" />
      <path d="M48 58 L50 14 L84 38 Z M152 58 L150 14 L116 38 Z" fill="#C9CCD6" stroke="#7E8494" strokeWidth="3" strokeLinejoin="round" />
      <path d="M56 48 L58 26 L76 38 Z M144 48 L142 26 L124 38 Z" fill="#FFC2D6" /></g>;
    case "unicornio": return <g>
      <path d="M42 104 C36 46 70 30 100 30 C130 30 164 46 158 104 C150 80 128 68 100 68 C72 68 50 80 42 104 Z" fill="#F7A8D8" stroke="#D9539E" strokeWidth="3" />
      <path d="M92 34 L100 0 L108 34 Z" fill="#FFC800" stroke="#E0A800" strokeWidth="2" />
      <path d="M58 52 L52 24 L80 40 Z M142 52 L148 24 L120 40 Z" fill="#F7A8D8" stroke="#D9539E" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="64" cy="64" r="6" fill="#9CDCFF" /><circle cx="138" cy="70" r="5" fill="#FFE27A" /></g>;
    case "fenix": return <g>
      <path d="M42 104 C36 46 70 30 100 30 C130 30 164 46 158 104 C150 80 128 68 100 68 C72 68 50 80 42 104 Z" fill="#FF9600" stroke="#E5600A" strokeWidth="3" />
      <path d="M100 0 C110 16 118 22 114 36 C124 30 128 20 126 14 C138 30 130 44 118 46 L82 46 C70 44 62 30 74 14 C72 20 76 30 86 36 C82 22 90 14 100 0 Z" fill="#FF4B4B" />
      <path d="M100 14 C105 22 108 28 105 38 L95 38 C92 28 96 22 100 14 Z" fill="#FFC800" /></g>;
    default: return null;
  }
}

function Accessory({ a }: { a: AvatarConfig }) {
  switch (a.accessory) {
    case "oculos": return <g fill="none" stroke="#2B2B3A" strokeWidth="4"><circle cx="80" cy="96" r="17" /><circle cx="120" cy="96" r="17" /><path d="M97 96 H103 M63 94 L50 90 M137 94 L150 90" /></g>;
    case "bone": return <g><path d="M50 80 C50 44 150 44 150 80 Z" fill="#1CB0F6" stroke="#1899D6" strokeWidth="3" /><path d="M140 78 C160 76 176 82 178 90 L144 88 Z" fill="#1899D6" /><circle cx="100" cy="48" r="5" fill="#FFC800" /></g>;
    case "laco": return <g><path d="M130 52 L108 40 L110 66 Z M130 52 L152 40 L150 66 Z" fill="#FF4FA3" stroke="#C2307A" strokeWidth="2" /><circle cx="130" cy="53" r="7" fill="#FF86C8" stroke="#C2307A" strokeWidth="2" /></g>;
    case "visor": return <g><path d="M48 98 C44 40 156 40 152 98" stroke="#F4F7FA" strokeWidth="10" fill="none" /><path d="M48 98 C44 40 156 40 152 98" stroke="#2BB5A8" strokeWidth="3" fill="none" />
      <path d="M60 66 C80 50 120 50 140 66 L138 78 C120 66 80 66 62 78 Z" fill="#7FF5FF" stroke="#36E0C4" strokeWidth="3" opacity=".9" className="avatar-glow" />
      <circle cx="48" cy="100" r="13" fill="#F4F7FA" stroke="#2BB5A8" strokeWidth="4" /><circle cx="152" cy="100" r="13" fill="#F4F7FA" stroke="#2BB5A8" strokeWidth="4" /></g>;
    case "goggles": return <g><path d="M52 66 C70 56 130 56 148 66" stroke="#6B3FC9" strokeWidth="6" fill="none" />
      <circle cx="82" cy="62" r="13" fill="#B79CFF" stroke="#D7D9E6" strokeWidth="4" /><circle cx="118" cy="62" r="13" fill="#B79CFF" stroke="#D7D9E6" strokeWidth="4" />
      <circle cx="78" cy="58" r="4" fill="#fff" opacity=".8" /><circle cx="114" cy="58" r="4" fill="#fff" opacity=".8" /></g>;
    case "capacete": return <g><circle cx="100" cy="94" r="66" fill="#CFE8FF" fillOpacity=".22" stroke="#E6F3FF" strokeWidth="5" />
      <path d="M58 60 C70 42 88 36 104 36" stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round" opacity=".8" />
      <rect x="62" y="150" width="76" height="10" rx="5" fill="#FF6FD0" /></g>;
    case "mascara": return <path fillRule="evenodd" d="M50 84 C70 74 130 74 150 84 L148 108 C132 114 112 110 100 104 C88 110 68 114 52 108 Z M66 96 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0 Z M106 96 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0 Z" fill="#1E5FD6" stroke="#123E91" strokeWidth="2.5" />;
    case "fones": return <g><path d="M50 96 C48 40 152 40 150 96" stroke="#9C7BFF" strokeWidth="8" fill="none" /><rect x="38" y="86" width="18" height="30" rx="8" fill="#9C7BFF" /><rect x="144" y="86" width="18" height="30" rx="8" fill="#9C7BFF" /></g>;
    default: return null;
  }
}

/** Rosto do herói 3D recortado num círculo (para tamanhos pequenos). */
export function HeroFace({ hero, size = 40, className = "" }: { hero: (typeof HEROES)[number]; size?: number; className?: string }) {
  const Z = 2.6, [cx, cy] = hero.face;
  return (
    <span role="img" aria-label={`Seu avatar: ${hero.name}`} className={`relative inline-block shrink-0 overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size, background: `radial-gradient(circle at 50% 35%, #fff, ${hero.color})` }}>
      <img src={castSrc(`heroi-${hero.id}`)} alt="" draggable={false} className="absolute max-w-none select-none"
        style={{ width: size * Z, height: size * Z, left: size / 2 - size * Z * cx, top: size / 2 - size * Z * cy }} />
    </span>
  );
}

export function Avatar({ a, size = 96, className = "" }: { a: AvatarConfig; size?: number; className?: string }) {
  const hero = HEROES.find((h) => h.id === a.hero);
  if (hero) return size <= 110 ? <HeroFace hero={hero} size={size} className={className} /> : <Pet id={`heroi-${hero.id}`} size={size} anim="float" className={className} />;
  const hood = a.costume !== "nenhuma";
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} role="img" aria-label="Seu avatar">
      <defs><clipPath id="fx-av-circle"><circle cx="100" cy="100" r="100" /></clipPath></defs>
      <g clipPath="url(#fx-av-circle)">
        <circle cx="100" cy="100" r="100" fill="#DDF4FF" />
        <SuitBack outfit={a.outfit} />
        {!hood && <Hair a={a} back />}
        <Outfit a={a} />
        <rect x="88" y="132" width="24" height="20" fill={a.skin} />
        <ellipse cx="100" cy="96" rx="50" ry="48" fill={a.skin} stroke={darker(a.skin, 0.85)} strokeWidth="3" />
        <ellipse cx="50" cy="100" rx="8" ry="11" fill={a.skin} stroke={darker(a.skin, 0.85)} strokeWidth="3" />
        <ellipse cx="150" cy="100" rx="8" ry="11" fill={a.skin} stroke={darker(a.skin, 0.85)} strokeWidth="3" />
        <Eyes a={a} />
        <ellipse cx="66" cy="114" rx="8" ry="5" fill="#FF86C8" opacity=".45" />
        <ellipse cx="134" cy="114" rx="8" ry="5" fill="#FF86C8" opacity=".45" />
        <path d="M100 104 q-3 6 0 8" stroke={darker(a.skin, 0.7)} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M86 126 q14 12 28 0" stroke="#C2307A" strokeWidth="4" fill="#fff" strokeLinecap="round" />
        <Mustache a={a} />
        {hood ? <Costume a={a} /> : <Hair a={a} />}
        <Accessory a={a} />
      </g>
    </svg>
  );
}
