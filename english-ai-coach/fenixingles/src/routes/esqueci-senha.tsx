import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, Field, Msg } from "@/components/AuthShell";
import { sendReset } from "@/lib/accounts";

export const Route = createFileRoute("/esqueci-senha")({
  head: () => ({ meta: [{ title: "Recuperar acesso — FenixInglês" }, { name: "description", content: "Receba um link para criar uma nova senha." }] }),
  component: Esqueci,
});

function Esqueci() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    await sendReset(email.trim()); // mesma resposta exista ou não a conta (não revela quem tem cadastro)
    setBusy(false); setSent(true);
  };
  return (
    <AuthShell title="Recuperar acesso" subtitle="Vamos enviar um link para você criar uma nova senha.">
      {sent ? <>
        <Msg ok>Se existir uma conta com <b>{email}</b>, o link para criar uma nova senha chega em alguns minutos.</Msg>
        <p className="text-sm text-muted-foreground">Confira também o spam. O link vale por pouco tempo.</p>
      </> : (
        <form onSubmit={submit} noValidate>
          <Field id="email" label="E-mail da conta" type="email" autoComplete="email" inputMode="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <button type="submit" disabled={busy || !email} className="btn3d btn-green w-full">{busy ? "Enviando…" : "Enviar link"}</button>
        </form>
      )}
      <p className="mt-4 text-center text-sm font-extrabold"><Link to="/entrar" className="text-fx-blue-dark underline">Voltar para entrar</Link></p>
    </AuthShell>
  );
}
