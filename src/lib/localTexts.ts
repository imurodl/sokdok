// Imported texts live in localStorage (Phase 0). Same `Text` shape as the seed
// library so the reading loop, WPM timer, and word bank treat them identically.
// Phase 3 moves these to Postgres behind the same interface.

import type { Text, TopikLevel } from "./types";
import { countWords, countChars } from "./korean";

const KEY = "sokdok.localtexts.v1";

function read(): Text[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Text[]) : [];
  } catch {
    return [];
  }
}

function write(texts: Text[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(texts));
  } catch {
    /* quota — ignore for now */
  }
}

export function getLocalTexts(): Text[] {
  return read().sort((a, b) => (b.addedAt ?? 0) - (a.addedAt ?? 0));
}

export function getLocalText(id: string): Text | undefined {
  return read().find((t) => t.id === id);
}

export function deleteLocalText(id: string): void {
  write(read().filter((t) => t.id !== id));
}

function slugId(title: string): string {
  // ASCII-only slug so the id survives URL encoding cleanly; a random suffix
  // keeps it unique (Korean-only titles collapse to just the suffix).
  const base =
    title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 32) || "text";
  return `local-${base}-${Math.random().toString(36).slice(2, 8)}`;
}

export interface ImportInput {
  title: string;
  source?: string;
  body: string;
  level: TopikLevel;
  difficulty: number;
}

/** Create and persist an imported text; returns it (with computed counts + id). */
export function addLocalText(input: ImportInput): Text {
  const body = input.body.trim();
  const text: Text = {
    id: slugId(input.title),
    title: input.title.trim() || "Untitled",
    source: input.source?.trim() || "Imported",
    level: input.level,
    difficulty: input.difficulty,
    body,
    questions: [],
    wordCount: countWords(body),
    charCount: countChars(body),
    local: true,
    addedAt: Date.now(),
  };
  const all = read();
  all.push(text);
  write(all);
  return text;
}
