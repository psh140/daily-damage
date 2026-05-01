import type { Question } from './types';

export const questions: Question[] = [
  {
    id: 1,
    text: '오늘 지각했어 안했어?',
    options: [
      { score: 0, text: '아 눈이 안 떠지던데.. 그냥 휴가 쓰고 늦음' },
      { score: 1, text: '늦게 일어나서 겁나 급하게 나왔어' },
      { score: 2, text: '완벽했지, 지각도 안 하고 준비도 다 하고 나왔어' },
    ],
  },
  {
    id: 2,
    text: '밥은 먹긴 했어?',
    options: [
      { score: 0, text: '귀찮아서 안 먹었어' },
      { score: 1, text: '대충 때웠어' },
      { score: 2, text: '나름 제때 다 챙겼어' },
    ],
  },
  {
    id: 3,
    text: '폰 좀 그만 봤어?',
    options: [
      { score: 0, text: '아 오늘 폰만 봤어, 손에서 내려놓은 적이 없어' },
      { score: 1, text: '좀 봤어, 적당히는 아니고' },
      { score: 2, text: '오늘 폰 별로 안 봤어, 나 좀 대단한듯' },
    ],
  },
  {
    id: 4,
    text: '오늘 운동은 했어?',
    options: [
      { score: 0, text: '아예 안 함' },
      { score: 1, text: '스트레칭 및 산책 정도' },
      { score: 2, text: '러닝이나 헬스 등 적극적인 활동' },
    ],
  },
  {
    id: 5,
    text: '오늘 한 거 있긴 해?',
    options: [
      { score: 0, text: '아무것도 안 했어, 그냥 존재만 했어' },
      { score: 1, text: '하긴 했는데 반도 못 한 것 같아' },
      { score: 2, text: '오 나 오늘 할 거 다 했어' },
    ],
  },
  {
    id: 6,
    text: '오늘 한심한 짓 했어?',
    options: [
      { score: 0, text: '아 적지 않겠어, 오늘 좀 많이 했어' },
      { score: 1, text: '한두 개는 있어, 딱히 자랑스럽진 않아' },
      { score: 2, text: '없어, 오늘 나 꽤 멀쩡했어' },
    ],
  },
  {
    id: 7,
    text: '지금 기분이 어때 솔직히?',
    options: [
      { score: 0, text: '최악이야, 오늘 그냥 통째로 버리고 싶어' },
      { score: 1, text: '별로야, 그렇다고 죽겠다는 건 아닌데' },
      { score: 2, text: '나쁘지 않아, 오늘 하루 나름 견딜만했어' },
    ],
  },
];
