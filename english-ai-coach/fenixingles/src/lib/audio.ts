import { load } from "./progress";
import { toast } from "sonner";

let ctx: AudioContext | null = null;
function tone(freqs: number[], dur = 0.12) {
  if (!load().sound) return;
  try {
    ctx ??= new AudioContext();
    const c = ctx;
    freqs.forEach((f, i) => {
      const o = c.createOscillator(); const g = c.createGain();
      o.type = "sine"; o.frequency.value = f;
      const t = c.currentTime + i * dur;
      g.gain.setValueAtTime(0.15, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur * 1.5);
      o.connect(g).connect(c.destination); o.start(t); o.stop(t + dur * 1.6);
    });
  } catch { /* sem áudio */ }
}
export const playCorrect = () => tone([660, 880]);
export const playWrong = () => tone([300, 220], 0.15);
export const playFinish = () => tone([523, 659, 784, 1046], 0.13);

let voices: SpeechSynthesisVoice[] = [];
let synthesis: SpeechSynthesis | null = null;
let utterance: SpeechSynthesisUtterance | null = null;
let speakTimer: ReturnType<typeof setTimeout> | undefined;
let startTimer: ReturnType<typeof setTimeout> | undefined;
let warned = false;
let lastError = "";
let lastOk = false;
const warningKey = "fenix-audio-warning";

const isChrome = () => typeof navigator !== "undefined" && /Chrome\//.test(navigator.userAgent) && !/Edg\//.test(navigator.userAgent);

function warnAudio() {
  if (warned) return;
  warned = true;
  try {
    if (window.sessionStorage.getItem(warningKey)) return;
    window.sessionStorage.setItem(warningKey, "1");
  } catch { /* O aviso continua limitado nesta página se o armazenamento estiver bloqueado. */ }
  const noVoice = englishVoices().length === 0;
  const msg = noVoice
    ? "Seu navegador não tem voz em inglês. No Android: Configurações › Gerenciamento geral › Saída de texto para fala › escolha \"Serviços de fala do Google\" e instale \"Inglês (Estados Unidos)\". Ou use o app no Microsoft Edge, que já tem vozes."
    : "Não consegui tocar o áudio. Confira se o volume de mídia está ligado. Se continuar, abra o app no Microsoft Edge ou instale a voz em inglês nos Serviços de fala do Google.";
  toast.error(msg, { duration: 12000 });
}

function getSynthesis() {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const engine = window.speechSynthesis;
  if (synthesis !== engine) {
    synthesis = engine;
    voices = engine.getVoices();
    engine.onvoiceschanged = () => { voices = engine.getVoices(); };
  }
  if (!voices.length) voices = engine.getVoices();
  return engine;
}

const englishVoices = () => voices.filter((v) => /^en[-_]/i.test(v.lang));
const pickVoice = () =>
  englishVoices().find((v) => /^en[-_]US$/i.test(v.lang) && v.localService)
  ?? englishVoices().find((v) => /^en[-_]US$/i.test(v.lang))
  ?? englishVoices()[0];

export function getEnglishVoiceCount() {
  getSynthesis();
  return englishVoices().length;
}

/** Informações para o Perfil (diagnóstico do áudio). */
export function getAudioDiagnostics() {
  getSynthesis();
  return {
    supported: typeof window !== "undefined" && !!window.speechSynthesis,
    englishVoices: englishVoices().map((v) => `${v.name} (${v.lang})`),
    lastError,
    lastOk,
    browser: typeof navigator === "undefined" ? "" : /Edg\//.test(navigator.userAgent) ? "Edge" : isChrome() ? "Chrome" : "Outro",
  };
}

export function speak(text: string, slow = false, retry = false) {
  if (typeof window === "undefined") return;
  const engine = getSynthesis();
  if (!engine || typeof window.SpeechSynthesisUtterance === "undefined") {
    lastError = "sem suporte a voz";
    warnAudio(); return;
  }
  clearTimeout(speakTimer);
  clearTimeout(startTimer);
  // Ignora callbacks da fala anterior quando ela é cancelada ou substituída.
  if (utterance) {
    utterance.onstart = null; utterance.onerror = null; utterance.onend = null;
  }
  const u = new window.SpeechSynthesisUtterance(text);
  utterance = u; // Mantém referência forte enquanto o Chrome toca a fala.
  u.lang = "en-US"; u.rate = slow ? 0.6 : 0.9;
  u.onstart = () => { if (utterance === u) { clearTimeout(startTimer); lastOk = true; lastError = ""; } };
  u.onerror = (e?: Event) => {
    if (utterance !== u) return;
    clearTimeout(startTimer);
    const code = (e as SpeechSynthesisErrorEvent | undefined)?.error ?? "erro";
    if (code === "interrupted" || code === "canceled") return;
    lastError = code;
    // Chrome Android: a voz escolhida pode falhar; tenta 1 vez com o motor padrão.
    if (!retry && u.voice) { utterance = null; speak(text, slow, true); return; }
    warnAudio();
  };
  u.onend = () => {
    if (utterance !== u) return;
    clearTimeout(startTimer); utterance = null;
  };
  try {
    if (engine.speaking || engine.pending) engine.cancel();
    speakTimer = setTimeout(() => {
      try {
        const v = retry ? undefined : pickVoice();
        if (v) { u.voice = v; u.lang = v.lang.replace("_", "-"); }
        startTimer = setTimeout(() => {
          if (utterance !== u) return;
          lastError = lastError || "a fala não começou em 2 s";
          warnAudio();
        }, 2000);
        engine.resume();
        engine.speak(u);
      } catch { clearTimeout(startTimer); lastError = "falha ao chamar speak"; warnAudio(); }
    }, 50);
  } catch { warnAudio(); }
}
