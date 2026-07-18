import { NextRequest, NextResponse } from "next/server";
import { nlpLevel } from "@/lib/nlp";
import { countWords } from "@/lib/korean";

// Auto-leveling for imported text. Uses Kiwi's difficulty scorer on `oci`; when
// unreachable, a rough heuristic keeps import working (mean eojeol length as a
// stand-in for lexical/syntactic load).

export async function POST(req: NextRequest) {
  const { text } = (await req.json().catch(() => ({}))) as { text?: string };
  const body = text?.trim();
  if (!body) return NextResponse.json({ sokdok: 0, topik: 1, source: "none" });

  const nlp = await nlpLevel(body);
  if (nlp) return NextResponse.json({ ...nlp, source: "kiwi" });

  // Heuristic fallback: longer average words ≈ harder. Clamp to a sane band.
  const words = body.split(/\s+/).filter(Boolean);
  const wc = countWords(body);
  const meanLen = wc ? words.reduce((s, w) => s + w.length, 0) / words.length : 2;
  const sokdok = Math.round(Math.max(0, Math.min((meanLen - 1.5) / 3, 1)) * 100);
  const topik = Math.min(6, Math.max(1, 1 + Math.floor(sokdok / 17)));
  return NextResponse.json({ sokdok, topik, source: "heuristic" });
}
