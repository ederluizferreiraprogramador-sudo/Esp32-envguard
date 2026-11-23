import { createFileRoute } from "@tanstack/react-router";
import { units } from "@/data/units";
import { lessonKey, reset, update, useProgress } from "@/lib/progress";
import { TopBar, BottomNav } from "@/components/TopBar";
import { Phoenix } from "@/components/Phoenix";
import { Capi, UniFront } from "@/components/Characters";
import { Kitten } from "@/components/Kittens";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getAudioDiagnostics, speak } from "@/lib/audio";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Perfil — FenixInglês" },
      { name: "description", content: "Veja seu XP, sequência de dias e unidades concluídas no FenixInglês." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const [p] = useProgress();
  const [diag, setDiag] = useState<ReturnType<typeof getAudioDiagnostics> | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  useEffect(() => {
    const refresh = () => setDiag(getAudioDiagnostics());
    refresh();
    const engine = window.speechSynthesis;
    engine?.addEventListener("voiceschanged", refresh);
    return () => engine?.removeEventListener("voiceschanged", refresh);
  }, []);
  const unitsDone = units.filter((u) => u.lessons.length > 0 && u.lessons.every((_, i) => p.completed.includes(lessonKey(u.id, i)))).length;
  const stats = [
    { label: "XP total", value: p.xp, icon: "💎" },
    { label: "Dias seguidos", value: p.streak, icon: "🔥" },
    { label: "Lições", value: p.completed.length, icon: "⭐" },
    { label: "Unidades", value: unitsDone, icon: "👑" },
  ];
  const n = diag?.englishVoices.length ?? 0;
  return (
    <div className="min-h-screen pb-28">
      <TopBar p={p} />
      <main className="mx-auto max-w-lg px-4 py-6">
        <div className="flex items-center gap-4">
          <Phoenix size={90} />
          <div><h1 className="text-2xl font-extrabold">Seu perfil</h1><p className="text-muted-foreground">A Charlotte e a turma estão torcendo por você!</p></div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border-2 border-fx-gray p-4">
              <div className="text-2xl font-extrabold">{s.icon} {s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
        <section className="mt-6 rounded-2xl border-2 border-fx-gray p-4">
          <h2 className="font-extrabold">Turma do FenixInglês</h2>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center text-xs">
            <div><Kitten name="charlotte" size={72} className="mx-auto" />Charlotte<br /><span className="text-muted-foreground">professora</span></div>
            <div><Kitten name="mingau" size={72} className="mx-auto" />Mingau<br /><span className="text-muted-foreground">colega de diálogo</span></div>
            <div><Kitten name="luna" size={72} className="mx-auto" />Luna<br /><span className="text-muted-foreground">tradutora</span></div>
            <div><Capi size={72} className="mx-auto" />Capi<br /><span className="text-muted-foreground">comemora acertos</span></div>
            <div><UniFront size={72} className="mx-auto" />Uni<br /><span className="text-muted-foreground">rebola nos erros</span></div>
            <div><Phoenix size={72} className="mx-auto" />Fênix<br /><span className="text-muted-foreground">mascote</span></div>
          </div>
        </section>
        <label className="mt-6 flex items-center justify-between rounded-2xl border-2 border-fx-gray p-4">
          <span>🔊 Efeitos sonoros</span>
          <input id="sound" type="checkbox" className="h-6 w-6 accent-[var(--fx-green)]" checked={p.sound} onChange={(e) => update((x) => ({ ...x, sound: e.target.checked }))} />
        </label>
        <Button className="btn3d btn-blue mt-5 h-auto w-full text-base" onClick={() => {
          speak("Hello! Welcome to FenixInglês.");
          setTimeout(() => setDiag(getAudioDiagnostics()), 2600);
        }}>🔊 Testar áudio</Button>
        <div role="status" className="mt-3 rounded-2xl border-2 border-fx-gray p-3 text-sm">
          <p className="font-extrabold">Diagnóstico do áudio</p>
          {diag && (
            <ul className="mt-1 space-y-0.5 text-muted-foreground">
              <li>Navegador: {diag.browser}{diag.supported ? "" : " (sem suporte a voz)"}</li>
              <li>{n} {n === 1 ? "voz em inglês encontrada" : "vozes em inglês encontradas"}{n > 0 && `: ${diag.englishVoices.slice(0, 4).join(", ")}${n > 4 ? "…" : ""}`}</li>
              <li>{diag.lastOk ? "✅ Último áudio tocou" : diag.lastError ? `⚠️ Último erro: ${diag.lastError}` : "Toque em Testar áudio"}</li>
            </ul>
          )}
        </div>
        {confirmReset ? (
          <div className="mt-8 flex gap-3">
            <button className="btn3d btn-outline flex-1" onClick={() => setConfirmReset(false)}>Cancelar</button>
            <button className="btn3d btn-red flex-1" onClick={() => { reset(); setConfirmReset(false); }}>Sim, zerar</button>
          </div>
        ) : (
          <button className="btn3d btn-red mt-8 w-full" onClick={() => setConfirmReset(true)}>Zerar progresso</button>
        )}
      </main>
      <BottomNav active="profile" />
    </div>
  );
}
