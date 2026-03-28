import { ProgressBar } from "./ProgressBar";
import { AnswerOption } from "./AnswerOption";

interface Option {
  key: string;
  text: string;
}

interface Question {
  id: number;
  question: string;
  options: Option[];
}

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  progressPercent: number;
  selectedOption: string | null;
  onSelect: (key: string) => void;
  onNext: () => void;
  onBack: () => void;
  isTransitioning: boolean;
}

export function QuestionCard({
  question,
  currentIndex,
  totalQuestions,
  progressPercent,
  selectedOption,
  onSelect,
  onNext,
  onBack,
  isTransitioning,
}: QuestionCardProps) {
  return (
    <main className={`quiz-screen quiz-question${isTransitioning ? " quiz-question--fade" : ""}`}>
      <ProgressBar
        current={currentIndex + 1}
        total={totalQuestions}
        percent={progressPercent}
      />

      <div className="quiz-question-card">
        <p className="quiz-question-number">Question {currentIndex + 1}</p>
        <h2 className="quiz-question-text">{question.question}</h2>

        <div className="quiz-answers" role="group" aria-label="Answer options">
          {question.options.map((opt) => (
            <AnswerOption
              key={opt.key}
              optionKey={opt.key}
              text={opt.text}
              selected={selectedOption === opt.key}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>

      <div className="quiz-nav">
        <button
          type="button"
          className="quiz-btn quiz-btn--ghost"
          onClick={onBack}
          aria-label="Go to previous question"
        >
          ← Back
        </button>
        <button
          type="button"
          className="quiz-btn quiz-btn--primary"
          onClick={onNext}
          disabled={!selectedOption}
          aria-label="Go to next question"
        >
          {currentIndex + 1 === totalQuestions ? "See My Result" : "Next →"}
        </button>
      </div>
    </main>
  );
}
