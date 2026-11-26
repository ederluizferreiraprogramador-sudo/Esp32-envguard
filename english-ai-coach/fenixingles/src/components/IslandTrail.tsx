// Trilha "Ilhas da Fênix": cada unidade é uma ilha flutuante no céu, ligadas pelo rastro de voo da Fênix.
// Estilo próprio do FenixInglês (ilhas geradas no Figma); caminho em SVG calculado a partir dos dados.
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { units, type Unit } from "@/data/units";
import { lessonKey, type Progress } from "@/lib/progress";
import { assetBase } from "@/lib/cast";
import { CastImage } from "./CastImage";

type State = "done" | "progress" | "current" | "locked" | "soon";
const ROW = 250;          // altura de cada ilha na trilha (px)
const SIDES = [30, 70];   // posição horizontal (%) alternando esquerda/direita
const JITTER = [0, 4, -3, 2, -4, 3];

const islandSrc = (id: number) => `${assetBase()}ilha-${String(id).padStart(2, "0")}.webp`;
const STATE_LABEL: Record<State, string> = { done: "✓ Concluída", progress: "⏳ Em andamento", current: "★ Comece aqui", locked: "🔒 Bloqueada", soon: "Em breve" };

function unitState(u: Unit, p: Progress, currentKey: string | undefined): { state: State; done: number; total: number } {
  const total = u.lessons.length;
  if (!total) return { state: "soon", done: 0, total: 3 };
  const done = u.lessons.filter((_, i) => p.completed.includes(lessonKey(u.id, i))).length;
  if (done === total) return { state: "done", done, total };
  const hasCurrent = u.lessons.some((_, i) => lessonKey(u.id, i) === currentKey);
  if (hasCurrent) return { state: done > 0 ? "progress" : "current", done, total };
  return { state: done > 0 ? "progress" : "locked", done, total };
}

function Ring({ done, total, state }: { done: number; total: number; state: State }) {
  const c = 2 * Math.PI * 17, f = total ? done / total : 0;
  return (
    <span className={`isle-ring isle-ring-${state}`} aria-hidden>
      <svg viewBox="0 0 44 44" className="h-full w-full -rotate-90">
        <circle cx="22" cy="22" r="17" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="5" />
        <circle cx="22" cy="22" r="17" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeDasharray={`${f * c} ${c}`} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-extrabold">{state === "locked" ? "🔒" : state === "done" ? "👑" : `${done}/${total}`}</span>
    </span>
  );
}

export function IslandTrail({ p }: { p: Progress }) {
  const flat = units.flatMap((u) => u.lessons.map((_, i) => lessonKey(u.id, i)));
  const currentKey = flat.find((k) => !p.completed.includes(k));
  const info = units.map((u) => ({ u, ...unitState(u, p, currentKey) }));
  const curIdx = Math.max(0, info.findIndex((x) => x.state === "current" || x.state === "progress" && x.u.lessons.some((_, i) => lessonKey(x.u.id, i) === currentKey)));
  const pts = info.map((_, i) => ({ x: (SIDES[i % 2] ?? 50) + (JITTER[i % JITTER.length] ?? 0), y: i * ROW + 120 }));
  const H = units.length * ROW + 60;
  const seg = (a: { x: number; y: number }, b: { x: number; y: number }) => ` C ${a.x} ${a.y + ROW / 2} ${b.x} ${b.y - ROW / 2} ${b.x} ${b.y}`;
  const full = pts.reduce((d, pt, i) => (i ? d + seg(pts[i - 1]!, pt) : `M ${pt.x} ${pt.y}`), "");
  const flown = pts.slice(0, curIdx + 1).reduce((d, pt, i, arr) => (i ? d + seg(arr[i - 1]!, pt) : `M ${pt.x} ${pt.y}`), "");
  const [open, setOpen] = useState<number | null>(null);
  const curRef = useRef<HTMLButtonElement>(null);

  return (
    <section className="isle-sky relative mt-6 overflow-hidden rounded-[2rem] border-3 border-fx-ink" aria-label="Trilha das ilhas: unidades do curso" style={{ height: H }}>
      <div aria-hidden className="isle-stars absolute inset-0" />
      <svg aria-hidden className="absolute inset-0 h-full w-full" viewBox={`0 0 100 ${H}`} preserveAspectRatio="none">
        <path d={full} fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="18" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        <path d={full} fill="none" stroke="rgba(255,255,255,.75)" strokeWidth="3" strokeDasharray="2 12" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        {flown && <path d={flown} fill="none" stroke="url(#isle-gold)" strokeWidth="7" strokeLinecap="round" vectorEffect="non-scaling-stroke" className="isle-flown" />}
        <defs><linearGradient id="isle-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe27a" /><stop offset="1" stopColor="#ff9a3c" /></linearGradient></defs>
      </svg>
      {info.map(({ u, state, done, total }, i) => {
        const pt = pts[i]!, left = (SIDES[i % 2] ?? 50) < 50;
        return (
          <div key={u.id} className="absolute" style={{ top: pt.y - 105, left: `${pt.x}%`, transform: "translateX(-50%)" }}>
            {i === curIdx && <CastImage id="fenix-voando" size={78} className={`isle-phoenix pointer-events-none absolute -top-10 ${left ? "-right-12" : "-left-12"}`} />}
            <button ref={i === curIdx ? curRef : undefined} onClick={() => setOpen(i)}
              aria-label={`Unidade ${u.id}: ${u.title}. ${STATE_LABEL[state]}. ${done} de ${total} lições.`}
              className={`isle isle-${state} relative block`} style={{ animationDelay: `${(i % 4) * -0.7}s` }}>
              {(state === "current" || state === "progress") && <span aria-hidden className="isle-aura" />}
              <img src={islandSrc(u.id)} alt="" width={150} height={150} loading={i < 4 ? "eager" : "lazy"} draggable={false} className="relative h-[150px] w-[150px] select-none object-contain" />
              <span className={`absolute top-1 ${left ? "right-0" : "left-0"}`}><Ring done={done} total={total} state={state} /></span>
            </button>
            <div className={`isle-label absolute top-12 w-[150px] ${left ? "left-[150px] text-left" : "right-[150px] text-right"}`}>
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-white/75">Unidade {u.id}</p>
              <p className="font-display text-lg leading-tight text-white drop-shadow">{u.title}</p>
              <span className={`isle-chip isle-chip-${state}`}>{STATE_LABEL[state]}</span>
              {(state === "current" || state === "progress") && (
                <button onClick={() => setOpen(i)} className="isle-cta mt-2 block">{state === "current" ? "COMEÇAR" : "CONTINUAR"}</button>
              )}
            </div>
          </div>
        );
      })}
      {open !== null && info[open] && <IslandSheet item={info[open]!} p={p} currentKey={currentKey} onClose={() => setOpen(null)} />}
    </section>
  );
}

function IslandSheet({ item, p, currentKey, onClose }: { item: { u: Unit; state: State; done: number; total: number }; p: Progress; currentKey?: string; onClose: () => void }) {
  const { u, state, done, total } = item;
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  const next = u.lessons.findIndex((_, i) => lessonKey(u.id, i) === currentKey);
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-[#1b1530]/60 p-3" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="isle-sheet-title" onClick={(e) => e.stopPropagation()}
        className="isle-sheet anim-up relative w-full max-w-lg rounded-[2rem] border-3 border-fx-ink p-5 text-white" style={{ marginBottom: "max(5.5rem, env(safe-area-inset-bottom))" }}>
        <button ref={closeRef} onClick={onClose} aria-label="Fechar" className="absolute right-4 top-3 text-2xl font-extrabold text-white/80">✕</button>
        <div className="flex items-center gap-3">
          <img src={islandSrc(u.id)} alt="" className={`isle-float h-28 w-28 shrink-0 object-contain ${state === "locked" ? "grayscale" : ""}`} />
          <div className="min-w-0 pr-6">
            <p className="text-xs font-extrabold uppercase text-white/70">Unidade {u.id} · {STATE_LABEL[state]}</p>
            <h2 id="isle-sheet-title" className="font-display text-2xl leading-tight">{u.title}</h2>
            <div className="mt-2 h-2.5 w-44 overflow-hidden rounded-full bg-white/20"><div className="h-full rounded-full bg-[#ffd23f]" style={{ width: `${(done / total) * 100}%` }} /></div>
            <p className="mt-1 text-xs font-bold text-white/75">{done} de {total} lições</p>
          </div>
        </div>
        {u.lessons.length === 0 ? <p className="mt-4 rounded-2xl bg-white/10 p-3 font-bold">Esta ilha ainda está sendo construída. Em breve!</p> : (
          <ol className="mt-4 flex flex-col gap-2">
            {u.lessons.map((l, i) => {
              const k = lessonKey(u.id, i), ok = p.completed.includes(k), cur = k === currentKey;
              const row = <><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-extrabold ${ok ? "bg-[#ffd23f] text-fx-ink" : cur ? "bg-fx-teal text-fx-ink" : "bg-white/15"}`}>{ok ? "✓" : cur ? "▶" : "🔒"}</span>
                <span className="min-w-0 flex-1"><span className="block font-extrabold">{l.title}</span><span className="block text-xs text-white/70">{ok ? "Concluída · pode refazer" : cur ? "Disponível agora" : "Bloqueada"}</span></span></>;
              return <li key={i}>{ok || cur
                ? <Link to="/lesson/$unitId/$lessonId" params={{ unitId: String(u.id), lessonId: String(i) }} className="flex items-center gap-3 rounded-2xl bg-white/10 p-2.5 hover:bg-white/20">{row}</Link>
                : <div className="flex items-center gap-3 rounded-2xl p-2.5 opacity-60">{row}</div>}</li>;
            })}
          </ol>
        )}
        {next >= 0 && <Link to="/lesson/$unitId/$lessonId" params={{ unitId: String(u.id), lessonId: String(next) }} className="isle-cta mt-4 block w-full text-center">{done ? "CONTINUAR" : "COMEÇAR LIÇÃO"}</Link>}
        {state === "done" && <Link to="/unit-summary/$unitId" params={{ unitId: String(u.id) }} className="mt-3 block text-center font-extrabold underline">📄 Resumo de erros da unidade</Link>}
        {state === "locked" && <p className="mt-4 text-center text-sm font-bold text-white/80">Termine as ilhas anteriores para liberar esta. 🔥</p>}
      </div>
    </div>
  );
}
