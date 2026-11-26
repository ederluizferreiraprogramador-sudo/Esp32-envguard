// Fênix Imortal na lateral: vidas infinitas. Painel no desktop, aba flutuante no celular.
import { Link } from "@tanstack/react-router";
import { castSrc } from "@/lib/cast";
import { usePremium } from "@/lib/rewards";

export function PremiumSide() {
  const prem = usePremium();
  return (
    <>
      <aside aria-label="Fênix Imortal: vidas infinitas" className="imortal-panel fixed right-4 top-24 z-10 hidden w-56 flex-col items-center rounded-3xl border-3 border-fx-ink p-4 text-center text-white xl:flex">
        <img src={castSrc("fenix-imortal")} alt="" className="imortal-bird h-40 w-40 object-contain" />
        <p className="font-display text-xl leading-tight">Fênix Imortal</p>
        {prem.active ? (
          <p className="mt-1 text-sm font-extrabold">❤️ ∞ Vidas infinitas ativas</p>
        ) : (
          <>
            <p className="mt-1 text-sm text-white/90">Vidas infinitas: erre, aprenda e continue sem esperar.</p>
            <Link to="/imortal" className="isle-cta mt-3 block w-full">QUERO ∞</Link>
          </>
        )}
      </aside>
      <Link to="/imortal" aria-label={prem.active ? "Fênix Imortal ativa: vidas infinitas" : "Fênix Imortal: conhecer as vidas infinitas"}
        className="imortal-tab fixed right-0 top-[62%] z-20 flex -translate-y-1/2 flex-col items-center rounded-l-2xl border-3 border-r-0 border-fx-ink px-0.5 py-1.5 xl:hidden">
        <img src={castSrc("fenix-imortal")} alt="" className="imortal-bird h-9 w-9 object-contain" />
        <span className="text-[10px] font-extrabold text-fx-ink">{prem.active ? "∞ON" : "❤️∞"}</span>
      </Link>
    </>
  );
}
