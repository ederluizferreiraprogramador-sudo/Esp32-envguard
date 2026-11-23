import { castSrc, type CastId } from "@/lib/cast";

/** Imagem de um personagem da turma. */
export function CastImage({ id, size = 96, className = "", alt = "" }: { id: CastId; size?: number; className?: string; alt?: string }) {
  return <img src={castSrc(id)} alt={alt} width={size} height={size} loading="lazy" draggable={false}
    className={`select-none object-contain ${className}`} style={{ width: size, height: size }} />;
}
