import Link from "next/link";
import { TEXTS } from "@/lib/texts";
import { Dashboard } from "@/components/Dashboard";
import { LocalLibrary } from "@/components/LocalLibrary";

export default function Home() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Your reading</h1>
        <p className="text-text-dim">Read daily. Watch the line go up.</p>
        <div className="mt-4">
          <Dashboard />
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your imports</h2>
          <Link
            href="/import"
            className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-white"
          >
            + Import text
          </Link>
        </div>
        <LocalLibrary />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Library</h2>
        <div className="grid gap-3">
          {TEXTS.map((t) => (
            <Link
              key={t.id}
              href={`/read/${t.id}`}
              className="group flex items-center justify-between rounded-xl border border-border bg-bg-card p-4 transition hover:border-accent"
            >
              <div>
                <div className="font-medium group-hover:text-accent">{t.title}</div>
                <div className="text-sm text-text-dim">
                  TOPIK {t.level} · {t.wordCount} words · {t.questions.length} questions
                </div>
              </div>
              <LevelDot difficulty={t.difficulty} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function LevelDot({ difficulty }: { difficulty: number }) {
  // 0-100 difficulty → a small labelled meter
  return (
    <div className="flex flex-col items-end gap-1">
      <div className="h-1.5 w-24 rounded-full bg-bg-elev">
        <div
          className="h-1.5 rounded-full bg-accent"
          style={{ width: `${difficulty}%` }}
        />
      </div>
      <span className="text-xs text-text-dim tabular-nums">difficulty {difficulty}</span>
    </div>
  );
}
