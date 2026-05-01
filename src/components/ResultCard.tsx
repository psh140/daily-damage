import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import type { Score, Tier } from '../types';
import { TIER_CONFIG } from '../types';

// meh 등급 탭 시 점수 옆에 잠깐 떴다 사라지는 한숨 텍스트
const SIGH_TEXTS = ['...', '휴...', '그래서 뭐.', '하...', '...'];

// 등급별 고정 결과 멘트 (각 3개 중 랜덤 1개 표시)
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

// 결과 진입 시 한 번만 호출 — 이후 탭해도 같은 멘트 유지
function pickComment(tier: Tier): string {
  const list = COMMENTS[tier];
  return list[Math.floor(Math.random() * list.length)];
}

// iOS Safari는 vibrate 미지원 — 체크 후 무시
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

  // 멘트는 컴포넌트 마운트 시 한 번만 결정 (탭해도 바뀌지 않음)
  const [comment] = useState(() => pickComment(tier));
  const pendingTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // sighKey: 탭할 때마다 증가 → key prop으로 전달해 애니메이션 재실행
  const [sighKey, setSighKey] = useState(0);
  const [showSigh, setShowSigh] = useState(false);

  // 애니메이션 끝나면 shake 클래스 제거 (연속 탭 시 재실행 가능하도록)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = () => el.classList.remove('shake', 'shake-intense');
    el.addEventListener('animationend', handler);
    return () => el.removeEventListener('animationend', handler);
  }, []);

  // DOM 직접 조작으로 shake 처리 — state로 하면 연속 탭 시 재실행이 안 됨
  // (클래스를 한 번 제거했다가 다시 추가해야 애니메이션이 재시작됨)
  function triggerShake(intense = false) {
    const el = containerRef.current;
    if (!el) return;
    el.classList.remove('shake', 'shake-intense');
    void el.offsetWidth; // 강제 reflow — 없으면 브라우저가 클래스 변경을 합쳐버림
    el.classList.add(intense ? 'shake-intense' : 'shake');
  }

  // 화면 탭 시 등급별로 다른 이펙트 실행
  function handleTap() {
    // 이전 파티클 및 대기 중인 타이머 모두 취소 후 새로 시작 — 누적 방지
    confetti.reset();
    pendingTimers.current.forEach(clearTimeout);
    pendingTimers.current = [];

    if (tier === 'perfect') {
      // 꽃가루 + 양쪽 축포 + 긴 진동
      vibrate([100, 50, 200, 50, 300]);
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      pendingTimers.current.push(
        setTimeout(() => confetti({ particleCount: 60, angle: 60,  spread: 55, origin: { x: 0, y: 0.7 } }), 250),
        setTimeout(() => confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1, y: 0.7 } }), 400),
      );

    } else if (tier === 'good') {
      // 초록 꽃가루 + 짧은 진동
      vibrate([100]);
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.65 }, colors: ['#16A34A', '#22C55E', '#86EFAC', '#FFFFFF'] });

    } else if (tier === 'meh') {
      // 화면 흔들림 + 한숨 텍스트 표시 + 짧은 진동
      vibrate([50]);
      triggerShake(false);
      setSighKey(k => k + 1);
      setShowSigh(true);
      pendingTimers.current.push(setTimeout(() => setShowSigh(false), 3600));

    } else if (tier === 'bad') {
      // 쓰레기통 이모지 파티클 + 중간 진동
      vibrate([200, 50, 100]);
      triggerShake(false);
      const trash = confetti.shapeFromText({ text: '🗑️', scalar: 2 });
      confetti({ shapes: [trash], particleCount: 60, spread: 180, origin: { y: 0.5 }, startVelocity: 20, scalar: 2 });

    } else if (tier === 'broken') {
      // 해골 이모지 3연속 폭발 + 강한 진동
      vibrate([500, 100, 500]);
      triggerShake(true);
      const skull = confetti.shapeFromText({ text: '💀', scalar: 2 });
      [0.2, 0.5, 0.8].forEach((x, i) => {
        pendingTimers.current.push(setTimeout(() => {
          confetti({ shapes: [skull], particleCount: 50, spread: 360, startVelocity: 28, scalar: 2, origin: { x, y: 0.5 } });
        }, i * 160));
      });
    }
  }

  return (
    // 전체 화면이 탭 영역 — 버튼 클릭은 e.stopPropagation()으로 이벤트 분리
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
        {/* 점수 범위 */}
        <div style={{ fontSize: '0.85rem', opacity: 0.55, marginBottom: '0.4rem' }}>
          {config.range}
        </div>

        {/* 등급명 */}
        <div style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '1.2rem', lineHeight: 1.2 }}>
          {config.label}
        </div>

        {/* 점수 표시 + meh 한숨 텍스트 (점수 옆에 인라인으로 표시) */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '2rem' }}>
          <span style={{ fontSize: '5rem', fontWeight: '900', color: config.accent, lineHeight: 1 }}>
            {total}
          </span>
          <span style={{ fontSize: '1.4rem', opacity: 0.4 }}>/ 14</span>
          {showSigh && (
            // key 변경으로 매 탭마다 애니메이션 새로 실행
            <span key={sighKey} className="sigh-text" style={{ color: config.mutedColor }}>
              {SIGH_TEXTS[sighKey % SIGH_TEXTS.length]}
            </span>
          )}
        </div>

        {/* 결과 멘트 박스 */}
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

        {/* 다시하기 버튼 — 탭 이벤트가 상위로 전파되지 않도록 stopPropagation */}
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
