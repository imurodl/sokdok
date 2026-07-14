"""Sokdok NLP service — Korean tokenization + difficulty leveling.

Runs on `oci` (aarch64, Python 3.10). Wraps Kiwi (kiwipiepy) for real
morphological analysis: accurate word/morpheme boundaries, lemmas, and POS —
used at text-ingest time to produce tappable tokens and a difficulty level,
so the reading view and the leveling engine don't rely on the heuristic
whitespace tokenizer.

Endpoints:
  GET  /health          -> {ok, kiwi_version}
  POST /analyze {text}  -> tokens (eojeol + morphemes), sentences, counts
  POST /level   {text}  -> {topik, sokdok, factors}
"""
from __future__ import annotations

from fastapi import FastAPI
from pydantic import BaseModel
from kiwipiepy import Kiwi

app = FastAPI(title="Sokdok NLP", version="0.1.0")
kiwi = Kiwi()

# Content POS tags worth glossing / counting toward vocabulary load.
CONTENT_TAGS = {"NNG", "NNP", "NNB", "VV", "VA", "MAG", "MM", "XR", "NR", "SL"}
# Tags whose dictionary form takes a trailing 다 (verbs, adjectives).
DA_TAGS = {"VV", "VA", "VX", "XSV", "XSA"}


class TextIn(BaseModel):
    text: str


def lemma_of(form: str, tag: str) -> str:
    return form + "다" if tag in DA_TAGS else form


@app.get("/health")
def health():
    return {"ok": True, "kiwi_version": getattr(kiwi, "version", "unknown")}


@app.post("/analyze")
def analyze(inp: TextIn):
    text = inp.text
    sents = kiwi.split_into_sents(text, return_tokens=True)
    sentences = []
    total_morphs = 0
    content_morphs = 0
    for s in sents:
        toks = []
        for t in s.tokens:
            is_content = t.tag in CONTENT_TAGS
            total_morphs += 1
            if is_content:
                content_morphs += 1
            toks.append(
                {
                    "form": t.form,
                    "tag": t.tag,
                    "lemma": lemma_of(t.form, t.tag),
                    "start": t.start,
                    "len": t.len,
                    "content": is_content,
                }
            )
        sentences.append({"text": s.text, "start": s.start, "tokens": toks})

    eojeols = [w for w in text.split() if any("가" <= c <= "힣" for c in w)]
    chars = sum(1 for c in text if "가" <= c <= "힣")
    return {
        "wordCount": len(eojeols),
        "charCount": chars,
        "sentenceCount": len(sentences),
        "morphCount": total_morphs,
        "contentMorphCount": content_morphs,
        "sentences": sentences,
    }


@app.post("/level")
def level(inp: TextIn):
    """Heuristic difficulty until the TOPIK frequency list is wired in.

    Combines: mean sentence length (eojeol), mean eojeol length (chars),
    and lexical variety (unique content lemmas / content morphemes).
    Produces a 0-100 Sokdok score and a rough TOPIK band 1-6.
    """
    text = inp.text
    sents = kiwi.split_into_sents(text, return_tokens=True)
    n_sents = max(len(sents), 1)
    eojeols = [w for w in text.split() if w.strip()]
    n_eojeol = max(len(eojeols), 1)

    content_lemmas = []
    for s in sents:
        for t in s.tokens:
            if t.tag in CONTENT_TAGS:
                content_lemmas.append(lemma_of(t.form, t.tag))

    mean_sent_len = n_eojeol / n_sents  # eojeol per sentence
    mean_eojeol_chars = sum(len(w) for w in eojeols) / n_eojeol
    variety = (len(set(content_lemmas)) / max(len(content_lemmas), 1)) if content_lemmas else 0

    # Normalize each factor to ~0-1 then weight.
    f_sentlen = min(mean_sent_len / 18.0, 1.0)      # 18+ eojeol/sentence = hard
    f_wordlen = min((mean_eojeol_chars - 1.5) / 2.5, 1.0)  # longer words = harder
    f_variety = variety                              # more unique words = harder
    score01 = 0.45 * f_sentlen + 0.25 * max(f_wordlen, 0) + 0.30 * f_variety
    sokdok = round(max(0.0, min(score01, 1.0)) * 100)
    topik = min(6, max(1, 1 + sokdok // 17))

    return {
        "sokdok": sokdok,
        "topik": topik,
        "factors": {
            "meanSentenceLen": round(mean_sent_len, 2),
            "meanEojeolChars": round(mean_eojeol_chars, 2),
            "lexicalVariety": round(variety, 3),
            "uniqueContentLemmas": len(set(content_lemmas)),
        },
    }
