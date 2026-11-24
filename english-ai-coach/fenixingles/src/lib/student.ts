// Perfil do aluno (nome, idade, meta) e avatar personalizado — salvos no aparelho.
import { useEffect, useState } from "react";

export interface AvatarConfig {
  skin: string; eyes: "zoiudo" | "feliz" | "estrela" | "piscando"; eyeColor: string;
  hair: "curto" | "longo" | "cacheado" | "rabo" | "moicano" | "careca"; hairColor: string;
  mustache: "nenhum" | "classico" | "enrolado" | "fino";
  outfit: "camiseta" | "moletom" | "vestido" | "jaqueta"; outfitColor: string;
  costume: "nenhuma" | "dino" | "gatinho" | "unicornio" | "fenix";
  accessory: "nenhum" | "oculos" | "bone" | "laco" | "fones";
  /** Herói 3D escolhido (substitui o desenho quando diferente de "nenhum"). */
  hero: HeroId;
}
export type HeroId = "nenhum" | "nova" | "tita" | "raio" | "fenix" | "astra" | "onda";
export const HEROES: { id: Exclude<HeroId, "nenhum">; name: string; power: string; color: string; face: [number, number] }[] = [
  { id: "nova", name: "Nova Tech", power: "armadura robô", color: "#36e0c4", face: [0.49, 0.2] },
  { id: "tita", name: "Titã", power: "super força", color: "#ff7a45", face: [0.49, 0.15] },
  { id: "raio", name: "Raio", power: "energia elétrica", color: "#9b6bff", face: [0.52, 0.16] },
  { id: "fenix", name: "Fênix", power: "asas de fogo", color: "#ffb020", face: [0.5, 0.15] },
  { id: "astra", name: "Astra", power: "poder das estrelas", color: "#ff6fd0", face: [0.48, 0.19] },
  { id: "onda", name: "Onda", power: "controla a água", color: "#3aa0ff", face: [0.54, 0.16] },
];
export interface Student { name: string; age: string; goal: number; avatar: AvatarConfig }

export const DEFAULT_AVATAR: AvatarConfig = {
  skin: "#E8B48A", eyes: "zoiudo", eyeColor: "#1CB0F6", hair: "curto", hairColor: "#4A2C1A",
  mustache: "nenhum", outfit: "camiseta", outfitColor: "#58CC02", costume: "nenhuma", accessory: "nenhum", hero: "nenhum",
};
const KEY = "fenixingles-student-v1";
const empty: Student = { name: "", age: "", goal: 10, avatar: DEFAULT_AVATAR };

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
