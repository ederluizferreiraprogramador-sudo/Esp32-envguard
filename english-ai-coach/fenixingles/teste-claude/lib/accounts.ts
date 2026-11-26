// Versão de teste (link do Claude): a página não pode falar com servidores de fora
// (a plataforma bloqueia), então o "login" é a própria conta Claude de quem abre o link.
// Cada pessoa tem uma área privada no banco do link (data/users/<id>/), invisível
// para as outras — inclusive para o dono do link.
import { useEffect, useState } from "react";

export const BASE44_SITE = "https://fenix-ingles-c5968695.base44.app";
export const canLogout = false; // a conta é a do Claude: para trocar, saia do Claude
export const DATA_KEYS = [
  "fenixingles-student-v1", "fenixingles-progress-v1", "fenixingles-mistakes-v1", "fenixingles-reviewed-v1",
  "fenixingles-nest-v1", "fenixingles-premium-v1", "fenixingles-home-v1",
] as const;
const OWNER = "fenixingles-owner-v1", GUEST = "fenixingles-guest-v1";
type Snapshot = Partial<Record<(typeof DATA_KEYS)[number], unknown>>;

type DocSnap = { exists: boolean; data(): Record<string, unknown> | undefined };
type DocRef = { get(): Promise<DocSnap>; set(d: Record<string, unknown>): Promise<void> };
type DB = { doc(path: string): DocRef };
type UserNS = { id(): Promise<string | null>; me(): Promise<{ id: string | null; name: string }> };
type ClaudeWin = { claude?: { use(n: string): Promise<unknown> } };
const use = async <T,>(name: string): Promise<T | null> => {
  const c = (window as unknown as ClaudeWin).claude;
  if (!c) return null;
  try { return (await c.use(name)) as T | null; } catch { return null; }
};

const get = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const put = (k: string, v: string | null) => { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch { /* */ } };

export function snapshot(): Snapshot {
  const s: Snapshot = {};
  for (const k of DATA_KEYS) { const v = get(k); if (v !== null) { try { s[k] = JSON.parse(v); } catch { /* */ } } }
  return s;
}
function applySnapshot(s: Snapshot | null) { for (const k of DATA_KEYS) put(k, s && s[k] !== undefined ? JSON.stringify(s[k]) : null); }
function clearLocal() { applySnapshot(null); put(OWNER, null); try { sessionStorage.removeItem("fx-chat-greeted"); } catch { /* */ } }

/** Corpo salvo: JSON em texto, sempre abaixo do limite de 256 KiB por documento. */
function body(): string {
  const s = snapshot();
  let txt = JSON.stringify(s);
  const m = s["fenixingles-mistakes-v1"];
  if (txt.length > 230_000 && Array.isArray(m)) { s["fenixingles-mistakes-v1"] = m.slice(-300); txt = JSON.stringify(s); }
  return txt;
}

let lastSent = "";
async function push(ref: DocRef, uid: string) {
  if (get(OWNER) !== uid) return;
  const dados = body();
  if (dados === lastSent) return;
  await ref.set({ dados, atualizado_em: new Date().toISOString() });
  lastSent = dados;
}

export function continueAsGuest() { clearLocal(); put(GUEST, "1"); window.location.reload(); }
export async function logout() { /* não usado no link de teste (canLogout = false) */ }

export function useAuth(): { ready: boolean; signedIn: boolean; name?: string; guest?: boolean } {
  const [s, setS] = useState<{ ready: boolean; signedIn: boolean; name?: string; guest?: boolean }>({ ready: false, signedIn: false });
  useEffect(() => {
    let alive = true, timer = 0, busy = false;
    const onHide = () => { void tick(); };
    let tick = async () => { /* definido abaixo */ };
    (async () => {
      const [user, db] = await Promise.all([use<UserNS>("user"), use<DB>("db")]);
      const me = user ? await user.me() : null;
      const uid = me?.id ?? null;
      if (!uid || !db) {
        if (get(GUEST) === "1") { if (alive) setS({ ready: true, signedIn: true, guest: true }); return; }
        if (get(OWNER)) clearLocal();
        if (alive) setS({ ready: true, signedIn: false });
        return;
      }
      put(GUEST, null);
      const ref = db.doc(`data/users/${uid}/progresso`);
      if (get(OWNER) !== uid) {
        try {
          const snap = await ref.get();
          clearLocal();
          const d = snap.exists ? snap.data()?.dados : undefined;
          if (typeof d === "string") { try { applySnapshot(JSON.parse(d) as Snapshot); } catch { /* */ } }
          put(OWNER, uid);
          lastSent = body();
          window.location.reload(); return;
        } catch { if (alive) setS({ ready: true, signedIn: false }); return; }
      }
      tick = async () => { if (busy) return; busy = true; try { await push(ref, uid); } catch { /* tenta no próximo ciclo */ } finally { busy = false; } };
      timer = window.setInterval(() => { void tick(); }, 5000);
      window.addEventListener("pagehide", onHide); document.addEventListener("visibilitychange", onHide);
      if (alive) setS({ ready: true, signedIn: true, name: me?.name || undefined });
    })();
    return () => { alive = false; window.clearInterval(timer); window.removeEventListener("pagehide", onHide); document.removeEventListener("visibilitychange", onHide); };
  }, []);
  return s;
}
