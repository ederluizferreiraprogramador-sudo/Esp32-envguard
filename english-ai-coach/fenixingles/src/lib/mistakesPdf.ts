// Gera o PDF (em português) com os erros da unidade, no visual do app: roxo, cartões e a turma.
import type { UnitReport } from "./mistakes";
import { assetBase } from "./cast";

// As fontes padrão do PDF não têm emoji nem alguns símbolos: troca por texto simples.
const clean = (s: string) =>
  s.replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/[→›]/g, "->").replace(/…/g, "...").replace(/[—–]/g, "-")
   .replace(/[^\u0000-ÿ]/g, "").trim();

export type SaveResult = "saved" | "declined" | "busy" | "error";
/** Quem entrega o arquivo ao usuário. Padrão: download do navegador. A versão de teste troca pelo "downloads" da plataforma. */
export type FileSaver = (filename: string, data: Blob) => Promise<SaveResult>;
let saver: FileSaver | null = null;
export function setFileSaver(s: FileSaver | null) { saver = s; }

type RGB = [number, number, number];
const C = {
  purple: [106, 63, 230] as RGB, violet: [155, 107, 255] as RGB, lavender: [239, 230, 255] as RGB, lilac: [222, 208, 255] as RGB,
  ink: [27, 21, 48] as RGB, text: [42, 35, 64] as RGB, muted: [111, 102, 136] as RGB, white: [255, 255, 255] as RGB,
  red: [224, 52, 75] as RGB, redBg: [255, 224, 229] as RGB, green: [31, 158, 76] as RGB, greenBg: [217, 251, 229] as RGB,
  gold: [255, 201, 60] as RGB, teal: [54, 224, 196] as RGB, cream: [251, 248, 255] as RGB,
};
/** Um bichinho da turma para cada tipo de erro. */
const MASCOT: Record<string, string> = { fill: "mingau", choose: "luna", build: "juba", listen: "charlotte", write: "lili", match: "capi" };

/** Carrega a imagem do personagem como PNG (data URL) para o PDF; null se não der. */
async function petPng(name: string, px = 160): Promise<string | null> {
  try {
    const inline = (window as unknown as { __FX_INLINE__?: Record<string, string> }).__FX_INLINE__;
    const src = inline?.[`pdf-${name}`] ?? `${assetBase()}${name}.webp`;
    const img = await new Promise<HTMLImageElement>((ok, fail) => { const i = new Image(); i.onload = () => ok(i); i.onerror = fail; i.src = src; });
    const cv = document.createElement("canvas"); cv.width = px; cv.height = px;
    const ctx = cv.getContext("2d"); if (!ctx) return null;
    const s = Math.min(px / img.naturalWidth, px / img.naturalHeight);
    ctx.drawImage(img, (px - img.naturalWidth * s) / 2, (px - img.naturalHeight * s) / 2, img.naturalWidth * s, img.naturalHeight * s);
    return cv.toDataURL("image/png");
  } catch { return null; }
}

export async function downloadUnitPdf(report: UnitReport, unitTitle: string): Promise<SaveResult> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210, H = 297, M = 14, CW = W - M * 2, BOTTOM = 280;
  const names = ["fenix-leitora", "capi", ...new Set(report.byCategory.map((c) => MASCOT[c.type] ?? "capi"))];
  const pics: Record<string, string | null> = {};
  await Promise.all(names.map(async (n) => { pics[n] = await petPng(n); }));
  const pic = (n: string, x: number, y: number, s: number) => { const d = pics[n]; if (d) { try { doc.addImage(d, "PNG", x, y, s, s, `pet-${n}`, "FAST"); } catch { /* imagem opcional */ } } };

  const font = (size: number, style: "normal" | "bold", color: RGB) => { doc.setFont("helvetica", style); doc.setFontSize(size); doc.setTextColor(...color); };
  const lines = (s: string, size: number, w: number, style: "normal" | "bold" = "normal") => { doc.setFont("helvetica", style); doc.setFontSize(size); return doc.splitTextToSize(clean(s), w) as string[]; };
  const lh = (size: number) => size * 0.42;
  const fill = (c: RGB) => doc.setFillColor(...c);
  const pageBg = () => { fill(C.cream); doc.rect(0, 0, W, H, "F"); };
  let page = 1;
  const footer = () => {
    fill(C.purple); doc.rect(0, H - 9, W, 9, "F");
    font(8.5, "bold", C.white); doc.text("FenixInglês - aprender inglês é uma aventura!", M, H - 3.5);
    doc.text(`Página ${page}`, W - M, H - 3.5, { align: "right" });
  };
  let y = 0;
  const newPage = () => { footer(); doc.addPage(); page++; pageBg(); y = 14; };
  const ensure = (h: number) => { if (y + h > BOTTOM) newPage(); };

  // ── Capa / cabeçalho ──
  pageBg();
  fill(C.purple); doc.rect(0, 0, W, 50, "F");
  fill(C.violet); doc.circle(W - 30, 8, 34, "F");
  fill(C.purple); doc.roundedRect(0, 44, W, 12, 6, 6, "F");
  pic("fenix-leitora", W - 58, 4, 46);
  font(11, "bold", C.lilac); doc.text("FENIXINGLÊS", M, 15);
  font(24, "bold", C.white); doc.text(`Resumo da Unidade ${report.unit}`, M, 27);
  font(14, "bold", C.gold); doc.text(lines(unitTitle, 14, 130, "bold")[0] ?? "", M, 36);
  font(9, "normal", C.lilac); doc.text(`Gerado em ${new Date().toLocaleDateString("pt-BR")}`, M, 43);
  y = 64;

  // Cartão de resumo
  const intro = report.total === 0
    ? "Parabéns! Você não errou nenhuma questão nesta unidade. Continue assim!"
    : `Você teve ${report.total} ${report.total === 1 ? "erro" : "erros"}. Eles estão agrupados pelo tipo de dificuldade, do mais frequente para o menos frequente. Leia a dica de cada grupo e ouça as respostas certas no app.`;
  const il = lines(intro, 11, CW - 44);
  const ih = Math.max(32, il.length * lh(11) + 16);
  fill(C.white); doc.setDrawColor(...C.lilac); doc.setLineWidth(0.8); doc.roundedRect(M, y, CW, ih, 6, 6, "FD");
  pic("capi", M + 4, y + (ih - 30) / 2, 30);
  font(13, "bold", C.text); doc.text(report.total === 0 ? "Uau, nenhum erro!" : "Veja onde focar:", M + 38, y + 10);
  font(11, "normal", C.muted); doc.text(il, M + 38, y + 17);
  y += ih + 8;

  // ── Grupos de erros ──
  for (const c of report.byCategory) {
    const mascot = MASCOT[c.type] ?? "capi";
    const tl = lines(c.tip, 10, CW - 40);
    const catStart = y, catPage = page;
    const headH = 13, tipH = Math.max(26, tl.length * lh(10) + 12);
    ensure(headH + tipH + 22);
    // barra roxa com título e contador
    fill(C.violet); doc.roundedRect(M, y, CW, headH + 6, 6, 6, "F");
    font(13, "bold", C.white); doc.text(clean(c.title), M + 6, y + 8.5);
    fill(C.lilac); doc.roundedRect(W - M - 18, y + 3, 13, 7.5, 3.7, 3.7, "F");
    font(11, "bold", C.purple); doc.text(String(c.count), W - M - 11.5, y + 8.4, { align: "center" });
    y += headH;
    // dica com o bichinho
    fill(C.lavender); doc.rect(M, y, CW, tipH, "F");
    pic(mascot, M + 4, y + (tipH - 24) / 2, 24);
    font(10, "bold", C.purple); doc.text("Dica para melhorar", M + 32, y + 7);
    font(10, "normal", C.text); doc.text(tl, M + 32, y + 12.5);
    y += tipH;
    // questões
    c.items.forEach((m, i) => {
      const pl = lines(m.prompt, 11, CW - 16, "bold");
      const gl = m.given ? lines(`Você: ${m.given}`, 10.5, CW - 22) : [];
      const cl = lines(`Certo: ${m.correct}`, 10.5, CW - 22, "bold");
      const el = lines(m.explain, 10, CW - 16);
      const h = 7 + pl.length * lh(11) + (gl.length ? gl.length * lh(10.5) + 3 : 0) + cl.length * lh(10.5) + 3 + el.length * lh(10) + 6;
      if (y + h > BOTTOM) { newPage(); fill(C.violet); doc.roundedRect(M, y, CW, 9, 4, 4, "F"); font(10, "bold", C.white); doc.text(`${clean(c.title)} (continuação)`, M + 6, y + 6); y += 11; }
      const last = i === c.items.length - 1;
      fill(C.white); doc.rect(M, y, CW, h, "F");
      doc.setDrawColor(...C.lilac); doc.setLineWidth(0.5);
      doc.line(M, y, M, y + h); doc.line(W - M, y, W - M, y + h);
      if (!last) doc.line(M + 6, y + h, W - M - 6, y + h);
      let yy = y + 7;
      font(11, "bold", C.text); doc.text(pl, M + 8, yy); yy += pl.length * lh(11) + 1.5;
      if (gl.length) {
        fill(C.redBg); doc.roundedRect(M + 8, yy - 3.6, Math.min(CW - 16, doc.getTextWidth(gl[0] ?? "") + 14), gl.length * lh(10.5) + 1.8, 2.5, 2.5, "F");
        fill(C.red); doc.circle(M + 11.5, yy - 1.2, 1.6, "F");
        font(10.5, "normal", C.red); doc.text(gl, M + 15, yy); yy += gl.length * lh(10.5) + 3;
      }
      font(10.5, "bold", C.green);
      fill(C.greenBg); doc.roundedRect(M + 8, yy - 3.6, Math.min(CW - 16, doc.getTextWidth(cl[0] ?? "") + 14), cl.length * lh(10.5) + 1.8, 2.5, 2.5, "F");
      fill(C.green); doc.circle(M + 11.5, yy - 1.2, 1.6, "F");
      font(10.5, "bold", C.green); doc.text(cl, M + 15, yy); yy += cl.length * lh(10.5) + 3;
      font(10, "normal", C.muted); doc.text(el, M + 8, yy);
      y += h;
      if (last) {
        fill(C.white); doc.roundedRect(M, y - 6, CW, 8, 6, 6, "F");
        doc.setDrawColor(...C.lilac); doc.setLineWidth(0.8);
        const top = page === catPage ? catStart + headH : 14;
        doc.roundedRect(M, top, CW, y + 2 - top, 6, 6, "S"); y += 2;
      }
    });
    y += 6;
  }

  // ── Dica final ──
  const fl = lines("Refaça as lições desta unidade e tente acertar estas questões sem olhar as respostas. Você também pode treinar na aba Revisar do app!", 10.5, CW - 42);
  const fh = Math.max(30, fl.length * lh(10.5) + 16);
  ensure(fh);
  fill(C.purple); doc.roundedRect(M, y, CW, fh, 6, 6, "F");
  pic("capi", W - M - 32, y + (fh - 28) / 2, 28);
  font(13, "bold", C.gold); doc.text("Dica final", M + 7, y + 10);
  font(10.5, "normal", C.white); doc.text(fl, M + 7, y + 16.5);
  footer();

  const filename = `FenixIngles-Unidade-${report.unit}-erros.pdf`;
  if (saver) return saver(filename, doc.output("blob"));
  doc.save(filename);
  return "saved";
}
