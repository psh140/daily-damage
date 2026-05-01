import type { Question, Score } from '../types';

interface Props {
  question: Question;
  index: number;
  total: number;
  onAnswer: (score: Score) => void;
}

export default function QuestionCard({ question, index, total, onAnswer }: Props) {
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
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ color: '#9CA3AF', fontSize: '0.85rem', marginBottom: '0.6rem' }}>
          {index + 1} / {total}
        </div>
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {question.options.map((option, i) => (
          <button
            key={i}
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
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#374151';
              e.currentTarget.style.background = '#F3F4F6';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#E5E7EB';
              e.currentTarget.style.background = '#FAFAFA';
            }}
            onTouchStart={e => {
              e.currentTarget.style.borderColor = '#374151';
              e.currentTarget.style.background = '#F3F4F6';
            }}
            onTouchEnd={e => {
              e.currentTarget.style.borderColor = '#E5E7EB';
              e.currentTarget.style.background = '#FAFAFA';
            }}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}
