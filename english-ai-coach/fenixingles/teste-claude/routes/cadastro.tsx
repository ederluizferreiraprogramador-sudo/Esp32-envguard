import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, Field, Msg, passwordProblem } from "@/components/AuthShell";
import { authMessage, register, resendOtp, signIn, verifyOtp } from "@/lib/accounts";
import { Offline } from "./entrar";

export const Route = createFileRoute("/cadastro")({
  head: () => ({ meta: [{ title: "Criar conta — FenixInglês" }, { name: "description", content: "Crie sua conta com e-mail para salvar o progresso." }] }),
  component: Cadastro,
});

function Cadastro() {
  const [step, setStep] = useState<"form" | "code">("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [adult, setAdult] = useState(false);
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setErr("Digite um e-mail válido.");
    const pp = passwordProblem(password); if (pp) return setErr(pp);
    if (password !== confirm) return setErr("As duas senhas não são iguais.");
    if (!adult) return setErr("Um adulto responsável precisa confirmar o cadastro.");
    setBusy(true);
    try { await register(email.trim(), password); setStep("code"); }
    catch (x) { setErr(authMessage(x)); }
    finally { setBusy(false); }
  };
  const confirmCode = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(""); setBusy(true);
    try { await verifyOtp(email.trim(), code.trim()); await signIn(email.trim(), password); window.location.reload(); }
    catch (x) { setErr(authMessage(x)); setBusy(false); }
  };

  if (step === "code") return (
    <AuthShell title="Confira seu e-mail 📬" subtitle={`Enviamos um código para ${email}.`}>
      <form onSubmit={confirmCode} noValidate>
        {err === "offline" ? <Offline /> : err && <Msg>{err}</Msg>}
        {info && <Msg ok>{info}</Msg>}
        <Field id="codigo" label="Código de confirmação" inputMode="numeric" autoComplete="one-time-code" maxLength={8} value={code} onChange={(e) => setCode(e.target.value.replace(/\s/g, ""))} />
        <button type="submit" disabled={busy || code.length < 4} className="btn3d btn-green w-full">{busy ? "Confirmando…" : "Confirmar e entrar"}</button>
      </form>
      <button type="button" className="mt-3 w-full text-sm font-extrabold text-fx-blue-dark underline"
        onClick={async () => { setErr(""); try { await resendOtp(email.trim()); setInfo("Enviamos um novo código."); } catch (x) { setErr(authMessage(x)); } }}>Reenviar código</button>
      <p className="mt-2 text-center text-xs text-muted-foreground">Não chegou? Veja a caixa de spam ou promoções.</p>
    </AuthShell>
  );
  return (
    <AuthShell title="Criar conta" subtitle="Cada conta tem o seu próprio progresso.">
      <form onSubmit={submit} noValidate>
        {err === "offline" ? <Offline /> : err && <Msg>{err}</Msg>}
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
