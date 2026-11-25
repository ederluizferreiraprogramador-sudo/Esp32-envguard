// Perfil do aluno (nome, idade, meta) e avatar personalizado — salvos no aparelho.
import { useEffect, useState } from "react";
import type { HeroTint } from "./heroTint";

export interface AvatarConfig {
  skin: string; eyes: "zoiudo" | "feliz" | "estrela" | "piscando"; eyeColor: string;
  hair: "curto" | "longo" | "cacheado" | "rabo" | "moicano" | "careca"; hairColor: string;
  mustache: "nenhum" | "classico" | "enrolado" | "fino";
  outfit: "camiseta" | "moletom" | "vestido" | "jaqueta" | SuitId; outfitColor: string;
  costume: "nenhuma" | "dino" | "gatinho" | "unicornio" | "fenix";
  accessory: "nenhum" | "oculos" | "bone" | "laco" | "fones" | "visor" | "goggles" | "capacete" | "mascara";
  /** Herói 3D escolhido (substitui o desenho quando diferente de "nenhum"). */
  hero: HeroId;
  /** Cores escolhidas para o herói 3D (traje, cabelo, olhos, pele); vazio = cores originais. */
  heroTint: HeroTint;
}
export type SuitId = "traje-nova" | "traje-tita" | "traje-raio" | "traje-fenix" | "traje-astra" | "traje-onda";
export type HeroId = "nenhum" | "nova" | "tita" | "raio" | "fenix" | "astra" | "onda";
export const HEROES: { id: Exclude<HeroId, "nenhum">; name: string; power: string; color: string; face: [number, number]; wear: Pick<AvatarConfig, "outfit" | "accessory"> }[] = [
  { id: "nova", name: "Nova Tech", power: "armadura robô", color: "#36e0c4", face: [0.49, 0.2], wear: { outfit: "traje-nova", accessory: "visor" } },
  { id: "tita", name: "Titã", power: "super força", color: "#ff7a45", face: [0.49, 0.15], wear: { outfit: "traje-tita", accessory: "nenhum" } },
  { id: "raio", name: "Raio", power: "energia elétrica", color: "#9b6bff", face: [0.52, 0.16], wear: { outfit: "traje-raio", accessory: "goggles" } },
  { id: "fenix", name: "Fênix", power: "asas de fogo", color: "#ffb020", face: [0.5, 0.15], wear: { outfit: "traje-fenix", accessory: "nenhum" } },
  { id: "astra", name: "Astra", power: "poder das estrelas", color: "#ff6fd0", face: [0.48, 0.19], wear: { outfit: "traje-astra", accessory: "capacete" } },
  { id: "onda", name: "Onda", power: "controla a água", color: "#3aa0ff", face: [0.54, 0.16], wear: { outfit: "traje-onda", accessory: "mascara" } },
];
export type Level = "" | "iniciante" | "basico" | "conversa";
export const LEVELS: { id: Exclude<Level, "">; icon: string; title: string; desc: string }[] = [
  { id: "iniciante", icon: "🌱", title: "Estou começando agora", desc: "Nunca estudei inglês ou sei bem pouquinho." },
  { id: "basico", icon: "🌿", title: "Sei algumas palavras", desc: "Cores, números, cumprimentos e frases curtas." },
  { id: "conversa", icon: "🌳", title: "Consigo conversar um pouco", desc: "Me apresento e entendo perguntas simples." },
];
export interface Student { name: string; age: string; goal: number; level: Level; avatar: AvatarConfig }

export const DEFAULT_AVATAR: AvatarConfig = {
  skin: "#E8B48A", eyes: "zoiudo", eyeColor: "#1CB0F6", hair: "curto", hairColor: "#4A2C1A",
  mustache: "nenhum", outfit: "camiseta", outfitColor: "#58CC02", costume: "nenhuma", accessory: "nenhum", hero: "nenhum", heroTint: {},
};
const KEY = "fenixingles-student-v1";
const empty: Student = { name: "", age: "", goal: 10, level: "", avatar: DEFAULT_AVATAR };

export function loadStudent(): Student {
  if (typeof window === "undefined") return empty;
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || "{}") as Partial<Student>;
    return { ...empty, ...s, avatar: { ...DEFAULT_AVATAR, ...(s.avatar ?? {}) } };
  } catch { return empty; }
}
const listeners = new Set<() => void>();
export function saveStudent(s: Student) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* armazenamento bloqueado */ }
  listeners.forEach((l) => l());
}
export function updateStudent(fn: (s: Student) => Student) { saveStudent(fn(loadStudent())); }
export function clearStudent() { try { localStorage.removeItem(KEY); } catch { /* */ } listeners.forEach((l) => l()); }

export function useStudent(): [Student, boolean] {
  const [s, setS] = useState(empty);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const sync = () => setS(loadStudent());
    sync(); setReady(true); listeners.add(sync);
    return () => { listeners.delete(sync); };
  }, []);
  return [s, ready];
}
