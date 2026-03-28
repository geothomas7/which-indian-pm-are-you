import { useState } from "react";
import { Motif } from "./Motif";
import { ScoreMixCard } from "./ScoreMixCard";
import { Disclaimer } from "./Disclaimer";
import { QuoteBlock } from "../QuoteBlock";
import { ShareModal } from "../ShareModal";
import type { QuizResult } from "../../hooks/useQuiz";
import quizData from "../../data/quiz.json";
import creditsData from "../../data/credits.json";

interface ResultCardProps {
  result: QuizResult;
  onRetake: () => void;
}

export function ResultCard({ result, onRetake }: ResultCardProps) {
  const [showShareModal, setShowShareModal] = useState(false);

  const resultData = quizData.results.find((r) => r.pm === result.winner.pm);
  const portrait = creditsData.find((c) => c.pmName === result.winner.pm);

  if (!resultData) return null;

  const portraitSrc =
    portrait?.imageEnabled && !portrait?.needsManualReview
      ? `https://commons.wikimedia.org/wiki/Special:FilePath/${portrait.imageTitle}?width=240`
      : null;

  const handleShare = async () => {
    const shareText = `I got ${result.winner.pm} — ${resultData.subtitle}. Which Indian Prime Minister are you most like?`;
    const shareUrl = window.location.origin + window.location.pathname;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Which Indian Prime Minister Are You Most Like?",
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // user cancelled native share
      }
    } else {
      setShowShareModal(true);
    }
  };

  return (
    <>
      <main className="quiz-screen quiz-result">
        <div className="quiz-result-motif">
          <Motif className="quiz-motif-svg quiz-motif-svg--result" />
        </div>

        <div className="quiz-result-content">
          <p className="quiz-result-you">You are</p>
          <h1 className="quiz-result-name">{result.winner.pm}</h1>
          <p className="quiz-result-subtitle">{resultData.subtitle}</p>

          {portraitSrc && (
            <div className="quiz-result-portrait">
              <img
                src={portraitSrc}
                alt={`Portrait of ${result.winner.pm}`}
                className="quiz-portrait-img"
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              {portrait && (
                <p className="quiz-portrait-credit">{portrait.attributionText}</p>
              )}
            </div>
          )}

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

          <QuoteBlock quote={resultData.quote} />

          {result.secondaryMatches.length > 0 && (
            <ScoreMixCard
              secondaryMatches={result.secondaryMatches}
              winnerTotal={result.winner.total}
            />
          )}

          <div className="quiz-result-actions">
            <button
              type="button"
              className="quiz-btn quiz-btn--primary"
              onClick={handleShare}
            >
              Share My Result
            </button>
            <button
              type="button"
              className="quiz-btn quiz-btn--secondary"
              onClick={onRetake}
            >
              Retake the Quiz
            </button>
          </div>

          <Disclaimer variant="result" />
        </div>
      </main>

      {showShareModal && (
        <ShareModal
          pmName={result.winner.pm}
          archetype={resultData.subtitle}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </>
  );
}
