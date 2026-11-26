// Recompensas: uma fênix de presente a cada lição concluída (coleção "Ninho das Fênix")
// e a "Fênix Imortal" (vidas infinitas). Tudo salvo no aparelho.
import { useEffect, useState } from "react";

export type PhoenixId = "fogo" | "esmeralda" | "azul" | "ametista" | "dourada" | "cristal" | "aurora" | "imortal";
export type Rarity = "comum" | "rara" | "épica" | "lendária" | "imortal";
export const PHOENIXES: { id: PhoenixId; name: string; rarity: Rarity; color: string; weight: number; desc: string }[] = [
  { id: "fogo", name: "Fênix de Fogo", rarity: "comum", color: "#ff6a2b", weight: 30, desc: "A primeira chama da sua jornada." },
  { id: "esmeralda", name: "Fênix Esmeralda", rarity: "comum", color: "#3ccf6e", weight: 25, desc: "Renasce das folhas da floresta." },
  { id: "azul", name: "Fênix Azul", rarity: "rara", color: "#2f8bff", weight: 15, desc: "Fogo azul, o mais quente de todos." },
  { id: "ametista", name: "Fênix Ametista", rarity: "rara", color: "#9b6bff", weight: 12, desc: "Brilha como pedra preciosa." },
  { id: "dourada", name: "Fênix Dourada", rarity: "épica", color: "#ffb020", weight: 8, desc: "Feita de luz do sol." },
  { id: "cristal", name: "Fênix de Cristal", rarity: "épica", color: "#7fd8ff", weight: 6, desc: "Asas de gelo que nunca derretem." },
  { id: "aurora", name: "Fênix Aurora", rarity: "lendária", color: "#ff6fd0", weight: 4, desc: "Tem todas as cores do céu." },
  { id: "imortal", name: "Fênix Imortal", rarity: "imortal", color: "#ffd23f", weight: 0, desc: "Vidas infinitas para estudar sem parar." },
];
export const phoenix = (id: string) => PHOENIXES.find((p) => p.id === id);

interface Nest { counts: Partial<Record<PhoenixId, number>>; gifted: string[] }
const NEST = "fenixingles-nest-v1", PREMIUM = "fenixingles-premium-v1";
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const read = <T,>(k: string, d: T): T => { try { return { ...d, ...JSON.parse(localStorage.getItem(k) || "{}") } as T; } catch { return d; } };
const write = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* armazenamento bloqueado */ } emit(); };

export function loadNest(): Nest { return typeof window === "undefined" ? { counts: {}, gifted: [] } : read<Nest>(NEST, { counts: {}, gifted: [] }); }

/** Sorteia a fênix de presente da lição (só na primeira vez que a lição é concluída). */
export function awardForLesson(lessonKey: string, rnd = Math.random): PhoenixId | null {
  const n = loadNest();
  if (n.gifted.includes(lessonKey)) return null;
  const pool = PHOENIXES.filter((p) => p.weight > 0);
  let id: PhoenixId;
  if (!n.gifted.length) id = "fogo";
  else {
    // Fênix que ainda faltam têm o dobro de chance — a coleção anda mais rápido.
    const w = pool.map((p) => p.weight * (n.counts[p.id] ? 1 : 2));
    let r = rnd() * w.reduce((a, b) => a + b, 0), i = 0;
    while (i < w.length - 1 && (r -= w[i]!) > 0) i++;
    id = pool[i]!.id;
  }
  write(NEST, { counts: { ...n.counts, [id]: (n.counts[id] ?? 0) + 1 }, gifted: [...n.gifted, lessonKey] });
  return id;
}

export interface Premium { active: boolean; since: string | null }
export function loadPremium(): Premium { return typeof window === "undefined" ? { active: false, since: null } : read<Premium>(PREMIUM, { active: false, since: null }); }
export function setPremium(active: boolean) {
  write(PREMIUM, { active, since: active ? new Date().toISOString() : null });
  if (active) { const n = loadNest(); write(NEST, { ...n, counts: { ...n.counts, imortal: 1 } }); }
}

function useStore<T>(load: () => T, init: T): T {
  const [v, setV] = useState(init);
  useEffect(() => {
    const sync = () => setV(load());
    sync(); listeners.add(sync); window.addEventListener("storage", sync);
    return () => { listeners.delete(sync); window.removeEventListener("storage", sync); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return v;
}
export const useNest = () => useStore(loadNest, { counts: {}, gifted: [] } as Nest);
export const usePremium = () => useStore(loadPremium, { active: false, since: null } as Premium);
