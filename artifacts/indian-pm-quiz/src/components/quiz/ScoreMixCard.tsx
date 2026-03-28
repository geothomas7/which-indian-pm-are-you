import type { PMScore } from "../../hooks/useQuiz";
import quizData from "../../data/quiz.json";

interface ScoreMixCardProps {
  secondaryMatches: PMScore[];
  winnerTotal: number;
}

export function ScoreMixCard({ secondaryMatches, winnerTotal }: ScoreMixCardProps) {
  if (!secondaryMatches.length) return null;

  return (
    <div className="quiz-mix-card">
      <h3 className="quiz-mix-title">Your leadership mix</h3>
      <p className="quiz-mix-desc">
        These styles also showed up meaningfully in your answers.
      </p>
      <div className="quiz-mix-list">
        {secondaryMatches.map((match) => {
          const result = quizData.results.find((r) => r.pm === match.pm);
          const pct = Math.round((match.total / winnerTotal) * 100);
          return (
            <div key={match.pm} className="quiz-mix-item">
              <div className="quiz-mix-item-header">
                <span className="quiz-mix-pm">{match.pm}</span>
                {result && <span className="quiz-mix-subtitle">{result.subtitle}</span>}
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
