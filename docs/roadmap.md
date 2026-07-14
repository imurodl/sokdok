# Sokdok — Roadmap

From personal dogfood tool → complete multi-tenant SaaS. Build posture: **personal-first, then grow** (validate the core loop on one user before building platform/social).

Legend: 🔨 build · 🎯 milestone · 📊 metric to watch

---

## Phase 0 — Personal core loop (dogfood) ← START HERE

**Goal:** Max is reading against Sokdok on `oci` within days, and the WPM line goes up.
No auth, single user, simplest infra. This proves the loop before anything else.

- 🔨 Next.js 16 + TS + Tailwind + shadcn scaffold, deploy to Vercel (preview) / run locally.
- 🔨 **Reading view** with client-side tokenization + tap-to-gloss (KRDict, cached).
- 🔨 Korean tokenizer wired (Kiwi via FastAPI on `oci`, or a Node/JS tokenizer for phase 0; results cached).
- 🔨 **WPM timer** (auto-pause on idle/blur) + word/char counting.
- 🔨 **Comprehension check** (2–3 questions; LLM-generated via Claude, cached) → **ERR** computed.
- 🔨 **Timed Repeated Reading** mode with live WPM + pass-over-pass delta chart. *(the signature feature — build early)*
- 🔨 **Word bank** capture + a basic **speed-recognition drill**.
- 🔨 Seed content: paste-your-own + a handful of Easy-Korean-news / Wikisource texts, hand-leveled.
- 🔨 Local Postgres or Neon free tier + Prisma; simple schema (texts, tokens, sessions, words).
- 🎯 **M0: End-to-end loop works** — pick → read → score → TRR → capture → drill → see WPM trend.
- 📊 Max's ERR trend over 2–3 weeks of daily use.

**Stack (phase 0):** Next.js on Vercel/local · Neon Postgres + Prisma · FastAPI+Kiwi on `oci` · KRDict · Claude for questions. No auth.

---

## Phase 1 — Make it a real reading habit (still personal, richer)

**Goal:** Sokdok is genuinely the tool Max reads in daily.

- 🔨 **Difficulty/leveling engine** (TOPIK band + Sokdok 0–100, personalized i+1). §7.2 of spec.
- 🔨 **Content library** with shelves, series, "for you" daily picks.
- 🔨 **Import pipeline:** paste / .txt / URL fetch → auto-tokenize + auto-level + auto-gloss.
- 🔨 **Progress dashboard:** ERR/WPM/comprehension trends, words-read total, streak, weekly report.
- 🔨 **FSRS** for word bank; chunk mining → chunk cards.
- 🔨 Automated **news ingest** job on `oci` (RSS → level → store).
- 🎯 **M1: Daily-driver** — Max reads ≥5×/week without touching other tools.
- 📊 Weekly words read (toward 200k/yr pace); comprehension stable as WPM rises.

---

## Phase 2 — Reading-While-Listening + polish

**Goal:** audio scaffolding + a product that feels finished for one user.

- 🔨 **RWL:** TTS generation (Google/Azure) → **forced alignment (MFA)** → word-level karaoke highlight. Audio to **Cloudflare R2** + CDN.
- 🔨 Playback speed control, listen-then-read / read-along modes.
- 🔨 **TOPIK mode:** timed sets, exam-format drills, ERR→TOPIK estimate.
- 🔨 Reading UX polish: focus mode, pacer, typography, dark mode, PWA + offline.
- 🎯 **M2: Feature-complete single-user product.**
- 📊 RWL sessions vs. silent; effect on listening + reading speed.

---

## Phase 3 — Multi-tenant SaaS

**Goal:** other people can sign up and use it.

- 🔨 **Auth.js** (email + Google + Kakao); per-user data isolation; migrate personal data.
- 🔨 Multi-tenant schema, rate limits, quotas.
- 🔨 **Billing** (Stripe/Lemon Squeezy): Free vs. Pro; paywall RWL/TOPIK/advanced analytics.
- 🔨 Onboarding + placement (quick reading test → starting level).
- 🔨 Cloudflare in front (WAF, caching, DNS) — likely `sokdok.app` / `sokdok.kr`.
- 🔨 Observability (Sentry), privacy-respecting analytics, admin/content tooling.
- 🎯 **M3: Public beta** — first external users, first paying user.
- 📊 Signups, activation (completed first loop), D7/D30, free→Pro conversion.

---

## Phase 4 — Content moat & scale

**Goal:** the graded→native bridge becomes the reason to stay.

- 🔨 **Leveled native content** at scale: news → essays → webtoon-style fiction, tagged by difficulty + slang density.
- 🔨 Content partnerships / licensing where needed; **browser extension** for read-anywhere (gloss + capture + send-to-Sokdok on any Korean page/webtoon).
- 🔨 **Native mobile app** (React Native/Expo) sharing API + core logic.
- 🔨 Light **social**: friend leaderboards, shared lists, passage challenges.
- 🔨 OCR import (screenshot → text).
- 🎯 **M4: The obvious choice** for intermediate Korean readers.
- 📊 % users crossing graded→native; retention; MRR.

---

## Phase 5 — Beyond Korean (optional)

- 🔨 Generalize the engine to a second script where the same mechanism applies — **Russian/Cyrillic** first (Max's own second use case), then others.
- 🔨 Per-language tokenizer + dictionary + leveling plug-ins; shared core loop.
- 🎯 **M5: Multi-language reading gym.**

---

## Immediate next actions (this session)

1. ✅ Project scaffolded, research + spec + roadmap written.
2. 🔨 Scaffold the Next.js app (`app/`).
3. 🔨 Build Phase 0 M0: the reading view + WPM timer + tap-to-gloss + TRR — the core loop, dogfoodable.
4. 🔨 Deploy to Vercel / run on `oci`.

## Guiding cadence
- Ship the **core loop** before platform, auth, payments, or social.
- Dogfood every phase — if Max doesn't read in it daily, fix that before adding features.
- Keep the engine **language-agnostic** even while shipping Korean-only.
