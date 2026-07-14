"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { BankWord } from "@/lib/types";
import { getBank, dueBankWords, reviewBankWord } from "@/lib/storage";
import { DICT } from "@/lib/dict";

interface Card {
  word: BankWord;
  choices: string[];
  answerIndex: number;
}

const ALL_DEFS = Object.values(DICT).flatMap((e) => e.defs);

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(bank: BankWord[]): Card[] {
  // Only quiz words that have a definition; def-less captures wait for lookup.
  const withDefs = bank.filter((w) => w.defs.length > 0);
  const due = dueBankWords().filter((w) => w.defs.length > 0);
  const pool = due.length ? due : withDefs;
  return shuffle(pool).map((word) => {
    const correct = word.defs[0] ?? "(no definition)";
    const distractors = shuffle(
      ALL_DEFS.filter((d) => d !== correct),
    ).slice(0, 3);
    const choices = shuffle([correct, ...distractors]);
    return { word, choices, answerIndex: choices.indexOf(correct) };
  });
}

export default function DrillPage() {
  const [deck, setDeck] = useState<Card[] | null>(null);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0, totalRt: 0 });
  const shownAt = useRef<number>(0);

  useEffect(() => {
    setDeck(buildDeck(getBank()));
  }, []);

  useEffect(() => {
    shownAt.current = Date.now();
    setPicked(null);
  }, [i]);

  const card = deck?.[i];
  const done = deck != null && i >= deck.length;

  const avgRt = score.total ? Math.round(score.totalRt / score.total) : 0;

  function pick(idx: number) {
    if (!card || picked != null) return;
    const rt = Date.now() - shownAt.current;
    const correct = idx === card.answerIndex;
    reviewBankWord(card.word.lemma, correct, rt);
    setPicked(idx);
    setScore((s) => ({
      correct: s.correct + (correct ? 1 : 0),
      total: s.total + 1,
      totalRt: s.totalRt + rt,
    }));
    setTimeout(() => setI((v) => v + 1), 650);
  }

  if (deck === null) return <div className="text-text-dim">Loading…</div>;

  if (deck.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Speed-recognition drill</h1>
        <p className="text-text-dim">
          No words yet. Tap unfamiliar words while reading — they land here for
          fast-recognition practice (building automaticity, not just meaning).
        </p>
        <Link href="/" className="text-accent">
          ← Back to library
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-semibold">Drill complete</h1>
        <div className="grid grid-cols-3 gap-3">
          <Tile label="Correct" value={`${score.correct}/${score.total}`} />
          <Tile label="Avg speed" value={`${(avgRt / 1000).toFixed(1)}s`} />
          <Tile
            label="Sub-1.5s"
            value={avgRt < 1500 ? "✓ fast" : "keep going"}
          />
        </div>
        <p className="text-sm text-text-dim">
          Goal: recognize each word in under ~1.5s without translating. That
          automaticity is what makes reading fast.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setDeck(buildDeck(getBank()));
              setI(0);
              setScore({ correct: 0, total: 0, totalRt: 0 });
            }}
            className="rounded-lg bg-accent px-4 py-2 font-medium text-white"
          >
            Again
          </button>
          <Link href="/" className="rounded-lg border border-border px-4 py-2 font-medium">
            Library
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between text-sm text-text-dim">
        <span>
          {i + 1} / {deck.length}
        </span>
        <span className="tabular-nums">
          {score.correct}/{score.total} · avg {(avgRt / 1000 || 0).toFixed(1)}s
        </span>
      </div>

      <div className="pt-6 text-center">
        <div className="text-6xl font-semibold">{card!.word.lemma}</div>
        <div className="mt-1 text-sm text-text-dim">tap the meaning — fast</div>
      </div>

      <div className="grid gap-3">
        {card!.choices.map((c, idx) => {
          const reveal = picked != null;
          const isAnswer = idx === card!.answerIndex;
          const chosen = picked === idx;
          const cls = [
            "rounded-lg border px-4 py-3 text-left transition",
            !reveal ? "border-border hover:border-accent" : "border-border",
            reveal && isAnswer ? "border-good bg-good/10" : "",
            reveal && chosen && !isAnswer ? "border-bad bg-bad/10" : "",
          ].join(" ");
          return (
            <button key={idx} className={cls} onClick={() => pick(idx)}>
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-bg-card p-4 text-center">
      <div className="text-xl font-bold">{value}</div>
      <div className="text-sm text-text-dim">{label}</div>
    </div>
  );
}
