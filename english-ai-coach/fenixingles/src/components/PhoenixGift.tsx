// Presente da lição: o ovo balança, racha e a fênix nasce brilhando.
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { castSrc } from "@/lib/cast";
import { phoenix, type PhoenixId } from "@/lib/rewards";
import { speak } from "@/lib/audio";

const RARITY_LABEL: Record<string, string> = { comum: "Comum", rara: "Rara", "épica": "Épica", "lendária": "Lendária", imortal: "Imortal" };

export function PhoenixGift({ id }: { id: PhoenixId }) {
  const ph = phoenix(id)!;
  const [hatched, setHatched] = useState(false);
  useEffect(() => { const t = setTimeout(() => setHatched(true), 1600); return () => clearTimeout(t); }, []);
  useEffect(() => { if (hatched) speak("A phoenix for you!"); }, [hatched]);
  return (
    <section className="gift-card relative w-full overflow-hidden rounded-3xl border-3 border-fx-ink p-4 text-white" style={{ ["--ph" as string]: ph.color }} aria-live="polite">
      <p className="text-xs font-extrabold uppercase tracking-widest text-white/80">🎁 Presente da lição</p>
      <div className="relative mx-auto mt-1 flex h-48 w-48 items-center justify-center">
        <span aria-hidden className={`gift-rays absolute inset-0 rounded-full ${hatched ? "gift-rays-on" : ""}`} />
        {!hatched
          ? <img src={castSrc("ovo-fenix")} alt="Ovo de fênix" className="gift-egg relative h-40 w-40 object-contain" />
          : <img src={castSrc(`fenix-${id}` as "fenix-fogo")} alt={ph.name} className="gift-bird relative h-48 w-48 object-contain" />}
      </div>
      {hatched ? (
        <div className="anim-pop">
          <p className="font-display text-2xl">Você ganhou a {ph.name}!</p>
          <p className="mt-1"><span className="rounded-full px-2 py-0.5 text-xs font-extrabold text-fx-ink" style={{ background: ph.color }}>{RARITY_LABEL[ph.rarity]}</span> <span className="text-sm text-white/85">{ph.desc}</span></p>
          <Link to="/profile" className="mt-2 inline-block text-sm font-extrabold underline">🪺 Ver meu ninho</Link>
        </div>
      ) : <p className="font-extrabold">Um ovo de fênix está chocando…</p>}
    </section>
  );
}
