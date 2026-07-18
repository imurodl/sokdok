// Client for the Sokdok NLP service (Kiwi via FastAPI on `oci`, see nlp/main.py).
// Server-side only — called from API routes at tap/import time, never in the
// browser. Set NLP_URL to reach the service; when unset or unreachable every
// call returns null and callers fall back to the heuristic tokenizer + KRDict
// on the raw surface form, so the app degrades gracefully (Vercel still works).

const NLP_URL = process.env.NLP_URL?.replace(/\/$/, "");
const TIMEOUT_MS = 2500;
// Circuit breaker: after a failed/timed-out call, skip the service for a cooldown
// so taps stay snappy when the tunnel/endpoint is down (Kiwi answers in <100ms
// when up, so this never trips in the happy path).
const COOLDOWN_MS = 20_000;
let downUntil = 0;

export interface Morph {
  form: string; // surface morpheme
  tag: string; // Kiwi POS tag (NNG, VV, JKO, EF, …)
  lemma: string; // dictionary form (verbs/adjectives get trailing 다)
  start: number;
  len: number;
  content: boolean; // worth glossing (noun/verb/adj/adverb/…)
}

export interface AnalyzeResult {
  morphs: Morph[];
  wordCount: number;
  charCount: number;
}

export interface LevelResult {
  sokdok: number; // 0-100
  topik: number; // 1-6
}

// Kiwi POS tag → readable English part of speech (for the gloss panel).
const TAG_POS: Record<string, string> = {
  NNG: "noun", NNP: "proper noun", NNB: "bound noun", NR: "numeral", NP: "pronoun",
  VV: "verb", VA: "adjective", VX: "aux. verb", VCP: "copula", VCN: "copula (neg.)",
  MAG: "adverb", MAJ: "conj. adverb", MM: "determiner", IC: "interjection",
  XR: "root", XPN: "prefix", XSN: "suffix", XSV: "verb suffix", XSA: "adj. suffix",
  SL: "foreign", SH: "hanja", SN: "number",
};

export function tagToPos(tag: string): string | undefined {
  return TAG_POS[tag];
}

// Tags ranked as the "headword" of an eojeol — the morpheme worth looking up.
const PRIMARY_ORDER = ["NNG", "NNP", "VV", "VA", "XR", "NP", "NR", "MAG", "NNB", "MM", "SL"];

async function post<T>(path: string, text: string): Promise<T | null> {
  if (!NLP_URL || Date.now() < downUntil) return null;
  try {
    const res = await fetch(`${NLP_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    downUntil = Date.now() + COOLDOWN_MS; // endpoint unreachable — back off
    return null;
  }
}

/** Morpheme analysis of arbitrary text. Null when the service is unavailable. */
export async function nlpAnalyze(text: string): Promise<AnalyzeResult | null> {
  const data = await post<{
    wordCount: number;
    charCount: number;
    sentences: { tokens: Morph[] }[];
  }>("/analyze", text);
  if (!data) return null;
  const morphs = (data.sentences ?? []).flatMap((s) => s.tokens ?? []);
  return { morphs, wordCount: data.wordCount, charCount: data.charCount };
}

/** Difficulty leveling for a whole text. Null when the service is unavailable. */
export async function nlpLevel(text: string): Promise<LevelResult | null> {
  const data = await post<LevelResult>("/level", text);
  if (!data || typeof data.sokdok !== "number") return null;
  return { sokdok: data.sokdok, topik: data.topik };
}

export interface HeadMorph {
  lemma: string;
  pos?: string;
  content: Morph[]; // all content morphemes (compounds surface more than one)
  grammar: Morph[]; // particles / endings, in order
}

/** From one eojeol's morphemes, pick the headword to gloss + split off grammar. */
export function pickHead(morphs: Morph[]): HeadMorph | null {
  if (!morphs.length) return null;
  const content = morphs.filter((m) => m.content);
  const pool = content.length ? content : morphs;
  // Prefer the highest-ranked content tag; ties broken by longest surface.
  const head = [...pool].sort((a, b) => {
    const ra = PRIMARY_ORDER.indexOf(a.tag);
    const rb = PRIMARY_ORDER.indexOf(b.tag);
    const wa = ra === -1 ? 99 : ra;
    const wb = rb === -1 ? 99 : rb;
    return wa - wb || b.len - a.len;
  })[0];
  // Grammar = particles/endings shown under the gloss — everything but the head.
  const grammar = morphs.filter((m) => m !== head && !m.content);
  return {
    lemma: head.lemma || head.form,
    pos: tagToPos(head.tag),
    content,
    grammar,
  };
}
