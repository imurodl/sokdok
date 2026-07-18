"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { countWords, countChars } from "@/lib/korean";
import { addLocalText } from "@/lib/localTexts";
import type { TopikLevel } from "@/lib/types";

export default function ImportPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const words = useMemo(() => countWords(body), [body]);
  const chars = useMemo(() => countChars(body), [body]);
  const canSave = body.trim().length > 0 && !busy;

  async function save() {
    const text = body.trim();
    if (!text) return;
    setBusy(true);
    setError(null);
    try {
      // Auto-level via the NLP service (falls back to a heuristic server-side).
      let level: TopikLevel = 3;
      let difficulty = 50;
      try {
        const res = await fetch("/api/level", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        if (res.ok) {
          const d = (await res.json()) as { sokdok: number; topik: number };
          difficulty = d.sokdok;
          level = Math.min(6, Math.max(1, d.topik)) as TopikLevel;
        }
      } catch {
        /* keep defaults */
      }
      const saved = addLocalText({
        title: title.trim() || "Untitled",
        source: source.trim() || undefined,
        body: text,
        level,
        difficulty,
      });
      router.push(`/read/${saved.id}`);
    } catch {
      setError("Couldn't save. Try again.");
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/" className="text-sm text-text-dim hover:text-text">
          ← Library
        </Link>
        <h1 className="mt-1 text-2xl font-semibold">Import a text</h1>
        <p className="text-text-dim">
          Paste the Korean you actually want to read — a news article, a page of your
          book, lyrics. It gets tokenized, auto-leveled, and dropped straight into the
          reading loop with the timer and tap-to-gloss.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm text-text-dim">Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="아침 뉴스"
              className="mt-1 w-full rounded-lg border border-border bg-bg-card px-3 py-2 outline-none focus:border-accent"
            />
          </label>
          <label className="block">
            <span className="text-sm text-text-dim">Source (optional)</span>
            <input
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="한겨레 / 내 책 3장"
              className="mt-1 w-full rounded-lg border border-border bg-bg-card px-3 py-2 outline-none focus:border-accent"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm text-text-dim">
            Korean text — separate paragraphs with a blank line
          </span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={14}
            placeholder="여기에 한국어 글을 붙여넣으세요…"
            className="mt-1 w-full resize-y rounded-lg border border-border bg-bg-card px-3 py-2 font-[family-name:var(--font-reading)] leading-relaxed outline-none focus:border-accent"
          />
        </label>

        <div className="flex items-center justify-between">
          <span className="text-sm text-text-dim tabular-nums">
            {words} words · {chars} chars
          </span>
          <div className="flex items-center gap-3">
            {error && <span className="text-sm text-bad">{error}</span>}
            <button
              onClick={save}
              disabled={!canSave}
              className="rounded-lg bg-accent px-5 py-2.5 font-medium text-white disabled:opacity-40"
            >
              {busy ? "Leveling…" : "Save & read →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
