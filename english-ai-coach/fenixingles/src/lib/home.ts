// Estado da "Casa da turma": felicidade do bichinho, presente diário e soninho.
import { useEffect, useState } from "react";

export interface HomeState { buddy: string; happy: number; giftDay: string | null; fedAt: number; sleptAt: number }
const KEY = "fenixingles-home-v1";
const today = () => new Date().toISOString().slice(0, 10);
const initial: HomeState = { buddy: "charlotte", happy: 40, giftDay: null, fedAt: 0, sleptAt: 0 };

export function loadHome(): HomeState {
  if (typeof window === "undefined") return initial;
  try { return { ...initial, ...JSON.parse(localStorage.getItem(KEY) || "{}") } as HomeState; } catch { return initial; }
}
const ls = new Set<() => void>();
export function updateHome(fn: (h: HomeState) => HomeState) {
  const h = fn(loadHome());
  h.happy = Math.max(0, Math.min(100, h.happy));
  try { localStorage.setItem(KEY, JSON.stringify(h)); } catch { /* */ }
  ls.forEach((l) => l());
}
export const giftAvailable = (h: HomeState) => h.giftDay !== today();
export const markGift = (h: HomeState): HomeState => ({ ...h, giftDay: today(), happy: h.happy + 10 });

export function useHome(): HomeState {
  const [h, setH] = useState(initial);
  useEffect(() => { const s = () => setH(loadHome()); s(); ls.add(s); return () => { ls.delete(s); }; }, []);
  return h;
}
