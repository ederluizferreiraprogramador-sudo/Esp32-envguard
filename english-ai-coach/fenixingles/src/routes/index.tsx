import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { pendingReview } from "@/lib/mistakes";
import { LEVELS } from "@/lib/student";
import { useStudent } from "@/lib/student";
import { IslandTrail } from "@/components/IslandTrail";
import { units } from "@/data/units";
import { lessonKey, useProgress } from "@/lib/progress";
import { TopBar, BottomNav } from "@/components/TopBar";
import { Kitten, NameTag } from "@/components/Kittens";
import { speak } from "@/lib/audio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FenixInglês — Trilha de aprendizado" },
      { name: "description", content: "Sua trilha de inglês para iniciantes: lições curtas, XP e sequência de dias." },
      { property: "og:title", content: "FenixInglês — Trilha de aprendizado" },
      { property: "og:description", content: "Sua trilha de inglês para iniciantes: lições curtas, XP e sequência de dias." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Trail,
});

function Trail() {
  const [p] = useProgress();
  const [st, stReady] = useStudent();
  const nav = useNavigate();
  useEffect(() => {
    if (!stReady) return;
    if (!st.name) { nav({ to: "/bem-vindo" }); return; }
    try {
      if (!sessionStorage.getItem("fx-chat-greeted")) { sessionStorage.setItem("fx-chat-greeted", "1"); nav({ to: "/conversa" }); }
    } catch { /* sem sessionStorage: segue na trilha */ }
  }, [stReady, st.name]);
  const first = st.name.split(" ")[0];
  const flat = units.flatMap((u) => u.lessons.map((_, i) => lessonKey(u.id, i)));
  const current = flat.find((k) => !p.completed.includes(k));
  const doneCount = flat.filter((k) => p.completed.includes(k)).length;
  const pct = flat.length ? Math.round((doneCount / flat.length) * 100) : 0;
  const ready = units.filter((u) => u.lessons.length > 0);
  const unitsDone = ready.filter((u) => u.lessons.every((_, i) => p.completed.includes(lessonKey(u.id, i)))).length;
  const [cu, cl] = (current ?? "").split("-").map(Number);
  const curUnit = units.find((u) => u.id === cu);
  const [toReview, setToReview] = useState(0);
  useEffect(() => { setToReview(pendingReview().length); }, [p.completed.length]);
  const level = LEVELS.find((l) => l.id === st.level);

  return (
    <div className="min-h-screen pb-28">
      <TopBar p={p} />
      <main className="mx-auto max-w-lg px-4">
        <section className="card mt-5 flex items-center gap-3 p-3" aria-label="Boas-vindas da Charlotte">
          <div className="flex shrink-0 flex-col items-center gap-1"><Kitten name="charlotte" size={84} /><NameTag name="charlotte" /></div>
          <div className="min-w-0">
            <p className="font-extrabold">Oi{first ? `, ${first}` : ""}! Eu sou a Charlotte, sua professora de inglês. 🐾</p>
            <p className="text-sm text-muted-foreground">Vamos seguir o livro unidade por unidade. Quando errar, o Uni rebola e a gente repete juntos!</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Link to="/conversa" className="rounded-xl bg-fx-green px-3 py-1.5 text-sm font-extrabold text-white">💬 Conversar com a Charlotte</Link>
              <button className="rounded-xl bg-fx-blue-light px-3 py-1.5 text-sm font-extrabold text-fx-blue-dark" onClick={() => speak("Hi! I'm Charlotte, your English teacher. Let's learn together!")}>🔊 Ouvir</button>
            </div>
          </div>
        </section>
        <section className="dash mt-4 rounded-3xl border-3 border-fx-ink p-4 text-white" aria-label="Seu progresso">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="font-display text-lg">Seu progresso</h2>
            {level && <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-extrabold">{level.icon} {level.title}</span>}
          </div>
          <div className="flex items-center gap-4">
            <div className="relative h-24 w-24 shrink-0" role="img" aria-label={`${pct}% do curso concluído`}>
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden>
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="11" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--fx-teal)" strokeWidth="11" strokeLinecap="round"
                  strokeDasharray={`${(pct / 100) * 263.9} 263.9`} className="dash-ring" />
              </svg>
              <span className="absolute inset-0 flex flex-col items-center justify-center font-display text-2xl leading-none">{pct}%<span className="font-sans text-[10px] font-extrabold opacity-75">do curso</span></span>
            </div>
            <dl className="grid flex-1 grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl bg-white/10 p-2"><dt className="text-[11px] font-bold opacity-75">Lições</dt><dd className="font-display text-xl">{doneCount}<span className="text-sm opacity-70">/{flat.length}</span></dd></div>
              <div className="rounded-2xl bg-white/10 p-2"><dt className="text-[11px] font-bold opacity-75">Unidades</dt><dd className="font-display text-xl">{unitsDone}<span className="text-sm opacity-70">/{ready.length}</span></dd></div>
              <div className="rounded-2xl bg-white/10 p-2"><dt className="text-[11px] font-bold opacity-75">Revisar</dt><dd className="font-display text-xl">{toReview}</dd></div>
            </dl>
          </div>
          {curUnit && cl !== undefined && !Number.isNaN(cl) ? (
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white p-3 text-fx-text">
              <span className="text-3xl" aria-hidden>🎯</span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-extrabold uppercase text-fx-blue-dark">Próxima atividade</p>
                <p className="truncate font-extrabold">Unidade {curUnit.id} · {curUnit.lessons[cl]?.title}</p>
              </div>
              <Link to="/lesson/$unitId/$lessonId" params={{ unitId: String(cu), lessonId: String(cl) }} className="btn3d btn-green shrink-0 px-4 py-2 text-sm">Continuar</Link>
            </div>
          ) : (
            <p className="mt-4 rounded-2xl bg-white p-3 font-extrabold text-fx-text">🏆 Você concluiu todas as lições disponíveis!</p>
          )}
        </section>
        <IslandTrail p={p} />
      </main>
      <BottomNav active="trail" />
    </div>
  );
}

