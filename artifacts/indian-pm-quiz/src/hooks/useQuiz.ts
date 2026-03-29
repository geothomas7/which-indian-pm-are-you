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
const TIE_BREAKER_QUESTIONS = [1, 5, 10, 17, 18];

interface PersistedState {
  screen: QuizScreen;
  currentIndex: number;
}

function loadSavedAnswers(): Record<number, string> {
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

  console.log("[Quiz] resolveResults called");
  console.log("[Quiz] answers:", answers);
  console.log("[Quiz] raw scores before sort:", JSON.parse(JSON.stringify(scores)));

  if (!scores.length) return null;

  scores.sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    if (b.primaryHits !== a.primaryHits) return b.primaryHits - a.primaryHits;
    const tbA = computeTiebreakerScore(a.pm, answers);
    const tbB = computeTiebreakerScore(b.pm, answers);
    const tbDiff = tbB - tbA;
    if (tbDiff !== 0) {
      console.log(`[Quiz] Tiebreak triggered between ${a.pm} (${tbA}) and ${b.pm} (${tbB})`);
      return tbDiff;
    }
    console.log(`[Quiz] Alphabetical tiebreak triggered between ${a.pm} and ${b.pm}`);
    return a.pm.localeCompare(b.pm);
  });

  console.log("[Quiz] final sorted scores:", scores.map(s => `${s.pm}: ${s.total}pts ${s.primaryHits}hits`));
  console.log("[Quiz] winner:", scores[0].pm, "with", scores[0].total, "points");

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

  // Bug fix: never restore "result" screen on fresh load — always start from intro
  // so the user isn't shown a stale result from a previous session.
  const initialScreen: QuizScreen =
    savedState?.screen === "result" ? "intro" : (savedState?.screen ?? "intro");

  const [screen, setScreen] = useState<QuizScreen>(initialScreen);
  const [currentIndex, setCurrentIndex] = useState(savedState?.currentIndex ?? 0);
  const [answers, setAnswers] = useState<Record<number, string>>(loadSavedAnswers);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const questions = quizData.questions;
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];

  const selectedOption = answers[currentQuestion?.id] ?? null;

  const saveAnswers = useCallback((newAnswers: Record<number, string>) => {
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
      console.log(`[Quiz] Q${currentQuestion.id} (index ${currentIndex}): selected option "${option}"`);
      const newAnswers = { ...answers, [currentQuestion.id]: option };
      console.log("[Quiz] answers after selection:", newAnswers);
      setAnswers(newAnswers);
      saveAnswers(newAnswers);
    },
    [answers, currentQuestion, currentIndex, saveAnswers]
  );

  const goNext = useCallback(() => {
    if (!selectedOption) return;
    console.log(`[Quiz] goNext from Q index ${currentIndex}, selectedOption="${selectedOption}"`);
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
    const answeredCount = Object.keys(savedAnswers).length;

    console.log("[Quiz] startQuiz called. savedAnswers:", savedAnswers, "answeredCount:", answeredCount, "totalQuestions:", totalQuestions);

    if (answeredCount > 0 && answeredCount < totalQuestions) {
      // Partial completion — resume from where they left off
      const resumeIndex = answeredCount;
      console.log(`[Quiz] Resuming from index ${resumeIndex}`);
      setCurrentIndex(resumeIndex);
    } else {
      // Bug fix: if a prior complete quiz exists in localStorage, clear it so
      // the user starts fresh instead of inheriting old pre-selected answers.
      if (answeredCount >= totalQuestions) {
        console.log("[Quiz] Prior completed quiz detected — clearing answers for fresh start");
        const cleared: Record<number, string> = {};
        setAnswers(cleared);
        saveAnswers(cleared);
      }
      setCurrentIndex(0);
    }
    setScreen("question");
  }, [totalQuestions, saveAnswers]);

  const retakeQuiz = useCallback(() => {
    console.log("[Quiz] retakeQuiz called — clearing all state");
    const cleared: Record<number, string> = {};
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
    console.log("[Quiz] Computing result. answers at result time:", answers);
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
