import { useQuiz } from "./hooks/useQuiz";
import { QuizIntro } from "./components/quiz/QuizIntro";
import { QuestionCard } from "./components/quiz/QuestionCard";
import { ResultCard } from "./components/quiz/ResultCard";

function App() {
  const quiz = useQuiz();

  return (
    <div className="quiz-root">
      <div className="quiz-container">
        {quiz.screen === "intro" && (
          <QuizIntro onStart={quiz.startQuiz} />
        )}

        {quiz.screen === "question" && quiz.currentQuestion && (
          <QuestionCard
            question={quiz.currentQuestion}
            currentIndex={quiz.currentIndex}
            totalQuestions={quiz.totalQuestions}
            progressPercent={quiz.progressPercent}
            selectedOption={quiz.selectedOption}
            onSelect={quiz.selectOption}
            onNext={quiz.goNext}
            onBack={quiz.goBack}
            isTransitioning={quiz.isTransitioning}
          />
        )}

        {quiz.screen === "result" && quiz.result && (
          <ResultCard result={quiz.result} onRetake={quiz.retakeQuiz} />
        )}
      </div>
    </div>
  );
}

export default App;
