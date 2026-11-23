// Perfil do aluno (nome, idade, meta) e avatar personalizado — salvos no aparelho.
import { useEffect, useState } from "react";

export interface AvatarConfig {
  skin: string; eyes: "zoiudo" | "feliz" | "estrela" | "piscando"; eyeColor: string;
  hair: "curto" | "longo" | "cacheado" | "rabo" | "moicano" | "careca"; hairColor: string;
  mustache: "nenhum" | "classico" | "enrolado" | "fino";
  outfit: "camiseta" | "moletom" | "vestido" | "jaqueta"; outfitColor: string;
  costume: "nenhuma" | "dino" | "gatinho" | "unicornio" | "fenix";
  accessory: "nenhum" | "oculos" | "bone" | "laco" | "fones";
}
export interface Student { name: string; age: string; goal: number; avatar: AvatarConfig }

export const DEFAULT_AVATAR: AvatarConfig = {
  skin: "#E8B48A", eyes: "zoiudo", eyeColor: "#1CB0F6", hair: "curto", hairColor: "#4A2C1A",
  mustache: "nenhum", outfit: "camiseta", outfitColor: "#58CC02", costume: "nenhuma", accessory: "nenhum",
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
