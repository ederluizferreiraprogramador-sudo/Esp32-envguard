// Turma do FenixInglês: personagens ilustrados (imagens em /characters/*.webp).
export type CastId =
  | "panda" | "lontra" | "polvo-professor" | "polvinho" | "capivara" | "camaleao"
  | "pantera" | "onca" | "aguia" | "pelicano" | "preguica"
  | "fenix-leitora" | "fenix-exploradora" | "fenix-cantora" | "fenix-meditando"
  | "fenix-voando" | "fenix-mae" | "fenix-guerreira" | "fenix-letras" | "fenix-selo";

export const CAST: { id: CastId; name: string; role: string }[] = [
  { id: "fenix-voando", name: "Fê, a Fênix", role: "mascote" },
  { id: "panda", name: "Pandi", role: "adora ler em inglês" },
  { id: "lontra", name: "Lola", role: "treina o listening" },
  { id: "polvo-professor", name: "Prof. Oto", role: "explica a gramática" },
  { id: "polvinho", name: "Tito", role: "ajuda na escrita" },
  { id: "camaleao", name: "Leo", role: "muda de cor e traduz" },
  { id: "capivara", name: "Capi", role: "comemora acertos" },
  { id: "onca", name: "Jaci", role: "guarda as conquistas" },
  { id: "pantera", name: "Nina", role: "corre na sequência" },
  { id: "aguia", name: "Ágata", role: "vê o seu progresso" },
  { id: "pelicano", name: "Pepe", role: "pesca palavras novas" },
  { id: "preguica", name: "Soneca", role: "lembra de descansar" },
];

/** Base dos arquivos de imagem: "/characters/" no app; a versão de teste define window.__FX_ASSETS__. */
export function castSrc(id: CastId) {
  const base = (typeof window !== "undefined" && (window as unknown as { __FX_ASSETS__?: string }).__FX_ASSETS__) || "/characters/";
  return `${base}${id}.webp`;
}

/** Personagem que acompanha cada unidade na trilha (ordem do livro). */
export const UNIT_BUDDY: CastId[] = [
  "fenix-exploradora", "panda", "lontra", "polvo-professor", "camaleao", "capivara", "onca", "pantera",
  "pelicano", "aguia", "fenix-cantora", "preguica", "polvinho", "fenix-voando", "fenix-leitora", "fenix-letras",
];
