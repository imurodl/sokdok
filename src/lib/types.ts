// Core domain types for Sokdok's reading loop.

export type TopikLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface Question {
  id: string;
  prompt: string; // in Korean or English
  choices: string[];
  answerIndex: number;
}

export interface Text {
  id: string;
  title: string;
  source: string;
  level: TopikLevel;
  /** Estimated Sokdok difficulty 0-100 (finer than TOPIK band). */
  difficulty: number;
  body: string; // raw Korean text, paragraphs separated by \n\n
  questions: Question[];
  wordCount: number; // eojeol count, precomputed
  charCount: number; // Hangul/char count, precomputed
}

export interface GlossEntry {
  word: string; // the surface token tapped
  lemma: string; // best-guess dictionary form
  reading?: string;
  pos?: string;
  grade?: string; // KRDict word_grade: 초급 / 중급 / 고급
  defs: string[]; // English definitions
  particles?: string[]; // stripped grammatical endings, if any
  source: "bundled" | "krdict" | "none";
}

/** A single reading pass (one read-through of a text). */
export interface ReadingPass {
  wpm: number;
  cpm: number;
  seconds: number;
  words: number;
}

/** A completed reading session, persisted to build the trend line. */
export interface Session {
  id: string;
  textId: string;
  title: string;
  level: TopikLevel;
  at: number; // epoch ms
  mode: "read" | "trr";
  passes: ReadingPass[]; // 1 for normal read, N for TRR
  bestWpm: number;
  comprehension: number; // 0-1, from the final quiz (or NaN if skipped)
  err: number; // effective reading rate = bestWpm * comprehension
  wordsRead: number;
}

/** A captured word in the user's bank, with speed-recognition SRS state. */
export interface BankWord {
  lemma: string;
  surface: string;
  defs: string[];
  contextSentence: string;
  addedAt: number;
  // lightweight speed-recognition scheduling
  seen: number;
  correct: number;
  lastRtMs: number; // last reaction time
  dueAt: number; // epoch ms when next due
  ease: number; // simple interval multiplier
}
