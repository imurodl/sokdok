"use client";

import type { GlossEntry } from "@/lib/types";
import { labelParticle } from "@/lib/dict";

export function GlossPanel({
  entry,
  onClose,
}: {
  entry: GlossEntry | null;
  onClose: () => void;
}) {
  if (!entry) return null;
  const found = entry.defs.length > 0;
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4">
      <div className="w-full max-w-3xl rounded-xl border border-border bg-bg-card shadow-2xl p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold">{entry.lemma}</span>
              {entry.word !== entry.lemma && (
                <span className="text-sm text-text-dim">tapped: {entry.word}</span>
              )}
              {entry.pos && (
                <span className="text-xs rounded bg-bg-elev px-1.5 py-0.5 text-text-dim">
                  {entry.pos}
                </span>
              )}
            </div>
            {found ? (
              <ul className="mt-1 text-text">
                {entry.defs.map((d, i) => (
                  <li key={i}>• {d}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-text-dim text-sm">
                No bundled entry yet — saved to your word bank for later.
              </p>
            )}
            {entry.particles && entry.particles.length > 0 && (
              <p className="mt-2 text-sm text-text-dim">
                {entry.particles.map((p, i) => (
                  <span key={i} className="mr-2">
                    <span className="text-accent">{p}</span> {labelParticle(p)}
                  </span>
                ))}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-text-dim hover:text-text text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        {found && (
          <p className="mt-2 text-xs text-accent">✓ saved to word bank</p>
        )}
      </div>
    </div>
  );
}
