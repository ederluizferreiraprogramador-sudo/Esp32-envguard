// Vários alunos no mesmo aparelho (versão de teste). Os dados do aluno ativo ficam nas chaves
// normais do app; os dos outros ficam guardados em "gavetas" e trocam de lugar no login.
// Não é uma conta na nuvem: serve para testar com várias crianças no mesmo celular/computador.
import { useEffect, useState } from "react";

export const DATA_KEYS = [
  "fenixingles-student-v1", "fenixingles-progress-v1", "fenixingles-mistakes-v1", "fenixingles-reviewed-v1",
  "fenixingles-nest-v1", "fenixingles-premium-v1", "fenixingles-home-v1",
] as const;
const ACC = "fenixingles-accounts-v1";
export interface Account { id: string; name: string; pin: string | null; createdAt: string; test?: boolean }
interface Store { users: Account[]; current: string | null }

const slot = (id: string, key: string) => `fenixingles-u-${id}-${key.replace("fenixingles-", "")}`;
const ls = () => (typeof window === "undefined" ? null : window.localStorage);
const get = (k: string) => { try { return ls()?.getItem(k) ?? null; } catch { return null; } };
const put = (k: string, v: string | null) => { try { if (v === null) ls()?.removeItem(k); else ls()?.setItem(k, v); } catch { /* bloqueado */ } };

export function loadAccounts(): Store {
  let s: Store = { users: [], current: null };
  try { s = { ...s, ...JSON.parse(get(ACC) || "{}") }; } catch { /* */ }
  // Migração: quem já usava o app vira o primeiro aluno.
  if (!s.users.length) {
    const st = get("fenixingles-student-v1");
    const name = st ? (JSON.parse(st) as { name?: string }).name : "";
    if (name) { const a: Account = { id: newId(), name, pin: null, createdAt: new Date().toISOString() }; s = { users: [a], current: a.id }; saveStore(s); }
  }
  return s;
}
function saveStore(s: Store) { put(ACC, JSON.stringify(s)); }
const newId = () => Math.random().toString(36).slice(2, 10);

/** Lê um dado de qualquer aluno (o ativo está nas chaves normais). */
export function userData<T>(id: string, key: (typeof DATA_KEYS)[number]): T | null {
  const raw = loadAccounts().current === id ? get(key) : get(slot(id, key));
  try { return raw ? (JSON.parse(raw) as T) : null; } catch { return null; }
}

function stash(id: string) { for (const k of DATA_KEYS) { put(slot(id, k), get(k)); put(k, null); } }
function restore(id: string) { for (const k of DATA_KEYS) { put(k, get(slot(id, k))); put(slot(id, k), null); } }
function reloadHome() { try { sessionStorage.removeItem("fx-chat-greeted"); } catch { /* */ } window.location.reload(); }

/** PIN de 4 números guardado só como resumo (SHA-256), nunca o número em si. */
export async function hashPin(id: string, pin: string): Promise<string> {
  const data = new TextEncoder().encode(`fenixingles:${id}:${pin}`);
  try { const h = await crypto.subtle.digest("SHA-256", data); return Array.from(new Uint8Array(h), (b) => b.toString(16).padStart(2, "0")).join(""); }
  catch { let h = 0; for (const b of data) h = (h * 31 + b) >>> 0; return `x${h.toString(16)}`; }
}
export async function checkPin(a: Account, pin: string) { return !a.pin || a.pin === (await hashPin(a.id, pin)); }

export function switchTo(id: string, reload = true) {
  const s = loadAccounts();
  if (s.current === id) { if (reload) reloadHome(); return; }
  if (s.current) stash(s.current); else for (const k of DATA_KEYS) put(k, null);
  restore(id); saveStore({ ...s, current: id });
  if (reload) reloadHome();
}
export function logout() {
  const s = loadAccounts();
  if (s.current) stash(s.current);
  saveStore({ ...s, current: null }); reloadHome();
}
export async function createAccount(name: string, pin: string | null, reload = true): Promise<Account> {
  const s = loadAccounts();
  const a: Account = { id: newId(), name: name.trim().slice(0, 30), pin: null, createdAt: new Date().toISOString() };
  if (pin) a.pin = await hashPin(a.id, pin);
  saveStore({ ...s, users: [...s.users, a] });
  for (const k of DATA_KEYS) put(slot(a.id, k), null);
  put(slot(a.id, "fenixingles-student-v1"), JSON.stringify({ name: a.name }));
  switchTo(a.id, reload);
  return a;
}
export function deleteAccount(id: string) {
  const s = loadAccounts();
  for (const k of DATA_KEYS) put(slot(id, k), null);
  if (s.current === id) for (const k of DATA_KEYS) put(k, null);
  saveStore({ users: s.users.filter((u) => u.id !== id), current: s.current === id ? null : s.current });
}

/** Cria 3 alunos de teste com situações diferentes (sem dados reais de ninguém). */
export async function createTestUsers() {
  const s = loadAccounts();
  const today = new Date().toISOString().slice(0, 10);
  const mk = async (name: string, pin: string | null, data: Partial<Record<(typeof DATA_KEYS)[number], unknown>>) => {
    const a: Account = { id: newId(), name, pin: null, createdAt: new Date().toISOString(), test: true };
    if (pin) a.pin = await hashPin(a.id, pin);
    for (const k of DATA_KEYS) put(slot(a.id, k), data[k] === undefined ? null : JSON.stringify(data[k]));
    return a;
  };
  const m = (unit: number, lesson: number, activity: number, type: string, prompt: string, given: string, correct: string, explain: string) =>
    ({ unit, lesson, activity, type, prompt, given, correct, explain, at: new Date().toISOString() });
  const users = [
    await mk("Ana (teste)", null, {
      "fenixingles-student-v1": { name: "Ana (teste)", age: "4 a 6 anos", goal: 5, level: "iniciante", avatar: { hair: "longo", hairColor: "#F2C14E", outfit: "vestido", outfitColor: "#FF86C8" } },
    }),
    await mk("Davi (teste)", null, {
      "fenixingles-student-v1": { name: "Davi (teste)", age: "7 a 9 anos", goal: 10, level: "basico", avatar: { hero: "nova" } },
      "fenixingles-progress-v1": { xp: 60, streak: 3, lastDay: today, hearts: 3, heartsDay: today, completed: ["1-0", "1-1", "1-2", "2-0", "2-1", "2-2"], sound: true },
      "fenixingles-mistakes-v1": [
        m(1, 0, 1, "fill", "Good ___ ! How are you?", "night", "morning", '"Good morning" = "Bom dia".'),
        m(2, 0, 2, "fill", "Where ___ my umbrella?", "are", "is", 'umbrella é singular → "Where is...?".'),
        m(2, 1, 3, "build", "A carteira está embaixo da cadeira.", "The wallet is under on chair", "The wallet is under the chair", "under = embaixo de."),
        m(2, 2, 1, "write", 'Plural de "chair"', "chaires", "chairs", "A maioria dos plurais ganha -s: chairs."),
      ],
      "fenixingles-nest-v1": { counts: { fogo: 1, esmeralda: 2, azul: 1, dourada: 1 }, gifted: ["1-0", "1-1", "1-2", "2-0", "2-1"] },
    }),
    await mk("Bia (teste)", "1234", {
      "fenixingles-student-v1": { name: "Bia (teste)", age: "10 a 12 anos", goal: 15, level: "conversa", avatar: { hero: "raio", heroTint: { suit: "#FF4FA3" } } },
      "fenixingles-progress-v1": { xp: 160, streak: 7, lastDay: today, hearts: 5, heartsDay: today, completed: ["1-0", "1-1", "1-2", "2-0", "2-1", "2-2", "3-0", "3-1", "3-2", "4-0", "4-1", "4-2", "5-0"], sound: true },
      "fenixingles-premium-v1": { active: true, since: new Date().toISOString() },
      "fenixingles-nest-v1": { counts: { fogo: 3, esmeralda: 2, azul: 2, ametista: 1, dourada: 2, cristal: 1, aurora: 1, imortal: 1 }, gifted: ["1-0", "1-1", "1-2", "2-0", "2-1", "2-2", "3-0", "3-1", "3-2", "4-0", "4-1", "4-2", "5-0"] },
    }),
  ];
  saveStore({ ...s, users: [...s.users, ...users] });
}

const subs = new Set<() => void>();
export function useAccounts(): [Store, () => void] {
  const [s, setS] = useState<Store>({ users: [], current: null });
  useEffect(() => { const f = () => setS(loadAccounts()); f(); subs.add(f); return () => { subs.delete(f); }; }, []);
  return [s, () => subs.forEach((f) => f())];
}
