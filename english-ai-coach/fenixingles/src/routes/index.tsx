import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { pendingReview } from "@/lib/mistakes";
import { LEVELS } from "@/lib/student";
import { useStudent } from "@/lib/student";
import { Buddy } from "@/components/Buddy";
import { UNIT_BUDDY } from "@/lib/cast";
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

const OFFSETS = [0, 56, 84, 56, 0, -56, -84, -56];
const headerBg: Record<string, string> = {
  green: "bg-gradient-to-r from-[#9b6bff] to-[#c39bff]", blue: "bg-gradient-to-r from-[#13a892] to-[#36e0c4]",
  orange: "bg-gradient-to-r from-[#d93fa8] to-[#ff8bdc]", red: "bg-gradient-to-r from-[#ff7a2f] to-[#ffb35c]",
};

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
        {units.map((u) => {
          const soon = u.lessons.length === 0;
          const nodes = soon ? [0, 1, 2] : u.lessons.map((_, i) => i);
          const unitDone = !soon && u.lessons.every((_, i) => p.completed.includes(lessonKey(u.id, i)));
          return (
            <section key={u.id} className="mt-10">
              <div className={`relative rounded-2xl border-3 border-fx-ink p-4 pr-28 text-white ${soon ? "bg-fx-gray-dark" : headerBg[u.color]}`} style={{ boxShadow: "0 5px 0 #1b1530" }}>
                <Buddy id={u.id === 3 ? "juba" : u.id === 9 ? "lili" : (UNIT_BUDDY[(u.id - 1) % UNIT_BUDDY.length] ?? "fenix-exploradora")} size={112} className="anim-float pointer-events-none absolute -top-8 right-1 drop-shadow-[0_4px_0_rgba(27,21,48,.35)]" />
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-extrabold uppercase opacity-90">Unidade {u.id}{soon && " · Em breve"}</p>
                  {unitDone && (
                    <Link to="/unit-summary/$unitId" params={{ unitId: String(u.id) }} className="text-sm font-extrabold text-white underline">
                      📄 Resumo de erros
                    </Link>
                  )}
                </div>
                <h2 className="font-display text-2xl">{u.title}</h2>
              </div>
              <div className="relative flex flex-col items-center gap-5 py-8">
                {nodes.map((i) => {
                  const key = lessonKey(u.id, i);
                  const done = p.completed.includes(key);
                  const isCur = key === current;
                  const offset = OFFSETS[(u.id * 3 + i) % OFFSETS.length] ?? 0;
                  const base = "flex h-20 w-20 items-center justify-center rounded-full text-3xl transition-transform active:translate-y-1.5";
                  const node = soon || (!done && !isCur) ? (
                    <div role="img" aria-label={soon ? "Em breve" : `Lição ${i + 1} bloqueada: ${u.lessons[i]?.title}`} className={`${base} bg-fx-gray text-fx-gray-dark`} style={{ boxShadow: "0 6px 0 var(--fx-gray-dark)" }}>🔒</div>
                  ) : (
                    <Link to="/lesson/$unitId/$lessonId" params={{ unitId: String(u.id), lessonId: String(i) }}
                      className={`${base} border-3 border-fx-ink ${isCur ? "bg-fx-teal anim-pulse-node" : "bg-fx-yellow"}`}
                      style={isCur ? undefined : { boxShadow: "0 6px 0 #1b1530" }}
                      aria-label={`Lição ${i + 1}: ${u.lessons[i]?.title} — ${done ? "concluída" : "disponível"}`}>
                      {done ? "👑" : "⭐"}
                    </Link>
                  );
                  return (
                    <div key={i} className="relative flex flex-col items-center" style={{ transform: `translateX(${offset}px)` }}>
                      {isCur && <span className="anim-bob mb-2 rounded-xl border-2 border-fx-gray bg-background px-3 py-1 text-sm font-extrabold text-fx-green">COMEÇAR</span>}
                      {node}
                      {!soon && <span className="mt-2 text-xs font-extrabold text-muted-foreground">{u.lessons[i]?.title}</span>}
                      {!soon && <span aria-hidden className={`node-tag ${done ? "node-done" : isCur ? "node-cur" : "node-lock"}`}>{done ? "✓ Concluída" : isCur ? "▶ Disponível" : "🔒 Bloqueada"}</span>}
                    </div>
                  );
                })}

              </div>
            </section>
          );
        })}
      </main>
      <BottomNav active="trail" />
    </div>
  );
}

