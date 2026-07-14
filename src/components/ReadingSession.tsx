"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import type { Text, GlossEntry, ReadingPass, Session } from "@/lib/types";
import { glossBundled } from "@/lib/dict";
import { computePass, effectiveRate, pctOfNative, NATIVE_WPM } from "@/lib/stats";
import { addSession, addBankWord } from "@/lib/storage";
import { useReadingTimer } from "@/hooks/useReadingTimer";
import { TextReader } from "./TextReader";
import { GlossPanel } from "./GlossPanel";
import { ComprehensionQuiz } from "./ComprehensionQuiz";

type Phase = "intro" | "reading" | "postpass" | "quiz" | "results";

export function ReadingSession({ text }: { text: Text }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [passes, setPasses] = useState<ReadingPass[]>([]);
  const [gloss, setGloss] = useState<GlossEntry | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [savedLemmas, setSavedLemmas] = useState<Set<string>>(new Set());
  const [comprehension, setComprehension] = useState<number>(NaN);

  const timer = useReadingTimer();

  const bestWpm = passes.reduce((m, p) => Math.max(m, p.wpm), 0);
  const liveWpm =
    timer.elapsedMs > 500
      ? Math.round(text.wordCount / (timer.elapsedMs / 60000))
      : 0;

  const lemmaOf = useCallback((w: string) => glossBundled(w).lemma, []);

  const startPass = useCallback(() => {
    timer.reset();
    setPhase("reading");
    timer.start();
  }, [timer]);

  const onTapWord = useCallback(
    (word: string, context: string, key: string) => {
      const entry = glossBundled(word);
      setGloss(entry);
      setActiveKey(key);
      // Capture every tapped word — the unknown ones are exactly what's worth
      // banking (research/01). Def-less words wait for a Phase-1 KRDict lookup.
      addBankWord({
        lemma: entry.lemma,
        surface: word,
        defs: entry.defs,
        contextSentence: context,
      });
      setSavedLemmas((prev) => new Set(prev).add(entry.lemma));
    },
    [],
  );

  const finishPass = useCallback(() => {
    const ms = timer.stop();
    const pass = computePass(text.wordCount, text.charCount, ms);
    setPasses((prev) => [...prev, pass]);
    setGloss(null);
    setActiveKey(null);
    setPhase("postpass");
  }, [timer, text]);

  const saveSession = useCallback(
    (compScore: number) => {
      const best = passes.reduce((m, p) => Math.max(m, p.wpm), 0);
      const session: Session = {
        id: crypto.randomUUID(),
        textId: text.id,
        title: text.title,
        level: text.level,
        at: Date.now(),
        mode: passes.length > 1 ? "trr" : "read",
        passes,
        bestWpm: best,
        comprehension: compScore,
        err: effectiveRate(best, compScore),
        wordsRead: text.wordCount * passes.length,
      };
      addSession(session);
      setComprehension(compScore);
      setPhase("results");
    },
    [passes, text],
  );

  // ---- render ----
  if (phase === "intro") {
    return (
      <div className="space-y-6">
        <Header text={text} />
        <p className="text-text-dim">
          Read it once at a comfortable pace. When you finish, you&apos;ll see your
          speed, then you can re-read it against the clock to push it up.
        </p>
        <button
          onClick={startPass}
          className="rounded-lg bg-accent px-5 py-2.5 font-medium text-white"
        >
          Start reading →
        </button>
      </div>
    );
  }

  if (phase === "reading") {
    return (
      <div className="space-y-6 pb-40">
        <div className="sticky top-0 z-40 -mx-4 flex items-center justify-between border-b border-border bg-bg/90 px-4 py-2 backdrop-blur">
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-semibold tabular-nums">{liveWpm}</span>
            <span className="text-sm text-text-dim">WPM</span>
            <span className="text-sm text-text-dim tabular-nums">
              {(timer.elapsedMs / 1000).toFixed(0)}s{" "}
              {!timer.running && <span className="text-warn">paused</span>}
            </span>
          </div>
          <button
            onClick={finishPass}
            className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-white"
          >
            Done reading
          </button>
        </div>
        {passes.length > 0 && (
          <p className="text-sm text-text-dim">
            Pass {passes.length + 1} — beat your best of{" "}
            <span className="text-accent font-medium">{bestWpm} WPM</span>
          </p>
        )}
        <TextReader
          body={text.body}
          onTapWord={onTapWord}
          activeKey={activeKey}
          savedLemmas={savedLemmas}
          lemmaOf={lemmaOf}
        />
        <GlossPanel entry={gloss} onClose={() => setGloss(null)} />
      </div>
    );
  }

  if (phase === "postpass") {
    const last = passes[passes.length - 1];
    const prev = passes.length > 1 ? passes[passes.length - 2] : null;
    const delta = prev ? last.wpm - prev.wpm : 0;
    return (
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Pass {passes.length} done</h2>
        <div className="rounded-xl border border-border bg-bg-card p-5">
          <div className="flex items-end gap-6">
            <div>
              <div className="text-4xl font-bold tabular-nums">{last.wpm}</div>
              <div className="text-sm text-text-dim">WPM · {last.seconds}s</div>
            </div>
            <div className="text-text-dim">
              <div className="tabular-nums">{last.cpm} chars/min</div>
              {prev && (
                <div className={delta >= 0 ? "text-good" : "text-bad"}>
                  {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)} vs last pass
                </div>
              )}
            </div>
          </div>
          <PassBars passes={passes} />
        </div>
        <p className="text-text-dim text-sm">
          Re-reading the same passage is the single best-proven way to speed up
          (research: +52% in 9 weeks). Push it 2–3 more times.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={startPass}
            className="rounded-lg bg-accent px-4 py-2 font-medium text-white"
          >
            Read again (timed) ↻
          </button>
          <button
            onClick={() => setPhase("quiz")}
            className="rounded-lg border border-border px-4 py-2 font-medium"
          >
            Comprehension check →
          </button>
          <button
            onClick={() => saveSession(NaN)}
            className="rounded-lg px-4 py-2 text-text-dim hover:text-text"
          >
            Finish without quiz
          </button>
        </div>
      </div>
    );
  }

  if (phase === "quiz") {
    return <ComprehensionQuiz questions={text.questions} onDone={saveSession} />;
  }

  // results
  const err = effectiveRate(bestWpm, comprehension);
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Session complete</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Best WPM" value={bestWpm} />
        <Stat
          label="Comprehension"
          value={Number.isNaN(comprehension) ? "—" : `${Math.round(comprehension * 100)}%`}
        />
        <Stat label="Effective rate" value={err} hint="WPM × comprehension" />
        <Stat label="of native" value={`${pctOfNative(bestWpm)}%`} hint={`native ≈ ${NATIVE_WPM}`} />
      </div>
      <div className="rounded-xl border border-border bg-bg-card p-5">
        <PassBars passes={passes} />
        <p className="mt-2 text-sm text-text-dim">
          {passes.length} pass{passes.length > 1 ? "es" : ""} ·{" "}
          {text.wordCount * passes.length} words read · {savedLemmas.size} words
          saved
        </p>
      </div>
      <div className="flex gap-3">
        <Link href="/" className="rounded-lg bg-accent px-4 py-2 font-medium text-white">
          Back to library
        </Link>
        {savedLemmas.size > 0 && (
          <Link href="/drill" className="rounded-lg border border-border px-4 py-2 font-medium">
            Drill {savedLemmas.size} new words →
          </Link>
        )}
      </div>
    </div>
  );
}

function Header({ text }: { text: Text }) {
  return (
    <div>
      <div className="text-sm text-text-dim">
        TOPIK {text.level} · {text.wordCount} words · {text.source}
      </div>
      <h1 className="text-2xl font-semibold">{text.title}</h1>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div className="rounded-xl border border-border bg-bg-card p-4">
      <div className="text-2xl font-bold tabular-nums">{value}</div>
      <div className="text-sm text-text-dim">{label}</div>
      {hint && <div className="text-xs text-text-dim/70">{hint}</div>}
    </div>
  );
}

function PassBars({ passes }: { passes: ReadingPass[] }) {
  const max = Math.max(...passes.map((p) => p.wpm), 1);
  return (
    <div className="mt-3 flex items-end gap-2 h-24">
      {passes.map((p, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1">
          <span className="text-xs tabular-nums text-text-dim">{p.wpm}</span>
          <div
            className="w-full rounded-t bg-accent"
            style={{ height: `${Math.max((p.wpm / max) * 100, 6)}%` }}
          />
          <span className="text-xs text-text-dim">#{i + 1}</span>
        </div>
      ))}
    </div>
  );
}
