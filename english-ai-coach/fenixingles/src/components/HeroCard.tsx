// Cartão futurista do perfil: holograma, nível e barra de energia.
import { Link } from "@tanstack/react-router";
import { HEROES, type Student } from "@/lib/student";
import { Avatar, HeroBody } from "./Avatar";

export function HeroCard({ st, xp }: { st: Student; xp: number }) {
  const hero = HEROES.find((h) => h.id === st.avatar.hero);
  const suit = HEROES.find((h) => h.wear.outfit === st.avatar.outfit);
  const color = (hero ?? suit)?.color ?? "#36e0c4";
  const level = Math.floor(xp / 100) + 1, pct = xp % 100;
  return (
    <section className="hero-card relative overflow-hidden rounded-3xl border-[3px] border-fx-ink p-4 text-white" style={{ ["--hero" as string]: color }}>
      <div aria-hidden className="hero-grid absolute inset-0" />
      <div className="relative flex items-center gap-3">
        <div className="relative flex h-[170px] w-[150px] shrink-0 items-end justify-center">
          <span aria-hidden className="hero-ring absolute bottom-1 left-1/2 h-8 w-36 -translate-x-1/2 rounded-[50%]" />
          <span aria-hidden className="hero-beam absolute bottom-4 left-1/2 h-36 w-28 -translate-x-1/2" />
          {hero ? <HeroBody hero={hero} tint={st.avatar.heroTint} size={160} className="relative" /> : <Avatar a={st.avatar} size={120} className="relative mb-6" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] uppercase tracking-[.2em] text-white/60">Agente FenixInglês</p>
          <h1 className="truncate text-2xl font-extrabold">{st.name || "Seu perfil"}</h1>
          <p className="text-sm font-bold" style={{ color }}>{hero ? `${hero.name} · ${hero.power}` : suit ? `Traje ${suit.name} · ${suit.power}` : "Escolha um herói!"}</p>
          <p className="mt-2 text-xs font-bold text-white/70">Nível {level} · {st.age && `${st.age} · `}meta {st.goal} min/dia</p>
          <div className="mt-1 h-3 overflow-hidden rounded-full bg-white/15" role="progressbar" aria-label="Energia até o próximo nível" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <div className="hero-bar h-full rounded-full" style={{ width: `${Math.max(6, pct)}%` }} />
          </div>
          <Link to="/avatar" className="mt-3 inline-block rounded-xl border-2 px-3 py-1 text-sm font-extrabold" style={{ borderColor: color, color }}>⚡ Trocar herói / avatar</Link>
        </div>
      </div>
    </section>
  );
}
