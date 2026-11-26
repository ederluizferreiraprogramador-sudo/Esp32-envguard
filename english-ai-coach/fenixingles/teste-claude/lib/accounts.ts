// Versão de teste (link do Claude): login com as MESMAS contas do app no Base44
// (https://fenix-ingles-c5968695.base44.app) e progresso completo salvo na conta,
// na tabela ProgressoCompleto (cada pessoa só lê o que é dela).
import { useEffect, useState } from "react";

const APP_ID = "6b03f9395666f1f1c5968695";
const API = `https://base44.app/api/apps/${APP_ID}`;
export const BASE44_SITE = "https://fenix-ingles-c5968695.base44.app";
export const DATA_KEYS = [
  "fenixingles-student-v1", "fenixingles-progress-v1", "fenixingles-mistakes-v1", "fenixingles-reviewed-v1",
  "fenixingles-nest-v1", "fenixingles-premium-v1", "fenixingles-home-v1",
] as const;
const TOKEN = "fenixingles-b44-token", OWNER = "fenixingles-owner-v1", RECORD = "fenixingles-b44-record", GUEST = "fenixingles-guest-v1";
type Snapshot = Partial<Record<(typeof DATA_KEYS)[number], unknown>>;

const get = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const put = (k: string, v: string | null) => { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch { /* */ } };

export class AuthError extends Error { constructor(public status: number, public detail: string, public offline = false) { super(detail); } }

async function api<T>(method: string, path: string, body?: unknown): Promise<T> {
  const token = get(TOKEN);
  let res: Response;
  try {
    res = await fetch(`${API}${path}`, {
      method,
      headers: { "X-App-Id": APP_ID, "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch { throw new AuthError(0, "offline", true); }
  const text = await res.text();
  let data: unknown = null; try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    const d = data as { detail?: unknown; message?: string } | string | null;
    const detail = typeof d === "string" ? d : typeof d?.detail === "string" ? d.detail : d?.message ?? JSON.stringify(d?.detail ?? "");
    throw new AuthError(res.status, detail || `HTTP ${res.status}`);
  }
  return data as T;
}

export function snapshot(): Snapshot {
  const s: Snapshot = {};
  for (const k of DATA_KEYS) { const v = get(k); if (v !== null) { try { s[k] = JSON.parse(v); } catch { /* */ } } }
  return s;
}
function applySnapshot(s: Snapshot | null) { for (const k of DATA_KEYS) put(k, s && s[k] !== undefined ? JSON.stringify(s[k]) : null); }
function clearLocal() { applySnapshot(null); put(OWNER, null); put(RECORD, null); try { sessionStorage.removeItem("fx-chat-greeted"); } catch { /* */ } }

type Me = { id: string; email?: string; full_name?: string };
type Rec = { id: string; dados: string; created_by_id?: string };
const me = () => api<Me>("GET", "/entities/User/me");

/** Traz o progresso da conta para o aparelho, sem misturar com dados de outra pessoa. */
async function pullProgress(user: Me) {
  const q = encodeURIComponent(JSON.stringify({ created_by_id: user.id }));
  const rows = await api<Rec[]>("GET", `/entities/ProgressoCompleto?q=${q}&sort=-updated_date&limit=1`);
  clearLocal();
  const r = rows?.[0];
  if (r) { try { applySnapshot(JSON.parse(r.dados) as Snapshot); } catch { /* registro vazio */ } put(RECORD, r.id); }
  put(OWNER, user.id);
}

let lastSent = "";
async function pushProgress(userId: string) {
  if (get(OWNER) !== userId) return;
  const dados = JSON.stringify(snapshot());
  if (dados === lastSent) return;
  const body = { dados, atualizado_em: new Date().toISOString() };
  const id = get(RECORD);
  if (id) await api("PUT", `/entities/ProgressoCompleto/${id}`, body);
  else { const r = await api<Rec>("POST", "/entities/ProgressoCompleto", body); put(RECORD, r.id); }
  lastSent = dados;
}
function startSync(userId: string) {
  const tick = () => { void pushProgress(userId).catch(() => { /* tenta de novo no próximo ciclo */ }); };
  const t = window.setInterval(tick, 5000);
  window.addEventListener("pagehide", tick); document.addEventListener("visibilitychange", tick);
  return () => { window.clearInterval(t); window.removeEventListener("pagehide", tick); document.removeEventListener("visibilitychange", tick); };
}

export async function signIn(email: string, password: string) {
  const r = await api<{ access_token?: string }>("POST", "/auth/login", { email, password });
  if (!r?.access_token) throw new AuthError(401, "no token");
  put(TOKEN, r.access_token); put(GUEST, null);
  await pullProgress(await me());
}
export const register = (email: string, password: string) => api("POST", "/auth/register", { email, password });
export const verifyOtp = (email: string, otpCode: string) => api("POST", "/auth/verify-otp", { email, otp_code: otpCode });
export const resendOtp = (email: string) => api("POST", "/auth/resend-otp", { email });
export const sendReset = (email: string) => api("POST", "/auth/reset-password-request", { email });

export async function logout() {
  try { const u = await me(); await pushProgress(u.id); } catch { /* sem conexão */ }
  put(TOKEN, null); put(GUEST, null); clearLocal();
  window.location.reload();
}
/** Sem conexão com o servidor: deixa usar o app só neste aparelho. */
export function continueAsGuest() { clearLocal(); put(GUEST, "1"); window.location.reload(); }
export const isGuest = () => get(GUEST) === "1";

export function useAuth(): { ready: boolean; signedIn: boolean; email?: string; guest?: boolean } {
  const [s, setS] = useState<{ ready: boolean; signedIn: boolean; email?: string; guest?: boolean }>({ ready: false, signedIn: false });
  useEffect(() => {
    let stop: (() => void) | undefined, alive = true;
    (async () => {
      if (isGuest()) { setS({ ready: true, signedIn: true, guest: true }); return; }
      if (!get(TOKEN)) { if (get(OWNER)) clearLocal(); setS({ ready: true, signedIn: false }); return; }
      try {
        const u = await me();
        if (get(OWNER) !== u.id) { await pullProgress(u); window.location.reload(); return; }
        stop = startSync(u.id);
        if (alive) setS({ ready: true, signedIn: true, email: u.email });
      } catch (e) {
        if (e instanceof AuthError && e.offline && get(OWNER)) { if (alive) setS({ ready: true, signedIn: true }); return; } // sem internet: segue com os dados locais
        put(TOKEN, null); clearLocal(); if (alive) setS({ ready: true, signedIn: false });
      }
    })();
    return () => { alive = false; stop?.(); };
  }, []);
  return s;
}

export function authMessage(e: unknown): string {
  if (!(e instanceof AuthError)) return "Não foi possível concluir. Tente de novo.";
  if (e.offline) return "offline";
  const m = e.detail.toLowerCase();
  if (m.includes("verif") || m.includes("not confirmed")) return "Confirme seu e-mail primeiro: digite o código que enviamos.";
  if (m.includes("already") || m.includes("exist")) return "Este e-mail já tem cadastro. Use \"Entrar\" ou \"Esqueci minha senha\".";
  if (m.includes("otp") || m.includes("code")) return "Código inválido ou expirado. Peça um novo código.";
  if (m.includes("password") && (m.includes("short") || m.includes("weak") || m.includes("least"))) return "Senha fraca: use 8+ caracteres com letras e números.";
  if (e.status === 401 || e.status === 403 || m.includes("invalid") || m.includes("incorrect")) return "E-mail ou senha incorretos.";
  if (e.status === 429) return "Muitas tentativas. Espere um pouco e tente de novo.";
  return "Não foi possível concluir. Tente de novo.";
}
