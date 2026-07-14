import type { GlossEntry } from "./types";
import { stripParticles } from "./korean";

// Phase 0 bundled starter dictionary (high-frequency words + the vocabulary used
// in the seed texts). Enough for tap-to-gloss to be genuinely useful offline.
// Phase 1 swaps/augments this with the KRDict Open API + CC-KEDICT dataset.
export const DICT: Record<string, { defs: string[]; pos?: string }> = {
  // pronouns / basics
  저: { defs: ["I, me (humble)"], pos: "pron" },
  나: { defs: ["I, me"], pos: "pron" },
  너: { defs: ["you"], pos: "pron" },
  우리: { defs: ["we, our"], pos: "pron" },
  그: { defs: ["that; he"], pos: "det/pron" },
  이: { defs: ["this"], pos: "det" },
  것: { defs: ["thing"], pos: "noun" },
  거: { defs: ["thing (casual)"], pos: "noun" },
  수: { defs: ["ability, way (in ~할 수 있다)"], pos: "noun" },
  때: { defs: ["time, moment, when"], pos: "noun" },
  // time / daily
  오늘: { defs: ["today"], pos: "noun" },
  내일: { defs: ["tomorrow"], pos: "noun" },
  어제: { defs: ["yesterday"], pos: "noun" },
  아침: { defs: ["morning; breakfast"], pos: "noun" },
  저녁: { defs: ["evening; dinner"], pos: "noun" },
  시간: { defs: ["time, hour"], pos: "noun" },
  요즘: { defs: ["these days, lately"], pos: "noun" },
  날씨: { defs: ["weather"], pos: "noun" },
  // people / places
  사람: { defs: ["person"], pos: "noun" },
  친구: { defs: ["friend"], pos: "noun" },
  가족: { defs: ["family"], pos: "noun" },
  선생님: { defs: ["teacher"], pos: "noun" },
  학생: { defs: ["student"], pos: "noun" },
  집: { defs: ["house, home"], pos: "noun" },
  학교: { defs: ["school"], pos: "noun" },
  회사: { defs: ["company, office"], pos: "noun" },
  나라: { defs: ["country"], pos: "noun" },
  한국: { defs: ["Korea"], pos: "noun" },
  세계: { defs: ["world"], pos: "noun" },
  도시: { defs: ["city"], pos: "noun" },
  // common nouns
  말: { defs: ["words, speech, language"], pos: "noun" },
  일: { defs: ["work; thing; day"], pos: "noun" },
  책: { defs: ["book"], pos: "noun" },
  음식: { defs: ["food"], pos: "noun" },
  물: { defs: ["water"], pos: "noun" },
  커피: { defs: ["coffee"], pos: "noun" },
  영화: { defs: ["movie"], pos: "noun" },
  음악: { defs: ["music"], pos: "noun" },
  운동: { defs: ["exercise, sports"], pos: "noun" },
  공부: { defs: ["study"], pos: "noun" },
  생각: { defs: ["thought, idea"], pos: "noun" },
  문제: { defs: ["problem, question"], pos: "noun" },
  이야기: { defs: ["story, talk"], pos: "noun" },
  이유: { defs: ["reason"], pos: "noun" },
  방법: { defs: ["method, way"], pos: "noun" },
  마음: { defs: ["mind, heart"], pos: "noun" },
  기분: { defs: ["mood, feeling"], pos: "noun" },
  속도: { defs: ["speed"], pos: "noun" },
  독서: { defs: ["reading (books)"], pos: "noun" },
  단어: { defs: ["word, vocabulary"], pos: "noun" },
  글: { defs: ["writing, text"], pos: "noun" },
  뉴스: { defs: ["news"], pos: "noun" },
  // verbs (dictionary form / stem)
  하다: { defs: ["to do"], pos: "verb" },
  되다: { defs: ["to become; to work out"], pos: "verb" },
  있다: { defs: ["to exist, to have"], pos: "verb" },
  없다: { defs: ["to not exist, to lack"], pos: "verb" },
  가다: { defs: ["to go"], pos: "verb" },
  오다: { defs: ["to come"], pos: "verb" },
  보다: { defs: ["to see, to watch"], pos: "verb" },
  읽다: { defs: ["to read"], pos: "verb" },
  읽: { defs: ["read (stem of 읽다)"], pos: "verb" },
  쓰다: { defs: ["to write; to use"], pos: "verb" },
  먹다: { defs: ["to eat"], pos: "verb" },
  마시다: { defs: ["to drink"], pos: "verb" },
  자다: { defs: ["to sleep"], pos: "verb" },
  살다: { defs: ["to live"], pos: "verb" },
  알다: { defs: ["to know"], pos: "verb" },
  모르다: { defs: ["to not know"], pos: "verb" },
  좋아하다: { defs: ["to like"], pos: "verb" },
  생각하다: { defs: ["to think"], pos: "verb" },
  말하다: { defs: ["to speak, to say"], pos: "verb" },
  공부하다: { defs: ["to study"], pos: "verb" },
  시작하다: { defs: ["to start"], pos: "verb" },
  연습하다: { defs: ["to practice"], pos: "verb" },
  느끼다: { defs: ["to feel"], pos: "verb" },
  늘다: { defs: ["to increase, to improve"], pos: "verb" },
  // adjectives
  좋다: { defs: ["to be good"], pos: "adj" },
  나쁘다: { defs: ["to be bad"], pos: "adj" },
  크다: { defs: ["to be big"], pos: "adj" },
  작다: { defs: ["to be small"], pos: "adj" },
  많다: { defs: ["to be many/much"], pos: "adj" },
  적다: { defs: ["to be few/little"], pos: "adj" },
  빠르다: { defs: ["to be fast"], pos: "adj" },
  느리다: { defs: ["to be slow"], pos: "adj" },
  어렵다: { defs: ["to be difficult"], pos: "adj" },
  쉽다: { defs: ["to be easy"], pos: "adj" },
  재미있다: { defs: ["to be fun, interesting"], pos: "adj" },
  중요하다: { defs: ["to be important"], pos: "adj" },
  // adverbs / function
  아주: { defs: ["very"], pos: "adv" },
  너무: { defs: ["too, very"], pos: "adv" },
  정말: { defs: ["really"], pos: "adv" },
  많이: { defs: ["a lot, many"], pos: "adv" },
  조금: { defs: ["a little"], pos: "adv" },
  자주: { defs: ["often"], pos: "adv" },
  항상: { defs: ["always"], pos: "adv" },
  같이: { defs: ["together"], pos: "adv" },
  빨리: { defs: ["quickly, fast"], pos: "adv" },
  천천히: { defs: ["slowly"], pos: "adv" },
  그리고: { defs: ["and, and then"], pos: "conj" },
  그래서: { defs: ["so, therefore"], pos: "conj" },
  하지만: { defs: ["but, however"], pos: "conj" },
  그러나: { defs: ["but, however"], pos: "conj" },
  그런데: { defs: ["by the way; but"], pos: "conj" },
  왜냐하면: { defs: ["because"], pos: "conj" },
};

// Human-readable labels for stripped grammatical endings.
const PARTICLE_LABELS: Record<string, string> = {
  은: "topic marker", 는: "topic marker", 이: "subject marker", 가: "subject marker",
  을: "object marker", 를: "object marker", 에: "at/to (place/time)", 의: "possessive",
  도: "also/even", 만: "only", 와: "and/with", 과: "and/with", 로: "by/to", 으로: "by/to",
  에서: "from/at", 에게: "to (person)", 께서: "subject (honorific)", 부터: "from",
  까지: "until", 처럼: "like", 보다: "than", 하고: "and/with", 라고: "quotative",
  요: "polite ending", 어요: "polite ending", 아요: "polite ending", 해요: "polite (하다)",
  습니다: "formal ending", ㅂ니다: "formal ending", 는데: "background/contrast",
  지만: "but", 니까: "because/since", 으니까: "because/since", 아서: "and so", 어서: "and so",
  해서: "and so (하다)", 면서: "while",
};

export function labelParticle(p: string): string {
  return PARTICLE_LABELS[p] ?? "ending";
}

/** Look up a surface token: direct hit, else strip particles/endings and retry. */
export function glossBundled(surface: string): GlossEntry {
  const word = surface.trim();
  const direct = DICT[word];
  if (direct) {
    return { word, lemma: word, defs: direct.defs, pos: direct.pos, source: "bundled" };
  }
  const { stem, stripped } = stripParticles(word);
  // try stem, then stem + 다 (verb/adj dictionary form)
  const stemHit = DICT[stem] ?? DICT[stem + "다"];
  const lemma = DICT[stem] ? stem : DICT[stem + "다"] ? stem + "다" : stem;
  if (stemHit) {
    return {
      word,
      lemma,
      defs: stemHit.defs,
      pos: stemHit.pos,
      particles: stripped.length ? stripped : undefined,
      source: "bundled",
    };
  }
  return {
    word,
    lemma: stem || word,
    defs: [],
    particles: stripped.length ? stripped : undefined,
    source: "none",
  };
}
