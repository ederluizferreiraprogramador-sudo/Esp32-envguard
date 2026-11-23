import { createFileRoute, Link } from "@tanstack/react-router";
import { units } from "@/data/units";
import { lessonKey, useProgress } from "@/lib/progress";
import { TopBar, BottomNav } from "@/components/TopBar";
import { Phoenix } from "@/components/Phoenix";
import { Capi, UniFront } from "@/components/Characters";
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
  green: "bg-fx-green btn-green", blue: "bg-fx-blue btn-blue", orange: "bg-fx-orange", red: "bg-fx-red btn-red",
};

function Trail() {
  const [p] = useProgress();
  const flat = units.flatMap((u) => u.lessons.map((_, i) => lessonKey(u.id, i)));
  const current = flat.find((k) => !p.completed.includes(k));

  return (
    <div className="min-h-screen pb-28">
      <TopBar p={p} />
      <main className="mx-auto max-w-lg px-4">
        <section className="mt-5 flex items-center gap-3 rounded-2xl border-2 border-fx-gray p-3" aria-label="Boas-vindas da Charlotte">
          <div className="flex shrink-0 flex-col items-center gap-1"><Kitten name="charlotte" size={84} /><NameTag name="charlotte" /></div>
          <div className="min-w-0">
            <p className="font-extrabold">Oi! Eu sou a Charlotte, sua professora de inglês. 🐾</p>
            <p className="text-sm text-muted-foreground">Vamos seguir o livro unidade por unidade. Quando errar, o Uni rebola e a gente repete juntos!</p>
            <button className="mt-2 rounded-xl bg-fx-blue-light px-3 py-1 text-sm font-extrabold text-fx-blue-dark" onClick={() => speak("Hi! I'm Charlotte, your English teacher. Let's learn together!")}>🔊 Ouvir a Charlotte</button>
          </div>
        </section>
        {units.map((u) => {
          const soon = u.lessons.length === 0;
          const nodes = soon ? [0, 1, 2] : u.lessons.map((_, i) => i);
          const unitDone = !soon && u.lessons.every((_, i) => p.completed.includes(lessonKey(u.id, i)));
          return (
            <section key={u.id} className="mt-6">
              <div className={`rounded-2xl p-4 text-primary-foreground ${soon ? "bg-fx-gray-dark" : headerBg[u.color]}`} style={{ boxShadow: "0 4px 0 rgb(0 0 0 / .15)" }}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-extrabold uppercase opacity-90">Unidade {u.id}{soon && " · Em breve"}</p>
                  {unitDone && (
                    <Link to="/unit-summary/$unitId" params={{ unitId: String(u.id) }} className="text-sm font-extrabold text-white underline">
                      📄 Resumo de erros
                    </Link>
                  )}
                </div>
                <h2 className="text-xl font-extrabold">{u.title}</h2>
              </div>
              <div className="relative flex flex-col items-center gap-5 py-8">
                {nodes.map((i) => {
                  const key = lessonKey(u.id, i);
                  const done = p.completed.includes(key);
                  const isCur = key === current;
                  const offset = OFFSETS[(u.id * 3 + i) % OFFSETS.length] ?? 0;
                  const base = "flex h-20 w-20 items-center justify-center rounded-full text-3xl transition-transform active:translate-y-1.5";
                  const node = soon || (!done && !isCur) ? (
                    <div className={`${base} bg-fx-gray text-fx-gray-dark`} style={{ boxShadow: "0 6px 0 var(--fx-gray-dark)" }}>🔒</div>
                  ) : (
                    <Link to="/lesson/$unitId/$lessonId" params={{ unitId: String(u.id), lessonId: String(i) }}
                      className={`${base} ${isCur ? "bg-fx-green anim-pulse-node" : "bg-fx-yellow"}`}
                      style={isCur ? undefined : { boxShadow: "0 6px 0 var(--fx-yellow-dark)" }}
                      aria-label={`Lição ${i + 1}: ${u.lessons[i]?.title}`}>
                      {done ? "👑" : "⭐"}
                    </Link>
                  );
                  return (
                    <div key={i} className="relative flex flex-col items-center" style={{ transform: `translateX(${offset}px)` }}>
                      {isCur && <span className="anim-bob mb-2 rounded-xl border-2 border-fx-gray bg-background px-3 py-1 text-sm font-extrabold text-fx-green">COMEÇAR</span>}
                      {node}
                      {!soon && <span className="mt-2 text-xs font-extrabold text-muted-foreground">{u.lessons[i]?.title}</span>}
                    </div>
                  );
                })}
                <UnitBuddy id={u.id} side={u.id % 2 === 0 ? "left-0" : "right-0"} />
              </div>
            </section>
          );
        })}
      </main>
      <BottomNav active="trail" />
    </div>
  );
}

/** Um personagem da turma acompanha cada unidade na trilha. */
function UnitBuddy({ id, side }: { id: number; side: string }) {
  const cls = `absolute ${side} top-14`;
  switch (id % 6) {
    case 1: return id === 1 ? <Phoenix size={92} className={`${cls} anim-bob`} /> : <Capi size={92} className={cls} />;
    case 2: return <Kitten name="charlotte" size={92} className={cls} />;
    case 3: return <UniFront size={92} className={`${cls} anim-bob`} />;
    case 4: return <Kitten name="mingau" size={92} className={cls} />;
    case 5: return <Kitten name="luna" size={92} className={cls} />;
    default: return <Capi size={92} className={cls} />;
  }
}
