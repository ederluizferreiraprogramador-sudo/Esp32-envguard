// Moldura roxa das telas de conta (entrar, cadastro, recuperar senha).
import type { ReactNode } from "react";
import { castSrc } from "@/lib/cast";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="entrar-page min-h-screen px-5 pb-10 pt-6 text-white">
      <main className="mx-auto flex max-w-sm flex-col items-center gap-2 text-center">
        <img src={castSrc("fenix-imortal")} alt="" className="imortal-bird h-28 w-28 object-contain" />
        <p className="font-display text-xl text-white/85">FenixInglês</p>
        <h1 className="font-display text-3xl">{title}</h1>
        {subtitle && <p className="text-white/85">{subtitle}</p>}
        <div className="mt-3 w-full rounded-3xl border-3 border-fx-ink bg-white p-5 text-left text-fx-text" style={{ boxShadow: "0 6px 0 #1b1530" }}>{children}</div>
      </main>
    </div>
  );
}

export function Field({ id, label, ...p }: { id: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label htmlFor={id} className="mb-3 block">
      <span className="mb-1 block text-sm font-extrabold">{label}</span>
      <input id={id} {...p} className="w-full rounded-2xl border-2 border-fx-gray bg-fx-gray/30 p-3 text-lg outline-none focus:border-fx-blue" />
    </label>
  );
}

export const Msg = ({ ok, children }: { ok?: boolean; children: ReactNode }) =>
  <p role={ok ? "status" : "alert"} className={`mb-3 rounded-2xl p-3 text-sm font-extrabold ${ok ? "bg-fx-green-light text-fx-green-dark" : "bg-fx-red-light text-fx-red-dark"}`}>{children}</p>;

/** Senha forte o suficiente: 8+ caracteres, com letra e número. */
export const passwordProblem = (p: string) => p.length < 8 ? "A senha precisa ter pelo menos 8 caracteres." : !/[a-zA-Z]/.test(p) || !/\d/.test(p) ? "Use letras e números na senha." : "";
