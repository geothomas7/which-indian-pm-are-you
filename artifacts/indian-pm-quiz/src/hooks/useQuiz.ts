import { useState, useCallback, useMemo } from "react";
import quizData from "../data/quiz.json";

export type QuizScreen = "intro" | "question" | "result";

export interface PMScore {
  pm: string;
  total: number;
  primaryHits: number;
}

export interface QuizResult {
  winner: PMScore;
  secondaryMatches: PMScore[];
}

const STORAGE_KEY = "indian_pm_quiz_answers";
const TIE_BREAKER_QUESTIONS = [1, 5, 10, 17, 18];

function loadSavedAnswers(): Record<number, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {};
}

function computeScores(answers: Record<number, string>): PMScore[] {
  const totals: Record<string, { total: number; primaryHits: number }> = {};

  for (const entry of quizData.scoring_matrix) {
    const chosenOption = answers[entry.question_id];
    if (!chosenOption) continue;

    if (chosenOption === entry.option) {
      if (!totals[entry.primary_pm]) totals[entry.primary_pm] = { total: 0, primaryHits: 0 };
      totals[entry.primary_pm].total += entry.primary_points;
      totals[entry.primary_pm].primaryHits += 1;

      if (!totals[entry.secondary_pm]) totals[entry.secondary_pm] = { total: 0, primaryHits: 0 };
      totals[entry.secondary_pm].total += entry.secondary_points;
    }
  }

  return Object.entries(totals).map(([pm, data]) => ({
    pm,
    total: data.total,
    primaryHits: data.primaryHits,
  }));
}

function computeTiebreakerScore(pm: string, answers: Record<number, string>): number {
  let score = 0;
  for (const qId of TIE_BREAKER_QUESTIONS) {
    const chosenOption = answers[qId];
    if (!chosenOption) continue;
    const entry = quizData.scoring_matrix.find(
      (e) => e.question_id === qId && e.option === chosenOption && e.primary_pm === pm
    );
    if (entry) score += entry.primary_points;
  }
  return score;
}

function resolveResults(answers: Record<number, string>): QuizResult | null {
  const scores = computeScores(answers);
  if (!scores.length) return null;

  scores.sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    if (b.primaryHits !== a.primaryHits) return b.primaryHits - a.primaryHits;
    return computeTiebreakerScore(b.pm, answers) - computeTiebreakerScore(a.pm, answers);
  });

  const winner = scores[0];
  const { within_points_of_winner, minimum_total_points } = quizData.display_rules;

  const secondaryMatches = scores.slice(1).filter(
    (s) =>
      s.total >= minimum_total_points &&
      winner.total - s.total <= within_points_of_winner
  );

  return { winner, secondaryMatches };
}

export function useQuiz() {
  const [screen, setScreen] = useState<QuizScreen>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>(loadSavedAnswers);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const questions = quizData.questions;
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];

  const selectedOption = answers[currentQuestion?.id] ?? null;

  const saveAnswers = useCallback((newAnswers: Record<number, string>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newAnswers));
    } catch {
      // ignore
    }
  }, []);

  const selectOption = useCallback(
    (option: string) => {
      const newAnswers = { ...answers, [currentQuestion.id]: option };
      setAnswers(newAnswers);
      saveAnswers(newAnswers);
    },
    [answers, currentQuestion, saveAnswers]
  );

  const goNext = useCallback(() => {
    if (!selectedOption) return;
    setIsTransitioning(true);
    setTimeout(() => {
      if (currentIndex + 1 >= totalQuestions) {
        setScreen("result");
      } else {
        setCurrentIndex((i) => i + 1);
      }
      setIsTransitioning(false);
    }, 200);
  }, [selectedOption, currentIndex, totalQuestions]);

  const goBack = useCallback(() => {
    if (currentIndex === 0) {
      setScreen("intro");
      return;
    }
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((i) => i - 1);
      setIsTransitioning(false);
    }, 200);
  }, [currentIndex]);

  const startQuiz = useCallback(() => {
    setScreen("question");
    setCurrentIndex(0);
  }, []);

  const retakeQuiz = useCallback(() => {
    const cleared: Record<number, string> = {};
    setAnswers(cleared);
    saveAnswers(cleared);
    setCurrentIndex(0);
    setScreen("intro");
  }, [saveAnswers]);

  const result = useMemo(() => {
    if (screen !== "result") return null;
    return resolveResults(answers);
  }, [screen, answers]);

  const progressPercent = Math.round(((currentIndex) / totalQuestions) * 100);

  return {
    screen,
    currentQuestion,
    currentIndex,
    totalQuestions,
    selectedOption,
    answers,
    result,
    progressPercent,
    isTransitioning,
    startQuiz,
    selectOption,
    goNext,
    goBack,
    retakeQuiz,
  };
}
