const ANSWERS_KEY = "indian_pm_quiz_answers";
const STATE_KEY = "indian_pm_quiz_state";

export function saveAnswers(answers: Record<number, string>): void {
  try {
    localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
  } catch {
    // ignore quota errors
  }
}

export function loadAnswers(): Record<number, string> {
  try {
    const raw = localStorage.getItem(ANSWERS_KEY);
    if (raw) return JSON.parse(raw) as Record<number, string>;
  } catch {
    // ignore parse errors
  }
  return {};
}

export function saveState(screen: string, currentIndex: number): void {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify({ screen, currentIndex }));
  } catch {
    // ignore quota errors
  }
}

export function loadState(): { screen: string; currentIndex: number } | null {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (raw) return JSON.parse(raw) as { screen: string; currentIndex: number };
  } catch {
    // ignore parse errors
  }
  return null;
}

export function clearQuizStorage(): void {
  try {
    localStorage.removeItem(ANSWERS_KEY);
    localStorage.removeItem(STATE_KEY);
  } catch {
    // ignore
  }
}
