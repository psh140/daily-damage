import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import type { Score, Tier } from '../types';
import { TIER_CONFIG } from '../types';

const SIGH_TEXTS = ['...', '휴...', '그래서 뭐.', '하...', '...'];

const COMMENTS: Record<Tier, string[]> = {
  perfect: [
    '오 진짜? 14점 만점에 이 점수? 솔직히 좀 의심스럽긴 한데... 뭐 어쨌든 대단하네.',
    '이게 가능해? 아니 진짜로. 오늘 완벽했던 거야? 그러면 내일은 어쩌려고.',
    '완벽한 하루를 보냈구나. 이런 날이 매일 오면 좋겠는데, 그러면 이 앱 쓸 일이 없겠지.',
  ],
  good: [
    '뭐, 나쁘진 않았네. 딱히 칭찬하고 싶진 않은데 인정은 해줄게.',
    '그래, 이 정도면 됐어. 모든 날이 완벽할 필요는 없잖아.',
    '나름 선방했네. 잘했다는 말은 아니고, 그냥 괜찮았다고.',
  ],
  meh: [
    '그래서 뭐. 존재는 했잖아. 그걸로 충분한 날도 있어.',
    '평범한 하루였네. 기억에 남을 것도 없고, 후회할 것도 없고. 그냥 하루.',
    '딱히 잘한 것도 없고 망한 것도 없어. 그냥 살았어. 그거면 돼.',
  ],
  bad: [
    '괜찮아? 아니 근데 진짜로? 오늘 좀 힘들었겠다. 그래도 하루 버텼잖아.',
    '오늘 좀 많이 무너졌네. 근데 뭐, 완전히 박살난 건 아니잖아. 내일 다시 해봐.',
    '이 정도면 좀 힘들었겠다. 위로해줄까, 말까. 일단 오늘은 그냥 쉬어.',
  ],
  broken: [
    '할 말이 없다. 근데 살아있잖아. 그게 어디야.',
    '오늘 완전 박살났네. 근데 이렇게 바닥을 찍으면 내일은 올라가는 일만 남은 거야.',
    '진짜 많이 힘들었구나. 그래도 이 앱 켤 여유는 있었잖아. 아직 괜찮은 거야.',
  ],
};

function pickComment(tier: Tier): string {
  const list = COMMENTS[tier];
  return list[Math.floor(Math.random() * list.length)];
}

function vibrate(pattern: number | number[]) {
  if ('vibrate' in navigator) navigator.vibrate(pattern);
}

interface Props {
  total: number;
  tier: Tier;
  answers: Score[];
  onReset: () => void;
}

export default function ResultCard({ total, tier, onReset }: Props) {
  const config = TIER_CONFIG[tier];
  const containerRef = useRef<HTMLDivElement>(null);
  const [comment] = useState(() => pickComment(tier));
  const [sighKey, setSighKey] = useState(0);
  const [showSigh, setShowSigh] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = () => el.classList.remove('shake', 'shake-intense');
    el.addEventListener('animationend', handler);
    return () => el.removeEventListener('animationend', handler);
  }, []);

  function triggerShake(intense = false) {
    const el = containerRef.current;
    if (!el) return;
    el.classList.remove('shake', 'shake-intense');
    void el.offsetWidth;
    el.classList.add(intense ? 'shake-intense' : 'shake');
  }

  function handleTap() {
    if (tier === 'perfect') {
      vibrate([100, 50, 200, 50, 300]);
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => confetti({ particleCount: 60, angle: 60,  spread: 55, origin: { x: 0, y: 0.7 } }), 250);
      setTimeout(() => confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1, y: 0.7 } }), 400);
    } else if (tier === 'good') {
      vibrate([100]);
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.65 }, colors: ['#16A34A', '#22C55E', '#86EFAC', '#FFFFFF'] });
    } else if (tier === 'meh') {
      vibrate([50]);
      triggerShake(false);
      setSighKey(k => k + 1);
      setShowSigh(true);
      setTimeout(() => setShowSigh(false), 3600);
    } else if (tier === 'bad') {
      vibrate([200, 50, 100]);
      triggerShake(false);
      const trash = confetti.shapeFromText({ text: '🗑️', scalar: 2 });
      confetti({ shapes: [trash], particleCount: 60, spread: 180, origin: { y: 0.5 }, startVelocity: 20, scalar: 2 });
    } else if (tier === 'broken') {
      vibrate([500, 100, 500]);
      triggerShake(true);
      const skull = confetti.shapeFromText({ text: '💀', scalar: 2 });
      [0.2, 0.5, 0.8].forEach((x, i) => {
        setTimeout(() => {
          confetti({ shapes: [skull], particleCount: 50, spread: 360, startVelocity: 28, scalar: 2, origin: { x, y: 0.5 } });
        }, i * 160);
      });
    }
  }

  return (
    <div
      ref={containerRef}
      onClick={handleTap}
      style={{
        minHeight: '100vh',
        background: config.bg,
        color: config.textColor,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '2.5rem 1.5rem',
        cursor: 'pointer',
        maxWidth: '480px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      <div className="slide-up">
        <div style={{ fontSize: '0.85rem', opacity: 0.55, marginBottom: '0.4rem' }}>
          {config.range}
        </div>

        <div style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '1.2rem', lineHeight: 1.2 }}>
          {config.label}
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '2rem' }}>
          <span style={{ fontSize: '5rem', fontWeight: '900', color: config.accent, lineHeight: 1 }}>
            {total}
          </span>
          <span style={{ fontSize: '1.4rem', opacity: 0.4 }}>/ 14</span>
          {showSigh && (
            <span key={sighKey} className="sigh-text" style={{ color: config.mutedColor }}>
              {SIGH_TEXTS[sighKey % SIGH_TEXTS.length]}
            </span>
          )}
        </div>

        <div style={{
          background: config.subBg,
          borderRadius: '16px',
          padding: '1.25rem',
          marginBottom: '2rem',
        }}>
          <p style={{ fontSize: '0.95rem', lineHeight: '1.75' }}>
            {comment}
          </p>
        </div>

        <div style={{ textAlign: 'center', opacity: 0.35, fontSize: '0.82rem', marginBottom: '1.75rem' }}>
          탭하면 반응함
        </div>

        <button
          onClick={e => { e.stopPropagation(); onReset(); }}
          style={{
            width: '100%',
            padding: '1rem',
            border: `2px solid ${config.accent}`,
            borderRadius: '14px',
            background: 'transparent',
            color: config.accent,
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          다시 해볼게
        </button>
      </div>
    </div>
  );
}
