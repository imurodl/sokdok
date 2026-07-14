# 07 — Synthesis & product thesis

## The problem, precisely stated

An intermediate Korean learner (TOPIK 3–5) reads slowly not because they can't decode Hangul (it's phonologically transparent — they can already sound out anything), and not because they lack a "speed-reading technique" (those are debunked). They read slowly because:

1. **Sight-vocabulary is not automatic** — frequent words still cost working memory to recognize.
2. **They don't chunk** — they process word-by-word instead of recognizing multi-word units.
3. **They mentally translate to L1** — shredding reading flow.
4. **Underneath all of it: too few engaged reading hours in the script.**

The same mechanism explains why a Latin-dominant reader is slower in Cyrillic despite "knowing" it: **reading speed is a function of cumulative engaged hours in that script** (print-exposure research, r ≈ 0.60 with fluency, independent of decoding/IQ). Cross-script transfer is weak, so each script must earn its own hours.

## What actually fixes it (evidence-ranked)

1. **Extensive Reading** (STRONG; *d* = 0.83–0.98 for speed; ~200k words/year threshold).
2. **Timed Repeated Reading** (STRONG; +52% in 9 weeks — proven on Korean learners).
3. **Reading-While-Listening** (MOD–STRONG; best scaffold when listening lags reading).
4. **Sight-word automaticity drills** (MODERATE; necessary foundation).
- **Do NOT build:** RSVP/Spritz (harms comprehension) or eye-span/anti-subvocalization "speed reading" (physiologically impossible). When speed-reading apps help at all, it's **metacognition** (a visible goal + a timer), not eye mechanics — which is exactly what a WPM chart + TRR timer provide honestly.

## The market gap

- The Korean market is full of **graded-reader + audio** apps and **TOPIK exam-prep** apps.
- **None measures or trains reading speed.** None bridges the **graded → native** cliff with leveled native content.
- General speed tools that do target speed (RSVP, Beeline Reader) are debunked/unproven.
- Adjacent proof: Du Chinese (4.9★, 43k reviews) and Satori Reader show real demand + $9–15/mo WTP for reading-specific tools.

## Product thesis

> **Sokdok is a Korean reading gym: it maximizes engaged, measured reading volume and turns "read faster" into a trackable, gamified training loop.** "Strava for Korean reading."

Three differentiators no competitor combines:
1. **Measures WPM + comprehension** per passage and shows the trend line climb.
2. **Timed Repeated Reading drill** — the best-proven speed intervention, which no Korean app implements.
3. **Automaticity training on YOUR unknown words** — speed-recognition drills, not just meaning flashcards.

Plus the long-term moat: **difficulty-tagged leveled content** from graded → semi-authentic → native (news → webtoons), filling the cliff.

## Design principles (derived from the research)

- **Volume is the lever** — the app's real job is to make engaged reading enjoyable, measured, and habitual. Everything serves time-on-text.
- **Measure speed AND comprehension** — never optimize speed alone ("fast but shallow" is a real failure mode).
- **Fight the translation habit** — tap-to-gloss (peek), not inline translation; nudge reading-for-gist.
- **Level everything** — i+1 comprehensible input; match text to the reader.
- **Honest mechanics only** — no eye-span gimmicks; the timer and the chart are the intervention.
- **Script-agnostic engine, Korean-first product** — generalizes to Cyrillic/others later, but each language earns its own hours.

## From research to build

The entire product reduces to one core loop:

**pick leveled text → read (tap-to-gloss) → score (WPM + comprehension) → timed repeated re-read (watch WPM climb) → capture unknown words → automaticity drill → track volume & streak.**

That loop *is* the product and the differentiator. Build posture: **personal-first** — build the loop for one user (Max) on `oci`, dogfood it, then grow into the full multi-tenant SaaS described in [product-spec.md](../product-spec.md) and [roadmap.md](../roadmap.md).
