// "Ninho das Fênix": coleção de fênix ganhas nas lições.
import { castSrc } from "@/lib/cast";
import { PHOENIXES, useNest } from "@/lib/rewards";

export function Nest() {
  const n = useNest();
  const got = PHOENIXES.filter((p) => (n.counts[p.id] ?? 0) > 0).length;
  return (
    <section id="ninho" className="nest mt-6 rounded-2xl border-3 border-fx-ink p-4 text-white">
      <div className="flex items-center justify-between"><h2 className="font-display text-xl">🪺 Ninho das Fênix</h2><span className="pill text-sm">{got}/{PHOENIXES.length}</span></div>
      <p className="text-sm text-white/80">Cada lição concluída choca um ovo. Colecione todas!</p>
      <ul className="mt-3 grid grid-cols-4 gap-2">
        {PHOENIXES.map((p) => {
          const c = n.counts[p.id] ?? 0;
          return (
            <li key={p.id} className={`flex flex-col items-center rounded-2xl p-1 text-center ${c ? "bg-white/15" : "bg-black/20"}`}>
              <img src={castSrc(`fenix-${p.id}` as "fenix-fogo")} alt="" className={`h-16 w-16 object-contain ${c ? "" : "nest-locked"}`} />
              <span className="text-[10px] font-extrabold leading-tight">{c ? p.name.replace("Fênix ", "") : "???"}</span>
              {c > 1 && <span className="text-[10px] font-bold text-white/70">×{c}</span>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
