import { useState, useEffect } from "react";
import { useQuiz } from "./hooks/useQuiz";
import { QuizIntro } from "./components/quiz/QuizIntro";
import { QuestionCard } from "./components/quiz/QuestionCard";
import { ResultCard } from "./components/quiz/ResultCard";
import { Footer } from "./components/Footer";
import { AboutPage } from "./pages/AboutPage";
import { SourcesPage } from "./pages/SourcesPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { DisclaimerPage } from "./pages/DisclaimerPage";

type Page = "quiz" | "about" | "sources" | "privacy" | "disclaimer";

function getPageFromHash(): Page {
  const hash = window.location.hash.replace("#", "");
  const valid: Page[] = ["about", "sources", "privacy", "disclaimer"];
  return valid.includes(hash as Page) ? (hash as Page) : "quiz";
}

function App() {
  const quiz = useQuiz();
  const [page, setPage] = useState<Page>(getPageFromHash);

  useEffect(() => {
    const handler = () => setPage(getPageFromHash());
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const navigate = (target: string) => {
    window.location.hash = target === "quiz" ? "" : target;
    setPage(target === "quiz" ? "quiz" : (target as Page));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="quiz-root">
      <div className="quiz-container">
        {page !== "quiz" ? (
          <>
            {page === "about" && <AboutPage onNavigate={navigate} />}
            {page === "sources" && <SourcesPage onNavigate={navigate} />}
            {page === "privacy" && <PrivacyPage onNavigate={navigate} />}
            {page === "disclaimer" && <DisclaimerPage onNavigate={navigate} />}
          </>
        ) : (
          <>
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
          </>
        )}

        <Footer onNavigate={navigate} />
      </div>
    </div>
  );
}

export default App;
