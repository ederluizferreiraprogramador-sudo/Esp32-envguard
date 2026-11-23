// Gera o PDF (em português) com os erros da unidade. Usa jsPDF no navegador.
import type { UnitReport } from "./mistakes";

// As fontes padrão do PDF não têm emoji nem alguns símbolos: troca por texto simples.
const clean = (s: string) =>
  s.replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/[→›]/g, "->").replace(/…/g, "...").replace(/[—–]/g, "-")
   .replace(/[^\u0000-ÿ]/g, "");

export async function downloadUnitPdf(report: UnitReport, unitTitle: string) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210, M = 16, maxW = W - M * 2;
  let y = 20;

  const ensure = (h: number) => { if (y + h > 280) { doc.addPage(); y = 20; } };
  const text = (s: string, size = 11, style: "normal" | "bold" = "normal", color: [number, number, number] = [75, 75, 75]) => {
    doc.setFont("helvetica", style); doc.setFontSize(size); doc.setTextColor(...color);
    const lines = doc.splitTextToSize(clean(s), maxW) as string[];
    ensure(lines.length * size * 0.45 + 2);
    doc.text(lines, M, y);
    y += lines.length * size * 0.45 + 2;
  };

  // Cabeçalho
  doc.setFillColor(88, 204, 2); doc.rect(0, 0, W, 12, "F");
  text("FenixInglês - Relatório de erros", 18, "bold", [88, 167, 0]);
  text(`Unidade ${report.unit}: ${unitTitle}`, 13, "bold");
  text(`Gerado em ${new Date().toLocaleDateString("pt-BR")}`, 9, "normal", [140, 140, 140]);
  y += 2;

  if (report.total === 0) {
    text("Parabéns! Você não errou nenhuma questão nesta unidade.", 12, "bold", [88, 167, 0]);
  } else {
    text(`Total de erros: ${report.total}. Abaixo estão agrupados pelo tipo de dificuldade, do mais frequente para o menos frequente.`, 11);
    y += 2;
    for (const c of report.byCategory) {
      ensure(20);
      doc.setDrawColor(229, 229, 229); doc.line(M, y, W - M, y); y += 5;
      text(`${c.title} (${c.count} ${c.count === 1 ? "erro" : "erros"})`, 13, "bold", [28, 176, 246]);
      text(`Como melhorar: ${c.tip}`, 10, "normal", [90, 90, 90]);
      y += 1;
      c.items.forEach((m, i) => {
        ensure(24);
        text(`${i + 1}. Questão: ${m.prompt}`, 10.5, "bold");
        if (m.given) text(`   Você respondeu: ${m.given}`, 10, "normal", [234, 43, 43]);
        text(`   Resposta certa: ${m.correct}`, 10, "normal", [88, 167, 0]);
        text(`   Por quê: ${m.explain}`, 10);
        y += 1.5;
      });
    }
  }
  ensure(16); y += 4;
  text("Dica final: refaça as lições desta unidade e tente acertar estas questões sem olhar as respostas.", 10, "normal", [255, 150, 0]);

  doc.save(`FenixIngles-Unidade-${report.unit}-erros.pdf`);
}
