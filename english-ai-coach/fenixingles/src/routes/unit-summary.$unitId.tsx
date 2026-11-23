import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { units } from "@/data/units";
import { unitReport, type UnitReport } from "@/lib/mistakes";
import { downloadUnitPdf } from "@/lib/mistakesPdf";
import { Phoenix } from "@/components/Phoenix";
import { speak } from "@/lib/audio";

export const Route = createFileRoute("/unit-summary/$unitId")({
  head: () => ({
    meta: [
      { title: "Resumo da unidade — FenixInglês" },
      { name: "description", content: "Veja onde você errou na unidade e baixe o relatório em PDF." },
    ],
  }),
  component: UnitSummary,
});

function UnitSummary() {
  const { unitId } = Route.useParams();
  const unit = units.find((u) => u.id === Number(unitId));
  const [report, setReport] = useState<UnitReport | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { setReport(unitReport(Number(unitId))); }, [unitId]);

  if (!unit) return <div className="p-6 text-center">Unidade não encontrada. <Link to="/" className="text-fx-blue">Voltar</Link></div>;
  if (!report) return null;

  const pdf = async () => {
    setBusy(true);
    try { await downloadUnitPdf(report, unit.title); } finally { setBusy(false); }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col gap-5 p-5 pb-10">
      <div className="flex items-center gap-3">
        <Link to="/" aria-label="Voltar" className="text-3xl font-extrabold text-fx-gray-dark">✕</Link>
        <h1 className="text-2xl font-extrabold">Resumo da Unidade {unit.id}</h1>
      </div>
      <div className="flex items-center gap-4 rounded-2xl border-2 border-fx-gray p-4">
        <Phoenix size={72} className="anim-bob shrink-0" />
        <div>
          <p className="text-lg font-extrabold">{unit.title}</p>
          <p className="text-muted-foreground">
            {report.total === 0 ? "Você não errou nada nesta unidade. Incrível! 🎉"
              : `Você teve ${report.total} ${report.total === 1 ? "erro" : "erros"}. Veja onde focar:`}
          </p>
        </div>
      </div>

      {report.byCategory.map((c) => (
        <section key={c.type} className="overflow-hidden rounded-2xl border-2 border-fx-gray">
          <div className="flex items-center justify-between bg-fx-blue px-4 py-2 text-primary-foreground">
            <h2 className="font-extrabold">{c.title}</h2>
            <span className="rounded-full bg-white/25 px-2 text-sm font-extrabold">{c.count}</span>
          </div>
          <p className="border-b-2 border-fx-gray bg-fx-gray/30 px-4 py-3 text-sm">💡 {c.tip}</p>
          <ul className="divide-y-2 divide-fx-gray">
            {c.items.map((m) => (
              <li key={`${m.lesson}-${m.activity}`} className="px-4 py-3 text-sm">
                <p className="font-extrabold">{m.prompt}</p>
                {m.given && <p className="text-fx-red-dark">✗ Você: {m.given}</p>}
                <p className="flex items-center gap-2 text-fx-green-dark">✓ Certo: {m.correct}
                  {m.type !== "match" && m.type !== "build" && (
                    <button aria-label="Ouvir" className="text-base" onClick={() => speak(m.correct)}>🔊</button>
                  )}
                </p>
                <p className="mt-1 text-muted-foreground">{m.explain}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <button className="btn3d btn-blue w-full" onClick={pdf} disabled={busy}>
        {busy ? "Gerando PDF…" : "📄 Baixar PDF com explicações"}
      </button>
      <Link to="/" className="btn3d btn-green w-full text-center">Continuar</Link>
    </div>
  );
}
