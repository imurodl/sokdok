import { XMLParser } from "fast-xml-parser";

// KRDict Open API (한국어기초사전) — free, CC-BY-SA, 50k req/day.
// Register a key at https://krdict.korean.go.kr/kor/openApi/openApiRegister and set
// KRDICT_KEY in the environment. Without a key this returns null and callers
// fall back to the bundled starter dictionary.
// NOTE: their WAF blocks requests without a browser-like User-Agent.

const BASE = "https://krdict.korean.go.kr/api/search";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";
const parser = new XMLParser({ ignoreAttributes: false, cdataPropName: "__cdata" });

const POS_EN: Record<string, string> = {
  명사: "noun", 동사: "verb", 형용사: "adjective", 부사: "adverb",
  관형사: "determiner", 대명사: "pronoun", 수사: "numeral", 조사: "particle",
  감탄사: "interjection", 의존명사: "bound noun",
};

export interface KrdictResult {
  lemma: string;
  pos?: string;
  grade?: string; // 초급 / 중급 / 고급
  defs: string[];
}

function asArray<T>(v: T | T[] | undefined): T[] {
  if (v == null) return [];
  return Array.isArray(v) ? v : [v];
}

// fast-xml-parser returns CDATA under __cdata; normalize to a plain string.
function txt(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v.trim();
  if (typeof v === "object" && "__cdata" in (v as Record<string, unknown>)) {
    return String((v as Record<string, unknown>).__cdata).trim();
  }
  return String(v).trim();
}

/** Look a query up in KRDict, English translations. Returns null on miss/no-key. */
export async function krdictLookup(q: string): Promise<KrdictResult | null> {
  const key = process.env.KRDICT_KEY;
  if (!key || !q) return null;

  const url = `${BASE}?key=${encodeURIComponent(key)}&part=word&sort=popular&translated=y&trans_lang=1&q=${encodeURIComponent(q)}`;

  let xml: string;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA },
      next: { revalidate: 60 * 60 * 24 },
    });
    if (!res.ok) return null;
    xml = await res.text();
  } catch {
    return null;
  }

  let data: unknown;
  try {
    data = parser.parse(xml);
  } catch {
    return null;
  }

  const channel = (data as { channel?: { item?: unknown } })?.channel;
  const items = asArray(channel?.item as Record<string, unknown> | Record<string, unknown>[]);
  if (items.length === 0) return null;

  const top = items[0] as Record<string, unknown>;
  const lemma = txt(top.word) || q;
  const pos = top.pos ? POS_EN[txt(top.pos)] ?? txt(top.pos) : undefined;
  const grade = top.word_grade ? txt(top.word_grade) : undefined;

  const defs: string[] = [];
  for (const sense of asArray(top.sense as Record<string, unknown> | Record<string, unknown>[])) {
    for (const t of asArray(
      (sense as Record<string, unknown>).translation as
        | Record<string, unknown>
        | Record<string, unknown>[]
        | undefined,
    )) {
      const word = txt((t as Record<string, unknown>).trans_word);
      const dfn = txt((t as Record<string, unknown>).trans_dfn);
      const line = word && dfn ? `${word} — ${dfn}` : word || dfn;
      if (line) defs.push(line);
    }
    if (defs.length >= 3) break;
  }

  if (defs.length === 0) return null;
  return { lemma, pos, grade, defs: defs.slice(0, 3) };
}
