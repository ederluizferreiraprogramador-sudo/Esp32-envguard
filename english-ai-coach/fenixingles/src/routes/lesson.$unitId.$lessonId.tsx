import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { units, type Activity } from "@/data/units";
import { completeLesson, lessonKey, MAX_HEARTS, update, useProgress } from "@/lib/progress";
import { playCorrect, playFinish, playWrong, speak } from "@/lib/audio";
import { recordMistake } from "@/lib/mistakes";
import { Phoenix } from "@/components/Phoenix";
import { Capi, Uni } from "@/components/Characters";

export const Route = createFileRoute("/lesson/$unitId/$lessonId")({
  head: () => ({
    meta: [
      { title: "Lição — FenixInglês" },
      { name: "description", content: "Pratique inglês com atividades curtas e interativas." },
      { property: "og:title", content: "Lição — FenixInglês" },
      { property: "og:description", content: "Pratique inglês com atividades curtas e interativas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LessonPage,
});

// embaralhamento determinístico (igual no servidor e no navegador)
function shuffle<T>(arr: T[], seed: string): T[] {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) | 0;
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) & 0x7fffffff;
    const j = h % (i + 1);
    [a[i], a[j]] = [a[j] as T, a[i] as T];
  }
  return a;
}
export const norm = (s: string) => s.toLowerCase().replace(/[’']/g, "'").replace(/[.,!?]/g, "").replace(/\s+/g, " ").trim();

function isCorrect(a: Activity, v: string) {
  switch (a.type) {
    case "build": return norm(v) === norm(a.answer);
    case "write": return a.answer.some((x) => norm(x) === norm(v));
    case "match": return v === "done";
    default: return v === a.answer;
  }
}
function correctText(a: Activity) {
  if (a.type === "match") return "";
  if (a.type === "write") return a.answer[0] ?? "";
  return a.answer;
}
/** Frase em inglês que será lida em voz alta na autocorreção. */
function spokenAnswer(a: Activity): string {
  switch (a.type) {
    case "fill": return `${a.before} ${a.answer} ${a.after}`.replace(/^[AB]:\s*/, "").replace(/\s+/g, " ").trim();
    case "write": return /portugu/i.test(a.prompt) ? "" : (a.answer[0] ?? "");
    case "match": return "";
    default: return a.answer;
  }
}

function LessonPage() {
  const { unitId, lessonId } = Route.useParams();
  const unit = units.find((u) => u.id === Number(unitId));
  const lesson = unit?.lessons[Number(lessonId)];
  const [p, ready] = useProgress();
  const navigate = useNavigate();

  const total = lesson?.activities.length ?? 0;
  const [queue, setQueue] = useState<number[]>(() => Array.from({ length: total }, (_, i) => i));
  const [pos, setPos] = useState(0);
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [retry, setRetry] = useState(false); // autocorreção: repetir a mesma questão com a resposta certa
  const [solved, setSolved] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!unit || !lesson) {
    return <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center"><Phoenix /><p>Lição não encontrada.</p><Link to="/" className="btn3d btn-green">Voltar</Link></div>;
  }

  const idx = queue[pos] ?? 0;
  const act = lesson.activities[idx] as Activity;

  if (finished) {
    const pct = Math.round(((attempts - mistakes) / Math.max(attempts, 1)) * 100);
    const unitDone = unit.lessons.every((_, i) => p.completed.includes(lessonKey(unit.id, i)));
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-6 p-6 text-center">
        <div className="flex items-end gap-2"><Phoenix size={150} className="anim-bob" /><Capi size={110} /></div>
        <h1 className="anim-pop text-3xl font-extrabold text-fx-orange">Lição concluída!</h1>
        <div className="grid w-full grid-cols-2 gap-3">
          <div className="anim-pop overflow-hidden rounded-2xl border-2 border-fx-yellow"><div className="bg-fx-yellow py-1 text-sm font-extrabold text-primary-foreground">XP GANHO</div><div className="py-3 text-2xl font-extrabold text-fx-orange">💎 +10</div></div>
          <div className="anim-pop overflow-hidden rounded-2xl border-2 border-fx-green"><div className="bg-fx-green py-1 text-sm font-extrabold text-primary-foreground">ACERTOS</div><div className="py-3 text-2xl font-extrabold text-fx-green">🎯 {pct}%</div></div>
        </div>
        <p className="text-muted-foreground">🔥 Sequência: {p.streak} {p.streak === 1 ? "dia" : "dias"}</p>
        {unitDone && <p className="font-extrabold text-fx-blue">Unidade concluída! Veja onde você pode melhorar.</p>}
        <button className="btn3d btn-green w-full" onClick={() =>
          unitDone ? navigate({ to: "/unit-summary/$unitId", params: { unitId: String(unit.id) } }) : navigate({ to: "/" })
        }>Continuar</button>
      </div>
    );
  }

  if (ready && p.hearts <= 0 && status === "idle" && !retry) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-5 p-6 text-center">
        <div className="text-6xl">💔</div>
        <h1 className="text-2xl font-extrabold">Suas vidas acabaram</h1>
        <p className="text-muted-foreground">Elas recarregam amanhã — ou recarregue agora para continuar praticando.</p>
        <button className="btn3d btn-blue w-full" onClick={() => update((x) => ({ ...x, hearts: MAX_HEARTS }))}>Recarregar vidas</button>
        <Link to="/" className="btn3d btn-outline w-full">Sair</Link>
      </div>
    );
  }

  const sayAnswer = () => { const s = spokenAnswer(act); if (s) speak(s); };

  const check = () => {
    const ok = isCorrect(act, value);
    if (retry) {
      // Repetição da autocorreção: não conta tentativa nem tira vida.
      if (ok) { setStatus("correct"); playCorrect(); sayAnswer(); }
      else { setStatus("wrong"); playWrong(); }
      return;
    }
    setAttempts((n) => n + 1);
    if (ok) { setStatus("correct"); setSolved((n) => n + 1); playCorrect(); }
    else {
      setStatus("wrong"); setMistakes((n) => n + 1); playWrong();
      recordMistake(unit.id, Number(lessonId), idx, act, value);
      update((x) => ({ ...x, hearts: Math.max(0, x.hearts - 1), heartsDay: new Date().toISOString().slice(0, 10) }));
      setQueue((q) => [...q, idx]);
      // lê a resposta certa em inglês logo após o som de erro
      setTimeout(sayAnswer, 600);
    }
  };
  const startRetry = () => { setRetry(true); setValue(""); setStatus("idle"); };
  const next = () => {
    setRetry(false);
    if (pos + 1 >= queue.length) {
      update((x) => completeLesson(x, lessonKey(unit.id, Number(lessonId)), 10));
      playFinish(); setFinished(true); return;
    }
    setPos(pos + 1); setValue(""); setStatus("idle");
  };

  const seed = `${unitId}-${lessonId}-${idx}`;
  const locked = status !== "idle";
  const canRetry = act.type !== "match";
  const hint = retry ? correctText(act) : undefined;

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col">
      <div className="flex items-center gap-3 px-4 pt-4">
        <Link to="/" aria-label="Sair da lição" className="text-3xl font-extrabold text-fx-gray-dark">✕</Link>
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-fx-gray">
          <div className="h-full rounded-full bg-fx-green transition-all duration-500" style={{ width: `${(solved / total) * 100}%` }} />
        </div>
        <span className="font-extrabold text-fx-red">❤️ {p.hearts}</span>
      </div>

      <main key={`${pos}-${retry ? "r" : "n"}`} className="anim-pop flex-1 px-5 py-6">
        {retry && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl border-2 border-fx-blue bg-fx-blue/10 p-3 text-sm font-extrabold text-fx-blue-dark">
            🔁 Autocorreção: repita agora com a resposta certa
            <button onClick={sayAnswer} aria-label="Ouvir a resposta certa" className="ml-auto text-xl">🔊</button>
          </div>
        )}
        <ActivityView act={act} seed={seed} value={value} setValue={setValue} locked={locked} hint={hint} />
      </main>

      {status === "idle" ? (
        <div className="border-t-2 border-fx-gray p-4">
          <button className="btn3d btn-green w-full" disabled={!value} onClick={check}>Verificar</button>
        </div>
      ) : (
        <div className={`anim-up p-4 ${status === "correct" ? "bg-fx-green-light" : "bg-fx-red-light"}`}>
          <div className="mb-3 flex items-start gap-3">
            {status === "correct" ? <Capi size={72} className="anim-pop shrink-0" /> : <Uni size={84} className="anim-pop shrink-0" />}
            <div className="flex-1">
              <p className={`text-xl font-extrabold ${status === "correct" ? "text-fx-green-dark" : "text-fx-red-dark"}`}>
                {status === "correct" ? (retry ? "Isso! Agora você acertou." : "Muito bem!") : `Resposta correta: ${correctText(act)}`}
              </p>
              {status === "wrong" && <p className="text-sm font-extrabold text-fx-red-dark">O Uni está dançando para te animar — bora repetir! 🦄</p>}
              <p className={status === "correct" ? "text-fx-green-dark" : "text-fx-red-dark"}>{act.explain}</p>
            </div>
            {status === "wrong" && spokenAnswer(act) && (
              <button onClick={sayAnswer} aria-label="Ouvir a resposta certa" className="btn3d btn-blue h-12 w-12 shrink-0 p-0 text-xl">🔊</button>
            )}
          </div>
          {status === "wrong" && canRetry ? (
            <button className="btn3d btn-red w-full" onClick={startRetry}>Repetir com a resposta certa</button>
          ) : (
            <button className={`btn3d w-full ${status === "correct" ? "btn-green" : "btn-red"}`} onClick={next}>Continuar</button>
          )}
        </div>
      )}
    </div>
  );
}

interface AVProps { act: Activity; seed: string; value: string; setValue: (v: string) => void; locked: boolean; hint?: string }

function Options({ options, seed, value, setValue, locked, hint }: { options: string[] } & Omit<AVProps, "act">) {
  const opts = useMemo(() => shuffle(options, seed), [options, seed]);
  return (
    <div className="mt-6 flex flex-col gap-3">
      {opts.map((o) => (
        <button key={o} disabled={locked} onClick={() => { setValue(o); if (hint) speak(o); }}
          className={`tile text-left text-lg ${value === o ? "tile-selected" : ""} ${hint === o ? "ring-4 ring-fx-green" : ""}`}>
          {hint === o && "👉 "}{o}
        </button>
      ))}
    </div>
  );
}

function SpeakBtn({ text, big }: { text: string; big?: boolean }) {
  return (
    <div className="flex gap-3">
      <button onClick={() => speak(text)} className={`btn3d btn-blue ${big ? "h-24 w-24 text-4xl" : "h-12 w-12 p-0 text-xl"}`} aria-label="Ouvir">🔊</button>
      {big && <button onClick={() => speak(text, true)} className="btn3d btn-outline h-16 w-16 self-end p-0 text-2xl" aria-label="Ouvir devagar">🐢</button>}
    </div>
  );
}

function Hint({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="mt-4 rounded-2xl bg-fx-green-light p-3 text-lg font-extrabold text-fx-green-dark">👉 {text}</p>;
}

function ActivityView(props: AVProps) {
  const { act, value, setValue, locked, seed, hint } = props;
  const h = "text-2xl font-extrabold";
  switch (act.type) {
    case "fill":
      return (
        <>
          <h1 className={h}>Complete o diálogo</h1>
          {act.context && <p className="mt-5 rounded-2xl border-2 border-fx-gray p-3 text-lg">{act.context}</p>}
          <p className="mt-3 rounded-2xl border-2 border-fx-gray p-3 text-lg">
            {act.before}{" "}
            <span className={`inline-block min-w-16 border-b-2 px-1 text-center ${value ? "border-fx-blue text-fx-blue-dark" : "border-fx-gray-dark"}`}>{value || " "}</span>{" "}
            {act.after}
          </p>
          <Options options={act.options} {...props} />
        </>
      );
    case "choose":
      return (
        <>
          <h1 className={h}>Escolha a resposta correta</h1>
          <div className="mt-5 flex items-center gap-3">
            <SpeakBtn text={act.line} />
            <p className="rounded-2xl border-2 border-fx-gray p-3 text-lg">{act.line}</p>
          </div>
          <Options options={act.options} {...props} />
        </>
      );
    case "listen":
      return (
        <>
          <h1 className={h}>Ouça e escolha o que você ouviu</h1>
          <div className="mt-6 flex justify-center"><SpeakBtn text={act.audio} big /></div>
          <Options options={act.options} {...props} />
        </>
      );
    case "write":
      return (
        <>
          <h1 className={h}>Escreva por extenso em inglês</h1>
          <div className="mt-6 text-center text-6xl font-extrabold text-fx-blue">{act.prompt}</div>
          <Hint text={hint} />
          <input autoFocus disabled={locked} value={value} onChange={(e) => setValue(e.target.value)}
            placeholder="Digite aqui..." autoCapitalize="off" autoCorrect="off" spellCheck={false}
            className="mt-6 w-full rounded-2xl border-2 border-fx-gray bg-fx-gray/30 p-4 text-xl outline-none focus:border-fx-blue" />
        </>
      );
    case "build":
      return <Build {...props} act={act} />;
    case "match":
      return <Match act={act} seed={seed} setValue={setValue} />;
  }
}

function Build({ act, seed, setValue, locked, hint }: AVProps & { act: Extract<Activity, { type: "build" }> }) {
  const tiles = useMemo(() => shuffle([...act.answer.split(" "), ...act.extra], seed), [act, seed]);
  const [picked, setPicked] = useState<number[]>([]);
  const set = (n: number[]) => { setPicked(n); setValue(n.map((i) => tiles[i]).join(" ")); };
  return (
    <>
      <h1 className="text-2xl font-extrabold">Traduza esta frase</h1>
      <div className="mt-5 flex items-center gap-3">
        <Phoenix size={64} />
        <p className="rounded-2xl border-2 border-fx-gray p-3 text-lg">{act.pt}</p>
      </div>
      <Hint text={hint} />
      <div className="mt-5 flex min-h-16 flex-wrap gap-2 border-b-2 border-t-2 border-fx-gray py-3">
        {picked.map((i) => (
          <button key={i} disabled={locked} className="tile anim-pop" onClick={() => set(picked.filter((x) => x !== i))}>{tiles[i]}</button>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {tiles.map((t, i) => (
          <button key={i} disabled={locked} className={`tile ${picked.includes(i) ? "tile-done" : ""}`} onClick={() => { speak(t); set([...picked, i]); }}>{t}</button>
        ))}
      </div>
    </>
  );
}

function Match({ act, seed, setValue }: { act: Extract<Activity, { type: "match" }>; seed: string; setValue: (v: string) => void }) {
  const left = useMemo(() => shuffle(act.pairs.map((p) => p[0]), seed + "L"), [act, seed]);
  const right = useMemo(() => shuffle(act.pairs.map((p) => p[1]), seed + "R"), [act, seed]);
  const [selL, setSelL] = useState<string | null>(null);
  const [selR, setSelR] = useState<string | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string[]>([]);

  const tryPair = (l: string | null, r: string | null) => {
    if (!l || !r) return;
    if (act.pairs.some((p) => p[0] === l && p[1] === r)) {
      playCorrect();
      const d = [...done, l];
      setDone(d);
      if (d.length === act.pairs.length) setValue("done");
    } else {
      playWrong(); setWrong([l, r]); setTimeout(() => setWrong([]), 450);
    }
    setSelL(null); setSelR(null);
  };
  const doneR = act.pairs.filter((p) => done.includes(p[0])).map((p) => p[1]);
  const cls = (sel: boolean, isDone: boolean, isWrong: boolean) => `tile w-full ${isDone ? "tile-done" : ""} ${isWrong ? "tile-wrong anim-shake" : sel ? "tile-selected" : ""}`;

  return (
    <>
      <h1 className="text-2xl font-extrabold">Ligue os pares</h1>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-3">
          {left.map((l) => (
            <button key={l} className={cls(selL === l, done.includes(l), wrong[0] === l)} onClick={() => { speak(l); setSelL(l); tryPair(l, selR); }}>{l}</button>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {right.map((r) => (
            <button key={r} className={cls(selR === r, doneR.includes(r), wrong[1] === r)} onClick={() => { setSelR(r); tryPair(selL, r); }}>{r}</button>
          ))}
        </div>
      </div>
    </>
  );
}
