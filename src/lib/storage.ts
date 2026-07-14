// Phase 0 persistence: localStorage only. Phase 3 migrates this to Postgres/Prisma
// behind the same interface. Keep all reads/writes guarded for SSR.

import type { Session, BankWord } from "./types";

const SESSIONS_KEY = "sokdok.sessions.v1";
const BANK_KEY = "sokdok.bank.v1";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / private mode — ignore for now */
  }
}

// ---- sessions ----
export function getSessions(): Session[] {
  return read<Session[]>(SESSIONS_KEY, []).sort((a, b) => a.at - b.at);
}

export function addSession(s: Session): void {
  const all = read<Session[]>(SESSIONS_KEY, []);
  all.push(s);
  write(SESSIONS_KEY, all);
}

export function totalWordsRead(): number {
  return getSessions().reduce((sum, s) => sum + s.wordsRead, 0);
}

/** Consecutive-day streak counting sessions. */
export function currentStreak(): number {
  const days = new Set(
    getSessions().map((s) => new Date(s.at).toDateString()),
  );
  let streak = 0;
  const d = new Date();
  // allow today or yesterday to start the streak
  if (!days.has(d.toDateString())) d.setDate(d.getDate() - 1);
  while (days.has(d.toDateString())) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

// ---- word bank ----
export function getBank(): BankWord[] {
  return read<BankWord[]>(BANK_KEY, []);
}

export function saveBank(words: BankWord[]): void {
  write(BANK_KEY, words);
}

export function addBankWord(w: Omit<BankWord, "seen" | "correct" | "lastRtMs" | "dueAt" | "ease" | "addedAt">): void {
  const bank = getBank();
  if (bank.some((b) => b.lemma === w.lemma)) return; // dedupe by lemma
  bank.push({
    ...w,
    addedAt: Date.now(),
    seen: 0,
    correct: 0,
    lastRtMs: 0,
    dueAt: Date.now(),
    ease: 1,
  });
  saveBank(bank);
}

/** Enrich a captured word's definitions (e.g. after an async KRDict lookup). */
export function updateBankWordDefs(lemma: string, defs: string[]): void {
  if (defs.length === 0) return;
  const bank = getBank();
  const w = bank.find((b) => b.lemma === lemma);
  if (!w) return;
  w.defs = defs;
  saveBank(bank);
}

export function dueBankWords(now = Date.now()): BankWord[] {
  return getBank().filter((w) => w.dueAt <= now);
}

/** Update SRS state after a speed-recognition rep. */
export function reviewBankWord(lemma: string, correct: boolean, rtMs: number): void {
  const bank = getBank();
  const w = bank.find((b) => b.lemma === lemma);
  if (!w) return;
  w.seen++;
  w.lastRtMs = rtMs;
  if (correct) {
    w.correct++;
    // fast + correct grows the interval faster
    const fast = rtMs < 1500;
    w.ease = Math.min(w.ease * (fast ? 2.2 : 1.5), 64);
  } else {
    w.ease = 1; // reset
  }
  const intervalMs = w.ease * 24 * 60 * 60 * 1000; // days -> ms
  w.dueAt = Date.now() + intervalMs;
  saveBank(bank);
}
