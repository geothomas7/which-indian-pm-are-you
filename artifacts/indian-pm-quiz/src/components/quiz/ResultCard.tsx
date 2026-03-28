import { useState } from "react";
import { Motif } from "./Motif";
import { ScoreMixCard } from "./ScoreMixCard";
import { Disclaimer } from "./Disclaimer";
import type { QuizResult } from "../../hooks/useQuiz";
import quizData from "../../data/quiz.json";

interface ResultCardProps {
  result: QuizResult;
  onRetake: () => void;
}

export function ResultCard({ result, onRetake }: ResultCardProps) {
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "shared">("idle");

  const resultData = quizData.results.find((r) => r.pm === result.winner.pm);
  if (!resultData) return null;

  const shareText = `I got ${result.winner.pm} — ${resultData.subtitle} on the Indian PM Quiz!`;
  const shareUrl = window.location.href;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Which Indian Prime Minister Are You Most Like?",
          text: shareText,
          url: shareUrl,
        });
        setShareStatus("shared");
        setTimeout(() => setShareStatus("idle"), 2000);
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        setShareStatus("copied");
        setTimeout(() => setShareStatus("idle"), 2000);
      } catch {
        // fallback
      }
    }
  };

  return (
    <main className="quiz-screen quiz-result">
      <div className="quiz-result-motif">
        <Motif className="quiz-motif-svg quiz-motif-svg--result" />
      </div>

      <div className="quiz-result-content">
        <p className="quiz-result-you">You are</p>
        <h1 className="quiz-result-name">{result.winner.pm}</h1>
        <p className="quiz-result-subtitle">{resultData.subtitle}</p>

        <div className="quiz-result-summary">
          <p>{resultData.summary1}</p>
          <p>{resultData.summary2}</p>
        </div>

        <div className="quiz-result-strengths">
          <h2 className="quiz-result-strengths-title">Your leadership strengths</h2>
          <div className="quiz-strengths-chips">
            {resultData.strengths.map((s) => (
              <span key={s} className="quiz-strength-chip">{s}</span>
            ))}
          </div>
        </div>

        <div className="quiz-result-growth">
          <p className="quiz-result-growth-text">
            <span className="quiz-result-growth-label">One thing to hold lightly: </span>
            {resultData.gentleNote}
          </p>
        </div>

        {result.secondaryMatches.length > 0 && (
          <ScoreMixCard
            secondaryMatches={result.secondaryMatches}
            winnerTotal={result.winner.total}
          />
        )}

        <div className="quiz-result-actions">
          <button
            type="button"
            className="quiz-btn quiz-btn--secondary"
            onClick={onRetake}
          >
            Retake the Quiz
          </button>
          <button
            type="button"
            className="quiz-btn quiz-btn--primary"
            onClick={handleShare}
          >
            {shareStatus === "copied"
              ? "Copied!"
              : shareStatus === "shared"
              ? "Shared!"
              : "Share My Result"}
          </button>
        </div>

        <Disclaimer variant="result" />
      </div>
    </main>
  );
}
