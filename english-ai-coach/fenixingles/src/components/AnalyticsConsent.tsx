// Cartão do Perfil: o responsável decide se ajuda a melhorar o app (medição anônima).
// Atrás de uma pergunta para adultos. Só aparece quando o app tem a chave de medição.
import { useMemo, useState } from "react";
import { analyticsAvailable, analyticsEnabled, setAnalytics } from "@/lib/analytics";

export function AnalyticsConsent() {
  const [on, setOn] = useState(analyticsEnabled());
  const [ask, setAsk] = useState(false);
  const [answer, setAnswer] = useState("");
  const q = useMemo(() => ({ a: 6 + Math.floor(Math.random() * 4), b: 6 + Math.floor(Math.random() * 4) }), []);
  if (!analyticsAvailable()) return null;
  const ok = Number(answer) === q.a * q.b;
  const change = (v: boolean) => { setAnalytics(v); setOn(v); setAsk(false); setAnswer(""); };
  return (
    <section className="mt-6 rounded-2xl border-2 border-fx-gray p-4" aria-labelledby="fx-med">
      <h2 id="fx-med" className="font-extrabold">📊 Ajudar a melhorar o app (para adultos)</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Com a sua permissão, enviamos dados <b>anônimos</b> de uso: quais lições foram concluídas e em quais tipos de questão há mais erros.
        <b> Nunca</b> enviamos nome, e-mail, idade nem o que a criança digita. Dá para mudar de ideia quando quiser.
      </p>
      <p className="mt-2 text-sm font-extrabold">{on ? "✅ Ligado" : "⛔ Desligado"}</p>
      {!ask ? (
        <button className="btn3d btn-outline mt-2 w-full" onClick={() => (on ? change(false) : setAsk(true))}>{on ? "Desligar" : "Permitir (responsável)"}</button>
      ) : (
        <div className="mt-2 rounded-2xl bg-fx-gray/30 p-3">
          <p className="text-sm font-extrabold">Chame um adulto: quanto é {q.a} × {q.b}?</p>
          <input inputMode="numeric" aria-label="Resposta do adulto" value={answer} onChange={(e) => setAnswer(e.target.value.replace(/\D/g, ""))}
            className="mt-2 w-full rounded-2xl border-2 border-fx-gray p-3 text-center text-xl outline-none focus:border-fx-blue" />
          <button disabled={!ok} className="btn3d btn-green mt-2 w-full" onClick={() => change(true)}>Eu sou o responsável e permito</button>
          <button className="mt-2 w-full text-sm font-bold underline" onClick={() => { setAsk(false); setAnswer(""); }}>Cancelar</button>
        </div>
      )}
    </section>
  );
}
