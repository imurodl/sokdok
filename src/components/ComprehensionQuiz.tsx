"use client";

import { useState } from "react";
import type { Question } from "@/lib/types";

export function ComprehensionQuiz({
  questions,
  onDone,
}: {
  questions: Question[];
  onDone: (comprehension: number) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = questions.every((q) => answers[q.id] != null);
  const correct = questions.filter((q) => answers[q.id] === q.answerIndex).length;
  const score = questions.length ? correct / questions.length : 1;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Comprehension check</h2>
      {questions.map((q, qi) => (
        <div key={q.id} className="space-y-2">
          <p className="font-medium">
            {qi + 1}. {q.prompt}
          </p>
          <div className="grid gap-2">
            {q.choices.map((c, ci) => {
              const chosen = answers[q.id] === ci;
              const reveal = submitted;
              const isAnswer = ci === q.answerIndex;
              const cls = [
                "text-left rounded-lg border px-3 py-2 transition",
                chosen ? "border-accent bg-accent/10" : "border-border",
                reveal && isAnswer ? "border-good bg-good/10" : "",
                reveal && chosen && !isAnswer ? "border-bad bg-bad/10" : "",
              ].join(" ");
              return (
                <button
                  key={ci}
                  disabled={submitted}
                  className={cls}
                  onClick={() => setAnswers((a) => ({ ...a, [q.id]: ci }))}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button
          disabled={!allAnswered}
          onClick={() => setSubmitted(true)}
          className="rounded-lg bg-accent px-4 py-2 font-medium text-white disabled:opacity-40"
        >
          Check answers
        </button>
      ) : (
        <div className="flex items-center gap-4">
          <span className="text-lg">
            {correct} / {questions.length} correct ({Math.round(score * 100)}%)
          </span>
          <button
            onClick={() => onDone(score)}
            className="rounded-lg bg-accent px-4 py-2 font-medium text-white"
          >
            See results →
          </button>
        </div>
      )}
    </div>
  );
}
