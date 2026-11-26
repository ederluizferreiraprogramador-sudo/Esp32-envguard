import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Phoenix } from "@/components/Phoenix";
import { Kitten } from "@/components/Kittens";
import { CastImage } from "@/components/CastImage";
import { LEVELS, updateStudent, useStudent, type Level } from "@/lib/student";
import { speak } from "@/lib/audio";

export const Route = createFileRoute("/bem-vindo")({
  head: () => ({ meta: [{ title: "Bem-vindo — FenixInglês" }, { name: "description", content: "Monte a sua jornada de inglês." }] }),
  component: Welcome,
});

const AGES = ["4 a 6 anos", "7 a 9 anos", "10 a 12 anos", "13 a 17 anos", "Adulto"];
const GOALS = [{ m: 5, l: "Leve" }, { m: 10, l: "Regular" }, { m: 15, l: "Puxado" }, { m: 20, l: "Intenso" }];

function Welcome() {
  const [s] = useStudent();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [goal, setGoal] = useState(10);
  const [level, setLevel] = useState<Level>("");
  useEffect(() => { if (s.name && !name) setName(s.name); }, [s.name]); // eslint-disable-line react-hooks/exhaustive-deps
  const first = (name || s.name).trim().split(" ")[0] ?? "";
  const steps = 5;
  const canNext = step === 0 ? true : step === 1 ? name.trim().length > 0 : step === 2 ? !!age : step === 3 ? !!level : true;
  const next = () => {
    if (step === 4) {
      updateStudent((x) => ({ ...x, name: name.trim(), age, goal, level }));
      try { sessionStorage.setItem("fx-chat-greeted", "1"); } catch { /* */ }
      nav({ to: "/conversa" }); return;
    }
    if (step === 3) speak(`${first}, your learning journey is ready!`);
    setStep(step + 1);
  };

  return (
    <div className={`mx-auto flex min-h-screen max-w-lg flex-col p-5 ${step === 3 ? "level-screen" : ""}`}>
      <div className="flex items-center gap-3">
        {step > 0 && <button aria-label="Voltar" className="text-3xl font-extrabold text-fx-gray-dark" onClick={() => setStep(step - 1)}>‹</button>}
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-fx-gray">
          <div className="h-full rounded-full bg-fx-green transition-all duration-500" style={{ width: `${((step + 1) / steps) * 100}%` }} />
        </div>
      </div>
      <main key={step} className="anim-pop flex flex-1 flex-col items-center justify-center gap-5 text-center">
        {step === 0 && <>
          <Phoenix pose="letras" size={190} />
          <h1 className="text-3xl font-extrabold">Bem-vindo ao FenixInglês!</h1>
          <p className="text-muted-foreground">Inglês do jeito divertido, seguindo o livro, com a Charlotte, a Fê e toda a turma.</p>
        </>}
        {step === 1 && <>
          <Kitten name="charlotte" size={150} />
          <h1 className="text-2xl font-extrabold">Oi! Eu sou a Charlotte. Qual é o seu nome?</h1>
          <label htmlFor="fx-name" className="sr-only">Seu nome</label>
          <input id="fx-name" autoFocus value={name} onChange={(e) => setName(e.target.value)} maxLength={30} placeholder="Digite seu nome"
            className="w-full rounded-2xl border-2 border-fx-gray bg-fx-gray/30 p-4 text-center text-xl outline-none focus:border-fx-blue" />
        </>}
        {step === 2 && <>
          <CastImage id="panda" size={150} />
          <h1 className="text-2xl font-extrabold">Quantos anos tem quem vai estudar?</h1>
          <div className="grid w-full grid-cols-2 gap-3">
            {AGES.map((a) => <button key={a} onClick={() => setAge(a)} className={`tile ${age === a ? "tile-selected" : ""}`}>{a}</button>)}
          </div>
          <h2 className="mt-2 font-extrabold">Meta diária</h2>
          <div className="grid w-full grid-cols-2 gap-3">
            {GOALS.map((g) => <button key={g.m} onClick={() => setGoal(g.m)} className={`tile ${goal === g.m ? "tile-selected" : ""}`}>{g.l} · {g.m} min/dia</button>)}
          </div>
        </>}
        {step === 3 && <>
          <h1 className="text-2xl font-extrabold">Como está o seu inglês hoje?</h1>
          <p className="text-muted-foreground">Sem pressão! Isso ajuda a Charlotte a dar as dicas certas.</p>
          <div role="radiogroup" aria-label="Nível de inglês" className="flex w-full flex-col gap-3">
            {LEVELS.map((l) => (
              <button key={l.id} role="radio" aria-checked={level === l.id} onClick={() => setLevel(l.id)}
                className={`level-card flex items-center gap-3 rounded-2xl border-[3px] p-4 text-left ${level === l.id ? "level-on" : ""}`}>
                <span className="text-4xl" aria-hidden>{l.icon}</span>
                <span className="min-w-0 flex-1"><span className="block text-lg font-extrabold">{l.title}</span><span className="block text-sm opacity-80">{l.desc}</span></span>
                <span aria-hidden className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-[3px] font-extrabold ${level === l.id ? "border-white bg-white text-fx-blue-dark" : "border-white/60"}`}>{level === l.id ? "✓" : ""}</span>
              </button>
            ))}
          </div>
        </>}
        {step === 4 && <>
          <div className="flex items-end"><Phoenix pose="guerreira" size={170} /><span className="text-6xl">🏆</span></div>
          <h1 className="text-3xl font-extrabold">A jornada de aprendizagem de <span className="text-fx-green">{first}</span> está pronta!</h1>
          <p className="text-muted-foreground">16 unidades na ordem do livro · meta de {goal} min por dia. Você pode montar o seu avatar no Perfil.</p>
        </>}
      </main>
      <button className="btn3d btn-green sticky bottom-3 w-full" disabled={!canNext} onClick={next}>{step === 4 ? "Começar" : "Continuar"}</button>
    </div>
  );
}
