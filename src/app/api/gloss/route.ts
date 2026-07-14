import { NextRequest, NextResponse } from "next/server";
import { krdictLookup } from "@/lib/krdict";
import { stripParticles } from "@/lib/korean";

// Simple in-memory cache (per server instance) to stay well under KRDict's quota.
const cache = new Map<string, { lemma: string; pos?: string; grade?: string; defs: string[]; source: string }>();

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ defs: [], source: "none" });

  if (cache.has(q)) return NextResponse.json(cache.get(q));

  // try the surface form, then a particle-stripped stem
  let hit = await krdictLookup(q);
  if (!hit) {
    const { stem } = stripParticles(q);
    if (stem && stem !== q) hit = await krdictLookup(stem);
  }

  const result = hit
    ? { lemma: hit.lemma, pos: hit.pos, grade: hit.grade, defs: hit.defs, source: "krdict" }
    : { lemma: q, defs: [], source: "none" };

  cache.set(q, result);
  return NextResponse.json(result);
}
