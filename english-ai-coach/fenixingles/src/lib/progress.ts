import { useEffect, useState } from "react";
import { clearMistakes } from "./mistakes";

export interface Progress { xp: number; streak: number; lastDay: string | null; hearts: number; heartsDay: string | null; completed: string[]; sound: boolean }
export const MAX_HEARTS = 5;
const KEY = "fenixingles-progress-v1";
const initial: Progress = { xp: 0, streak: 0, lastDay: null, hearts: MAX_HEARTS, heartsDay: null, completed: [], sound: true };

const today = () => new Date().toISOString().slice(0, 10);
export const lessonKey = (u: number, l: number) => `${u}-${l}`;

export function load(): Progress {
  if (typeof window === "undefined") return initial;
  try {
    const p = { ...initial, ...JSON.parse(localStorage.getItem(KEY) || "{}") } as Progress;
    // vidas recarregam a cada novo dia
    if (p.heartsDay !== today()) { p.hearts = MAX_HEARTS; p.heartsDay = today(); }
    // sequência quebrada se passou mais de um dia
    if (p.lastDay) {
      const diff = (Date.parse(today()) - Date.parse(p.lastDay)) / 86400000;
      if (diff > 1) p.streak = 0;
    }
    return p;
  } catch { return initial; }
}
const listeners = new Set<() => void>();
export function save(p: Progress) { localStorage.setItem(KEY, JSON.stringify(p)); listeners.forEach((l) => l()); }
export function update(fn: (p: Progress) => Progress) { save(fn(load())); }
export function reset() { localStorage.removeItem(KEY); clearMistakes(); listeners.forEach((l) => l()); }

export function completeLesson(p: Progress, key: string, xp: number): Progress {
  const t = today();
  let streak = p.streak;
  if (p.lastDay !== t) {
    const diff = p.lastDay ? (Date.parse(t) - Date.parse(p.lastDay)) / 86400000 : 99;
    streak = diff === 1 ? streak + 1 : 1;
  }
  return { ...p, xp: p.xp + xp, streak, lastDay: t, completed: p.completed.includes(key) ? p.completed : [...p.completed, key] };
}

export function useProgress(): [Progress, boolean] {
  const [p, setP] = useState(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const sync = () => setP(load());
    sync(); setReady(true);
    listeners.add(sync);
    return () => { listeners.delete(sync); };
  }, []);
  return [p, ready];
}
