// Personagens 3D (gerados no Figma) com animações leves em CSS.
import { castSrc, type ArtId } from "@/lib/cast";

export type PetAnim = "breathe" | "hop" | "wiggle" | "float" | "none";
const LABEL: Record<string, string> = {
  charlotte: "Charlotte", mingau: "Mingau", luna: "Luna", uni: "Uni", "uni-danca": "Uni dançando",
  capi: "Capi", juba: "Juba", lili: "Lili",
};

export function Pet({ id, size = 120, anim = "breathe", className = "" }: { id: ArtId; size?: number; anim?: PetAnim; className?: string }) {
  return (
    <span className={`relative inline-block shrink-0 ${className}`} style={{ width: size, height: size }} role="img" aria-label={LABEL[id] ?? id}>
      <span aria-hidden className={`pet-shadow absolute bottom-[2%] left-1/2 h-[7%] w-[56%] -translate-x-1/2 rounded-[50%] ${anim === "hop" || anim === "float" ? "pet-shadow-pulse" : ""}`} />
      <img src={castSrc(id)} alt="" width={size} height={size} draggable={false} loading="lazy"
        className={`relative block h-full w-full select-none object-contain ${anim === "none" ? "" : `pet-${anim}`}`} />
    </span>
  );
}
