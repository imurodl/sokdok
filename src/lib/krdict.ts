import { XMLParser } from "fast-xml-parser";

// KRDict Open API (한국어기초사전) — free, CC-BY-SA, 50k req/day.
// Register a key at https://krdict.korean.go.kr/openApi/openApiInfo and set
// KRDICT_KEY in the environment. Without a key this returns null and callers
// fall back to the bundled starter dictionary.

const BASE = "https://krdict.korean.go.kr/api/search";
const parser = new XMLParser({ ignoreAttributes: false });

export interface KrdictResult {
  lemma: string;
  pos?: string;
  defs: string[];
}

function asArray<T>(v: T | T[] | undefined): T[] {
  if (v == null) return [];
  return Array.isArray(v) ? v : [v];
}

/** Look a query up in KRDict, English translations. Returns null on miss/no-key. */
export async function krdictLookup(q: string): Promise<KrdictResult | null> {
  const key = process.env.KRDICT_KEY;
  if (!key || !q) return null;

  const url = `${BASE}?key=${encodeURIComponent(key)}&part=word&sort=popular&translated=y&trans_lang=1&q=${encodeURIComponent(q)}`;

  let xml: string;
  try {
    const res = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });
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

  // channel.item[]  each: word, pos, sense{ translation{ trans_dfn, trans_word } }
  const channel = (data as { channel?: { item?: unknown } })?.channel;
  const items = asArray(channel?.item as Record<string, unknown> | Record<string, unknown>[]);
  if (items.length === 0) return null;

  const top = items[0] as Record<string, unknown>;
  const lemma = String(top.word ?? q);
  const pos = top.pos ? String(top.pos) : undefined;

  const defs: string[] = [];
  for (const sense of asArray(top.sense as Record<string, unknown> | Record<string, unknown>[])) {
    const tr = (sense as Record<string, unknown>).translation as
      | Record<string, unknown>
      | Record<string, unknown>[]
      | undefined;
    for (const t of asArray(tr)) {
      const dfn = (t as Record<string, unknown>).trans_dfn;
      if (dfn) defs.push(String(dfn).trim());
    }
    if (defs.length >= 3) break;
  }

  if (defs.length === 0) return null;
  return { lemma, pos, defs };
}
