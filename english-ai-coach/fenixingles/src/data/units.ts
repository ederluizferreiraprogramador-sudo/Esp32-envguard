// Tipos copiados do projeto Lovable (src/data/units.ts) para validação local.
export type Activity =
  | { type: "fill"; before: string; after: string; options: string[]; answer: string; explain: string; context?: string }
  | { type: "choose"; line: string; options: string[]; answer: string; explain: string }
  | { type: "build"; pt: string; answer: string; extra: string[]; explain: string }
  | { type: "listen"; audio: string; options: string[]; answer: string; explain: string }
  | { type: "write"; prompt: string; answer: string[]; explain: string }
  | { type: "match"; pairs: [string, string][]; explain: string };
export interface Lesson { title: string; activities: Activity[] }
