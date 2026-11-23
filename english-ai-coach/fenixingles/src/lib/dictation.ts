// Ditado (falar em vez de digitar) quando o ambiente oferece (window.claude "dictation").
type Dict = {
  start(o?: { language?: string }): Promise<void>; stop(): Promise<void>;
  onFinal(h: (e: { text: string }) => void): () => void; onPartial(h: (e: { text: string }) => void): () => void;
  onState(h: (e: { state: string; reason?: string }) => void): () => void;
};
let p: Promise<Dict | null> | null = null;
export function getDictation(): Promise<Dict | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  const c = (window as unknown as { claude?: { use: (n: string) => Promise<unknown> } }).claude;
  if (!c?.use) return Promise.resolve(null);
  p ??= c.use("dictation").then((d) => (d as Dict) ?? null).catch(() => null);
  return p;
}
