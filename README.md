# 속독 Sokdok — read Korean faster

A Korean **reading gym**. Turns "read Korean faster" into a measured, trainable,
gamified loop: read leveled texts, measure your WPM + comprehension, re-read
against the clock (Timed Repeated Reading), bank the words you don't know, and
drill them for instant recognition. **"Strava for Korean reading."**

Built for Max first (TOPIK 4, reads slowly), then to grow into a full product.

## Why

Slow reading at intermediate level isn't a decoding problem or a "speed-reading
technique" problem — it's an **automaticity + exposure** problem. The only proven
fixes are Extensive Reading + Timed Repeated Reading + Reading-While-Listening +
sight-word automaticity. No Korean app measures or trains reading *speed*, and
none bridges the graded→native content cliff. That's the gap.

Full research, product spec, and roadmap: **[`docs/`](./docs/)**
- [Research index](./docs/research/00-index.md) · [Synthesis](./docs/research/07-synthesis.md)
- [Product spec](./docs/product-spec.md) · [Roadmap](./docs/roadmap.md)

## Status — Phase 0 (personal core loop)

Working end-to-end today:
- **Library** of leveled seed texts + a **progress dashboard** (WPM/ERR trend, streak, words-read).
- **Reading view**: tap-to-gloss (offline starter dictionary + particle stripping), honest **engaged-time WPM** timer (auto-pauses on blur/idle).
- **Timed Repeated Reading**: re-read the same passage, watch WPM climb pass over pass.
- **Comprehension check** → **Effective Reading Rate** (WPM × comprehension).
- **Word bank**: tapped words captured with context.
- **Speed-recognition drill**: fast meaning recognition (automaticity), tracks reaction time.

Persistence is `localStorage` for now (Phase 3 moves to Postgres/Prisma).

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind 4 · pnpm. Deploys to Vercel;
heavier services (Kiwi tokenizer, TTS + forced alignment, content ingest) run on
`oci` per the roadmap.

## Develop

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # production build + typecheck
```

## What's next

See [roadmap.md](./docs/roadmap.md). Immediate: real tokenizer (Kiwi) + KRDict
gloss, difficulty/leveling engine, import pipeline, then RWL, then multi-tenant SaaS.
