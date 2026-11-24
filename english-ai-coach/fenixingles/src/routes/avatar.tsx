import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { DEFAULT_AVATAR, HEROES, updateStudent, useStudent, type AvatarConfig } from "@/lib/student";
import { castSrc } from "@/lib/cast";

export const Route = createFileRoute("/avatar")({
  head: () => ({ meta: [{ title: "Criar avatar — FenixInglês" }, { name: "description", content: "Monte seu avatar: roupa, olhos, cabelo, bigode e fantasias." }] }),
  component: AvatarEditor,
});

type Tab = "heroi" | "pele" | "olhos" | "cabelo" | "bigode" | "roupa" | "fantasia" | "acessorio";
const TABS: { id: Tab; label: string }[] = [
  { id: "heroi", label: "⚡ Herói 3D" },
  { id: "pele", label: "Pele" }, { id: "olhos", label: "Olhos" }, { id: "cabelo", label: "Cabelo" }, { id: "bigode", label: "Bigode" },
  { id: "roupa", label: "Roupa" }, { id: "fantasia", label: "Fantasia" }, { id: "acessorio", label: "Acessório" },
];
const SKINS = ["#FAD7BD", "#E8B48A", "#C98B5E", "#9A6238", "#6B3F22"];
const EYE_COLORS = ["#1CB0F6", "#58CC02", "#8A5A33", "#9C7BFF", "#2B2B3A"];
const HAIR_COLORS = ["#2B2B3A", "#4A2C1A", "#A0522D", "#F2C14E", "#FF86C8", "#9C7BFF"];
const OUTFIT_COLORS = ["#58CC02", "#1CB0F6", "#FF4B4B", "#FF9600", "#CE82FF", "#FFC800"];

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return <button onClick={onClick} className={`tile text-sm ${on ? "tile-selected" : ""}`}>{children}</button>;
}
function Swatches({ colors, value, onPick }: { colors: string[]; value: string; onPick: (c: string) => void }) {
  return (
    <div className="flex flex-wrap gap-3">
      {colors.map((c) => (
        <button key={c} aria-label={`Cor ${c}`} onClick={() => onPick(c)}
          className={`h-11 w-11 rounded-full border-4 ${value === c ? "border-fx-blue" : "border-white"}`} style={{ background: c, boxShadow: "0 0 0 2px var(--fx-gray)" }} />
      ))}
    </div>
  );
}

function AvatarEditor() {
  const [s] = useStudent();
  const [draft, setDraft] = useState<AvatarConfig | null>(null);
  const [tab, setTab] = useState<Tab>("heroi");
  const [saved, setSaved] = useState(false);
  const a = draft ?? s.avatar;
  const set = (p: Partial<AvatarConfig>) => { setDraft({ ...a, ...p }); setSaved(false); };
  const opts = <T extends string>(list: [T, string][], key: keyof AvatarConfig) => (
    <div className="flex flex-wrap gap-2">{list.map(([v, l]) => <Chip key={v} on={a[key] === v} onClick={() => set({ [key]: v } as Partial<AvatarConfig>)}>{l}</Chip>)}</div>
  );

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col gap-4 p-5 pb-10">
      <div className="flex items-center gap-3">
        <Link to="/profile" aria-label="Voltar" className="text-3xl font-extrabold text-fx-gray-dark">✕</Link>
        <h1 className="text-2xl font-extrabold">Criar avatar</h1>
      </div>
      <div className="flex justify-center"><Avatar a={a} size={190} className="anim-pop" /></div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-xl px-3 py-2 text-sm font-extrabold ${tab === t.id ? "bg-fx-blue text-white" : "bg-fx-gray/50 text-fx-text"}`}>{t.label}</button>
        ))}
      </div>
      <section className="flex flex-col gap-3 rounded-2xl border-2 border-fx-gray p-4">
        {tab === "heroi" && <>
          <p className="text-sm text-muted-foreground">Escolha seu super-herói. Para voltar ao desenho, toque em “Meu desenho”.</p>
          <div className="grid grid-cols-3 gap-2">
            {HEROES.map((h) => (
              <button key={h.id} onClick={() => set({ hero: h.id })} aria-pressed={a.hero === h.id}
                className={`flex flex-col items-center rounded-2xl border-[3px] p-1 pb-2 text-xs font-extrabold ${a.hero === h.id ? "border-fx-ink" : "border-fx-gray"}`}
                style={{ background: a.hero === h.id ? `linear-gradient(180deg, ${h.color}55, #fff)` : "#fff" }}>
                <img src={castSrc(`heroi-${h.id}`)} alt="" className="h-24 w-24 object-contain" loading="lazy" />{h.name}
                <span className="font-bold text-muted-foreground">{h.power}</span>
              </button>
            ))}
          </div>
          <button className={`tile text-sm ${a.hero === "nenhum" ? "tile-selected" : ""}`} onClick={() => set({ hero: "nenhum" })}>🎨 Meu desenho</button>
        </>}
        {tab !== "heroi" && a.hero !== "nenhum" && <p className="text-sm font-bold text-fx-blue-dark">Você está usando um herói. As opções abaixo mudam o seu desenho — toque em “Meu desenho” na aba Herói para usá-lo.</p>}
        {tab === "pele" && <Swatches colors={SKINS} value={a.skin} onPick={(skin) => set({ skin })} />}
        {tab === "olhos" && <>{opts([["zoiudo", "Zoiudos"], ["feliz", "Felizes"], ["estrela", "Estrelas"], ["piscando", "Piscadinha"]], "eyes")}<Swatches colors={EYE_COLORS} value={a.eyeColor} onPick={(eyeColor) => set({ eyeColor })} /></>}
        {tab === "cabelo" && <>{opts([["curto", "Curto"], ["longo", "Longo"], ["cacheado", "Cacheado"], ["rabo", "Rabo de cavalo"], ["moicano", "Moicano"], ["careca", "Careca"]], "hair")}<Swatches colors={HAIR_COLORS} value={a.hairColor} onPick={(hairColor) => set({ hairColor })} /></>}
        {tab === "bigode" && opts([["nenhum", "Sem bigode"], ["classico", "Clássico"], ["enrolado", "Enrolado"], ["fino", "Fininho"]], "mustache")}
        {tab === "roupa" && <>{opts([["camiseta", "Camiseta"], ["moletom", "Moletom"], ["vestido", "Vestido"], ["jaqueta", "Jaqueta"]], "outfit")}<Swatches colors={OUTFIT_COLORS} value={a.outfitColor} onPick={(outfitColor) => set({ outfitColor })} /></>}
        {tab === "fantasia" && opts([["nenhuma", "Sem fantasia"], ["dino", "🦖 Dino"], ["gatinho", "🐱 Gatinho"], ["unicornio", "🦄 Unicórnio"], ["fenix", "🔥 Fênix"]], "costume")}
        {tab === "acessorio" && opts([["nenhum", "Nenhum"], ["oculos", "Óculos"], ["bone", "Boné"], ["laco", "Laço"], ["fones", "Fones"]], "accessory")}
      </section>
      <div className="flex gap-3">
        <button className="btn3d btn-outline flex-1" onClick={() => { setDraft(DEFAULT_AVATAR); setSaved(false); }}>Recomeçar</button>
        <button className="btn3d btn-green flex-1" onClick={() => { updateStudent((x) => ({ ...x, avatar: a })); setSaved(true); }}>Salvar</button>
      </div>
      {saved && <p role="status" className="text-center font-extrabold text-fx-green-dark">Avatar salvo! ✨</p>}
    </div>
  );
}
