import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Scene } from "@/components/Scene";
import { Buddy } from "@/components/Buddy";
import { TopBar, BottomNav } from "@/components/TopBar";
import { giftAvailable, markGift, updateHome, useHome } from "@/lib/home";
import { update, useProgress } from "@/lib/progress";
import { speak } from "@/lib/audio";

export const Route = createFileRoute("/casa")({
  head: () => ({ meta: [{ title: "Casa da turma — FenixInglês" }, { name: "description", content: "Cuide do seu bichinho e ganhe presentes." }] }),
  component: Casa,
});

const LINES: Record<string, string> = {
  comer: "Yummy! Thank you! I love apples.",
  dormir: "Good night! Zzz…",
  presente: "A present for you! Here are five coins!",
  oi: "Hi! I'm happy to see you!",
};

function Casa() {
  const [p] = useProgress();
  const h = useHome();
  const [mode, setMode] = useState<"oi" | "comer" | "dormir" | "presente">("oi");
  const act = (m: typeof mode) => {
    setMode(m);
    speak(LINES[m] ?? "");
    if (m === "comer") updateHome((x) => ({ ...x, happy: x.happy + 15, fedAt: Date.now() }));
    if (m === "dormir") updateHome((x) => ({ ...x, happy: x.happy + 10, sleptAt: Date.now() }));
    if (m === "presente") {
      if (!giftAvailable(h)) { toast("O presente de hoje já foi aberto. Volte amanhã! 🎁"); return; }
      updateHome(markGift); update((x) => ({ ...x, xp: x.xp + 5 }));
      toast.success("Nova conquista! +5 🪙 de presente diário");
    }
  };
  return (
    <div className="min-h-screen pb-28">
      <TopBar p={p} />
      <main className="mx-auto max-w-lg px-4 py-4">
        <div className="card flex items-center gap-3 p-3">
          <span className="text-xl">💗</span>
          <div className="h-5 flex-1 overflow-hidden rounded-full border-2 border-fx-ink bg-fx-gray">
            <div className="h-full rounded-full bg-gradient-to-r from-fx-pink to-fx-blue transition-all duration-700" style={{ width: `${h.happy}%` }} />
          </div>
          <span className="font-display text-sm">{h.happy}%</span>
        </div>
        <div className="relative mt-3 aspect-[4/3] w-full overflow-hidden rounded-[2rem] border-4 border-fx-ink">
          <Scene name="quarto" className="absolute inset-0 h-full w-full" />
          {mode === "dormir" && <div className="absolute inset-0 bg-[#1d1450]/55" />}
          <div className="absolute inset-x-0 bottom-6 flex justify-center">
            <div className={mode === "dormir" ? "" : "anim-float"}><Buddy id={h.buddy} size={200} /></div>
          </div>
          {mode === "dormir" && <p className="absolute right-10 top-10 font-display text-4xl text-white anim-float">Zzz</p>}
          {mode === "comer" && <p className="absolute right-12 top-12 text-5xl anim-pop">🍎</p>}
          {giftAvailable(h) && mode !== "presente" && (
            <button onClick={() => act("presente")} aria-label="Abrir presente diário" className="absolute right-4 top-4 text-6xl anim-bob">🎁</button>
          )}
          <p className="absolute left-3 top-3 rounded-2xl bg-white/90 px-3 py-1 font-display text-sm text-fx-ink">{LINES[mode]}</p>
        </div>
        <div className="mt-4 grid grid-cols-5 gap-2 rounded-2xl border-3 border-fx-ink bg-[#a77bff] p-2">
          {[
            { k: "oi", icon: "👋", label: "Oi" },
            { k: "comer", icon: "🍎", label: "Comer" },
            { k: "dormir", icon: "😴", label: "Dormir" },
            { k: "presente", icon: "🎁", label: "Presente" },
          ].map((b) => (
            <button key={b.k} onClick={() => act(b.k as typeof mode)}
              className={`flex flex-col items-center rounded-xl py-2 text-xs font-extrabold text-fx-ink ${mode === b.k ? "bg-fx-teal" : "bg-white/40"}`}>
              <span className="text-2xl">{b.icon}</span>{b.label}
            </button>
          ))}
          <Link to="/conversa" className="flex flex-col items-center rounded-xl bg-white/40 py-2 text-xs font-extrabold text-fx-ink"><span className="text-2xl">💬</span>Falar</Link>
        </div>
        <Link to="/turma" className="btn3d btn-outline mt-4 w-full">Trocar o bichinho da casa</Link>
      </main>
      <BottomNav active="casa" />
    </div>
  );
}
