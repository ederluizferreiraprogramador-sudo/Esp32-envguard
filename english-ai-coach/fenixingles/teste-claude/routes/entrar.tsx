import { createFileRoute } from "@tanstack/react-router";
import { AuthShell } from "@/components/AuthShell";
import { BASE44_SITE, continueAsGuest } from "@/lib/accounts";

export const Route = createFileRoute("/entrar")({
  head: () => ({ meta: [{ title: "Entrar — FenixInglês" }, { name: "description", content: "Entre para salvar o seu progresso." }] }),
  component: Entrar,
});

function Entrar() {
  return (
    <AuthShell title="Entrar" subtitle="Neste link, a sua conta é a sua conta Claude.">
      <p className="text-sm">Para salvar o seu progresso e continuar em qualquer aparelho, abra este link <b>entrando na sua conta Claude</b>. Cada pessoa tem o seu próprio progresso, que ninguém mais vê.</p>
      <p className="mt-3 text-sm">Quer entrar com <b>e-mail e senha</b>? Use o app do FenixInglês:</p>
      <a href={BASE44_SITE} target="_blank" rel="noopener noreferrer" className="btn3d btn-green mt-2 block w-full text-center">Abrir o app com e-mail</a>
      <button type="button" onClick={continueAsGuest} className="btn3d btn-outline mt-3 w-full">Continuar sem conta (só neste aparelho)</button>
    </AuthShell>
  );
}
