import { BigEye } from "./Kittens";

/** Fênix, mascote do FenixInglês: passarinho de fogo no estilo zoiudo da turma (SVG próprio). */
export function Phoenix({ size = 120, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" className={className} aria-label="Fênix, mascote do FenixInglês">
      <defs>
        <linearGradient id="fx-fire" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#FF4B4B" /><stop offset=".55" stopColor="#FF9600" /><stop offset="1" stopColor="#FFC800" />
        </linearGradient>
      </defs>
      {/* cauda de chamas */}
      <path d="M70 168 C40 190 20 172 30 150 C36 166 52 166 60 156 Z" fill="url(#fx-fire)" />
      <path d="M130 168 C160 190 180 172 170 150 C164 166 148 166 140 156 Z" fill="url(#fx-fire)" />
      <path d="M100 176 C92 198 108 198 100 176 Z M100 170 C84 196 116 196 100 170 Z" fill="url(#fx-fire)" />
      {/* asas de fogo */}
      <path d="M44 110 C14 96 10 132 26 150 C30 136 40 132 52 132 Z" fill="url(#fx-fire)" />
      <path d="M156 110 C186 96 190 132 174 150 C170 136 160 132 148 132 Z" fill="url(#fx-fire)" />
      {/* corpo redondo */}
      <ellipse cx="100" cy="112" rx="58" ry="60" fill="#FF9600" stroke="#E5600A" strokeWidth="3" />
      <ellipse cx="100" cy="138" rx="34" ry="30" fill="#FFD84D" />
      {/* topete de chamas */}
      <path d="M100 6 C112 24 122 30 116 50 C128 42 132 30 130 22 C144 40 136 58 120 62 L80 62 C64 58 56 40 70 22 C68 30 72 42 84 50 C78 30 88 22 100 6 Z" fill="url(#fx-fire)" stroke="#E5600A" strokeWidth="2" />
      <path d="M100 26 C106 36 110 42 106 54 L94 54 C90 44 94 36 100 26 Z" fill="#FFE27A" />
      {/* olhos zoiudos */}
      <BigEye cx={76} cy={96} r={18} iris="#FF4B4B" />
      <BigEye cx={124} cy={96} r={18} iris="#FF4B4B" />
      {/* bico e bochechas */}
      <path d="M90 116 L110 116 L100 130 Z" fill="#FFC800" stroke="#E0A800" strokeWidth="2" strokeLinejoin="round" />
      <ellipse cx="62" cy="122" rx="8" ry="5" fill="#FF4FA3" opacity=".45" />
      <ellipse cx="138" cy="122" rx="8" ry="5" fill="#FF4FA3" opacity=".45" />
      {/* pezinhos */}
      <path d="M84 168 l-6 12 M90 170 v12 M110 170 v12 M116 168 l6 12" stroke="#E0A800" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}
