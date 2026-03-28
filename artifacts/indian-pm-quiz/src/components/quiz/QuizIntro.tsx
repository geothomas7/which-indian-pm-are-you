import { Motif } from "./Motif";
import { Disclaimer } from "./Disclaimer";

interface QuizIntroProps {
  onStart: () => void;
}

export function QuizIntro({ onStart }: QuizIntroProps) {
  return (
    <main className="quiz-screen quiz-intro">
      <div className="quiz-intro-motif">
        <Motif className="quiz-motif-svg" />
      </div>

      <div className="quiz-intro-content">
        <h1 className="quiz-intro-title">
          Which Indian Prime Minister Are You Most Like?
        </h1>
        <p className="quiz-intro-subtitle">
          18 questions on leadership, values, decisions, and the kind of future you want to build.
        </p>

        <Disclaimer variant="landing" />

        <button
          type="button"
          className="quiz-btn quiz-btn--primary"
          onClick={onStart}
        >
          Start the Quiz
        </button>
      </div>
    </main>
  );
}
