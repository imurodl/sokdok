# 04 — Why a known-but-under-practiced script reads slowly

> Research question: Why is reading slower in a script you know but practice less (e.g. Cyrillic for a Latin-dominant reader)? Is speed mostly cumulative exposure hours?

## Headline: YES — exposure/reading volume is the dominant driver.

Not inherent script difficulty. The same principle explains both the Korean case and the Cyrillic-vs-Latin case: **reading speed in a script is a function of cumulative engaged hours in that script.**

## 1. Orthographic familiarity, exposure & automaticity

- **Consistency > script per se.** In matched bilinguals, the bottleneck is *visual orthographic processing automaticity*, not lexical familiarity.
  - <https://pmc.ncbi.nlm.nih.gov/articles/PMC8301906/>
- **Visual glyph confusion adds cost.** Serbian bi-scriptal readers show measurable Latin-vs-Cyrillic speed differences even when fluent in both (many Cyrillic letters resemble Latin ones → low-level perceptual confusion).
  - <https://psyjournals.ru/en/journals/exppsy/archive/2025_n1/Romic_Borojevic>
- **Automaticity is path-dependent** — more reading volume in a script → more words move into long-term orthographic storage → faster recognition.
- **Print exposure predicts speed.** Author Recognition Test (ART) research: cumulative reading exposure correlates ~**r = 0.60** with reading fluency, vocabulary, and word-recognition speed — **even after controlling for decoding skill, IQ, SES.**
  - <https://pmc.ncbi.nlm.nih.gov/articles/PMC4732519/>

## 2. Cross-script speed differences

Raw WPM isn't comparable across scripts (different information density). Brysbaert (2019) meta-analysis:

- English ~236 WPM, Spanish ~278, Chinese ~158, Arabic ~138, Hangul in the alphabetic range (~200–240 measured properly).
- **Adjusted for information density, scripts are roughly equivalent.**
- Differences come from **orthographic depth** (transparent orthographies decode faster), writing direction, and glyph complexity — not inherent script speed limits.
- Sources: <https://biblio.ugent.be/publication/8647789>, <https://link.springer.com/article/10.1007/s11145-022-10263-9>

## 3. Print exposure (Cunningham & Stanovich)

- The **Author Recognition Test** measures cumulative reading; validated (airport study: readers scored higher).
- Accounts for unique variance in vocabulary (~0.60), naming speed, spelling, word recognition, fluency — after controlling for IQ/decoding/SES.
- Benefits persist across the lifespan (reading builds an "efficiency reserve").
- **This is the single strongest empirical support for the "exposure/practice hours" hypothesis.**
- Sources: <https://pmc.ncbi.nlm.nih.gov/articles/PMC3022331/>, <https://pmc.ncbi.nlm.nih.gov/articles/PMC3275681/>

## 4. Cross-language reading transfer

- **Strong within a script family** (alphabetic→alphabetic, e.g. Latin→Cyrillic), **weak across dissimilar systems** (Latin→Chinese ≈ start from scratch).
- Transfer reliability depends on grapheme-phoneme mapping similarity; word-level orthographic knowledge transfers better than sub-lexical patterns.
- Sources: <https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3869981/>, <https://link.springer.com/article/10.1007/s11145-009-9221-7>

## 5. Practical implication: volume vs. deliberate practice

- Fluency interventions that work: **~30–60 min/day of engaged reading**; measurable gains in 4–6 weeks.
- **~4 rereadings** of a text is typically enough for fluency gains (overlearning helps sustain).
- **Volume dominates**, but must be *engaged* (high accuracy, active attention) — passive scanning doesn't build automaticity. "Volume with feedback beats volume without it."
- Natural ceiling: fluency plateaus (~150–175 WPM at high accuracy for many contexts) — it's a constrained skill.
- Sources: <https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10358931/>, <https://ila.onlinelibrary.wiley.com/doi/full/10.1002/trtr.70024>

## Conclusion

**Speed = engaged exposure hours in that script**, modulated (secondarily) by orthographic consistency and glyph confusability. A bilingual who reads 10h/week in Latin but 1h/week in Cyrillic will be far slower in Cyrillic — same brain, fewer hours.

## Design implications for Sokdok

- The engine is **script-agnostic** — the mechanism (tokenize → gloss → time → drill → measure engaged volume) generalizes to any language.
- But transfer across scripts is weak → **each language needs its own hours**. Ship Korean-first; keep the core language-neutral; add Russian/Cyrillic later.
- The product's real job: **make engaged volume enjoyable, measured, and habitual** — that is the entire lever.
