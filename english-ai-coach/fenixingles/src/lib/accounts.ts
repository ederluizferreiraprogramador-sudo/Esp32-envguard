// Contas na nuvem (Lovable Cloud / Supabase): cadastro por e-mail, recuperação de senha
// e progresso individual. O app continua lendo/escrevendo o localStorage; este módulo
// troca esses dados pelos da conta ao entrar e envia as mudanças para a nuvem.
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const canLogout = true;
export const DATA_KEYS = [
  "fenixingles-student-v1", "fenixingles-progress-v1", "fenixingles-mistakes-v1", "fenixingles-reviewed-v1",
  "fenixingles-nest-v1", "fenixingles-premium-v1", "fenixingles-home-v1",
] as const;
const OWNER = "fenixingles-owner-v1"; // de qual conta são os dados que estão no aparelho
const TABLE = "progresso_alunos";
type Snapshot = Partial<Record<(typeof DATA_KEYS)[number], unknown>>;

const get = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const put = (k: string, v: string | null) => { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch { /* */ } };

export function snapshot(): Snapshot {
  const s: Snapshot = {};
  for (const k of DATA_KEYS) { const v = get(k); if (v !== null) { try { s[k] = JSON.parse(v); } catch { /* ignora valor quebrado */ } } }
  return s;
}
export function applySnapshot(s: Snapshot | null) {
  for (const k of DATA_KEYS) put(k, s && s[k] !== undefined ? JSON.stringify(s[k]) : null);
}
function clearLocal() { applySnapshot(null); put(OWNER, null); try { sessionStorage.removeItem("fx-chat-greeted"); } catch { /* */ } }

/** Traz o progresso da conta para o aparelho. Nunca mistura com dados de outra conta. */
export async function pullProgress(userId: string) {
  const { data, error } = await supabase.from(TABLE).select("dados").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  clearLocal();
  applySnapshot((data?.dados as Snapshot) ?? null);
  put(OWNER, userId);
}

let lastSent = "";
export async function pushProgress(userId: string) {
  if (get(OWNER) !== userId) return; // dados no aparelho não são desta conta
  const dados = snapshot(), body = JSON.stringify(dados);
  if (body === lastSent) return;
  const { error } = await supabase.from(TABLE).upsert({ user_id: userId, dados, atualizado_em: new Date().toISOString() });
  if (!error) lastSent = body;
}

/** Liga o envio automático (a cada 5 s, se mudou, e ao sair da página). */
export function startSync(userId: string) {
  const t = window.setInterval(() => { void pushProgress(userId); }, 5000);
  const flush = () => { void pushProgress(userId); };
  window.addEventListener("pagehide", flush);
  document.addEventListener("visibilitychange", flush);
  return () => { window.clearInterval(t); window.removeEventListener("pagehide", flush); document.removeEventListener("visibilitychange", flush); };
}

export async function signUp(email: string, password: string) {
  return supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/` } });
}
export async function signIn(email: string, password: string) {
  const r = await supabase.auth.signInWithPassword({ email, password });
  if (!r.error && r.data.user) { await pullProgress(r.data.user.id); }
  return r;
}
export async function sendReset(email: string) {
  return supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/redefinir-senha` });
}
export async function updatePassword(password: string) { return supabase.auth.updateUser({ password }); }

export async function logout() {
  const { data } = await supabase.auth.getUser();
  if (data.user) { try { await pushProgress(data.user.id); } catch { /* sem internet: fica salvo na próxima vez */ } }
  await supabase.auth.signOut();
  clearLocal();
  window.location.assign("/entrar");
}

/** Estado de login; garante que os dados no aparelho são da conta logada. */
export function useAuth(): { ready: boolean; signedIn: boolean; email?: string } {
  const [s, setS] = useState<{ ready: boolean; signedIn: boolean; email?: string }>({ ready: false, signedIn: false });
  useEffect(() => {
    let stop: (() => void) | undefined;
    const handle = async (user: { id: string; email?: string } | null) => {
      stop?.(); stop = undefined;
      if (!user) { if (get(OWNER)) clearLocal(); setS({ ready: true, signedIn: false }); return; }
      if (get(OWNER) !== user.id) { try { await pullProgress(user.id); window.location.reload(); return; } catch { /* tenta de novo depois */ } }
      stop = startSync(user.id);
      setS({ ready: true, signedIn: true, email: user.email });
    };
    supabase.auth.getSession().then(({ data }) => handle(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((ev, session) => { if (ev === "SIGNED_OUT" || ev === "SIGNED_IN") void handle(session?.user ?? null); });
    return () => { stop?.(); sub.subscription.unsubscribe(); };
  }, []);
  return s;
}

/** Mensagens do Supabase em português. */
export function authMessage(err: { message?: string } | null | undefined): string {
  const m = (err?.message ?? "").toLowerCase();
  if (!m) return "";
  if (m.includes("invalid login")) return "E-mail ou senha incorretos.";
  if (m.includes("email not confirmed")) return "Confirme seu e-mail: abra o link que enviamos para a sua caixa de entrada.";
  if (m.includes("already registered") || m.includes("already exists")) return "Este e-mail já tem cadastro. Use \"Entrar\" ou \"Esqueci minha senha\".";
  if (m.includes("password") && (m.includes("6") || m.includes("short") || m.includes("weak"))) return "A senha precisa ter pelo menos 8 caracteres, com letras e números.";
  if (m.includes("rate") || m.includes("too many")) return "Muitas tentativas. Espere um pouco e tente de novo.";
  if (m.includes("network") || m.includes("fetch")) return "Sem conexão com a internet. Tente de novo.";
  return "Não foi possível concluir. Tente de novo.";
}
