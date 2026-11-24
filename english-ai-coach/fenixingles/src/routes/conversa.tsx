import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Kitten } from "@/components/Kittens";
import { Scene, type SceneName } from "@/components/Scene";
import { units } from "@/data/units";
import { lessonKey, useProgress } from "@/lib/progress";
import { useStudent } from "@/lib/student";
import { speak } from "@/lib/audio";
import { aiReply, getSample, greeting, scriptedReply, type Reply, type Turn } from "@/lib/charlotte";
import { getDictation } from "@/lib/dictation";

export const Route = createFileRoute("/conversa")({
  head: () => ({ meta: [{ title: "Conversar com a Charlotte — FenixInglês" }, { name: "description", content: "Pratique inglês conversando com a Charlotte." }] }),
  component: Chat,
});

function Chat() {
  const [st] = useStudent();
  const [p] = useProgress();
  const first = st.name.split(" ")[0] ?? "";
  const cur = units.find((u) => u.lessons.some((_, i) => !p.completed.includes(lessonKey(u.id, i)))) ?? units[0]!;
  const [turns, setTurns] = useState<Turn[]>([]);
  const [sugg, setSugg] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [partial, setPartial] = useState("");
  const [busy, setBusy] = useState(false);
  const [ai, setAi] = useState<"checking" | "on" | "off">("checking");
  const [mic, setMic] = useState<"none" | "idle" | "listening">("none");
  const [showPt, setShowPt] = useState<Record<number, boolean>>({});
  const listRef = useRef<HTMLDivElement>(null);
  const dictRef = useRef<Awaited<ReturnType<typeof getDictation>>>(null);
  const ctlRef = useRef<AbortController | null>(null);

  // saudação inicial
  useEffect(() => {
    if (turns.length) return;
    const g = greeting(first);
    setTurns([{ from: "charlotte", en: g.en, pt: g.pt }]);
    setSugg(g.suggestions);
  }, [first]);

  useEffect(() => { getSample().then((s) => setAi(s ? "on" : "off")); }, []);
  useEffect(() => {
    let offs: (() => void)[] = [];
    getDictation().then((d) => {
      if (!d) return;
      dictRef.current = d; setMic("idle");
      offs = [
        d.onPartial(({ text }) => setPartial(text)),
        d.onFinal(({ text }) => { setPartial(""); setText((v) => (v ? v + text : text.trimStart())); }),
        d.onState(({ state }) => setMic(state === "idle" ? "idle" : "listening")),
      ];
    });
    return () => offs.forEach((f) => f());
  }, []);
  useEffect(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight }); });

  const send = async (msg: string) => {
    const m = msg.trim();
    if (!m || busy) return;
    if (mic === "listening") void dictRef.current?.stop().catch(() => {});
    const next: Turn[] = [...turns, { from: "aluno", en: m }];
    setTurns(next); setText(""); setSugg([]); setBusy(true);
    let r: Reply | null = null;
    if (ai === "on") {
      ctlRef.current = new AbortController();
      try { r = await aiReply(next, first, cur.title, ctlRef.current.signal); }
      catch (e) { if ((e as { code?: string })?.code === "not_granted") setAi("off"); r = null; }
    }
    r ??= scriptedReply(m, first);
    setTurns([...next, { from: "charlotte", en: r.en, pt: r.pt, tip: r.tip }]);
    setSugg(r.suggestions);
    setBusy(false);
    speak(r.en);
  };

  const toggleMic = () => {
    const d = dictRef.current; if (!d) return;
    if (mic === "listening") { void d.stop().catch(() => {}); return; }
    d.start({ language: "en" }).catch(() => setMic("idle"));
  };

  const lastIdx = turns.map((t) => t.from).lastIndexOf("charlotte");
  const last = turns[lastIdx];
  const scenes: SceneName[] = ["espaco", "campo", "quarto"];
  const scene = scenes[Math.floor(turns.length / 4) % scenes.length] ?? "espaco";
  const [log, setLog] = useState(false);
  const [kbd, setKbd] = useState(false);

  return (
    <div className="flex h-[100dvh] flex-col bg-[#2a2340] p-2 text-white sm:p-4">
      <div className="mx-auto flex w-full max-w-3xl items-center gap-2">
        <Link to="/" aria-label="Voltar" className="btn3d btn-purple h-11 w-11 p-0 text-2xl">‹</Link>
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg leading-tight">Charlotte</p>
          <p className="text-xs text-white/70">{busy ? "pensando…" : ai === "on" ? "conversa com IA" : ai === "off" ? "conversa guiada" : "conectando…"} · Unidade {cur?.id}</p>
        </div>
        <span className="pill text-base" title="Moedas (XP)">{p.xp} <span aria-hidden>🪙</span></span>
        <button onClick={() => setLog((v) => !v)} aria-label="Ver conversa escrita" className="btn3d h-11 w-11 bg-fx-pink p-0 text-xl">💬</button>
      </div>

      <div className="relative mx-auto mt-2 w-full max-w-3xl flex-1 overflow-hidden rounded-[2rem] border-4 border-[#4a3f6b]">
        <Scene name={scene} className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-x-0 bottom-[6%] flex justify-center">
          <div className={busy ? "anim-bob" : "anim-float"}><Kitten name="charlotte" size={200} animated={busy} /></div>
        </div>
        {log && (
          <div ref={listRef} className="absolute inset-0 space-y-2 overflow-y-auto bg-[#1b1530]/92 p-4">
            <p className="font-display text-lg">Conversa escrita</p>
            {turns.map((t, i) => (
              <p key={i} className={`max-w-[85%] rounded-2xl p-2 ${t.from === "charlotte" ? "bg-white/10" : "ml-auto bg-fx-blue text-right"}`}>
                <span className="block text-xs text-white/60">{t.from === "charlotte" ? "Charlotte" : first || "Você"}</span>{t.en}
              </p>
            ))}
          </div>
        )}
      </div>

      {last && (
          <div className="mx-auto mt-2 w-full max-w-3xl rounded-2xl border-3 border-[#4a3f6b] bg-[#1b1530] p-3">
            <p className="font-display text-xl leading-snug">{last.en}</p>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm">
              <button className="font-extrabold text-fx-teal" onClick={() => speak(last.en)}>🔊 Ouvir</button>
              <button className="font-extrabold text-fx-teal" onClick={() => speak(last.en, true)}>🐢 Devagar</button>
              {last.pt && <button className="font-extrabold text-white/80" onClick={() => setShowPt((s) => ({ ...s, [lastIdx]: !s[lastIdx] }))}>🇧🇷 {showPt[lastIdx] ? "Esconder" : "Tradução"}</button>}
            </div>
            {showPt[lastIdx] && last.pt && <p className="mt-1 text-sm text-white/80">{last.pt}</p>}
            {last.tip && <p className="mt-2 rounded-xl bg-fx-yellow/90 p-2 text-sm text-fx-ink">💡 {last.tip}</p>}
          </div>
        )}
      <div className="mx-auto mt-2 w-full max-w-3xl">
        {sugg.length > 0 && (
          <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
            {sugg.map((s) => <button key={s} onClick={() => send(s)} disabled={busy} className="shrink-0 rounded-2xl border-2 border-white/30 bg-white/10 px-3 py-2 text-sm font-extrabold">{s}</button>)}
          </div>
        )}
        {partial && <p className="mb-1 text-sm italic text-white/70">{partial}…</p>}
        <div className="flex items-end gap-2">
          {(kbd || mic === "none") ? (
            <form className="flex min-w-0 flex-1 items-center gap-2" onSubmit={(e) => { e.preventDefault(); void send(text); }}>
              <label htmlFor="fx-chat" className="sr-only">Sua mensagem em inglês</label>
              <input id="fx-chat" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write in English…" autoComplete="off"
                className="min-w-0 flex-1 rounded-2xl border-3 border-[#4a3f6b] bg-white p-3 text-lg text-fx-ink outline-none focus:border-fx-teal" />
              <button type="submit" disabled={!text.trim() || busy} className="btn3d btn-teal h-12 shrink-0 px-4">Enviar</button>
            </form>
          ) : (
            <button onClick={() => setKbd(true)} className="btn3d h-12 flex-1 bg-white/90 text-fx-ink">⌨️ Escrever</button>
          )}
          {mic !== "none" && (
            <button type="button" onClick={toggleMic} aria-label={mic === "listening" ? "Parar de ouvir" : "Falar"}
              className={`h-20 w-20 shrink-0 rounded-full border-4 border-[#1b1530] text-4xl shadow-[0_6px_0_#1b1530] ${mic === "listening" ? "bg-fx-red anim-pulse-node" : "bg-gradient-to-br from-fx-teal to-fx-blue"}`}>{mic === "listening" ? "⏹" : "🎤"}</button>
          )}
        </div>
      </div>
    </div>
  );
}
