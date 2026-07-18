import { NextRequest, NextResponse } from "next/server";
import { krdictLookup } from "@/lib/krdict";
import { stripParticles } from "@/lib/korean";
import { nlpAnalyze, pickHead, type Morph } from "@/lib/nlp";

// Tap-to-gloss. Turns a tapped word into an accurate dictionary entry:
//   Kiwi (oci) analyzes the *sentence in context* → headword lemma + POS +
//   grammar morphemes at the tapped offset → KRDict on the lemma.
// Context matters: "마셔요" in isolation mis-parses, but inside its sentence
// Kiwi lemmatizes it to 마시다. When Kiwi is unreachable we fall back to KRDict
// on the surface form and the heuristic particle stripper, so the app degrades
// gracefully (Vercel without an NLP endpoint still glosses most words).

interface GlossResponse {
  lemma: string;
  pos?: string;
  grade?: string;
  defs: string[];
  particles?: string[];
  source: "krdict" | "none";
}

// Per-instance cache. Context changes the answer, so key on word + a window of
// surrounding text at the tap offset.
const cache = new Map<string, GlossResponse>();

async function gloss(word: string, context?: string, offset?: number): Promise<GlossResponse> {
  // 1) Kiwi headword. Prefer analyzing the sentence in context and picking the
  //    morphemes inside the tapped eojeol; fall back to the word alone.
  let head = null;
  if (context && typeof offset === "number") {
    const a = await nlpAnalyze(context);
    if (a) {
      const end = offset + word.length;
      const within = a.morphs.filter((m: Morph) => m.start >= offset && m.start < end);
      head = pickHead(within.length ? within : a.morphs);
    }
  }
  if (!head) {
    const a = await nlpAnalyze(word);
    if (a) head = pickHead(a.morphs);
  }
  const particles = head?.grammar.map((m) => m.form).filter(Boolean);

  // 2) KRDict on the lemma, then the raw surface, then a heuristic stem.
  const { stem } = stripParticles(word);
  const candidates = dedupe([head?.lemma, word, stem].filter(Boolean) as string[]);
  let hit = null;
  for (const c of candidates) {
    hit = await krdictLookup(c);
    if (hit) break;
  }

  return hit
    ? {
        lemma: hit.lemma,
        pos: hit.pos ?? head?.pos,
        grade: hit.grade,
        defs: hit.defs,
        particles: particles?.length ? particles : undefined,
        source: "krdict",
      }
    : {
        lemma: head?.lemma ?? stem ?? word,
        pos: head?.pos,
        defs: [],
        particles: particles?.length ? particles : undefined,
        source: "none",
      };
}

const empty: GlossResponse = { lemma: "", defs: [], source: "none" };

export async function POST(req: NextRequest) {
  const { word, context, offset } = (await req.json().catch(() => ({}))) as {
    word?: string;
    context?: string;
    offset?: number;
  };
  const q = word?.trim();
  if (!q) return NextResponse.json(empty);

  const key = `${q}@${offset ?? ""}@${(context ?? "").slice(0, 60)}`;
  const cached = cache.get(key);
  if (cached) return NextResponse.json(cached);

  const result = await gloss(q, context, offset);
  cache.set(key, result);
  return NextResponse.json(result);
}

// Word-only lookup (no sentence context) — handy for manual testing.
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q) return NextResponse.json(empty);
  const cached = cache.get(`${q}@@`);
  if (cached) return NextResponse.json(cached);
  const result = await gloss(q);
  cache.set(`${q}@@`, result);
  return NextResponse.json(result);
}

function dedupe(arr: string[]): string[] {
  return [...new Set(arr.filter(Boolean))];
}
