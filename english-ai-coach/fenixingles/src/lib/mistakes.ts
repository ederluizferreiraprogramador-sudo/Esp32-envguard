// Registro dos erros do aluno (localStorage) e agrupamento por tipo de dificuldade.
import type { Activity } from "@/data/units";
import { track } from "./analytics";

export interface Mistake {
  unit: number;
  lesson: number;
  activity: number;
  type: Activity["type"];
  prompt: string;   // o que foi perguntado (em inglês ou português)
  given: string;    // o que o aluno respondeu
  correct: string;  // resposta certa
  explain: string;  // explicação em português
  at: string;       // data ISO
}

const KEY = "fenixingles-mistakes-v1";
const MAX = 2000;

export function loadMistakes(): Mistake[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]") as Mistake[]; } catch { return []; }
}

export function clearMistakes() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}

export function promptOf(a: Activity): string {
  switch (a.type) {
    case "fill": return `${a.context ? a.context + " / " : ""}${a.before} ___ ${a.after}`.trim();
    case "choose": return a.line;
    case "build": return a.pt;
    case "listen": return `(áudio) ${a.audio}`;
    case "write": return a.prompt;
    case "match": return "Ligar pares";
  }
}

export function correctOf(a: Activity): string {
  if (a.type === "match") return a.pairs.map((p) => `${p[0]} = ${p[1]}`).join("; ");
  if (a.type === "write") return a.answer[0] ?? "";
  return a.answer;
}

export function recordMistake(unit: number, lesson: number, activity: number, a: Activity, given: string) {
  if (typeof window === "undefined") return;
  const m: Mistake = {
    unit, lesson, activity, type: a.type, prompt: promptOf(a), given: given.trim(),
    correct: correctOf(a), explain: a.explain, at: new Date().toISOString(),
  };
  track("erro_na_questao", { unidade: unit, licao: lesson, tipo: a.type });
  try {
    const all = loadMistakes();
    all.push(m);
    localStorage.setItem(KEY, JSON.stringify(all.slice(-MAX)));
  } catch { /* armazenamento cheio ou bloqueado */ }
}

/** Categorias pedagógicas (o que o tipo de erro revela) com dica em português. */
export const CATEGORIES: Record<Activity["type"], { title: string; tip: string }> = {
  fill: {
    title: "Gramática no diálogo",
    tip: "Releia a frase inteira antes de escolher. Observe quem é o sujeito (I, you, he, she, they) e se a ideia é singular ou plural — isso decide a forma do verbo e do pronome.",
  },
  choose: {
    title: "Resposta adequada à situação",
    tip: "Identifique a palavra-chave da pergunta (Where = onde, What = o que, How = como, When = quando). A resposta precisa combinar com ela.",
  },
  build: {
    title: "Ordem das palavras na frase",
    tip: "Em inglês a ordem é quase sempre: sujeito + verbo + complemento. Adjetivos vêm ANTES do substantivo (a black coat). Em perguntas, o verbo auxiliar vem primeiro (Do you...? Are you...?).",
  },
  listen: {
    title: "Compreensão auditiva",
    tip: "Ouça mais de uma vez e use o botão da tartaruga (devagar). Preste atenção no final das palavras (-teen x -ty, -s do plural) e nas contrações (I'm, isn't).",
  },
  write: {
    title: "Escrita (ortografia)",
    tip: "Confira letra por letra. Anote as palavras que você errou e escreva cada uma três vezes. Números: 13–19 terminam em -teen; 20, 30, 40... terminam em -ty (forty não tem 'u').",
  },
  match: {
    title: "Vocabulário",
    tip: "Revise as palavras em voz alta e crie uma frase curta com cada uma.",
  },
};

export interface UnitReport {
  unit: number;
  total: number;
  byCategory: { type: Activity["type"]; title: string; tip: string; count: number; items: Mistake[] }[];
}

/** Erros de uma unidade, agrupados por categoria e sem repetir a mesma questão. */
export function unitReport(unit: number, all = loadMistakes()): UnitReport {
  const seen = new Map<string, Mistake>();
  const counts = new Map<string, number>();
  for (const m of all.filter((x) => x.unit === unit)) {
    const k = `${m.lesson}-${m.activity}`;
    seen.set(k, m); // fica a tentativa mais recente
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  const groups = new Map<Activity["type"], Mistake[]>();
  for (const m of seen.values()) groups.set(m.type, [...(groups.get(m.type) ?? []), m]);
  const byCategory = [...groups.entries()]
    .map(([type, items]) => ({
      type, ...CATEGORIES[type],
      count: items.reduce((n, m) => n + (counts.get(`${m.lesson}-${m.activity}`) ?? 1), 0),
      items: items.sort((a, b) => (counts.get(`${b.lesson}-${b.activity}`) ?? 1) - (counts.get(`${a.lesson}-${a.activity}`) ?? 1)),
    }))
    .sort((a, b) => b.count - a.count);
  return { unit, total: byCategory.reduce((n, c) => n + c.count, 0), byCategory };
}

const REVIEWED = "fenixingles-reviewed-v1";
const qKey = (m: Pick<Mistake, "unit" | "lesson" | "activity">) => `${m.unit}-${m.lesson}-${m.activity}`;
function loadReviewed(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(REVIEWED) || "{}") as Record<string, string>; } catch { return {}; }
}
/** Marca uma questão como revisada (acertou no treino). Se errar de novo na lição, volta para a lista. */
export function markReviewed(m: Mistake) {
  try { const r = loadReviewed(); r[qKey(m)] = new Date().toISOString(); localStorage.setItem(REVIEWED, JSON.stringify(r)); } catch { /* */ }
}
/** Erros ainda não revisados: uma entrada por questão (a tentativa mais recente). */
export function pendingReview(all = loadMistakes()): Mistake[] {
  const r = loadReviewed(), latest = new Map<string, Mistake>();
  for (const m of all) latest.set(qKey(m), m);
  return [...latest.values()].filter((m) => !r[qKey(m)] || r[qKey(m)]! < m.at).reverse();
}
