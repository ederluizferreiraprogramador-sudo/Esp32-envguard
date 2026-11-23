import type { ReactNode } from "react";
// Turma "zoiuda" do FenixInglês (SVG próprio): olhos grandes e brilhantes, corpo fofinho.
// Charlotte: gatinha cinza rajada com laço rosa (professora). Mingau: laranja. Luna: preta.

export type KittenName = "charlotte" | "mingau" | "luna";

const KITTENS: Record<KittenName, { label: string; fur: string; furDark: string; belly: string; ear: string; iris: string; stripes: boolean; bow?: string }> = {
  charlotte: { label: "Charlotte, a gatinha professora", fur: "#C9CCD6", furDark: "#7E8494", belly: "#FFFFFF", ear: "#FFC2D6", iris: "#E0609E", stripes: true, bow: "#FF4FA3" },
  mingau: { label: "Mingau, o gatinho laranja", fur: "#FFB45C", furDark: "#D9771A", belly: "#FFF1DE", ear: "#FFD3A8", iris: "#58CC02", stripes: true },
  luna: { label: "Luna, a gatinha preta", fur: "#4B4B5C", furDark: "#2E2E3A", belly: "#6E6E85", ear: "#B98AC9", iris: "#FFC800", stripes: false },
};

const CSS = `
@keyframes fx-kit-tail { 0%,100% { transform: rotate(-8deg) } 50% { transform: rotate(14deg) } }
@keyframes fx-kit-blink { 0%,92%,100% { transform: scaleY(1) } 96% { transform: scaleY(.1) } }
@keyframes fx-kit-hop { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-4%) } }
@keyframes fx-kit-sparkle { 0%,100% { opacity: .2 } 50% { opacity: 1 } }
.fx-kit-tail { animation: fx-kit-tail 1.4s ease-in-out infinite; transform-box: view-box; transform-origin: 140px 165px; }
.fx-kit-eye { animation: fx-kit-blink 3.5s infinite; transform-box: fill-box; transform-origin: center; }
.fx-kit-hop { animation: fx-kit-hop 1.2s ease-in-out infinite; }
.fx-kit-spk { animation: fx-kit-sparkle 1.6s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .fx-kit-tail,.fx-kit-eye,.fx-kit-hop,.fx-kit-spk { animation: none } }
`;

/** Olho grande e brilhante (estilo zoiudo), reaproveitado por toda a turma. */
export function BigEye({ cx, cy, r, iris }: { cx: number; cy: number; r: number; iris: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 3} fill={iris} />
      <circle cx={cx} cy={cy} r={r + 3} fill="none" stroke="#FFFFFF" strokeOpacity=".5" strokeWidth="1.5" strokeDasharray="2 3" />
      <circle cx={cx} cy={cy} r={r - 2} fill="#1E1E2E" />
      <circle cx={cx - r * 0.35} cy={cy - r * 0.38} r={r * 0.32} fill="#FFFFFF" />
      <circle cx={cx + r * 0.3} cy={cy + r * 0.3} r={r * 0.14} fill="#FFFFFF" />
    </g>
  );
}

export function Kitten({ name = "charlotte", size = 80, animated = true, className = "" }: { name?: KittenName; size?: number; animated?: boolean; className?: string }) {
  const k = KITTENS[name];
  const a = animated;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} role="img" aria-label={k.label}>
      <style>{CSS}</style>
      <g className={a ? "fx-kit-hop" : undefined}>
        <g className={a ? "fx-kit-tail" : undefined}>
          <path d="M136 170 C178 166 190 124 170 98 C163 91 154 98 160 106 C173 124 162 150 134 154 Z" fill={k.fur} stroke={k.furDark} strokeWidth="3" />
          {k.stripes && <path d="M170 112 l-11 4 M172 128 l-13 2 M166 144 l-12 -2" stroke={k.furDark} strokeWidth="5" strokeLinecap="round" />}
        </g>
        {/* corpo sentadinho */}
        <ellipse cx="100" cy="156" rx="44" ry="36" fill={k.fur} stroke={k.furDark} strokeWidth="3" />
        <ellipse cx="100" cy="160" rx="24" ry="26" fill={k.belly} />
        {k.stripes && <path d="M62 146 q8 4 14 0 M60 160 q8 4 14 0 M138 146 q-8 4 -14 0 M140 160 q-8 4 -14 0" stroke={k.furDark} strokeWidth="4" fill="none" strokeLinecap="round" />}
        <ellipse cx="82" cy="188" rx="13" ry="8" fill={k.belly} stroke={k.furDark} strokeWidth="3" />
        <ellipse cx="118" cy="188" rx="13" ry="8" fill={k.belly} stroke={k.furDark} strokeWidth="3" />
        {/* orelhas */}
        <path d="M42 70 L46 14 L92 44 Z" fill={k.fur} stroke={k.furDark} strokeWidth="3" strokeLinejoin="round" />
        <path d="M158 70 L154 14 L108 44 Z" fill={k.fur} stroke={k.furDark} strokeWidth="3" strokeLinejoin="round" />
        <path d="M54 56 L56 30 L80 44 Z" fill={k.ear} />
        <path d="M146 56 L144 30 L120 44 Z" fill={k.ear} />
        {/* cabeça grande (proporção de pelúcia) */}
        <ellipse cx="100" cy="82" rx="64" ry="54" fill={k.fur} stroke={k.furDark} strokeWidth="3" />
        {k.stripes && <path d="M88 32 l3 16 M100 30 v18 M112 32 l-3 16 M40 80 h12 M38 92 h12 M160 80 h-12 M162 92 h-12" stroke={k.furDark} strokeWidth="5" strokeLinecap="round" />}
        <ellipse cx="100" cy="108" rx="26" ry="18" fill={k.belly} />
        {/* olhos zoiudos */}
        <g className={a ? "fx-kit-eye" : undefined}><BigEye cx={72} cy={80} r={19} iris={k.iris} /></g>
        <g className={a ? "fx-kit-eye" : undefined}><BigEye cx={128} cy={80} r={19} iris={k.iris} /></g>
        {/* nariz, boca, bigodes */}
        <path d="M94 100 h12 l-6 7 Z" fill="#FF6FA8" />
        <path d="M100 107 q-6 8 -12 3 M100 107 q6 8 12 3" stroke="#2B2B3A" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M74 104 l-34 -4 M74 110 l-34 6 M126 104 l34 -4 M126 110 l34 6" stroke={name === "luna" ? "#C9C9D6" : "#9A9AA8"} strokeWidth="2.2" strokeLinecap="round" />
        <ellipse cx="54" cy="104" rx="8" ry="5" fill="#FF86C8" opacity=".5" />
        <ellipse cx="146" cy="104" rx="8" ry="5" fill="#FF86C8" opacity=".5" />
        {k.bow && (
          <g>
            <path d="M100 34 L78 20 L78 48 Z" fill={k.bow} stroke="#C2307A" strokeWidth="2" />
            <path d="M100 34 L122 20 L122 48 Z" fill={k.bow} stroke="#C2307A" strokeWidth="2" />
            <circle cx="100" cy="34" r="7" fill="#FF86C8" stroke="#C2307A" strokeWidth="2" />
          </g>
        )}
        {a && <path className="fx-kit-spk" d="M176 40 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 Z" fill="#FFC800" />}
      </g>
    </svg>
  );
}

/** Personagem falando: bichinho + balão de fala. */
export function CharlotteSays({ children, name = "charlotte" }: { children: ReactNode; name?: KittenName }) {
  return (
    <div className="mt-4 flex items-end gap-2">
      <Kitten name={name} size={76} className="shrink-0" />
      <div className="relative min-w-0 rounded-2xl border-2 border-fx-gray bg-white p-3 text-lg">
        <span aria-hidden className="absolute -left-2 bottom-4 h-3 w-3 rotate-45 border-b-2 border-l-2 border-fx-gray bg-white" />
        {children}
      </div>
    </div>
  );
}
