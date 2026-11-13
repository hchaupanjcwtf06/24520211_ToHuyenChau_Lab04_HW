import styles from './AsymmetricRatioBar.module.css';

interface AsymmetricRatioBarProps {
  readonly myImpact: number;
  readonly rivalImpact: number;
  readonly isRedFlag: boolean;
}

export function AsymmetricRatioBar({ myImpact, rivalImpact, isRedFlag }: AsymmetricRatioBarProps) {
  const total = myImpact + rivalImpact;
  const myPercent = total > 0 ? Math.round((myImpact / total) * 100) : 50;
  const rivalPercent = 100 - myPercent;

  return (
    <section className={styles.ratioSection} aria-label="Biểu đồ tỷ lệ nỗ lực đôi bên">
      <div className={styles.ratioHeader}>
        <span className={styles.myLabel}>
          Em: {myPercent}% ({myImpact} điểm)
        </span>
        <span className={styles.vsBadge}>
          {isRedFlag ? '⚡ BẤT ĐỐI XỨNG NẶNG' : '⚖ CÂN BẰNG'}
        </span>
        <span className={styles.rivalLabel}>
          Ai Đó: {rivalPercent}% ({rivalImpact} điểm)
        </span>
      </div>

      <div className={styles.track}>
        <div
          className={styles.fillMy}
          style={{ width: `${myPercent}%` }}
          aria-hidden="true"
        />
        <div
          className={styles.fillRival}
          style={{ width: `${rivalPercent}%` }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}