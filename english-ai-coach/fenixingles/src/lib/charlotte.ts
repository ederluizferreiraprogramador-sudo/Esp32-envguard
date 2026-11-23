// "Cérebro" da Charlotte: conversa simples em inglês para iniciantes.
// Usa IA quando o ambiente oferece (window.claude "sample"); senão, um roteiro local.

export interface Turn { from: "charlotte" | "aluno"; en: string; pt?: string; tip?: string }
export interface Reply { en: string; pt: string; tip: string; suggestions: string[] }

type ClaudeWin = { claude?: { use: (n: string) => Promise<unknown> } };
type SampleFn = ((input: unknown, opts?: unknown) => Promise<{ text: string }>) & { json: <T>(input: unknown, opts?: unknown) => Promise<T> };

let samplePromise: Promise<SampleFn | null> | null = null;
export function getSample(): Promise<SampleFn | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  const c = (window as unknown as ClaudeWin).claude;
  if (!c?.use) return Promise.resolve(null);
  samplePromise ??= c.use("sample").then((s) => (s as SampleFn) ?? null).catch(() => null);
  return samplePromise;
}

// ---------- roteiro local (sem IA) ----------
const COLORS = ["blue", "red", "green", "pink", "yellow", "purple", "orange", "black", "white"];
const has = (t: string, ...w: string[]) => w.some((x) => new RegExp(`\\b${x}\\b`, "i").test(t));

function tipFor(text: string): string {
  if (/(^|\s)i(\s|'|$)/.test(text)) return "Dica: em inglês, \"I\" (eu) é sempre com letra maiúscula.";
  if (/\bi am\b/i.test(text)) return "Dica: no dia a dia dizemos \"I'm\" (contração de I am).";
  if (/\bhave \d+ years\b/i.test(text)) return "Dica: idade em inglês usa o verbo be: \"I'm 8 years old\" (não \"I have\").";
  return "";
}

export function scriptedReply(text: string, name: string): Reply {
  const n = name ? ` ${name}` : "";
  const tip = tipFor(text);
  const t = text.toLowerCase();
  const color = COLORS.find((c) => has(t, c));
  if (has(t, "bye", "goodbye", "tchau")) return { en: `Bye bye${n}! See you tomorrow!`, pt: "Tchau! Até amanhã!", tip, suggestions: ["Bye, Charlotte!"] };
  if (has(t, "my name is") || /^i'?m [a-z]+$/i.test(text.trim()) && !has(t, "fine", "good", "great", "ok", "tired", "sad", "happy"))
    return { en: "Nice to meet you! I'm Charlotte. How are you today?", pt: "Prazer em te conhecer! Eu sou a Charlotte. Como você está hoje?", tip, suggestions: ["I'm fine, thanks!", "I'm great!", "I'm tired."] };
  if (has(t, "hi", "hello", "hey", "oi", "olá", "ola", "good morning", "good afternoon"))
    return { en: `Hi${n}! How are you today?`, pt: "Oi! Como você está hoje?", tip, suggestions: ["I'm fine, thanks!", "I'm great!", "I'm tired."] };
  if (has(t, "fine", "good", "great", "ok", "okay", "happy", "well"))
    return { en: "Great! Where are you from?", pt: "Que ótimo! De onde você é?", tip, suggestions: ["I'm from Brazil.", "I'm from Fortaleza."] };
  if (has(t, "tired", "sad", "bad", "sick"))
    return { en: "Oh no! A short lesson can help. Where are you from?", pt: "Ah, não! Uma lição curtinha pode ajudar. De onde você é?", tip, suggestions: ["I'm from Brazil.", "I'm from Fortaleza."] };
  if (has(t, "from"))
    return { en: "Cool! How old are you?", pt: "Legal! Quantos anos você tem?", tip, suggestions: ["I'm eight years old.", "I'm ten."] };
  if (has(t, "years", "old") || /\b\d{1,2}\b/.test(t) || has(t, "seven", "eight", "nine", "ten", "eleven", "twelve"))
    return { en: "Nice! What's your favorite color?", pt: "Legal! Qual é a sua cor favorita?", tip, suggestions: ["My favorite color is blue.", "I like pink."] };
  if (color)
    return { en: `${color[0]!.toUpperCase()}${color.slice(1)}! I love ${color} too. Do you have a pet?`, pt: `Eu também adoro essa cor! Você tem um bichinho de estimação?`, tip, suggestions: ["Yes, I have a cat.", "Yes, I have a dog.", "No, I don't."] };
  if (has(t, "cat", "dog", "pet", "fish", "bird", "no", "don't", "dont"))
    return { en: "Aww! I'm a kitten, you know? Are you ready for a lesson?", pt: "Own! Eu sou uma gatinha, sabia? Está pronto(a) para uma lição?", tip, suggestions: ["Yes, let's go!", "Not now."] };
  if (has(t, "yes", "let's go", "lets go", "ready", "sim"))
    return { en: "Yay! Tap the green star on the trail to start.", pt: "Eba! Toque na estrela verde da trilha para começar.", tip, suggestions: ["Thank you!", "Bye, Charlotte!"] };
  if (has(t, "thank", "thanks", "obrigad"))
    return { en: "You're welcome!", pt: "De nada!", tip, suggestions: ["Bye, Charlotte!"] };
  return { en: "Hmm, I'm learning too! Can you say it another way?", pt: "Hum, eu também estou aprendendo! Pode dizer de outro jeito?", tip, suggestions: ["Hello!", "I'm fine, thanks!", "I'm from Brazil."] };
}

export function greeting(name: string): Reply {
  return {
    en: `Hi${name ? ` ${name}` : ""}! I'm Charlotte, your English teacher. How are you today?`,
    pt: "Oi! Eu sou a Charlotte, sua professora de inglês. Como você está hoje?",
    tip: "",
    suggestions: ["I'm fine, thanks!", "I'm great!", "I'm tired."],
  };
}

// ---------- com IA ----------
const RULES = (name: string, unit: string) => `You are Charlotte, a cheerful gray tabby kitten with a pink bow who teaches English to Brazilian beginners (CEFR A1) inside the FenixInglês app.
The student is ${name || "a student"}. Current book unit: "${unit}".
Rules: reply in VERY simple English (max 2 short sentences, A1 words), friendly, and always end with ONE easy question to keep the chat going, ideally about the current unit topic.
If the student's last message has an English mistake, explain it briefly in Brazilian Portuguese in "tip" with the corrected sentence; otherwise tip is "".
If the student writes in Portuguese, answer in simple English and give the English way to say it in "tip".
Never discuss unsafe topics; gently steer back to English practice.
Reply with ONLY a JSON object: {"en": string, "pt": string (Portuguese translation of en), "tip": string, "suggestions": [2 or 3 short English answers the student could send next]}`;

export async function aiReply(history: Turn[], name: string, unit: string, signal?: AbortSignal): Promise<Reply | null> {
  const sample = await getSample();
  if (!sample) return null;
  const turns: { role: "user" | "assistant"; content: string }[] = [{ role: "user", content: RULES(name, unit) }];
  for (const t of history.slice(-12)) turns.push({ role: t.from === "charlotte" ? "assistant" : "user", content: t.en });
  if (turns[turns.length - 1]!.role !== "user") return null;
  const r = await sample.json<Partial<Reply>>(turns, { modelTier: "quick", cache: false, signal });
  if (!r || typeof r.en !== "string") return null;
  return {
    en: r.en, pt: typeof r.pt === "string" ? r.pt : "", tip: typeof r.tip === "string" ? r.tip : "",
    suggestions: Array.isArray(r.suggestions) ? r.suggestions.filter((x): x is string => typeof x === "string").slice(0, 3) : [],
  };
}
