// Medição de uso com PostHog, pensada para app infantil:
// - desligada se não houver chave (VITE_POSTHOG_KEY) ou se o responsável não aceitou;
// - só eventos de aprendizagem e um ID aleatório do aparelho: nunca nome, e-mail, idade ou texto digitado.
const KEY = (import.meta as unknown as { env?: Record<string, string | undefined> }).env?.VITE_POSTHOG_KEY;
const HOST = (import.meta as unknown as { env?: Record<string, string | undefined> }).env?.VITE_POSTHOG_HOST ?? "https://us.i.posthog.com";
const OPT = "fenixingles-analytics-optin-v1", ANON = "fenixingles-anon-id-v1";

export type EventName = "licao_concluida" | "erro_na_questao" | "fenix_ganha" | "imortal_aberto" | "revisao_concluida" | "pdf_baixado";
type Props = { unidade?: number; licao?: number; tipo?: string; fenix?: string };

const get = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
export const analyticsAvailable = () => !!KEY;
export const analyticsEnabled = () => !!KEY && get(OPT) === "1";
export function setAnalytics(on: boolean) { try { localStorage.setItem(OPT, on ? "1" : "0"); } catch { /* */ } }

function anonId() {
  let id = get(ANON);
  if (!id) { id = crypto.randomUUID(); try { localStorage.setItem(ANON, id); } catch { /* */ } }
  return id;
}

/** Envia um evento. Nunca lança erro e nunca atrasa o jogo. */
export function track(event: EventName, props: Props = {}) {
  if (!analyticsEnabled()) return;
  const clean: Props = { unidade: props.unidade, licao: props.licao, tipo: props.tipo, fenix: props.fenix };
  try {
    void fetch(`${HOST}/capture/`, {
      method: "POST", keepalive: true, headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: KEY, event, distinct_id: anonId(), properties: { ...clean, $process_person_profile: false } }),
    }).catch(() => { /* sem internet: ignora */ });
  } catch { /* ignora */ }
}
