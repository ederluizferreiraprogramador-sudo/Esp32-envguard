import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { castSrc } from "@/lib/cast";
import { DEFAULT_AVATAR, type AvatarConfig } from "@/lib/student";
import { checkPin, createAccount, createTestUsers, deleteAccount, switchTo, useAccounts, userData, type Account } from "@/lib/accounts";

export const Route = createFileRoute("/entrar")({
  head: () => ({ meta: [{ title: "Entrar — FenixInglês" }, { name: "description", content: "Escolha quem vai estudar ou crie um novo aluno." }] }),
  component: Entrar,
});

type Mode = { kind: "list" } | { kind: "pin"; user: Account } | { kind: "new" };

function PinPad({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="mx-auto grid w-64 grid-cols-3 gap-2">
      {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map((k, i) => k === "" ? <span key={i} /> : (
        <button key={i} type="button" aria-label={k === "⌫" ? "Apagar" : k} onClick={() => onChange(k === "⌫" ? value.slice(0, -1) : (value + k).slice(0, 4))}
          className="h-14 rounded-2xl bg-white/15 font-display text-2xl text-white active:scale-95">{k}</button>
      ))}
    </div>
  );
}
const Dots = ({ n }: { n: number }) => (
  <div className="my-3 flex justify-center gap-3" aria-hidden>{[0, 1, 2, 3].map((i) => <span key={i} className={`h-4 w-4 rounded-full border-2 border-white ${i < n ? "bg-white" : ""}`} />)}</div>
);

function Entrar() {
  const [s, refresh] = useAccounts();
  const [mode, setMode] = useState<Mode>({ kind: "list" });
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const [name, setName] = useState("");
  const [usePin, setUsePin] = useState(false);
  const [manage, setManage] = useState(false);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  const pick = (u: Account) => { if (manage) return; setErr(""); setPin(""); if (u.pin) setMode({ kind: "pin", user: u }); else switchTo(u.id); };
  const tryPin = async (u: Account, p: string) => {
    setPin(p);
    if (p.length < 4) return;
    if (await checkPin(u, p)) switchTo(u.id); else { setErr("Senha errada. Tente de novo."); setPin(""); }
  };

  return (
    <div className="entrar-page min-h-screen px-5 pb-10 pt-6 text-white">
      <div className="mx-auto flex max-w-lg flex-col items-center gap-3 text-center">
        <img src={castSrc("fenix-imortal")} alt="" className="imortal-bird h-28 w-28 object-contain" />
        <h1 className="font-display text-3xl">FenixInglês</h1>

        {mode.kind === "list" && <>
          <p className="text-lg font-bold">{s.users.length ? "Quem vai estudar hoje?" : "Vamos criar o primeiro aluno!"}</p>
          <ul className="mt-2 grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
            {s.users.map((u) => {
              const st = userData<{ avatar?: Partial<AvatarConfig> }>(u.id, "fenixingles-student-v1");
              const p = userData<{ completed?: string[] }>(u.id, "fenixingles-progress-v1");
              return (
                <li key={u.id} className="relative">
                  <button onClick={() => pick(u)} aria-label={`Entrar como ${u.name}${u.pin ? " (com senha)" : ""}`}
                    className="entrar-card flex w-full flex-col items-center gap-1 rounded-3xl border-3 border-fx-ink p-3 text-fx-text">
                    <Avatar a={{ ...DEFAULT_AVATAR, ...(st?.avatar ?? {}) }} size={84} />
                    <span className="mt-1 max-w-full truncate font-extrabold">{u.name}</span>
                    <span className="text-xs font-bold text-muted-foreground">{p?.completed?.length ?? 0} {(p?.completed?.length ?? 0) === 1 ? "lição" : "lições"} {u.pin ? "· 🔒" : ""}</span>
                  </button>
                  {manage && (confirmDel === u.id
                    ? <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-3xl bg-fx-ink/90 p-2">
                        <p className="text-sm font-bold">Apagar {u.name} e todo o progresso?</p>
                        <div className="flex gap-2"><button className="rounded-xl bg-fx-red px-3 py-1 font-extrabold" onClick={() => { deleteAccount(u.id); setConfirmDel(null); refresh(); }}>Apagar</button>
                          <button className="rounded-xl bg-white/20 px-3 py-1 font-extrabold" onClick={() => setConfirmDel(null)}>Cancelar</button></div>
                      </div>
                    : <button aria-label={`Apagar ${u.name}`} onClick={() => setConfirmDel(u.id)} className="absolute -right-1 -top-1 h-9 w-9 rounded-full border-2 border-fx-ink bg-fx-red text-lg">🗑</button>)}
                </li>
              );
            })}
            <li>
              <button onClick={() => { setName(""); setUsePin(false); setPin(""); setErr(""); setMode({ kind: "new" }); }}
                className="flex h-full min-h-[150px] w-full flex-col items-center justify-center gap-1 rounded-3xl border-3 border-dashed border-white/70 p-3 font-extrabold">
                <span className="text-4xl" aria-hidden>＋</span>Novo aluno
              </button>
            </li>
          </ul>
          <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm font-bold">
            {s.users.length > 0 && <button className="underline" onClick={() => { setManage(!manage); setConfirmDel(null); }}>{manage ? "Pronto" : "Gerenciar alunos"}</button>}
            {!s.users.some((u) => u.test) && <button className="underline" onClick={async () => { await createTestUsers(); refresh(); }}>🧪 Criar usuários de teste</button>}
          </div>
          <p className="mt-2 text-xs text-white/70">Os alunos ficam salvos só neste aparelho. Senha é opcional (4 números).</p>
        </>}

        {mode.kind === "pin" && <>
          <p className="text-lg font-bold">Oi, {mode.user.name.split(" ")[0]}! Digite sua senha</p>
          <Dots n={pin.length} />
          {err && <p role="alert" className="font-extrabold text-[#ffd23f]">{err}</p>}
          <PinPad value={pin} onChange={(v) => tryPin(mode.user, v)} />
          <button className="mt-3 font-bold underline" onClick={() => setMode({ kind: "list" })}>Voltar</button>
        </>}

        {mode.kind === "new" && (
          <form className="w-full" onSubmit={async (e) => { e.preventDefault(); if (!name.trim() || (usePin && pin.length < 4)) return; await createAccount(name, usePin ? pin : null); }}>
            <p className="text-lg font-bold">Novo aluno</p>
            <label htmlFor="fx-new-name" className="sr-only">Nome do aluno</label>
            <input id="fx-new-name" autoFocus value={name} onChange={(e) => setName(e.target.value)} maxLength={30} placeholder="Nome do aluno"
              className="mt-2 w-full rounded-2xl border-2 border-white/40 bg-white p-4 text-center text-xl text-fx-text outline-none focus:border-fx-yellow" />
            <label className="mt-3 flex items-center justify-center gap-2 font-bold">
              <input type="checkbox" checked={usePin} onChange={(e) => { setUsePin(e.target.checked); setPin(""); }} className="h-5 w-5" /> Proteger com senha de 4 números
            </label>
            {usePin && <><Dots n={pin.length} /><PinPad value={pin} onChange={setPin} /></>}
            <button type="submit" disabled={!name.trim() || (usePin && pin.length < 4)} className="isle-cta mt-4 block w-full disabled:opacity-50">CRIAR E COMEÇAR</button>
            <button type="button" className="mt-3 font-bold underline" onClick={() => setMode({ kind: "list" })}>Voltar</button>
          </form>
        )}
      </div>
    </div>
  );
}
