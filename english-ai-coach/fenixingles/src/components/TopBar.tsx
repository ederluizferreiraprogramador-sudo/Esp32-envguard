import { Link } from "@tanstack/react-router";
import type { Progress } from "@/lib/progress";
import { useStudent } from "@/lib/student";
import { Avatar } from "./Avatar";
import { CastImage } from "./CastImage";

export function TopBar({ p }: { p: Progress }) {
  const [s] = useStudent();
  return (
    <header className="sticky top-0 z-20 border-b-3 border-fx-ink bg-[#2a2340] text-white">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-2 px-3 py-2">
        <Link to="/" className="flex items-center gap-1.5 font-display text-xl">
          <CastImage id="fenix-selo" size={38} alt="" />FenixInglês
        </Link>
        <div className="flex items-center gap-2 text-sm font-extrabold">
          <span className="rounded-full bg-white/10 px-2 py-1" title="Sequência de dias">🔥 {p.streak}</span>
          <span className="rounded-full bg-white/10 px-2 py-1" title="Vidas">❤️ {p.hearts}</span>
          <span className="pill" title="Moedas (XP)">{p.xp} <span aria-hidden>🪙</span></span>
          <Link to="/profile" aria-label="Perfil" className="rounded-full border-2 border-fx-teal"><Avatar a={s.avatar} size={34} /></Link>
        </div>
      </div>
    </header>
  );
}

type Tab = "trail" | "casa" | "turma" | "profile" | "revisar";
export function BottomNav({ active }: { active: Tab }) {
  const items: { to: string; tab: Tab | "chat"; icon: string; label: string }[] = [
    { to: "/", tab: "trail", icon: "🗺️", label: "Trilha" },
    { to: "/revisar", tab: "revisar", icon: "🔁", label: "Revisar" },
    { to: "/conversa", tab: "chat", icon: "💬", label: "Conversar" },
    { to: "/casa", tab: "casa", icon: "🏠", label: "Casa" },
    { to: "/profile", tab: "profile", icon: "👤", label: "Perfil" },
  ];
  return (
    <nav aria-label="Navegação principal" className="fixed inset-x-0 bottom-0 z-20 p-2" style={{ paddingBottom: "max(.5rem, env(safe-area-inset-bottom))" }}>
      <div className="mx-auto flex max-w-lg gap-1 rounded-2xl border-3 border-fx-ink bg-[#a77bff] p-1.5 shadow-[0_5px_0_#1b1530]">
        {items.map((it) => (
          <Link key={it.to} to={it.to} aria-current={active === it.tab ? "page" : undefined} className={`flex flex-1 flex-col items-center rounded-xl py-1.5 text-[11px] font-extrabold text-fx-ink ${active === it.tab ? "bg-fx-teal" : ""}`}>
            <span className="text-xl" aria-hidden>{it.icon}</span>{it.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
