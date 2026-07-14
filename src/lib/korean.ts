// Lightweight Korean text utilities for Phase 0.
// Real morphological analysis (Kiwi/MeCab via the oci NLP service) lands in Phase 1;
// for the personal dogfood loop, whitespace(eojeol)-splitting + heuristic particle
// stripping gives tappable tokens and decent lemma guesses without any infra.

const HANGUL = /[가-힣]/;

export function isHangul(s: string): boolean {
  return HANGUL.test(s);
}

/** Count eojeol (space-separated word units) — Sokdok's "word" for WPM. */
export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => /[가-힣A-Za-z0-9]/.test(w)).length;
}

/** Count Hangul syllable blocks — the more stable CPM basis for Korean. */
export function countChars(text: string): number {
  const m = text.match(/[가-힣]/g);
  return m ? m.length : 0;
}

export interface Token {
  text: string; // surface form incl. trailing punctuation
  word: string; // cleaned word (no surrounding punctuation)
  tappable: boolean; // has Hangul/latin/digit worth glossing
  key: string; // unique per-position key
}

/** Split a paragraph into tappable tokens, preserving spacing/punctuation. */
export function tokenize(paragraph: string): Token[] {
  const parts = paragraph.split(/(\s+)/); // keep whitespace chunks
  const tokens: Token[] = [];
  let i = 0;
  for (const part of parts) {
    if (/^\s+$/.test(part) || part === "") {
      tokens.push({ text: part, word: "", tappable: false, key: `w${i++}` });
      continue;
    }
    const word = part.replace(/^[^가-힣A-Za-z0-9]+|[^가-힣A-Za-z0-9]+$/g, "");
    tokens.push({
      text: part,
      word,
      tappable: /[가-힣A-Za-z]/.test(word),
      key: `w${i++}`,
    });
  }
  return tokens;
}

// Common Korean particles / josa, longest-first so we strip greedily.
const PARTICLES = [
  "에서는", "에게서", "으로는", "에서도", "에게는", "이라고", "라고는",
  "에서", "에게", "께서", "으로", "라고", "이나", "에는", "에도", "부터",
  "까지", "처럼", "만큼", "보다", "하고", "이랑", "든지", "마다", "조차",
  "밖에", "이야", "라도",
  "은", "는", "이", "가", "을", "를", "에", "의", "도", "만", "와", "과",
  "로", "고", "나", "야", "요",
];

// Common verb/adjective endings to peel toward a rough stem.
const ENDINGS = [
  "습니다", "ㅂ니다", "았습니다", "었습니다", "겠습니다",
  "에요", "예요", "아요", "어요", "여요", "해요", "네요", "지요",
  "았어요", "었어요", "했어요", "고요", "는데", "지만", "으니까", "니까",
  "면서", "라서", "아서", "어서", "해서", "다가", "거나", "든지",
  "다", "요", "죠", "함", "임",
];

/** Heuristic: strip a trailing particle/ending, returning [stemGuess, stripped[]]. */
export function stripParticles(word: string): { stem: string; stripped: string[] } {
  let stem = word;
  const stripped: string[] = [];
  // one ending pass (verbs/adjectives)
  for (const e of ENDINGS) {
    if (stem.length > e.length && stem.endsWith(e)) {
      stripped.push(e);
      stem = stem.slice(0, -e.length);
      break;
    }
  }
  // one particle pass (nouns)
  for (const p of PARTICLES) {
    if (stem.length > p.length && stem.endsWith(p)) {
      stripped.push(p);
      stem = stem.slice(0, -p.length);
      break;
    }
  }
  return { stem, stripped };
}
