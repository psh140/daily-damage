import { useState } from 'react';
import { getTier } from './types';
import type { Score } from './types';
import { questions } from './questions';
import QuestionCard from './components/QuestionCard';
import ResultCard from './components/ResultCard';

type Screen = 'start' | 'quiz' | 'result';

export default function App() {
  const [screen, setScreen] = useState<Screen>('start');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Score[]>([]);

  function handleAnswer(score: Score) {
    const next = [...answers, score];
    setAnswers(next);
    if (currentQ + 1 < questions.length) {
      setCurrentQ(q => q + 1);
    } else {
      setScreen('result');
    }
  }

  function handleReset() {
    setAnswers([]);
    setCurrentQ(0);
    setScreen('start');
  }

  if (screen === 'start') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem 1.5rem',
        background: '#fff',
        textAlign: 'center',
        maxWidth: '480px',
        margin: '0 auto',
        width: '100%',
      }}>
        <div className="fade-up">
          <div style={{ fontSize: '0.9rem', color: '#9CA3AF', marginBottom: '1rem', letterSpacing: '0.05em' }}>
            오늘 하루 점검
          </div>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: '800',
            color: '#111827',
            lineHeight: '1.35',
            marginBottom: '0.75rem',
          }}>
            오늘 내 인생<br />망함 점수 계산기
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.95rem', marginBottom: '3rem', lineHeight: '1.6' }}>
            7개 질문, 14점 만점.<br />솔직하게 답해봐.
          </p>
          <button
            onClick={() => setScreen('quiz')}
            style={{
              padding: '1rem 2.5rem',
              background: '#111827',
              color: '#fff',
              border: 'none',
              borderRadius: '14px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            시작하기
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'quiz') {
    return (
      <QuestionCard
        question={questions[currentQ]}
        index={currentQ}
        total={questions.length}
        onAnswer={handleAnswer}
      />
    );
  }

  const total = answers.reduce<number>((sum, s) => sum + s, 0);
  const tier = getTier(total);

  return (
    <ResultCard
      total={total}
      tier={tier}
      answers={answers}
      onReset={handleReset}
    />
  );
}
