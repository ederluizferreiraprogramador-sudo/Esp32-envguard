import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { castSrc } from "@/lib/cast";
import { setPremium, usePremium } from "@/lib/rewards";
import { Fireworks } from "@/components/Fireworks";

export const Route = createFileRoute("/imortal")({
  head: () => ({ meta: [{ title: "Fênix Imortal — FenixInglês" }, { name: "description", content: "Vidas infinitas com a Fênix Imortal." }] }),
  component: Imortal,
});

const PERKS = [
  { icon: "❤️", t: "Vidas infinitas", d: "Errou? Tudo bem. Continue a lição sem esperar." },
  { icon: "🔥", t: "Fênix Imortal no ninho", d: "A fênix mais rara da coleção, só para quem é Imortal." },
  { icon: "🪺", t: "Mais ovos de fênix", d: "Presentes especiais nas lições." },
  { icon: "🛡️", t: "Sem anúncios, sempre", d: "Um app seguro para crianças." },
];

function Imortal() {
  const prem = usePremium();
  const [plan, setPlan] = useState<"mensal" | "anual">("anual");
  const [gate, setGate] = useState(false);
  const [answer, setAnswer] = useState("");
  const [party, setParty] = useState(false);
  // Porta para adultos (política Famílias do Google Play): compras só com um responsável.
  const q = useMemo(() => { const a = 6 + Math.floor(Math.random() * 4), b = 6 + Math.floor(Math.random() * 4); return { a, b }; }, []);
  const ok = Number(answer) === q.a * q.b;

  return (
    <div className="imortal-page min-h-screen pb-10 text-white">
      {party && <Fireworks bursts={9} />}
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-5 pt-4 text-center">
        <div className="flex w-full items-center"><Link to="/" aria-label="Voltar" className="text-3xl font-extrabold text-white/80">✕</Link></div>
        <div className="relative">
          <span aria-hidden className="imortal-halo absolute inset-0 rounded-full" />
          <img src={castSrc("fenix-imortal")} alt="Fênix Imortal" className="imortal-bird relative h-64 w-64 object-contain" />
        </div>
        <h1 className="font-display text-4xl">Fênix Imortal</h1>
        <p className="text-lg text-white/90">A fênix sempre renasce. Com ela, suas vidas também: <b>vidas infinitas ❤️ ∞</b>.</p>

        {prem.active ? (
          <section className="w-full rounded-3xl bg-white/15 p-4">
            <p className="text-xl font-extrabold">✨ Você é Imortal!</p>
            <p className="text-sm text-white/85">Vidas infinitas ativas desde {new Date(prem.since ?? Date.now()).toLocaleDateString("pt-BR")}.</p>
            <Link to="/" className="isle-cta mt-3 block w-full">ESTUDAR AGORA</Link>
            <button className="mt-3 text-sm font-bold text-white/70 underline" onClick={() => setPremium(false)}>Desativar (demonstração)</button>
          </section>
        ) : (
          <>
            <ul className="grid w-full gap-2 text-left">
              {PERKS.map((p) => <li key={p.t} className="flex items-center gap-3 rounded-2xl bg-white/10 p-3"><span className="text-2xl" aria-hidden>{p.icon}</span><span><b className="block">{p.t}</b><span className="text-sm text-white/80">{p.d}</span></span></li>)}
            </ul>
            <div role="radiogroup" aria-label="Plano" className="grid w-full grid-cols-2 gap-3">
              {(["mensal", "anual"] as const).map((p) => (
                <button key={p} role="radio" aria-checked={plan === p} onClick={() => setPlan(p)}
                  className={`relative rounded-2xl border-3 p-3 text-left ${plan === p ? "border-[#ffd23f] bg-white/20" : "border-white/30 bg-white/5"}`}>
                  {p === "anual" && <span className="absolute -top-3 right-2 rounded-full bg-[#ffd23f] px-2 text-xs font-extrabold text-fx-ink">MELHOR</span>}
                  <b className="block text-lg capitalize">{p}</b><span className="text-sm text-white/80">{p === "anual" ? "12 meses, paga menos por mês" : "Cancele quando quiser"}</span>
                </button>
              ))}
            </div>
            {!gate ? (
              <button className="isle-cta w-full text-lg" onClick={() => setGate(true)}>QUERO SER IMORTAL</button>
            ) : (
              <section className="w-full rounded-3xl bg-white p-4 text-fx-text" aria-label="Pergunta para um adulto">
                <p className="font-extrabold">👨‍👩‍👧 Chame um adulto</p>
                <p className="text-sm text-muted-foreground">Compras só com a permissão de um responsável. Quanto é {q.a} × {q.b}?</p>
                <input inputMode="numeric" value={answer} onChange={(e) => setAnswer(e.target.value.replace(/\D/g, ""))} aria-label="Resposta do adulto"
                  className="mt-2 w-full rounded-2xl border-2 border-fx-gray p-3 text-center text-xl outline-none focus:border-fx-blue" />
                <button disabled={!ok} className="btn3d btn-green mt-3 w-full" onClick={() => { setPremium(true); setParty(true); }}>Ativar plano {plan}</button>
                <p className="mt-2 text-xs text-muted-foreground">Versão de teste: a ativação é uma demonstração e nada é cobrado. No app da loja, o pagamento será pela Google Play.</p>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
