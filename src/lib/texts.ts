import type { Text, TopikLevel } from "./types";
import { countWords, countChars } from "./korean";

interface RawText {
  id: string;
  title: string;
  source: string;
  level: TopikLevel;
  difficulty: number;
  body: string;
  questions: Text["questions"];
}

// Phase 0 seed content. Short, leveled, natural Korean with comprehension checks.
// Phase 1 replaces this with the auto-leveled library + import pipeline + news ingest.
const RAW: RawText[] = [
  {
    id: "coffee-morning",
    title: "아침 커피",
    source: "Sokdok seed",
    level: 2,
    difficulty: 28,
    body: `저는 아침마다 커피를 마셔요. 커피가 없으면 하루를 시작하기 어려워요.
집 근처에 작은 카페가 하나 있어요. 그 카페의 커피가 정말 맛있어요.
주말에는 친구들과 같이 그 카페에 가요. 커피를 마시면서 이야기를 해요.`,
    questions: [
      {
        id: "q1",
        prompt: "글쓴이는 언제 커피를 마셔요?",
        choices: ["매일 아침", "주말에만", "저녁에", "회사에서만"],
        answerIndex: 0,
      },
      {
        id: "q2",
        prompt: "카페는 어디에 있어요?",
        choices: ["학교 안에", "집 근처에", "회사 옆에", "역 앞에"],
        answerIndex: 1,
      },
    ],
  },
  {
    id: "reading-fast",
    title: "빨리 읽고 싶어요",
    source: "Sokdok seed",
    level: 3,
    difficulty: 44,
    body: `한국어를 공부한 지 몇 년이 됐지만 아직도 읽는 속도가 느려요.
단어를 다 아는데도 한 글자씩 천천히 읽게 돼요. 그래서 책 한 권을 다 읽으려면 시간이 오래 걸려요.
선생님은 매일 조금씩 읽는 연습을 하라고 하셨어요. 쉬운 글을 많이 읽으면 속도가 자연스럽게 는다고 해요.
그래서 저는 오늘부터 하루에 십오 분씩 읽기로 했어요.`,
    questions: [
      {
        id: "q1",
        prompt: "글쓴이의 문제는 무엇이에요?",
        choices: [
          "단어를 몰라요",
          "읽는 속도가 느려요",
          "책이 없어요",
          "시간이 많아요",
        ],
        answerIndex: 1,
      },
      {
        id: "q2",
        prompt: "선생님은 무엇을 하라고 했어요?",
        choices: [
          "매일 조금씩 읽기",
          "단어를 외우기",
          "시험을 보기",
          "영화를 보기",
        ],
        answerIndex: 0,
      },
      {
        id: "q3",
        prompt: "글쓴이는 하루에 얼마나 읽기로 했어요?",
        choices: ["오 분", "십 분", "십오 분", "한 시간"],
        answerIndex: 2,
      },
    ],
  },
  {
    id: "weather-autumn",
    title: "가을 날씨",
    source: "Sokdok seed",
    level: 2,
    difficulty: 32,
    body: `요즘 날씨가 정말 좋아요. 아침저녁으로는 조금 쌀쌀하지만 낮에는 따뜻해요.
가을이 되면 하늘이 높고 파래요. 그래서 저는 가을을 제일 좋아해요.
주말에 가족과 함께 공원에 가서 산책을 할 거예요. 단풍이 아주 예쁠 것 같아요.`,
    questions: [
      {
        id: "q1",
        prompt: "글쓴이가 제일 좋아하는 계절은 언제예요?",
        choices: ["봄", "여름", "가을", "겨울"],
        answerIndex: 2,
      },
      {
        id: "q2",
        prompt: "주말에 무엇을 할 거예요?",
        choices: [
          "집에서 쉴 거예요",
          "공원에서 산책할 거예요",
          "카페에 갈 거예요",
          "영화를 볼 거예요",
        ],
        answerIndex: 1,
      },
    ],
  },
  {
    id: "habit-reading",
    title: "읽기는 습관이다",
    source: "Sokdok seed",
    level: 4,
    difficulty: 58,
    body: `읽기 실력은 하루아침에 늘지 않는다. 중요한 것은 매일 꾸준히 읽는 습관을 만드는 것이다.
많은 사람들이 어려운 책을 붙잡고 오래 고민하지만, 사실은 쉬운 글을 빠르게 많이 읽는 편이 더 효과적이다.
같은 글을 여러 번 반복해서 읽으면 익숙한 단어와 표현이 눈에 자동으로 들어오게 된다. 그러면 읽는 속도가 눈에 띄게 빨라진다.
결국 읽기 속도를 결정하는 것은 특별한 기술이 아니라, 그동안 쌓아 온 읽기의 양이다.`,
    questions: [
      {
        id: "q1",
        prompt: "글쓴이는 무엇이 더 효과적이라고 해요?",
        choices: [
          "어려운 책을 오래 읽기",
          "쉬운 글을 빠르게 많이 읽기",
          "단어만 외우기",
          "천천히 한 번만 읽기",
        ],
        answerIndex: 1,
      },
      {
        id: "q2",
        prompt: "같은 글을 반복해서 읽으면 어떻게 돼요?",
        choices: [
          "지루해져요",
          "속도가 느려져요",
          "속도가 빨라져요",
          "단어를 잊어버려요",
        ],
        answerIndex: 2,
      },
      {
        id: "q3",
        prompt: "읽기 속도를 결정하는 것은 무엇이에요?",
        choices: [
          "특별한 기술",
          "비싼 책",
          "쌓아 온 읽기의 양",
          "선생님의 도움",
        ],
        answerIndex: 2,
      },
    ],
  },
];

export const TEXTS: Text[] = RAW.map((t) => ({
  ...t,
  wordCount: countWords(t.body),
  charCount: countChars(t.body),
}));

export function getText(id: string): Text | undefined {
  return TEXTS.find((t) => t.id === id);
}
