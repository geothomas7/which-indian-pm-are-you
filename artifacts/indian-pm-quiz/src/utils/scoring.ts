import type { PMScore, QuizResult } from "../hooks/useQuiz";
import quizData from "../data/quiz.json";

const TIE_BREAKER_QUESTIONS = [1, 5, 10, 17, 18];

function computeTiebreakerScore(pm: string, answers: Record<number, string>): number {
  let score = 0;
  for (const qId of TIE_BREAKER_QUESTIONS) {
    const chosen = answers[qId];
    if (!chosen) continue;
    const entry = quizData.scoring_matrix.find(
      (e) => e.question_id === qId && e.option === chosen && e.primary_pm === pm
    );
    if (entry) score += entry.primary_points;
  }
  return score;
}

export function computeResults(answers: Record<number, string>): QuizResult | null {
  const totals: Record<string, { total: number; primaryHits: number }> = {};

  for (const entry of quizData.scoring_matrix) {
    const chosen = answers[entry.question_id];
    if (!chosen || chosen !== entry.option) continue;

    if (!totals[entry.primary_pm]) totals[entry.primary_pm] = { total: 0, primaryHits: 0 };
    totals[entry.primary_pm].total += entry.primary_points;
    totals[entry.primary_pm].primaryHits += 1;

    if (!totals[entry.secondary_pm]) totals[entry.secondary_pm] = { total: 0, primaryHits: 0 };
    totals[entry.secondary_pm].total += entry.secondary_points;
  }

  const scores: PMScore[] = Object.entries(totals).map(([pm, data]) => ({
    pm,
    total: data.total,
    primaryHits: data.primaryHits,
  }));

  if (!scores.length) return null;

  scores.sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    if (b.primaryHits !== a.primaryHits) return b.primaryHits - a.primaryHits;
    const tbDiff = computeTiebreakerScore(b.pm, answers) - computeTiebreakerScore(a.pm, answers);
    if (tbDiff !== 0) return tbDiff;
    return a.pm.localeCompare(b.pm);
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
