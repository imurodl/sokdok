"use client";

import { useEffect, useState } from "react";
import type { Session } from "@/lib/types";
import { getSessions, totalWordsRead, currentStreak } from "@/lib/storage";
import { NATIVE_WPM } from "@/lib/stats";

const YEAR_GOAL = 200_000; // research: ~200k words/year for fluency gains

export function Dashboard() {
  const [sessions, setSessions] = useState<Session[] | null>(null);
  const [words, setWords] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setSessions(getSessions());
    setWords(totalWordsRead());
    setStreak(currentStreak());
  }, []);

  if (sessions === null) {
    return <div className="h-28 rounded-xl border border-border bg-bg-card animate-pulse" />;
  }

  if (sessions.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-bg-card p-5 text-text-dim">
        No sessions yet. Pick a text below and read it — your speed trend shows up here.
      </div>
    );
  }

  const recent = sessions.slice(-12);
  const errs = recent.map((s) => (Number.isNaN(s.err) ? s.bestWpm : s.err));
  const maxErr = Math.max(...errs, NATIVE_WPM);
  const latest = sessions[sessions.length - 1];
  const bestEver = Math.max(...sessions.map((s) => s.bestWpm));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile label="Streak" value={`${streak}d`} />
        <Tile label="Best WPM" value={bestEver} />
        <Tile label="Last ERR" value={Number.isNaN(latest.err) ? latest.bestWpm : latest.err} />
        <Tile label="Sessions" value={sessions.length} />
      </div>

      <div className="rounded-xl border border-border bg-bg-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-text-dim">Effective reading rate — recent</span>
          <span className="text-xs text-text-dim">native ≈ {NATIVE_WPM}</span>
        </div>
        <div className="flex h-24 items-end gap-1.5">
          {errs.map((e, i) => (
            <div key={i} className="flex flex-1 flex-col items-center justify-end">
              <div
                className="w-full rounded-t bg-accent"
                style={{ height: `${Math.max((e / maxErr) * 100, 4)}%` }}
                title={`${e} — ${recent[i].title}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-bg-card p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-dim">Words read this account</span>
          <span className="tabular-nums">
            {words.toLocaleString()} / {YEAR_GOAL.toLocaleString()}
          </span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-bg-elev">
          <div
            className="h-2 rounded-full bg-accent"
            style={{ width: `${Math.min((words / YEAR_GOAL) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-bg-card p-4">
      <div className="text-2xl font-bold tabular-nums">{value}</div>
      <div className="text-sm text-text-dim">{label}</div>
    </div>
  );
}
