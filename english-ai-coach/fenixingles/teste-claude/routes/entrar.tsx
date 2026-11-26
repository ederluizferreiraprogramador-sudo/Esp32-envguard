import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, Field, Msg } from "@/components/AuthShell";
import { authMessage, BASE44_SITE, continueAsGuest, signIn } from "@/lib/accounts";

export const Route = createFileRoute("/entrar")({
  head: () => ({ meta: [{ title: "Entrar — FenixInglês" }, { name: "description", content: "Entre com seu e-mail para continuar de onde parou." }] }),
  component: Entrar,
});

export function Offline() {
  return (
    <Msg>
      Não consegui falar com o servidor de login a partir deste link. Abra o app em{" "}
      <a href={BASE44_SITE} target="_blank" rel="noopener noreferrer" className="underline">fenix-ingles.base44.app</a> ou{" "}
      <button type="button" className="underline" onClick={continueAsGuest}>continue sem conta, só neste aparelho</button>.
    </Msg>
  );
}

function Entrar() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(""); setBusy(true);
    try { await signIn(email.trim(), password); window.location.reload(); }
    catch (x) { setErr(authMessage(x)); setBusy(false); }
  };
  return (
    <AuthShell title="Entrar" subtitle="Use a mesma conta do app FenixInglês. Seu progresso fica salvo nela.">
      <form onSubmit={submit} noValidate>
        {err === "offline" ? <Offline /> : err && <Msg>{err}</Msg>}
        <Field id="email" label="E-mail" type="email" autoComplete="email" inputMode="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Field id="senha" label="Senha" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" disabled={busy || !email || !password} className="btn3d btn-green w-full">{busy ? "Entrando…" : "Entrar"}</button>
      </form>
      <div className="mt-4 flex flex-col items-center gap-2 text-sm font-extrabold">
        <Link to="/esqueci-senha" className="text-fx-blue-dark underline">Esqueci minha senha</Link>
        <span className="text-muted-foreground">Ainda não tem conta?</span>
        <Link to="/cadastro" className="btn3d btn-outline w-full text-center">Criar conta grátis</Link>
      </div>
    </AuthShell>
  );
}
