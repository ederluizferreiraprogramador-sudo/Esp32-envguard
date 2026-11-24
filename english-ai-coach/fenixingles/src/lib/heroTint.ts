// Recolore os heróis 3D (traje, cabelo, olhos, pele) mantendo a luz e a sombra da imagem.
// Cada herói tem uma máscara PNG: canal vermelho = região (60 traje, 120 cabelo, 180 olhos, 240 pele).
import { useEffect, useState } from "react";
import { assetBase } from "@/lib/cast";

export type TintRegion = "suit" | "hair" | "eyes" | "skin";
export type HeroTint = Partial<Record<TintRegion, string>>;
type Ref = Record<TintRegion, [number, number, number]>;
/** Cor média (h, s, l) de cada região na imagem original — calculada ao gerar as máscaras. */
const REF: Record<string, Ref> = {"nova":{"suit":[189.0,0.676,0.444],"hair":[19.8,0.474,0.163],"eyes":[181.3,0.405,0.243],"skin":[19.5,0.731,0.659]},"tita":{"suit":[228.9,0.5,0.228],"hair":[17.8,0.412,0.166],"eyes":[14.9,0.583,0.226],"skin":[16.0,0.864,0.611]},"raio":{"suit":[274.0,0.435,0.501],"hair":[19.8,0.536,0.186],"eyes":[15.4,0.395,0.194],"skin":[22.3,0.624,0.599]},"fenix":{"suit":[26.3,0.956,0.503],"hair":[16.9,0.767,0.206],"eyes":[13.0,0.781,0.204],"skin":[23.0,0.853,0.624]},"astra":{"suit":[325.3,0.459,0.573],"hair":[11.4,0.325,0.217],"eyes":[19.1,0.325,0.237],"skin":[16.3,0.584,0.666]},"onda":{"suit":[202.6,0.813,0.464],"hair":[16.8,0.358,0.208],"eyes":[193.6,0.582,0.224],"skin":[19.0,0.474,0.626]}};
const REGION: TintRegion[] = ["suit", "suit", "hair", "eyes", "skin"];

type InlineMap = Record<string, string>;
/** Na versão de teste as imagens vêm embutidas (data:) para o canvas poder lê-las. */
function assetUrl(name: string) {
  const inline = typeof window !== "undefined" ? (window as unknown as { __FX_INLINE__?: InlineMap }).__FX_INLINE__ : undefined;
  return inline?.[name] ?? `${assetBase()}${name}${name.endsWith("-mask") ? ".png" : ".webp"}`;
}
export const heroImageUrl = (id: string) => assetUrl(`heroi-${id}`);

function hexToHsl(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return rgbToHsl((n >> 16) & 255, (n >> 8) & 255, n & 255);
}
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  if (d === 0) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h *= 60; if (h < 0) h += 360;
  return [h, Math.min(1, s), l];
}
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}
const clamp = (v: number) => Math.max(0, Math.min(1, v));

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((ok, fail) => { const i = new Image(); i.onload = () => ok(i); i.onerror = fail; i.src = src; });
}
const cache = new Map<string, Promise<string>>();

export function tintKey(t: HeroTint) { return (["suit", "hair", "eyes", "skin"] as const).map((k) => t[k] ?? "").join("|"); }

async function render(id: string, tint: HeroTint): Promise<string> {
  const ref = REF[id];
  if (!ref) return heroImageUrl(id);
  const [img, mask] = await Promise.all([loadImage(heroImageUrl(id)), loadImage(assetUrl(`heroi-${id}-mask`))]);
  const w = img.naturalWidth, h = img.naturalHeight;
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
  const ctx = cv.getContext("2d", { willReadFrequently: true }); if (!ctx) return heroImageUrl(id);
  ctx.drawImage(mask, 0, 0, w, h); const m = ctx.getImageData(0, 0, w, h).data;
  ctx.clearRect(0, 0, w, h); ctx.drawImage(img, 0, 0); const px = ctx.getImageData(0, 0, w, h); const d = px.data;
  const target: Partial<Record<TintRegion, [number, number, number]>> = {};
  for (const k of ["suit", "hair", "eyes", "skin"] as const) if (tint[k]) target[k] = hexToHsl(tint[k]!);
  for (let i = 0; i < d.length; i += 4) {
    const region = REGION[Math.round((m[i] ?? 0) / 60)];
    const t = region && target[region]; if (!t || !region || d[i + 3] === 0) continue;
    const [hh, ss, ll] = rgbToHsl(d[i] ?? 0, d[i + 1] ?? 0, d[i + 2] ?? 0);
    const [rh, rs, rl] = ref[region];
    // Traje: gira a cor (mantém os dois tons do uniforme). Cabelo, olhos e pele: assume a cor escolhida.
    const nh = region === "suit" ? (hh + t[0] - rh + 720) % 360 : t[0];
    const ns = clamp(region === "suit" ? ss * (t[1] / Math.max(rs, 0.08)) : t[1] * Math.min(1.25, 0.55 + ss / Math.max(rs, 0.08) * 0.45));
    // pupila preta continua preta; no traje, partes brancas/claras mantêm o brilho
    const w = region === "eyes" ? clamp((ll - 0.06) / 0.2) : region === "suit" ? Math.min(1, ss / Math.max(rs, 0.08)) : 1;
    const nl = clamp(ll + (t[2] - rl) * w * 0.85);
    const [r, g, b] = hslToRgb(nh, ns, nl); d[i] = r; d[i + 1] = g; d[i + 2] = b;
  }
  ctx.putImageData(px, 0, 0);
  return cv.toDataURL("image/webp", 0.9);
}

/** Endereço da imagem do herói já com as cores escolhidas (mostra a original enquanto calcula). */
export function useHeroSrc(id: string, tint: HeroTint | undefined): string {
  const t = tint ?? {}, key = `${id}#${tintKey(t)}`;
  const plain = !Object.values(t).some(Boolean);
  const [src, setSrc] = useState(() => heroImageUrl(id));
  useEffect(() => {
    let alive = true;
    if (plain) { setSrc(heroImageUrl(id)); return; }
    if (!cache.has(key)) cache.set(key, render(id, t).catch(() => heroImageUrl(id)));
    cache.get(key)!.then((s) => { if (alive) setSrc(s); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return src;
}
