import { Link } from "@tanstack/react-router";
import type { Progress } from "@/lib/progress";
import { useStudent } from "@/lib/student";
import { Avatar } from "./Avatar";
import { CastImage } from "./CastImage";

export function TopBar({ p }: { p: Progress }) {
  const [s] = useStudent();
  return (
    <header className="sticky top-0 z-20 border-b-2 border-fx-gray bg-background">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-2 px-4 py-2">
        <Link to="/" className="flex items-center gap-1.5 text-xl font-extrabold text-fx-orange">
          <CastImage id="fenix-selo" size={36} alt="" />FenixInglês
        </Link>
        <div className="flex items-center gap-3 text-base font-extrabold">
          <span className="text-fx-orange" title="Sequência de dias">🔥 {p.streak}</span>
          <span className="text-fx-blue" title="XP total">💎 {p.xp}</span>
          <span className="text-fx-red" title="Vidas">❤️ {p.hearts}</span>
          <Link to="/profile" aria-label="Perfil"><Avatar a={s.avatar} size={36} /></Link>
        </div>
      </div>
    </header>
  );
}

export function BottomNav({ active }: { active: "trail" | "profile" }) {
  const cls = (a: boolean) => `flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 text-xs font-extrabold ${a ? "bg-fx-blue-light text-fx-blue-dark" : "text-fx-gray-dark"}`;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-fx-gray bg-background">
      <div className="mx-auto flex max-w-lg gap-2 p-2">
        <Link to="/" className={cls(active === "trail")}><span className="text-2xl">🏠</span>Trilha</Link>
        <Link to="/avatar" className={cls(false)}><span className="text-2xl">🎨</span>Avatar</Link>
        <Link to="/profile" className={cls(active === "profile")}><span className="text-2xl">👤</span>Perfil</Link>
      </div>
    </nav>
  );
}
