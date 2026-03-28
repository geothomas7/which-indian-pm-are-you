interface ProgressBarProps {
  current: number;
  total: number;
  percent: number;
}

export function ProgressBar({ current, total, percent }: ProgressBarProps) {
  return (
    <div className="quiz-progress-wrap" role="progressbar" aria-valuenow={current} aria-valuemin={0} aria-valuemax={total} aria-label={`Question ${current} of ${total}`}>
      <div className="quiz-progress-track">
        <div
          className="quiz-progress-fill"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="quiz-progress-label">
        Question {current} of {total}
      </span>
    </div>
  );
}
