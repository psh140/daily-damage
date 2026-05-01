export type Score = 0 | 1 | 2;
export type Tier = 'perfect' | 'good' | 'meh' | 'bad' | 'broken';

export interface QuestionOption {
  score: Score;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  options: QuestionOption[];
}

export function getTier(total: number): Tier {
  if (total >= 13) return 'perfect';
  if (total >= 8) return 'good';
  if (total >= 5) return 'meh';
  if (total >= 2) return 'bad';
  return 'broken';
}

export const TIER_CONFIG: Record<Tier, {
  label: string;
  range: string;
  bg: string;
  textColor: string;
  accent: string;
  subBg: string;
  mutedColor: string;
}> = {
  perfect: {
    label: '인생 핵선방',
    range: '13~14점',
    bg: '#FFFBEB',
    textColor: '#92400E',
    accent: '#F59E0B',
    subBg: '#FEF3C7',
    mutedColor: '#B45309',
  },
  good: {
    label: '나름 선방',
    range: '8~12점',
    bg: '#F0FDF4',
    textColor: '#14532D',
    accent: '#16A34A',
    subBg: '#DCFCE7',
    mutedColor: '#15803D',
  },
  meh: {
    label: '그냥 그랬어',
    range: '5~7점',
    bg: '#F3F4F6',
    textColor: '#4B5563',
    accent: '#9CA3AF',
    subBg: '#E5E7EB',
    mutedColor: '#6B7280',
  },
  bad: {
    label: '좀 망했어',
    range: '2~4점',
    bg: '#431407',
    textColor: '#FED7AA',
    accent: '#EA580C',
    subBg: '#7C2D12',
    mutedColor: '#FB923C',
  },
  broken: {
    label: '오늘 완전 박살남',
    range: '0~1점',
    bg: '#1C0A0A',
    textColor: '#FCA5A5',
    accent: '#DC2626',
    subBg: '#3B0A0A',
    mutedColor: '#F87171',
  },
};
