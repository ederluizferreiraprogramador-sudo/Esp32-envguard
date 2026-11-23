import * as Z from "./src/data/units1to2.ts";
import * as A from "./src/data/units3to8.ts";
import * as B from "./src/data/units9to16.ts";
const U = { ...Z, ...A, ...B };
let errs = 0, n = 0;
const err = (m: string) => { errs++; console.log("ERRO:", m); };
for (const [name, lessons] of Object.entries(U)) {
  if ((lessons as any[]).length !== 3) err(`${name}: precisa de 3 lições`);
  for (const l of lessons as any[]) {
    if (l.activities.length !== 8) err(`${name}/${l.title}: ${l.activities.length} atividades`);
    for (const a of l.activities) {
      n++;
      const where = `${name}/${l.title}/${a.type}`;
      if (!a.explain) err(`${where}: sem explicação`);
      if (["fill", "choose", "listen"].includes(a.type)) {
        if (!a.options.includes(a.answer)) err(`${where}: resposta fora das opções (${a.answer})`);
        if (new Set(a.options).size !== a.options.length) err(`${where}: opções repetidas`);
      }
      if (a.type === "build") {
        const toks = a.answer.split(" ");
        for (const e of a.extra) { if (e.includes(" ")) err(`${where}: extra com espaço`); if (toks.includes(e)) err(`${where}: extra '${e}' igual a palavra da resposta`); }
        if (/[.,!?]/.test(a.answer)) err(`${where}: pontuação na resposta`);
      }
      if (a.type === "match") {
        const L = a.pairs.map((p: any) => p[0]), R = a.pairs.map((p: any) => p[1]);
        if (new Set(L).size !== L.length || new Set(R).size !== R.length) err(`${where}: pares repetidos`);
      }
      if (a.type === "write" && !a.answer.length) err(`${where}: sem resposta`);
    }
  }
}
console.log(`${n} atividades verificadas, ${errs} erro(s)`);
process.exit(errs ? 1 : 0);
