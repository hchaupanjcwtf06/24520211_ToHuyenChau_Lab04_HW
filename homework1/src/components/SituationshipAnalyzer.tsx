import { useReducer, useState, useEffect, useId, useMemo, useCallback } from 'react';
import type { EffortSignal } from '../types/situationship';
import { situationshipReducer } from '../reducers/situationshipReducer';
import { useCancelableMessagePing } from '../hooks/useCancelableMessagePing';
import { situationshipAudio } from '../audio/situationshipAudio';
import { AsymmetricRatioBar } from './AsymmetricRatioBar';
import styles from './SituationshipAnalyzer.module.css';

const INITIAL_SIGNALS: readonly EffortSignal[] = [
  { id: 'sig-1', actor: 'EM', description: 'Chủ động quan tâm, gửi tin nhắn mỗi sáng (100 lần)', timestamp: 1 },
  { id: 'sig-2', actor: 'AI_DO', description: 'Thả 1 icon vu vơ trên story', timestamp: 2 },
];

export function SituationshipAnalyzer() {
  const myTriesId = useId();
  const rivalTriesId = useId();

  // 1. Core State Machine với useReducer & Transition Guard (Slide 33)
  const [phase, dispatchPhase] = useReducer(situationshipReducer, 'DATING_NO_LOVE');
  const [myTries, setMyTries] = useState<number>(100);
  const [rivalTries, setRivalTries] = useState<number>(1);
  const [signals, setSignals] = useState<readonly EffortSignal[]>(INITIAL_SIGNALS);
  const [ghostingCountdown, setGhostingCountdown] = useState<number>(5);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [signalFilter, setSignalFilter] = useState<'ALL' | 'EM' | 'AI_DO'>('ALL');

  // Hook mô phỏng tin nhắn có khả năng Abort (Slide 33)
  const { status: pingStatus, sendPing, cancelPing } = useCancelableMessagePing();

  // 2. Pure Derived State: Asymmetric Effort & Red-Flag (Slide 33)
  const myImpact = useMemo(() => Math.round(myTries * 0.1 * 10) / 10, [myTries]);
  const rivalImpact = useMemo(() => Math.round(rivalTries * 50.0 * 10) / 10, [rivalTries]);
  const isRedFlag = phase === 'DATING_NO_LOVE' && myImpact < rivalImpact;

  // Pure Derived State: Lọc nhật ký tín hiệu trong render pass (Zero useEffect)
  const filteredSignals = useMemo(() => {
    if (signalFilter === 'ALL') {
      return signals;
    }
    return signals.filter(s => s.actor === signalFilter);
  }, [signals, signalFilter]);

  // 3. 'Seen Không Rep' Ghosting Countdown & Cleanup (Slide 34)
  useEffect(() => {
    if (phase !== 'DATING_NO_LOVE') {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setGhostingCountdown(prev => {
        if (prev <= 1) {
          window.clearInterval(intervalId);
          dispatchPhase({ type: 'TRIGGER_GHOSTED' });
          situationshipAudio.playExitChime();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [phase, myTries]);

  const handleToggleAudio = () => {
    setIsMuted(prev => {
      const next = !prev;
      situationshipAudio.setMuted(next);
      return next;
    });
  };

  const handleAddMyEffort = useCallback(() => {
    setMyTries(prev => prev + 10);
    setGhostingCountdown(5);
    sendPing();
    setSignals(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        actor: 'EM',
        description: 'Tiếp tục chủ động nhắn tin hồi hộp chờ đợi...',
        timestamp: Date.now(),
      },
    ]);
  }, [sendPing]);

  const handleAddRivalEffort = useCallback(() => {
    setRivalTries(prev => prev + 1);
    cancelPing();
    situationshipAudio.playRedFlagAlert();
    setSignals(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        actor: 'AI_DO',
        description: 'Ai đó chỉ cần xuất hiện mỉm cười một phần...',
        timestamp: Date.now(),
      },
    ]);
  }, [cancelPing]);

  const handleUnbind = useCallback(() => {
    cancelPing();
    dispatchPhase({ type: 'TRIGGER_GHOSTED' });
    situationshipAudio.playExitChime();
  }, [cancelPing]);

  // 4. WCAG 2.2 AA Keyboard Navigation Engine (e.code + Anti-repeat guard)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return; // Chặn spam phím liên tục của OS
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return; // Không chặn khi người dùng nhập dữ liệu form
      }

      if (e.code === 'KeyE') {
        handleAddMyEffort();
      } else if (e.code === 'KeyA') {
        handleAddRivalEffort();
      } else if (e.code === 'Escape' && phase !== 'GHOSTED_EXIT') {
        handleUnbind();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleAddMyEffort, handleAddRivalEffort, handleUnbind, phase]);

  const handleRollbackLastAction = () => {
    if (signals.length <= 1) return;
    const lastSignal = signals[signals.length - 1];

    if (lastSignal.actor === 'EM') {
      setMyTries(prev => Math.max(0, prev - 10));
    } else {
      setRivalTries(prev => Math.max(0, prev - 1));
    }

    setSignals(prev => prev.slice(0, -1));
  };

  const handleReset = () => {
    cancelPing();
    dispatchPhase({ type: 'RESET_TO_DATING' });
    setMyTries(100);
    setRivalTries(1);
    setGhostingCountdown(5);
    setSignals(INITIAL_SIGNALS);
    setSignalFilter('ALL');
  };

  return (
    <article className={styles.analyzerCard} aria-labelledby="fsm-analyzer-title">
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <span className={styles.tagline}>V-POP FINITE STATE MACHINE (WENDY THẢO)</span>
          <button
            type="button"
            onClick={handleToggleAudio}
            className={styles.audioToggleButton}
            aria-label={isMuted ? 'Bật âm thanh hiệu ứng' : 'Tắt âm thanh hiệu ứng'}
          >
            {isMuted ? '🔇 Bật Âm Thanh' : '🔊 Tắt Âm Thanh'}
          </button>
        </div>
        <h2 id="fsm-analyzer-title" className={styles.title}>
          &apos;Hẹn Hò Nhưng Không Yêu&apos; Situationship Analyzer
        </h2>
        <div className={styles.phaseIndicator}>
          Trạng thái hiện tại:{' '}
          <span className={`${styles.phaseBadge} ${styles[phase]}`}>
            {phase === 'FRIENDS' && 'Bạn Bè Thuần Túy'}
            {phase === 'DATING_NO_LOVE' && 'Mập Mờ (Hẹn Hò Không Yêu)'}
            {phase === 'OFFICIAL_LOVE' && 'Chính Thức Yêu Đương'}
            {phase === 'GHOSTED_EXIT' && 'Đã Rút Lui (Giải Phóng Bộ Nhớ)'}
          </span>
        </div>
      </header>

      {/* Screen-reader Live Status Announcement (Slide 33) */}
      <output className={styles.liveStatus} role="status" aria-live="polite">
        {isRedFlag
          ? `[CẢNH BÁO RED-FLAG] Điểm nỗ lực của bạn (${myImpact}) thua xa ai đó (${rivalImpact})! Tự động giải phóng bộ nhớ sau ${ghostingCountdown}s!`
          : phase === 'GHOSTED_EXIT'
          ? 'Đã tự giải thoát: Mối quan hệ mập mờ đã được Unbind & Thu gom rác (GC)!'
          : 'Trạng thái quan hệ đang ở mức ổn định.'}
      </output>

      {/* Huy hiệu tình trạng tín hiệu tin nhắn (AbortController - Slide 33) */}
      <div className={styles.pingStatusBadge} role="status">
        Tình trạng tin nhắn:{' '}
        <strong>
          {pingStatus === 'IDLE' && 'Chưa gửi'}
          {pingStatus === 'SENDING' && 'Đang gửi (Chờ xem có rep không)...'}
          {pingStatus === 'SEEN_NO_REP' && 'Đã Xem (Seen) Nhưng Không Rep!'}
          {pingStatus === 'ABORTED' && 'Đã Hủy Request (AbortController)'}
        </strong>
      </div>

      {phase !== 'GHOSTED_EXIT' ? (
        <>
          {/* Biểu đồ đo tỷ lệ nỗ lực đôi bên */}
          <AsymmetricRatioBar
            myImpact={myImpact}
            rivalImpact={rivalImpact}
            isRedFlag={isRedFlag}
          />

          <div className={styles.bodyGrid}>
            <fieldset className={styles.controlsFieldset}>
              <legend className={styles.srOnly}>Điều chỉnh chỉ số nỗ lực đôi bên</legend>

              <div className={styles.controlRow}>
                <label htmlFor={myTriesId} className={styles.controlLabel}>
                  Em cố gắng (Số lần): <strong>{myTries}</strong>
                </label>
                <input
                  id={myTriesId}
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={myTries}
                  onChange={e => {
                    setMyTries(e.target.valueAsNumber || 0);
                    setGhostingCountdown(5);
                  }}
                  className={styles.rangeInput}
                />
                <span className={styles.impactScore}>
                  Trọng số (0.1x): <strong>{myImpact} điểm</strong>
                </span>
              </div>

              <div className={styles.controlRow}>
                <label htmlFor={rivalTriesId} className={styles.controlLabel}>
                  Ai đó nỗ lực (Số lần): <strong>{rivalTries}</strong>
                </label>
                <input
                  id={rivalTriesId}
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={rivalTries}
                  onChange={e => setRivalTries(e.target.valueAsNumber || 0)}
                  className={styles.rangeInput}
                />
                <span className={styles.impactScore}>
                  Trọng số (50.0x): <strong>{rivalImpact} điểm</strong>
                </span>
              </div>

              <div className={styles.buttonGroup}>
                <button
                  type="button"
                  onClick={handleAddMyEffort}
                  className={styles.btnSecondary}
                >
                  +10 Lần Cố Gắng (Em)
                </button>
                <button
                  type="button"
                  onClick={handleAddRivalEffort}
                  className={styles.btnSecondary}
                >
                  +1 Lần Xuất Hiện (Ai Đó)
                </button>
                <button
                  type="button"
                  onClick={handleUnbind}
                  className={styles.btnDanger}
                >
                  Unbind & Free Memory (Dừng Lại)
                </button>
              </div>
            </fieldset>

            <section className={styles.logSection} aria-label="Nhật ký tương tác">
              <header className={styles.logHeader}>
                <h3 className={styles.logTitle}>Nhật Ký Tín Hiệu Nỗ Lực</h3>
                <button
                  type="button"
                  onClick={handleRollbackLastAction}
                  className={styles.rollbackBtn}
                  disabled={signals.length <= 1}
                  aria-label="Hoàn tác lần tương tác gần nhất"
                >
                  ↩ Hoàn Tác (Rollback)
                </button>
              </header>

              <div className={styles.filterBar}>
                <span className={styles.filterLabel}>Lọc theo:</span>
                <div className={styles.filterButtons}>
                  <button
                    type="button"
                    className={`${styles.filterBtn} ${signalFilter === 'ALL' ? styles.filterActive : ''}`}
                    onClick={() => setSignalFilter('ALL')}
                  >
                    Tất cả ({signals.length})
                  </button>
                  <button
                    type="button"
                    className={`${styles.filterBtn} ${signalFilter === 'EM' ? styles.filterActive : ''}`}
                    onClick={() => setSignalFilter('EM')}
                  >
                    Em
                  </button>
                  <button
                    type="button"
                    className={`${styles.filterBtn} ${signalFilter === 'AI_DO' ? styles.filterActive : ''}`}
                    onClick={() => setSignalFilter('AI_DO')}
                  >
                    Ai Đó
                  </button>
                </div>
              </div>

              <ul className={styles.logList}>
                {filteredSignals.length > 0 ? (
                  filteredSignals.map(s => (
                    <li key={s.id} className={styles.logItem}>
                      <strong className={s.actor === 'EM' ? styles.actorEm : styles.actorRival}>
                        [{s.actor === 'EM' ? 'EM' : 'AI ĐÓ'}]:
                      </strong>{' '}
                      {s.description}
                    </li>
                  ))
                ) : (
                  <li className={styles.emptyLog}>Không có tín hiệu nào phù hợp.</li>
                )}
              </ul>
            </section>
          </div>

          <p className={styles.keyboardHelp}>
            Phím tắt trợ năng (A11y): <kbd>E</kbd> (+10 Em) &bull; <kbd>A</kbd> (+1 Ai Đó) &bull; <kbd>Esc</kbd> (Dừng Lại)
          </p>
        </>
      ) : (
        <div className={styles.exitBox}>
          <p className={styles.exitMessage}>
            &ldquo;Hẹn hò nhưng không yêu, chắc em là kẻ mất trí...&rdquo; &rarr; <strong>Đã Thoát Khỏi Situationship.</strong>
          </p>
          <button
            type="button"
            onClick={handleReset}
            className={styles.btnReset}
          >
            Tái Khởi Động Trái Tim (Reset FSM)
          </button>
        </div>
      )}
    </article>
  );
}

