# Sokdok (속독) — Product Specification

> **Sokdok is a Korean reading gym.** It turns "read Korean faster" into a measured, trainable, gamified loop — maximizing engaged reading volume, tracking WPM + comprehension, and closing the gap between graded readers and native content.
>
> Tagline: **"Strava for Korean reading."**

This document specifies the **complete finished product**. Build sequencing lives in [roadmap.md](./roadmap.md); the evidence behind every design choice lives in [research/](./research/00-index.md).

---

## 1. Vision & principles

**Vision:** the default place an intermediate Korean learner goes to stop reading slowly — read every day, watch their speed climb, and graduate from graded texts to real webtoons and news.

**Design principles** (each traces to research):
1. **Volume is the lever.** Everything serves time-on-engaged-text. (research 03, 04)
2. **Measure speed AND comprehension.** Never optimize speed alone — "fast but shallow" is a real failure mode. (research 01, 03)
3. **Fight word-by-word translation.** Tap-to-peek gloss, not inline translation; nudge reading-for-gist. (research 01, 06)
4. **Level everything (i+1).** Match text difficulty to the reader. (research 03)
5. **Honest mechanics only.** No RSVP, no eye-span training — debunked. The timer + the chart *are* the intervention (metacognition). (research 03)
6. **Script-agnostic engine, Korean-first product.** Generalizes to Cyrillic/others later; each language earns its own hours. (research 04)

**Explicit non-goals:** RSVP/Spritz word-flashing; "read 1000 WPM" claims; eliminating subvocalization; being a full grammar course (we scaffold, TTMIK/textbooks teach); a social feed as the core.

---

## 2. Users

| Persona | Level | Goal | Key features |
|---|---|---|---|
| **Max (primary / dogfood)** | TOPIK 4 | Read faster for daily life & content | Core loop, TRR, import own text, WPM trend |
| **TOPIK climber** | 3–5 | Pass TOPIK II reading under time pressure | TOPIK mode, timed sets, leveled content |
| **K-culture reader** | 3–6 | Read webtoons/news natively | Leveled native content, graded→native bridge |
| **Maintainer** | 5–6+ | Keep fluency, expand vocab | Native content, automaticity SRS, streaks |

---

## 3. The core loop (the heart of the product)

Every reading session is one pass through this loop:

```
1. PICK      choose a leveled text (library, import, or daily pick)
2. READ      read it; tap any word/phrase for an instant gloss (peek, not translate)
3. SCORE     session yields WPM + a short comprehension check → logged
4. TRR       optional Timed Repeated Reading: re-read same passage 2–4× vs. the clock,
             WPM shown climbing live (the best-proven speed intervention)
5. CAPTURE   unknown/tapped words auto-saved to your word bank
6. DRILL     speed-recognition drill on due words (automaticity, not just meaning)
7. TRACK     volume (words read), streak, WPM trend, comprehension trend updated
```

This loop *is* the differentiator. Modules below expand each step.

---

## 4. Feature modules (complete product)

### 4.1 Reading engine
- **Tokenization:** Korean text segmented via Kiwi (eojeol + morpheme aware) so every word is tappable and countable. Handles particles, honorifics, compound nouns.
- **Tap-to-gloss:** tap a word → popup with lemma, POS, KRDict definition, TOPIK level tag, example. Tap-and-hold a phrase → phrase gloss. Never auto-translates the whole line.
- **Word status coloring** (LWT-style, opt-in): new / learning / known / ignored — subtle background tint, toggleable so it doesn't wreck flow.
- **Reading modes:** normal (silent), RWL (audio + karaoke highlight), TRR (timed).
- **Typography controls:** font size, line height, spacing, serif/sans, dark mode, focus mode (dim non-current paragraph). All research-safe (no RSVP).
- **Pacer (optional):** a subtle moving highlight guide the user can enable to set tempo — allowed because it's reader-controlled pacing, not word-flashing.

### 4.2 WPM + comprehension scoring
- **WPM:** timer runs during active reading (auto-pauses on blur/idle). WPM = words / minutes. Also track CPM (characters/min, 글자수) since Korean word counts vary. (See §7.1.)
- **Comprehension check:** 2–4 auto-or-authored questions per passage (MCQ + short cloze). Comprehension % gates whether a speed gain "counts" — a fast read with <70% comprehension is flagged, not celebrated.
- **Effective Reading Rate (ERR):** headline metric = WPM × comprehension%. This is what the trend chart tracks (prevents gaming speed by skimming).

### 4.3 Timed Repeated Reading (TRR) — signature feature
- Read the same passage N times (default 3) against a clock.
- Live WPM readout; after each pass, show the delta and a mini bar chart of pass 1→N.
- Research anchor: Chung & Nation 2006, +52% in 9 weeks. Gains transfer to new text.
- Comprehension check only on final pass (so speed isn't penalized by re-answering).
- "Graduate" a passage when WPM plateaus across two passes.

### 4.4 Reading-While-Listening (RWL)
- Native TTS audio synced to text with **word-level karaoke highlight**.
- Pipeline: Google/Azure TTS (word marks) → Montreal Forced Aligner fallback → store `[startMs,endMs]` per token.
- Adjustable playback speed (0.6×–1.4×). Best scaffold when listening lags reading (research 03).
- "Listen-then-read" and "read-along" sub-modes.

### 4.5 Word bank + automaticity SRS
- Every tapped/unknown word captured with source sentence (context matters — research 03).
- **Two review modes:**
  - *Meaning review* (standard SRS: recall the meaning).
  - *Speed-recognition drill* (the automaticity trainer): word flashes, user taps correct meaning fast; tracks reaction time, targets sub-second recognition. This is the sight-vocab automaticity lever.
- SRS scheduler: FSRS algorithm (modern, open) over words + optionally chunks/collocations.
- Chunk mining: frequent multi-word units the user tapped become chunk cards (chunking is the #1 efficiency predictor — research 01).

### 4.6 Content library + leveling
- **Difficulty engine:** every text scored to a TOPIK band (1–6) + a finer 100-pt "Sokdok level" from word-frequency percentile + sentence length + unknown-word ratio for *this* user. (See §7.2.)
- **Sources (phased):**
  - Seed: Easy Korean news, Wikisource public-domain, original graded micro-stories.
  - Grow: curated news feed (auto-leveled), user imports.
  - Moat: **leveled native content** — news → essays → webtoons — tagged by difficulty & slang density, filling the graded→native cliff (research 06).
- **Personalized "for you"** picks at i+1: mostly-known words, a few new — maximizing comprehensible input.
- **Series & shelves:** multi-part stories, difficulty ladders, themed collections (daily life, news, culture, business, webtoon-style fiction).

### 4.7 Import your own content
- Paste text, upload .txt/.epub, or URL fetch (readability-extract).
- Auto-tokenize, auto-level, auto-gloss. Optional TTS generation for RWL.
- OCR import (image/screenshot of webtoon/book → text) as a later add.

### 4.8 Progress & analytics
- **Dashboard:** ERR trend, WPM trend, comprehension trend, words-read total (toward 200k/year goal — research 03), streak, time-on-text, level progression.
- **Reading age / percentile** vs. native ~174 WPM benchmark and vs. own history.
- **Weekly report:** volume, speed delta, new words learned, chunks acquired.
- **Goals:** daily words/minutes target; the app defends the *engaged-volume* number.

### 4.9 Gamification & habit
- Streaks, daily goal ring (Du Chinese's proven habit driver — research 06).
- XP from engaged reading volume + drill accuracy (not raw speed, to avoid gaming).
- Milestones ("first 10k words", "beat native WPM on a level-3 text"), badges.
- Optional gentle notifications (research: 10–15 min daily beats weekly cramming).

### 4.10 TOPIK mode
- Timed reading sets in TOPIK II format (70 min / 50 q feel), passage-question drills.
- Speed-under-pressure training; maps user's ERR to likely TOPIK reading performance.
- Directly addresses the documented time-pressure failure (research 06).

### 4.11 Social / community (light, later)
- Leaderboards among friends (opt-in), shared reading lists, book-club "read this passage" challenges. Kept peripheral — not the core (principle).

### 4.12 Accounts, sync, offline
- Auth (email + Google/Kakao). Cross-device sync of word bank, progress, library.
- Offline reading + drills (PWA / mobile), sync on reconnect.

---

## 5. Platforms
- **Web app (PWA)** first — desktop + mobile browser, installable, offline-capable. (Fastest path; you live in the browser.)
- **Native mobile** (React Native / Expo) later, sharing the API + core logic.
- **Browser extension** (later) — read-anywhere: gloss + capture + "send to Sokdok" on any Korean webpage/webtoon.

---

## 6. Architecture (target / full product)

```
                 ┌─────────────────────────────────────────────┐
   Web PWA  ─────┤  Next.js (App Router) on Vercel               │
   Mobile   ─────┤   - UI, reading engine (client)               │
   Extension ────┤   - API routes / server actions               │
                 └───────────────┬───────────────────────────────┘
                                 │
              ┌──────────────────┼──────────────────────┐
              │                  │                        │
     ┌────────▼───────┐  ┌───────▼────────┐   ┌───────────▼──────────┐
     │ Postgres (Neon)│  │ NLP service     │   │ Media / jobs (oci)   │
     │  Prisma        │  │  (oci, FastAPI) │   │  - TTS generation     │
     │  users, texts, │  │  - Kiwi tokenize│   │  - forced alignment   │
     │  words, srs,   │  │  - readability  │   │  - content ingest     │
     │  sessions      │  │  - lemma/POS    │   │  - Cloudflare R2 audio│
     └────────────────┘  └────────┬────────┘   └──────────────────────┘
                                  │
                         ┌────────▼─────────┐
                         │ External APIs     │
                         │  KRDict (gloss)   │
                         │  Google/Azure TTS │
                         │  News/RSS feeds   │
                         └───────────────────┘
```

**Component decisions:**
- **Frontend/app:** Next.js 16 (App Router) + TypeScript + Tailwind + shadcn/ui, deployed on **Vercel**. Reading engine runs client-side for instant tap-to-gloss.
- **DB:** **Neon Postgres** + Prisma (you already run this in taklif/nikohnoma). Stores users, texts, tokens, word bank, SRS state, sessions, metrics.
- **NLP microservice:** small **FastAPI on `oci`** wrapping **Kiwi** (tokenize, lemma, POS) + readability scorer. Called at ingest time (not per-request in hot path). Results cached in Postgres.
- **Dictionary:** **KRDict Open API** (CC-BY-SA, free 50k/day), cached; offline CC-KEDICT fallback.
- **TTS + alignment:** batch jobs on `oci` (Google/Azure TTS → MFA) writing audio + timing JSON to **Cloudflare R2**; served via CDN.
- **Content ingest:** scheduled jobs on `oci` pull news/RSS, auto-tokenize + auto-level, store.
- **Auth:** Auth.js (NextAuth) — email + Google + Kakao.
- **Personal-first phase:** single-user, no auth, Next.js + local Postgres/SQLite or Neon free tier, NLP either in-process (Node port) or the same FastAPI on `oci`. See roadmap Phase 0.

---

## 7. Key algorithms

### 7.1 Reading rate
- `WPM = wordCount / activeMinutes`, where `wordCount` = eojeol count from Kiwi, `activeMinutes` excludes idle/blur time.
- Also compute `CPM` (characters/min) — more stable across texts for Korean.
- `ERR (Effective Reading Rate) = WPM × comprehension%` → the headline trend metric.
- Store per session; trend = rolling median over comparable difficulty levels (compare like-with-like).

### 7.2 Text difficulty / leveling
Composite score → TOPIK band (1–6) + 0–100 Sokdok level:
- **Lexical:** % of tokens outside TOPIK-A / high-frequency list; mean word-frequency percentile.
- **Syntactic:** mean sentence length (eojeol), clause depth proxy.
- **Personal overlay:** % unknown for *this* user (from word bank) → personalized i+1 targeting.
- Calibrate against the TOPIK 6k list + kdict tags; refine with user comprehension data over time.

### 7.3 SRS
- **FSRS** for meaning review; separate lightweight scheduler for speed-recognition (targets reaction-time, not just recall).
- Chunk cards scheduled alongside word cards.

### 7.4 "For you" recommendation
- Rank library by: closeness to user's i+1 band, topic affinity, freshness, and estimated comprehensible-input value (mostly-known + few-new). Surface 3–5 daily.

---

## 8. Monetization (full product)
- **Free tier:** core loop, limited daily texts, import own content, basic stats. (Volume matters, so never paywall *reading itself* into uselessness.)
- **Pro (~$9–12/mo, $79–89/yr):** unlimited leveled library, RWL audio, TRR analytics, full SRS + speed drills, TOPIK mode, offline, advanced analytics. (Matches Du Chinese/Satori WTP — research 06.)
- **Later:** content packs, B2B (schools/tutors), TOPIK-prep bundle.
- Personal-first phase is free / self-hosted; monetization switches on in the SaaS phase.

---

## 9. Non-functional requirements
- **Performance:** tap-to-gloss < 100ms (client-side index + cached dict); reading view smooth on M1 / mid mobile.
- **Offline:** PWA caches current texts, word bank, due drills.
- **i18n:** UI in English + Korean first; gloss language configurable (EN default). Engine language-neutral for future Cyrillic/other.
- **Accessibility:** proper contrast, font scaling, screen-reader-sane structure, keyboard nav; dyslexia-friendly font option.
- **Privacy:** user text imports are private by default; content licensing respected (only redistributable sources in the shared library).
- **Observability:** session metrics, error tracking (Sentry), basic analytics (privacy-respecting).

---

## 10. Success metrics
- **Primary (efficacy):** median ERR/WPM improvement per active user over 8 weeks (target: meaningful gain, echoing +52% TRR / ER effect sizes).
- **Engagement:** daily-active reading streak length; weekly words read (toward 200k/yr).
- **Comprehension held:** comprehension % stable or rising as WPM rises (no shallow-skimming drift).
- **Retention:** D7 / D30; % who cross from graded into native content (the cliff metric).
- **Business (SaaS phase):** free→Pro conversion, MRR, CAC/LTV.

---

## 11. Risks & mitigations
| Risk | Mitigation |
|---|---|
| Content licensing (native webtoons) | Start with PD + own + user-import + partnerships; only redistribute clearly-licensed content. |
| TTS/alignment cost & quality | Batch-generate, cache to R2; start RWL as Pro-only; MFA is free. |
| Korean tokenization edge cases | Kiwi + MeCab fallback; manual override for imports. |
| "Fast but shallow" gaming | ERR (speed×comprehension) as headline metric, not raw WPM. |
| Solo-dev scope | Personal-first; ship the core loop before platform/social. |
| Difficulty leveling accuracy | Calibrate on TOPIK lists; improve with real comprehension data (feedback loop). |

---

## 12. Open questions
- Exact source/identity of **쏙 / 말맛** (re-investigate with a pointer) — possible direct competitors to study.
- Comprehension-question generation: authored vs. LLM-generated (Claude) — likely LLM-generated + validated.
- Webtoon content: licensing vs. "bring-your-own via extension" as the pragmatic path.
