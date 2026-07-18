"use client";

import { useMemo } from "react";
import { tokenize } from "@/lib/korean";

export function TextReader({
  body,
  onTapWord,
  activeKey,
  savedLemmas,
  lemmaOf,
}: {
  body: string;
  onTapWord: (word: string, context: string, key: string, offset: number) => void;
  activeKey?: string | null;
  savedLemmas?: Set<string>;
  lemmaOf?: (word: string) => string;
}) {
  const paragraphs = useMemo(
    () =>
      body
        .split(/\n\s*\n/)
        .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
        .filter(Boolean),
    [body],
  );

  return (
    <div className="reading font-[family-name:var(--font-reading)]">
      {paragraphs.map((para, pi) => {
        const tokens = tokenize(para);
        return (
          <p key={pi} className="mb-5">
            {tokens.map((t) => {
              if (!t.tappable) return <span key={t.key}>{t.text}</span>;
              const saved =
                savedLemmas && lemmaOf ? savedLemmas.has(lemmaOf(t.word)) : false;
              const cls = [
                "tok",
                activeKey === `${pi}:${t.key}` ? "tok-active" : "",
                saved ? "tok-saved" : "",
              ]
                .filter(Boolean)
                .join(" ");
              return (
                <span
                  key={t.key}
                  className={cls}
                  onClick={() => onTapWord(t.word, para, `${pi}:${t.key}`, t.start)}
                >
                  {t.text}
                </span>
              );
            })}
          </p>
        );
      })}
    </div>
  );
}
