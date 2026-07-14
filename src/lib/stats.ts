import type { ReadingPass } from "./types";

/** Compute a reading pass from words read and elapsed milliseconds. */
export function computePass(words: number, chars: number, ms: number): ReadingPass {
  const minutes = Math.max(ms / 60000, 1 / 60000); // guard div-by-zero
  return {
    words,
    seconds: Math.round(ms / 1000),
    wpm: Math.round(words / minutes),
    cpm: Math.round(chars / minutes),
  };
}

/** Effective Reading Rate = speed discounted by comprehension. Headline metric. */
export function effectiveRate(wpm: number, comprehension: number): number {
  if (Number.isNaN(comprehension)) return wpm; // no quiz taken
  return Math.round(wpm * comprehension);
}

/** Native Korean adult reading benchmark (~174 WPM). See research/01. */
export const NATIVE_WPM = 174;

export function pctOfNative(wpm: number): number {
  return Math.round((wpm / NATIVE_WPM) * 100);
}
