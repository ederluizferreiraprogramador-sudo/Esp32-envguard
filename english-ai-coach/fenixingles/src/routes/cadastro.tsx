import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, Field, Msg, passwordProblem } from "@/components/AuthShell";
import { authMessage, pullProgress, signUp } from "@/lib/accounts";

export const Route = createFileRoute("/cadastro")({
  head: () => ({ meta: [{ title: "Criar conta — FenixInglês" }, { name: "description", content: "Crie sua conta com e-mail para salvar o progresso." }] }),
  component: Cadastro,
});

function Cadastro() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [adult, setAdult] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setErr("Digite um e-mail válido.");
    const pp = passwordProblem(password); if (pp) return setErr(pp);
    if (password !== confirm) return setErr("As duas senhas não são iguais.");
    if (!adult) return setErr("Um adulto responsável precisa confirmar o cadastro.");
    setBusy(true);
    const { data, error } = await signUp(email.trim(), password);
    setBusy(false);
    if (error) return setErr(authMessage(error));
    if (data.session && data.user) { await pullProgress(data.user.id); window.location.assign("/"); return; }
    setDone(true); // precisa confirmar o e-mail
  };
  if (done) return (
    <AuthShell title="Confira seu e-mail 📬">
      <Msg ok>Enviamos um link de confirmação para <b>{email}</b>. Abra o e-mail e toque no link para ativar a conta.</Msg>
      <p className="text-sm text-muted-foreground">Não chegou? Veja a caixa de spam ou promoções.</p>
      <Link to="/entrar" className="btn3d btn-green mt-4 block w-full text-center">Já confirmei, entrar</Link>
    </AuthShell>
  );
  return (
    <AuthShell title="Criar conta" subtitle="Cada conta tem o seu próprio progresso.">
      <form onSubmit={submit} noValidate>
        {err && <Msg>{err}</Msg>}
        <Field id="email" label="E-mail do responsável" type="email" autoComplete="email" inputMode="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Field id="senha" label="Senha (8+ caracteres, letras e números)" type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <Field id="senha2" label="Repita a senha" type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        <label className="mb-4 flex items-start gap-2 text-sm">
          <input type="checkbox" checked={adult} onChange={(e) => setAdult(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0" />
          <span>Sou maior de 18 anos ou responsável pela criança que vai usar o app. Usamos o e-mail só para login e recuperar o acesso.</span>
        </label>
        <button type="submit" disabled={busy} className="btn3d btn-green w-full">{busy ? "Criando…" : "Criar conta"}</button>
      </form>
      <p className="mt-4 text-center text-sm font-extrabold">Já tem conta? <Link to="/entrar" className="text-fx-blue-dark underline">Entrar</Link></p>
    </AuthShell>
  );
}
