import { CastImage } from "./CastImage";
import type { CastId } from "@/lib/cast";

export type PhoenixPose = "voando" | "leitora" | "exploradora" | "cantora" | "meditando" | "mae" | "guerreira" | "letras" | "selo";

/** Fê, a Fênix do FenixInglês, em várias poses ilustradas. */
export function Phoenix({ size = 120, className = "", pose = "voando" }: { size?: number; className?: string; pose?: PhoenixPose }) {
  return <CastImage id={`fenix-${pose}` as CastId} size={size} className={className} alt="Fê, a Fênix, mascote do FenixInglês" />;
}
