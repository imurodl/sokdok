"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Text } from "@/lib/types";
import { getLocalTexts, deleteLocalText } from "@/lib/localTexts";

// Client-rendered list of the user's imported texts (localStorage).
export function LocalLibrary() {
  const [texts, setTexts] = useState<Text[] | null>(null);

  useEffect(() => {
    setTexts(getLocalTexts());
  }, []);

  function remove(id: string) {
    deleteLocalText(id);
    setTexts(getLocalTexts());
  }

  if (!texts || texts.length === 0) return null;

  return (
    <div className="grid gap-3">
      {texts.map((t) => (
        <div
          key={t.id}
          className="group flex items-center justify-between rounded-xl border border-border bg-bg-card p-4 transition hover:border-accent"
        >
          <Link href={`/read/${t.id}`} className="min-w-0 flex-1">
            <div className="font-medium group-hover:text-accent">{t.title}</div>
            <div className="text-sm text-text-dim">
              TOPIK {t.level} · {t.wordCount} words · {t.source}
            </div>
          </Link>
          <div className="flex items-center gap-3 pl-3">
            <div className="flex flex-col items-end gap-1">
              <div className="h-1.5 w-24 rounded-full bg-bg-elev">
                <div
                  className="h-1.5 rounded-full bg-accent"
                  style={{ width: `${t.difficulty}%` }}
                />
              </div>
              <span className="text-xs text-text-dim tabular-nums">
                difficulty {t.difficulty}
              </span>
            </div>
            <button
              onClick={() => remove(t.id)}
              className="text-text-dim hover:text-bad"
              aria-label={`Delete ${t.title}`}
              title="Delete"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
