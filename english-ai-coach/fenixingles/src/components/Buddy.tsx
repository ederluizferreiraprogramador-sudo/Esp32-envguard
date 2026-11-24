// Mostra qualquer personagem da turma (gatinhos em SVG ou ilustrações) pelo id.
import { Kitten, type KittenName } from "./Kittens";
import { UniFront } from "./Characters";
import { CastImage } from "./CastImage";
import type { CastId } from "@/lib/cast";

export const KITTENS = ["charlotte", "mingau", "luna"];
export function Buddy({ id, size = 120, className = "" }: { id: string; size?: number; className?: string }) {
  if (KITTENS.includes(id)) return <Kitten name={id as KittenName} size={size} className={className} />;
  if (id === "uni") return <UniFront size={size} className={className} />;
  return <CastImage id={id as CastId} size={size} className={className} />;
}
