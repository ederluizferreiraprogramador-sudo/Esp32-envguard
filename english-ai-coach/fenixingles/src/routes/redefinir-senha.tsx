import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, Field, Msg, passwordProblem } from "@/components/AuthShell";
import { authMessage, updatePassword } from "@/lib/accounts";

// O link do e-mail abre esta página já com uma sessão de recuperação (o Supabase lê o código da URL).
export const Route = createFileRoute("/redefinir-senha")({
  head: () => ({ meta: [{ title: "Nova senha — FenixInglês" }, { name: "description", content: "Crie uma nova senha para a sua conta." }] }),
  component: Redefinir,
});

function Redefinir() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    const pp = passwordProblem(password); if (pp) return setErr(pp);
    if (password !== confirm) return setErr("As duas senhas não são iguais.");
    setBusy(true);
    const { error } = await updatePassword(password);
    setBusy(false);
    if (error) return setErr(authMessage(error) || "O link expirou. Peça um novo em \"Esqueci minha senha\".");
    setOk(true);
  };
  return (
    <AuthShell title="Nova senha">
      {ok ? <>
        <Msg ok>Senha alterada! ✅</Msg>
        <a href="/" className="btn3d btn-green block w-full text-center">Continuar estudando</a>
      </> : (
        <form onSubmit={submit} noValidate>
          {err && <Msg>{err}</Msg>}
          <Field id="senha" label="Nova senha (8+ caracteres, letras e números)" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Field id="senha2" label="Repita a nova senha" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          <button type="submit" disabled={busy} className="btn3d btn-green w-full">{busy ? "Salvando…" : "Salvar nova senha"}</button>
          <p className="mt-4 text-center text-sm font-extrabold"><Link to="/esqueci-senha" className="text-fx-blue-dark underline">Pedir um novo link</Link></p>
        </form>
      )}
    </AuthShell>
  );
}
