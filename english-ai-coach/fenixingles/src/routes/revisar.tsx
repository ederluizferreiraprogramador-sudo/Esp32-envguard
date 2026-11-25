import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { TopBar, BottomNav } from "@/components/TopBar";
import { Capi, Uni } from "@/components/Characters";
import { useProgress } from "@/lib/progress";
import { CATEGORIES, markReviewed, pendingReview, type Mistake } from "@/lib/mistakes";
import { playCorrect, playWrong, speak } from "@/lib/audio";
import { units } from "@/data/units";

export const Route = createFileRoute("/revisar")({
  head: () => ({ meta: [{ title: "Revisar — FenixInglês" }, { name: "description", content: "Treine de novo as questões em que você errou." }] }),
  component: Review,
});

const isEnglish = (m: Mistake) => m.type !== "match";
function options(m: Mistake) {
  const o = [m.correct];
  if (m.given && m.given.toLowerCase() !== m.correct.toLowerCase()) o.push(m.given);
  return (m.correct.length + m.unit) % 2 ? o.reverse() : o; // ordem estável, mas não sempre a certa primeiro
}

function Review() {
  const [p] = useProgress();
  const [list, setList] = useState<Mistake[]>([]);
  const [ready, setReady] = useState(false);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [training, setTraining] = useState(false);
  useEffect(() => { setList(pendingReview()); setReady(true); }, []);
  const deck = useMemo(() => list.slice(0, 10), [list]);
  const m = deck[i];
  const byUnit = useMemo(() => {
    const c = new Map<number, number>(); for (const x of list) c.set(x.unit, (c.get(x.unit) ?? 0) + 1);
    return [...c.entries()].sort((a, b) => a[0] - b[0]);
  }, [list]);

  const choose = (opt: string) => {
    if (!m || picked) return;
    setPicked(opt);
    const ok = opt === m.correct;
    if (ok) { playCorrect(); setScore((n) => n + 1); markReviewed(m); } else playWrong();
    if (isEnglish(m)) speak(m.correct);
  };
  const next = () => { setPicked(null); if (i + 1 < deck.length) setI(i + 1); else { setTraining(false); setI(0); setList(pendingReview()); } };

  return (
    <div className="min-h-screen pb-28">
      <TopBar p={p} />
      <main className="mx-auto max-w-lg px-4 py-5">
        <h1 className="text-2xl font-extrabold">🔁 Revisar</h1>
        <p className="text-muted-foreground">Treine de novo as questões em que você errou. Acertou no treino? Ela sai da lista.</p>

        {ready && list.length === 0 && !training && (
          <section className="card mt-5 flex flex-col items-center gap-2 p-6 text-center">
            <Capi size={130} />
            <h2 className="text-xl font-extrabold">Nada para revisar agora!</h2>
            <p className="text-muted-foreground">Quando errar alguma questão na trilha, ela aparece aqui para você treinar.</p>
            <Link to="/" className="btn3d btn-green mt-2 w-full">Ir para a trilha</Link>
          </section>
        )}

        {list.length > 0 && !training && (
          <>
            <section className="dash mt-5 flex items-center gap-3 rounded-3xl border-3 border-fx-ink p-4 text-white">
              <Uni size={96} dancing={false} />
              <div className="min-w-0 flex-1">
                <p className="font-display text-3xl">{list.length}</p>
                <p className="text-sm font-bold opacity-80">{list.length === 1 ? "questão para revisar" : "questões para revisar"}</p>
              </div>
              <button className="btn3d btn-green px-4" onClick={() => { setTraining(true); setI(0); setScore(0); setPicked(null); }}>Treinar {Math.min(10, list.length)}</button>
            </section>
            <h2 className="mt-6 font-extrabold">Por unidade</h2>
            <ul className="mt-2 flex flex-col gap-2">
              {byUnit.map(([u, n]) => (
                <li key={u} className="card flex items-center justify-between gap-2 p-3">
                  <span className="min-w-0"><span className="block text-xs font-extrabold uppercase text-fx-blue-dark">Unidade {u}</span><span className="block truncate font-extrabold">{units.find((x) => x.id === u)?.title}</span></span>
                  <span className="flex shrink-0 items-center gap-2"><span className="pill text-sm">{n}</span>
                    <Link to="/unit-summary/$unitId" params={{ unitId: String(u) }} className="rounded-xl bg-fx-blue-light px-3 py-1.5 text-sm font-extrabold text-fx-blue-dark">📄 Resumo</Link></span>
                </li>
              ))}
            </ul>
          </>
        )}

        {training && m && (
          <section className="mt-5" aria-live="polite">
            <div className="flex items-center gap-2" aria-label={`Questão ${i + 1} de ${deck.length}`}>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-fx-gray"><div className="h-full rounded-full bg-fx-green transition-all" style={{ width: `${((i + (picked ? 1 : 0)) / deck.length) * 100}%` }} /></div>
              <span className="text-sm font-extrabold">{i + 1}/{deck.length}</span>
            </div>
            <p className="mt-4 text-xs font-extrabold uppercase text-fx-blue-dark">{CATEGORIES[m.type].title} · Unidade {m.unit}</p>
            <h2 className="mt-1 text-xl font-extrabold">{m.prompt}</h2>
            {m.type === "match" ? (
              <div className="card mt-4 p-4"><p className="font-bold">Respostas certas:</p><p>{m.correct}</p>
                {!picked && <button className="btn3d btn-blue mt-3 w-full" onClick={() => { setPicked(m.correct); markReviewed(m); setScore((n) => n + 1); }}>Entendi ✓</button>}</div>
            ) : (
              <div role="radiogroup" aria-label="Escolha a resposta certa" className="mt-4 flex flex-col gap-3">
                {options(m).map((o) => {
                  const st = !picked ? "" : o === m.correct ? "tile-correct" : o === picked ? "tile-wrong" : "";
                  return <button key={o} role="radio" aria-checked={picked === o} disabled={!!picked} onClick={() => choose(o)} className={`tile text-left text-lg ${st}`}>{o}</button>;
                })}
              </div>
            )}
            {picked && (
              <div className={`anim-up mt-4 flex items-center gap-3 rounded-2xl p-3 ${picked === m.correct ? "bg-fx-green-light" : "bg-fx-red-light"}`}>
                {picked === m.correct ? <Capi size={72} /> : <Uni size={72} />}
                <div className="min-w-0 flex-1">
                  <p className={`font-extrabold ${picked === m.correct ? "text-fx-green-dark" : "text-fx-red-dark"}`}>{picked === m.correct ? "Isso! Revisada ✓" : `A certa é: ${m.correct}`}</p>
                  <p className="text-sm">{m.explain}</p>
                </div>
                {isEnglish(m) && <button aria-label="Ouvir de novo" className="rounded-xl bg-white px-3 py-2 text-xl" onClick={() => speak(m.correct)}>🔊</button>}
              </div>
            )}
            {picked && <button className="btn3d btn-green mt-4 w-full" onClick={next}>{i + 1 < deck.length ? "Continuar" : `Terminar (${score}/${deck.length})`}</button>}
          </section>
        )}
      </main>
      <BottomNav active="revisar" />
    </div>
  );
}
