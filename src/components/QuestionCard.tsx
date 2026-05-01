import type { Question, Score } from '../types';

interface Props {
  question: Question;
  index: number;   // 0부터 시작하는 현재 질문 번호
  total: number;   // 전체 질문 수 (현재 7)
  onAnswer: (score: Score) => void;
}

export default function QuestionCard({ question, index, total, onAnswer }: Props) {
  // 진행 바 너비 계산 (현재 질문 기준, 1번 질문부터 꽉 찬 느낌 주기 위해 +1)
  const progress = ((index + 1) / total) * 100;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      background: '#fff',
      maxWidth: '480px',
      margin: '0 auto',
      width: '100%',
    }}>
      {/* 상단: 진행 표시 */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ color: '#9CA3AF', fontSize: '0.85rem', marginBottom: '0.6rem' }}>
          {index + 1} / {total}
        </div>
        {/* 진행 바 */}
        <div style={{ height: '3px', background: '#F3F4F6', borderRadius: '2px' }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: '#111827',
            borderRadius: '2px',
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>

      {/* 질문 텍스트 — key를 question.id로 줘서 질문 바뀔 때마다 fade-up 재실행 */}
      <h2
        key={question.id}
        className="fade-up"
        style={{
          fontSize: '1.45rem',
          fontWeight: '700',
          color: '#111827',
          marginBottom: '2rem',
          lineHeight: '1.45',
        }}
      >
        {question.text}
      </h2>

      {/* 선택지 버튼 목록 — 클릭하면 즉시 다음 질문으로 넘어감 (별도 확인 없음) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {question.options.map((option, i) => (
          <button
            key={`${question.id}-${i}`}
            className="option-btn"
            onClick={() => onAnswer(option.score)}
            style={{
              padding: '1rem 1.25rem',
              border: '2px solid #E5E7EB',
              borderRadius: '14px',
              background: '#FAFAFA',
              textAlign: 'left',
              fontSize: '0.97rem',
              color: '#374151',
              cursor: 'pointer',
              lineHeight: '1.55',
              transition: 'border-color 0.12s, background 0.12s',
              WebkitAppearance: 'none',
            }}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}
