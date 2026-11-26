import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, Field, Msg } from "@/components/AuthShell";
import { authMessage, sendReset } from "@/lib/accounts";
import { Offline } from "./entrar";

export const Route = createFileRoute("/esqueci-senha")({
  head: () => ({ meta: [{ title: "Recuperar acesso — FenixInglês" }, { name: "description", content: "Receba um link para criar uma nova senha." }] }),
  component: Esqueci,
});

function Esqueci() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(""); setBusy(true);
    try { await sendReset(email.trim()); setSent(true); }
    catch (x) { const m = authMessage(x); if (m === "offline") setErr(m); else setSent(true); } // mesma resposta exista ou não a conta
    finally { setBusy(false); }
  };
  return (
    <AuthShell title="Recuperar acesso" subtitle="Vamos enviar um link para você criar uma nova senha.">
      {sent ? <>
        <Msg ok>Se existir uma conta com <b>{email}</b>, o link chega em alguns minutos.</Msg>
        <p className="text-sm text-muted-foreground">O link abre o site do FenixInglês para criar a nova senha. Depois, volte aqui e entre com ela.</p>
      </> : (
        <form onSubmit={submit} noValidate>
          {err === "offline" && <Offline />}
          <Field id="email" label="E-mail da conta" type="email" autoComplete="email" inputMode="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <button type="submit" disabled={busy || !email} className="btn3d btn-green w-full">{busy ? "Enviando…" : "Enviar link"}</button>
        </form>
      )}
      <p className="mt-4 text-center text-sm font-extrabold"><Link to="/entrar" className="text-fx-blue-dark underline">Voltar para entrar</Link></p>
    </AuthShell>
  );
}
