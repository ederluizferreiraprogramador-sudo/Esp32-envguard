import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TopBar, BottomNav } from "@/components/TopBar";
import { Buddy } from "@/components/Buddy";
import { CAST } from "@/lib/cast";
import { updateHome, useHome } from "@/lib/home";
import { useProgress } from "@/lib/progress";
import { speak } from "@/lib/audio";

export const Route = createFileRoute("/turma")({
  head: () => ({ meta: [{ title: "Turma — FenixInglês" }, { name: "description", content: "Conheça os personagens do FenixInglês." }] }),
  component: Turma,
});

const BG = ["#efe6ff", "#d9fbf4", "#ffe3f5", "#fff1d6", "#e0f1ff", "#ffe7dc"];
const ALL = [
  { id: "charlotte", name: "Charlotte", role: "professora", hi: "Hi! I'm Charlotte, your English teacher!" },
  { id: "mingau", name: "Mingau", role: "colega de diálogo", hi: "Hello! I'm Mingau. Let's talk!" },
  { id: "luna", name: "Luna", role: "gatinha curiosa", hi: "Hi, I'm Luna. I love the moon!" },
  { id: "uni", name: "Uni", role: "rebola nos erros", hi: "Hi! I'm Uni. Mistakes are okay!" },
  ...CAST.map((c) => ({ id: c.id, name: c.name, role: c.role, hi: `Hi! I'm ${c.name.replace("Fê, a Fênix", "Fê the phoenix")}. Nice to meet you!` })),
];

function Turma() {
  const [p] = useProgress();
  const home = useHome();
  const [sel, setSel] = useState<(typeof ALL)[number] | null>(null);
  return (
    <div className="min-h-screen pb-28">
      <TopBar p={p} />
      <main className="mx-auto max-w-lg px-4 py-5">
        <h1 className="font-display text-3xl">A turma</h1>
        <p className="text-muted-foreground">Toque num personagem para conhecer.</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {ALL.map((c, i) => (
            <button key={c.id} onClick={() => { setSel(c); speak(c.hi); }}
              className="card flex flex-col items-center overflow-hidden p-0 text-center transition-transform active:scale-95">
              <div className="flex w-full justify-center py-3" style={{ background: `radial-gradient(circle at 50% 60%, #fff 0 30%, ${BG[i % BG.length]} 70%)` }}>
                <Buddy id={c.id} size={120} />
              </div>
              <div className="w-full border-t-2 border-fx-gray px-2 py-2">
                <p className="font-display text-lg leading-tight">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.role}</p>
              </div>
            </button>
          ))}
        </div>
      </main>
      {sel && (
        <div role="dialog" aria-label={sel.name} className="fixed inset-0 z-30 flex items-end justify-center bg-[#1b1530]/60 p-4 sm:items-center" onClick={() => setSel(null)}>
          <div className="card anim-pop w-full max-w-sm p-5 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto flex h-60 w-60 items-center justify-center rounded-full" style={{ background: "radial-gradient(circle, #fff 0 35%, #efe6ff 75%)" }}>
              <div className="anim-float"><Buddy id={sel.id} size={220} /></div>
            </div>
            <h2 className="mt-2 font-display text-3xl">{sel.name}</h2>
            <p className="text-muted-foreground">{sel.role}</p>
            <p className="mt-2 font-display text-lg">“{sel.hi}”</p>
            <div className="mt-4 flex gap-2">
              <button className="btn3d btn-blue flex-1" onClick={() => speak(sel.hi)}>🔊 Ouvir</button>
              <button className="btn3d btn-teal flex-1" onClick={() => { updateHome((h) => ({ ...h, buddy: sel.id })); setSel(null); }}>
                {home.buddy === sel.id ? "Já mora na casa" : "🏠 Levar pra casa"}
              </button>
            </div>
          </div>
        </div>
      )}
      <BottomNav active="turma" />
    </div>
  );
}
