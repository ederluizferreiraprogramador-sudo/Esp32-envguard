import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Avatar, HeroBody } from "@/components/Avatar";
import { useHeroSrc, type HeroTint, type TintRegion } from "@/lib/heroTint";
import { DEFAULT_AVATAR, HEROES, updateStudent, useStudent, type AvatarConfig } from "@/lib/student";

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
const SUIT_COLORS = ["#E53935", "#FF9600", "#FFC800", "#58CC02", "#13A892", "#1CB0F6", "#3949AB", "#9C7BFF", "#FF4FA3", "#2B2B3A"];
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

/** Cores para o herói 3D, com a opção de voltar à cor original. */
function TintSwatches({ colors, value, onPick }: { colors: string[]; value?: string; onPick: (c: string | undefined) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button onClick={() => onPick(undefined)} className={`tile px-3 py-2 text-sm ${!value ? "tile-selected" : ""}`}>↺ Original</button>
      {colors.map((c) => (
        <button key={c} aria-label={`Cor ${c}`} aria-pressed={value === c} onClick={() => onPick(c)}
          className={`h-11 w-11 rounded-full border-4 ${value === c ? "border-fx-blue" : "border-white"}`} style={{ background: c, boxShadow: "0 0 0 2px var(--fx-gray)" }} />
      ))}
    </div>
  );
}

function HeroThumb({ id, tint }: { id: string; tint: HeroTint }) {
  const src = useHeroSrc(id, tint);
  return <img src={src} alt="" className="h-24 w-24 object-contain" />;
}

function AvatarEditor() {
  const [s] = useStudent();
  const [draft, setDraft] = useState<AvatarConfig | null>(null);
  const [tab, setTab] = useState<Tab>("heroi");
  const [saved, setSaved] = useState(false);
  const a = draft ?? s.avatar;
  const hero = HEROES.find((h) => h.id === a.hero);
  const set = (p: Partial<AvatarConfig>) => { setDraft({ ...a, ...p }); setSaved(false); };
  const tint = (k: TintRegion) => (c: string | undefined) => set({ heroTint: { ...a.heroTint, [k]: c } });
  const opts = <T extends string>(list: [T, string][], key: keyof AvatarConfig) => (
    <div className="flex flex-wrap gap-2">{list.map(([v, l]) => <Chip key={v} on={a[key] === v} onClick={() => set({ [key]: v } as Partial<AvatarConfig>)}>{l}</Chip>)}</div>
  );
  const drawing = { ...a, hero: "nenhum" as const };

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col gap-4 p-5 pb-10">
      <div className="flex items-center gap-3">
        <Link to="/profile" aria-label="Voltar" className="text-3xl font-extrabold text-fx-gray-dark">✕</Link>
        <h1 className="text-2xl font-extrabold">Criar avatar</h1>
      </div>
      <div className="flex justify-center">{hero ? <HeroBody hero={hero} tint={a.heroTint} size={200} /> : <Avatar a={a} size={190} className="anim-pop" />}</div>
      <p className="-mt-2 text-center text-sm font-extrabold text-fx-blue-dark">{hero ? `Editando o herói ${hero.name}` : "Editando o meu desenho"}</p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-xl px-3 py-2 text-sm font-extrabold ${tab === t.id ? "bg-fx-blue text-white" : "bg-fx-gray/50 text-fx-text"}`}>{t.label}</button>
        ))}
      </div>
      <section className="flex flex-col gap-3 rounded-2xl border-2 border-fx-gray p-4">
        {tab === "heroi" && <>
          <p className="text-sm text-muted-foreground">Escolha seu personagem. Depois use as abas Pele, Olhos, Cabelo e Roupa para mudar as cores.</p>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => set({ hero: "nenhum" })} aria-pressed={!hero}
              className={`flex flex-col items-center rounded-2xl border-[3px] p-1 pb-2 text-xs font-extrabold ${!hero ? "border-fx-ink bg-fx-blue-light" : "border-fx-gray bg-white"}`}>
              <span className="flex h-24 w-24 items-center justify-center"><Avatar a={drawing} size={84} /></span>Meu desenho
              <span className="font-bold text-muted-foreground">monte do seu jeito</span>
            </button>
            {HEROES.map((h) => (
              <button key={h.id} onClick={() => set({ hero: h.id })} aria-pressed={a.hero === h.id}
                className={`flex flex-col items-center rounded-2xl border-[3px] p-1 pb-2 text-xs font-extrabold ${a.hero === h.id ? "border-fx-ink" : "border-fx-gray"}`}
                style={{ background: a.hero === h.id ? `linear-gradient(180deg, ${h.color}55, #fff)` : "#fff" }}>
                <HeroThumb id={h.id} tint={a.heroTint} />{h.name}
                <span className="font-bold text-muted-foreground">{h.power}</span>
              </button>
            ))}
          </div>
          <h3 className="mt-2 font-extrabold">👕 Vestir o traje de um herói no meu desenho</h3>
          <div className="flex flex-wrap gap-2">
            {HEROES.map((h) => (
              <Chip key={h.id} on={!hero && a.outfit === h.wear.outfit} onClick={() => set({ hero: "nenhum", ...h.wear, costume: "nenhuma" })}>
                <span className="inline-block h-3 w-3 rounded-full align-middle" style={{ background: h.color }} /> {h.name}
              </Chip>
            ))}
          </div>
        </>}
        {hero && tab === "pele" && <TintSwatches colors={SKINS} value={a.heroTint.skin} onPick={tint("skin")} />}
        {hero && tab === "olhos" && <TintSwatches colors={EYE_COLORS} value={a.heroTint.eyes} onPick={tint("eyes")} />}
        {hero && tab === "cabelo" && <TintSwatches colors={HAIR_COLORS} value={a.heroTint.hair} onPick={tint("hair")} />}
        {hero && tab === "roupa" && <><p className="text-sm text-muted-foreground">Cor do traje do {hero.name}:</p><TintSwatches colors={SUIT_COLORS} value={a.heroTint.suit} onPick={tint("suit")} /></>}
        {hero && (tab === "bigode" || tab === "fantasia" || tab === "acessorio") && <>
          <p className="text-sm text-muted-foreground">Bigode, fantasias e acessórios são do “Meu desenho”. Você pode usar o traje do {hero.name} nele!</p>
          <button className="btn3d btn-blue" onClick={() => set({ hero: "nenhum", ...hero.wear, costume: "nenhuma" })}>🎨 Usar meu desenho com o traje do {hero.name}</button>
        </>}
        {!hero && <>
          {tab === "pele" && <Swatches colors={SKINS} value={a.skin} onPick={(skin) => set({ skin })} />}
          {tab === "olhos" && <>{opts([["zoiudo", "Zoiudos"], ["feliz", "Felizes"], ["estrela", "Estrelas"], ["piscando", "Piscadinha"]], "eyes")}<Swatches colors={EYE_COLORS} value={a.eyeColor} onPick={(eyeColor) => set({ eyeColor })} /></>}
          {tab === "cabelo" && <>{opts([["curto", "Curto"], ["longo", "Longo"], ["cacheado", "Cacheado"], ["rabo", "Rabo de cavalo"], ["moicano", "Moicano"], ["careca", "Careca"]], "hair")}<Swatches colors={HAIR_COLORS} value={a.hairColor} onPick={(hairColor) => set({ hairColor })} /></>}
          {tab === "bigode" && opts([["nenhum", "Sem bigode"], ["classico", "Clássico"], ["enrolado", "Enrolado"], ["fino", "Fininho"]], "mustache")}
          {tab === "roupa" && <>{opts([["camiseta", "Camiseta"], ["moletom", "Moletom"], ["vestido", "Vestido"], ["jaqueta", "Jaqueta"]], "outfit")}<Swatches colors={OUTFIT_COLORS} value={a.outfitColor} onPick={(outfitColor) => set({ outfitColor, ...(a.outfit.startsWith("traje-") ? { outfit: "camiseta" as const } : {}) })} />
            <h3 className="font-extrabold">🦸 Trajes de herói</h3>
            {opts([["traje-nova", "Nova Tech"], ["traje-tita", "Titã"], ["traje-raio", "Raio (capa)"], ["traje-fenix", "Fênix (asas)"], ["traje-astra", "Astra"], ["traje-onda", "Onda"]], "outfit")}</>}
          {tab === "fantasia" && opts([["nenhuma", "Sem fantasia"], ["dino", "🦖 Dino"], ["gatinho", "🐱 Gatinho"], ["unicornio", "🦄 Unicórnio"], ["fenix", "🔥 Fênix"]], "costume")}
          {tab === "acessorio" && opts([["nenhum", "Nenhum"], ["oculos", "Óculos"], ["bone", "Boné"], ["laco", "Laço"], ["fones", "Fones"], ["visor", "Visor (Nova)"], ["goggles", "Óculos de voo (Raio)"], ["capacete", "Capacete (Astra)"], ["mascara", "Máscara (Onda)"]], "accessory")}
        </>}
      </section>
      <div className="flex gap-3">
        <button className="btn3d btn-outline flex-1" onClick={() => { setDraft(DEFAULT_AVATAR); setSaved(false); }}>Recomeçar</button>
        <button className="btn3d btn-green flex-1" onClick={() => { updateStudent((x) => ({ ...x, avatar: a })); setSaved(true); }}>Salvar</button>
      </div>
      {saved && <p role="status" className="text-center font-extrabold text-fx-green-dark">Avatar salvo! ✨</p>}
    </div>
  );
}
