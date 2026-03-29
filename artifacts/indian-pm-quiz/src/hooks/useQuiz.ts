import { useState, useCallback, useMemo, useEffect } from "react";
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

const STORAGE_ANSWERS_KEY = "indian_pm_quiz_answers";
const STORAGE_STATE_KEY = "indian_pm_quiz_state";
const TIE_BREAKER_QUESTIONS = ["q1", "q5", "q10", "q17", "q18"];

interface PersistedState {
  screen: QuizScreen;
  currentIndex: number;
}

function loadSavedAnswers(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_ANSWERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {};
}

function loadSavedState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_STATE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return null;
}

function computeScores(answers: Record<string, string>): PMScore[] {
  const totals: Record<string, { total: number; primaryHits: number }> = {};

  for (const question of quizData.questions) {
    const chosenOptionId = answers[question.id];
    if (!chosenOptionId) continue;

    const option = question.options.find((o) => o.id === chosenOptionId);
    if (!option) continue;

    const entries = Object.entries(option.scores) as [string, number][];
    const maxPoints = Math.max(...entries.map(([, pts]) => pts));

    for (const [pm, points] of entries) {
      if (!totals[pm]) totals[pm] = { total: 0, primaryHits: 0 };
      totals[pm].total += points;
      if (points === maxPoints) {
        totals[pm].primaryHits += 1;
      }
    }
  }

  return Object.entries(totals).map(([pm, data]) => ({
    pm,
    total: data.total,
    primaryHits: data.primaryHits,
  }));
}

function computeTiebreakerScore(pm: string, answers: Record<string, string>): number {
  let score = 0;
  for (const qId of TIE_BREAKER_QUESTIONS) {
    const chosenOptionId = answers[qId];
    if (!chosenOptionId) continue;
    const question = quizData.questions.find((q) => q.id === qId);
    if (!question) continue;
    const option = question.options.find((o) => o.id === chosenOptionId);
    const pts = option?.scores[pm as keyof typeof option.scores];
    if (pts) score += pts;
  }
  return score;
}

function resolveResults(answers: Record<string, string>): QuizResult | null {
  const scores = computeScores(answers);
  if (!scores.length) return null;

  scores.sort((a, b) => {
    // Step 1: total accumulated points
    if (b.total !== a.total) return b.total - a.total;
    // Step 2: primary-hit count (direct wins)
    if (b.primaryHits !== a.primaryHits) return b.primaryHits - a.primaryHits;
    // Step 3: points earned on tiebreaker questions
    const tbDiff = computeTiebreakerScore(b.pm, answers) - computeTiebreakerScore(a.pm, answers);
    if (tbDiff !== 0) return tbDiff;
    // Step 4: deterministic final resolver — tieBreakPriority list
    const priority = quizData.tieBreakPriority as string[];
    const ia = priority.indexOf(a.pm);
    const ib = priority.indexOf(b.pm);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
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
  const savedState = loadSavedState();

  // Never restore the result screen — always start from intro on a fresh load
  const initialScreen: QuizScreen =
    savedState?.screen === "result" ? "intro" : (savedState?.screen ?? "intro");

  const [screen, setScreen] = useState<QuizScreen>(initialScreen);
  const [currentIndex, setCurrentIndex] = useState(savedState?.currentIndex ?? 0);
  const [answers, setAnswers] = useState<Record<string, string>>(loadSavedAnswers);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const questions = quizData.questions;
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];

  const selectedOption = answers[currentQuestion?.id] ?? null;

  const saveAnswers = useCallback((newAnswers: Record<string, string>) => {
    try {
      localStorage.setItem(STORAGE_ANSWERS_KEY, JSON.stringify(newAnswers));
    } catch {
      // ignore
    }
  }, []);

  const saveState = useCallback((newScreen: QuizScreen, newIndex: number) => {
    try {
      const state: PersistedState = { screen: newScreen, currentIndex: newIndex };
      localStorage.setItem(STORAGE_STATE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    saveState(screen, currentIndex);
  }, [screen, currentIndex, saveState]);

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
        setCurrentIndex(currentIndex);
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
    const savedAnswers = loadSavedAnswers();
    const savedScreenState = loadSavedState();
    const answeredCount = Object.keys(savedAnswers).length;

    // Only resume if the user was actively mid-quiz with partial answers
    if (
      savedScreenState?.screen === "question" &&
      answeredCount > 0 &&
      answeredCount < totalQuestions
    ) {
      setCurrentIndex(answeredCount);
    } else {
      // Fresh start — clear any stale answers
      const cleared: Record<string, string> = {};
      setAnswers(cleared);
      saveAnswers(cleared);
      setCurrentIndex(0);
    }
    setScreen("question");
  }, [totalQuestions, saveAnswers]);

  const retakeQuiz = useCallback(() => {
    const cleared: Record<string, string> = {};
    setAnswers(cleared);
    saveAnswers(cleared);
    setCurrentIndex(0);
    setScreen("intro");
    try {
      localStorage.removeItem(STORAGE_STATE_KEY);
    } catch {
      // ignore
    }
  }, [saveAnswers]);

  const result = useMemo(() => {
    if (screen !== "result") return null;
    return resolveResults(answers);
  }, [screen, answers]);

  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

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
