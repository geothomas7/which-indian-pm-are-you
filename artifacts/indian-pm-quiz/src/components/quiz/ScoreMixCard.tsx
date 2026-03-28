import type { PMScore } from "../../hooks/useQuiz";
import quizData from "../../data/quiz.json";

const BAR_MAX = 88;
const BAR_MIN = 52;

interface ScoreMixCardProps {
  secondaryMatches: PMScore[];
  winnerTotal: number;
}

export function ScoreMixCard({ secondaryMatches, winnerTotal }: ScoreMixCardProps) {
  if (!secondaryMatches.length) return null;

  const maxScore = Math.max(...secondaryMatches.map((m) => m.total));
  const minScore = Math.min(...secondaryMatches.map((m) => m.total));
  const scoreRange = maxScore - minScore;

  function barPct(score: number): number {
    if (scoreRange === 0) {
      return Math.round((score / winnerTotal) * 100);
    }
    const t = (score - minScore) / scoreRange;
    return Math.round(BAR_MIN + t * (BAR_MAX - BAR_MIN));
  }

  return (
    <div className="quiz-mix-card">
      <h3 className="quiz-mix-title">Your leadership mix</h3>
      <p className="quiz-mix-desc">
        These styles also showed up meaningfully in your answers.
      </p>
      <div className="quiz-mix-list">
        {secondaryMatches.map((match) => {
          const result = quizData.results.find((r) => r.pm === match.pm);
          const pct = barPct(match.total);
          return (
            <div key={match.pm} className="quiz-mix-item">
              <div className="quiz-mix-item-header">
                <span className="quiz-mix-pm">{match.pm}</span>
                <span className="quiz-mix-right">
                  {result && <span className="quiz-mix-subtitle">{result.subtitle}</span>}
                  <span className="quiz-mix-score">{match.total} pts</span>
                </span>
              </div>
              <div className="quiz-mix-bar-track">
                <div className="quiz-mix-bar-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
