# 05 — Build landscape: content, NLP, TTS, dictionaries, forkable apps

> Research question: What concrete resources exist to build a Korean reading-fluency app?

## 1. Content sources

### Public-domain / government text

| Resource | Provides | License | Link |
|---|---|---|---|
| **Korean Wikisource** | Classical + modern public-domain texts. XML dumps twice monthly. | CC-BY / PD (author-dependent) | <https://ko.wikisource.org/> |
| **National Library of Korea Open APIs** | 소장자료 API (books, old docs, newspapers); filter `licYn=N` for free full-text. LOD in TTL/RDF/JSON-LD. | KOGL Type 1 / CC0; free API key, 50k req/day | <https://www.nl.go.kr/NL/contents/N31101010000.do> |
| **KORCIS (한국고문헌종합목록)** | Korean rare/classical texts via Open API. | Variable (classical → PD) | <https://www.nl.go.kr/korcis/openAPI/contents.do> |

### Corpora (text mining)

| Resource | Size | License / access | Link |
|---|---|---|---|
| **모두의 말뭉치 (NIKL Modu)** | 신문 3.5M, 웹 2.1M, 형태분석 371k, 구어/문어 | Free but registration + approval; manual download | <https://corpus.korean.go.kr> |
| **AI Hub (NIA)** | 182 Korean datasets | Free but **domestic-restricted**; per-dataset license | <https://aihub.or.kr/> |
| **Open Korean Historical Corpus** | Diachronic PD texts | Freely redistributable | <https://arxiv.org/pdf/2510.24541> |

### Simple / graded news

| Resource | Type | License | Link |
|---|---|---|---|
| **Easy Korean News / Todaii** | Simplified news app, 1,076 articles | Freemium; no public API | <https://apps.apple.com/us/app/easy-korean-news> |
| **Kids Donga (어린이동아)** | Children's simplified news | Free; no API | dong-a site |
| **NewsAPI.org (South Korea)** | Live SK news JSON (not simplified) | Free dev tier | <https://newsapi.org/s/south-korea-news-api> |

## 2. Korean NLP tooling

### Tokenizers / morphological analyzers

| Tool | Notes | License | Link |
|---|---|---|---|
| **Kiwi** (kiwipiepy) | Fast, modern, ergonomic; good default. | permissive | <https://github.com/bab2min/kiwipiepy> |
| **MeCab-ko** | CRF-based, Sejong-corpus trained, accurate stem/ending/particle segmentation. | Apache 2.0 / GPL | `pip install mecab-ko` |
| **KoNLPy** | Python wrapper over Hannanum/Kkma/Komoran/MeCab/Okt. | MIT | <https://konlpy.org/> |
| **Okt** | Good for informal/social text. | MIT | via KoNLPy |

> Korean word-segmentation (eojeol/particle splitting) is non-trivial and **required** for tap-to-gloss + per-word tracking. Kiwi or MeCab-ko is the backbone.

### Difficulty / readability

- No mature open-source Korean readability model. Build a simple score from **word-frequency percentile + sentence length + unknown-word ratio**, mapped to TOPIK bands.
- TOPIK level framework as the reference scale: <https://www.topiklab.com/en/topik-scoring/>

### Frequency / vocabulary lists

| Resource | Content | License | Link |
|---|---|---|---|
| **TOPIK 6k list** | 6,000 words graded A/B/C (NIKL 2003) | reference | <https://www.topikguide.com/korean-frequency-list-top-6000-words/> |
| **kdict.org** | KO-EN dict w/ TOPIK tags (CC-KEDICT) | **CC-BY-SA 3.0** | <http://www.kdict.org/> |
| **combined_korean_vocabulary_list** | NIKL 2003 + TOPIK 2015 merged → TSV | derived | <https://github.com/julienshim/combined_korean_vocabulary_list> |

## 3. TTS + word-level timestamps (for RWL / karaoke)

| Engine | Korean | Word timestamps | License / cost | Link |
|---|---|---|---|---|
| **Google Cloud TTS** | ✅ | ✅ via SSML `<mark>` | paid/char | Google Cloud |
| **Azure TTS** | ✅ | ⚠ SSML marks / post-process | paid/char | Azure |
| **Naver Clova** | ✅ | ⚠ not documented | commercial | ncloud |
| **ElevenLabs** | ✅ | ❌ char-level only | freemium | <https://elevenlabs.io/> |
| **Coqui XTTS-v2** | ✅ | ⚠ align post-hoc | **CPML — non-commercial weights** | <https://huggingface.co/coqui/XTTS-v2> |

**Forced alignment (post-TTS word timing):**

- **Montreal Forced Aligner (MFA)** — Korean models available, <15ms error benchmark; Kaldi-based. <https://montreal-forced-aligner.readthedocs.io/>
- **OpenAI Whisper** — Korean STT with word-level timing. MIT. <https://github.com/openai/whisper>

**Recommended RWL pipeline:** Google/Azure TTS (word marks) → fall back to MFA alignment where marks unavailable → store per-word `[startMs, endMs]` for karaoke highlight.

## 4. Dictionary / gloss APIs

| API | Source | License | Limits | Link |
|---|---|---|---|---|
| **KRDict (한국어기초사전)** | NIKL Basic Korean Dict, KO-EN | **CC-BY-SA 2.0**, commercial OK | free, 50k/day | <https://krdict.korean.go.kr/eng/openApi/openApiInfo> |
| **표준국어대사전** | Standard Korean Dict | — | free (reg) | <https://stdict.korean.go.kr/openapi/openApiInfo.do> |
| **우리말샘** | Open Korean Dict | — | free | <https://opendict.korean.go.kr/service/openApiInfo> |
| **krdict.py** | Python wrapper | — | needs key | <https://pypi.org/project/krdict.py/> |

Offline embed data: **CC-KEDICT** (CC-BY-SA 3.0), Wiktionary Korean.

## 5. Forkable / studyable open-source reading apps

| Platform | Korean | License | Notes | Link |
|---|---|---|---|---|
| **Lute v3** | ✅ (needs MeCab) | open | Python/Flask, actively maintained. Comprehension tool — **no speed/timing concept**. | <https://github.com/LuteOrg/lute-v3> |
| **LWT (Learning With Texts)** | ✅ | open | PHP, older; original of the genre. | <https://github.com/HugoFara/lwt> |
| **Yomitan** (ex-Yomichan) | ✅ (Korean fork) | GPL-like | Popup dict + Anki mining. | <https://github.com/Lyroxide/yomichan-korean> |
| **Migaku** | ✅ | freemium | Extension + app + SRS + TTS. | <https://migaku.com/learn-korean> |

> **Decision:** do NOT fork Lute/LWT — they are comprehension readers with no notion of WPM, timing, or repeated-reading drills, which is Sokdok's entire differentiator. Borrow ideas (tap-to-gloss, term status), build the loop natively.

## Recommended stack for Sokdok

- **Tokenizer:** Kiwi (with MeCab-ko fallback).
- **Dictionary:** KRDict Open API (free, CC-BY-SA, commercial OK).
- **Vocab/difficulty:** TOPIK 6k list + kdict.org data → custom readability score.
- **Content:** Easy Korean news + Wikisource to seed; user imports; webtoon/news leveling later.
- **TTS + timing:** Google/Azure TTS → MFA alignment.
- **Popup/SRS:** build native (own word-status backend), study Yomitan for UX.
