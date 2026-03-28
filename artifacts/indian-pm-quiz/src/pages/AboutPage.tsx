interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <main className="info-page">
      <button type="button" className="info-back-link" onClick={() => onNavigate("quiz")}>
        ← Back to quiz
      </button>

      <h1 className="info-title">About this quiz</h1>

      <section className="info-section">
        <h2 className="info-h2">What is this?</h2>
        <p>
          "Which Indian Prime Minister Are You Most Like?" is a personality reflection quiz
          based on broad leadership styles. It uses 18 scenario-based questions to suggest
          which of India's 15 Prime Ministers your answers most resemble.
        </p>
      </section>

      <section className="info-section">
        <h2 className="info-h2">How the scoring works</h2>
        <p>
          Each answer gives points to a primary PM match and a secondary PM match.
          After all 18 questions, the PM with the highest score is shown as your result.
          A close-match card appears only when another PM scores within 3 points of the
          winner and has at least 6 total points.
        </p>
      </section>

      <section className="info-section">
        <h2 className="info-h2">What this is not</h2>
        <p>
          This quiz is not a political, historical, or psychological tool. It does not
          measure intelligence, values, ideology, or real personality. The results are
          playful reflections, not assessments.
        </p>
        <p>
          The PM profiles describe broad leadership styles only. They do not represent
          factual claims about any person living or deceased.
        </p>
      </section>

      <section className="info-section">
        <h2 className="info-h2">Privacy</h2>
        <p>
          This is a fully static site. No data is collected, no accounts are created,
          and nothing is sent to a server. Your quiz progress is saved locally in
          your own browser using localStorage, and only you can access it.
        </p>
      </section>

      <section className="info-section">
        <h2 className="info-h2">Technical details</h2>
        <p>
          Built with React and TypeScript. All quiz logic and content is stored
          in local JSON files. No backend, no database, no authentication.
        </p>
      </section>

      <div className="info-nav-links">
        <button type="button" className="quiz-footer-link" onClick={() => onNavigate("sources")}>Sources &amp; Credits</button>
        <button type="button" className="quiz-footer-link" onClick={() => onNavigate("privacy")}>Privacy</button>
        <button type="button" className="quiz-footer-link" onClick={() => onNavigate("disclaimer")}>Disclaimer</button>
      </div>
    </main>
  );
}
