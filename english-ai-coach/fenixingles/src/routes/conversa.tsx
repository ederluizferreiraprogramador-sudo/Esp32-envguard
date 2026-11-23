import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Kitten } from "@/components/Kittens";
import { Avatar } from "@/components/Avatar";
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
  useEffect(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }); }, [turns, busy]);

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

  return (
    <div className="mx-auto flex h-[100dvh] max-w-lg flex-col">
      <header className="flex items-center gap-3 border-b-2 border-fx-gray px-4 py-2">
        <Link to="/" aria-label="Voltar" className="text-3xl font-extrabold text-fx-gray-dark">✕</Link>
        <Kitten name="charlotte" size={52} animated={busy} />
        <div className="min-w-0 flex-1">
          <h1 className="font-extrabold">Charlotte</h1>
          <p className="text-xs text-muted-foreground">
            {busy ? "digitando…" : ai === "on" ? "🟢 Conversa com IA" : ai === "off" ? "Conversa guiada" : "conectando…"} · Unidade {cur.id}
          </p>
        </div>
      </header>

      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {turns.map((t, i) => t.from === "charlotte" ? (
          <div key={i} className="flex items-end gap-2">
            <Kitten name="charlotte" size={40} animated={false} className="shrink-0" />
            <div className="min-w-0 max-w-[80%] rounded-2xl rounded-bl-sm border-2 border-fx-gray bg-white p-3">
              <p className="text-lg">{t.en}</p>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm">
                <button className="font-extrabold text-fx-blue-dark" onClick={() => speak(t.en)}>🔊 Ouvir</button>
                <button className="font-extrabold text-fx-blue-dark" onClick={() => speak(t.en, true)}>🐢 Devagar</button>
                {t.pt && <button className="font-extrabold text-muted-foreground" onClick={() => setShowPt((s) => ({ ...s, [i]: !s[i] }))}>🇧🇷 {showPt[i] ? "Esconder" : "Tradução"}</button>}
              </div>
              {showPt[i] && t.pt && <p className="mt-1 text-sm text-muted-foreground">{t.pt}</p>}
              {t.tip && <p className="mt-2 rounded-xl bg-fx-yellow/30 p-2 text-sm">💡 {t.tip}</p>}
            </div>
          </div>
        ) : (
          <div key={i} className="flex items-end justify-end gap-2">
            <div className="min-w-0 max-w-[80%] rounded-2xl rounded-br-sm bg-fx-blue p-3 text-lg text-white">{t.en}</div>
            <Avatar a={st.avatar} size={36} className="shrink-0" />
          </div>
        ))}
        {busy && <p className="pl-12 text-sm text-muted-foreground">Charlotte está pensando… 🐾</p>}
      </div>

      <div className="border-t-2 border-fx-gray p-3">
        {sugg.length > 0 && (
          <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
            {sugg.map((s) => <button key={s} onClick={() => send(s)} disabled={busy} className="tile shrink-0 text-sm">{s}</button>)}
          </div>
        )}
        {partial && <p className="mb-1 text-sm italic text-muted-foreground">{partial}…</p>}
        <form className="flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); void send(text); }}>
          {mic !== "none" && (
            <button type="button" onClick={toggleMic} aria-label={mic === "listening" ? "Parar de ouvir" : "Falar"}
              className={`btn3d h-12 w-12 shrink-0 p-0 text-xl ${mic === "listening" ? "btn-red" : "btn-blue"}`}>{mic === "listening" ? "⏹" : "🎤"}</button>
          )}
          <label htmlFor="fx-chat" className="sr-only">Sua mensagem em inglês</label>
          <input id="fx-chat" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write in English…" autoComplete="off"
            className="min-w-0 flex-1 rounded-2xl border-2 border-fx-gray bg-fx-gray/30 p-3 text-lg outline-none focus:border-fx-blue" />
          <button type="submit" disabled={!text.trim() || busy} className="btn3d btn-green h-12 shrink-0 px-4">Enviar</button>
        </form>
      </div>
    </div>
  );
}
