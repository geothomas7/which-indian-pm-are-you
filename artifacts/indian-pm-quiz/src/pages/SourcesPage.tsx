import creditsData from "../data/credits.json";
import quizData from "../data/quiz.json";

interface SourcesPageProps {
  onNavigate: (page: string) => void;
}

export function SourcesPage({ onNavigate }: SourcesPageProps) {
  return (
    <main className="info-page">
      <button type="button" className="info-back-link" onClick={() => onNavigate("quiz")}>
        ← Back to quiz
      </button>

      <h1 className="info-title">Sources &amp; Credits</h1>

      <section className="info-section">
        <h2 className="info-h2">Portrait images</h2>
        <p className="info-muted">
          Portraits are shown only when the image is publicly licensed and has been
          reviewed. Entries marked for review are not displayed in the app.
        </p>
        <ul className="credits-list">
          {creditsData.map((entry) => (
            <li key={entry.pmName} className="credits-item">
              <div className="credits-pm-name">
                {entry.pmName}
                {(!entry.imageEnabled || entry.needsManualReview) && (
                  <span className="credits-badge">not shown</span>
                )}
              </div>
              <div className="credits-attribution">{entry.attributionText}</div>
              <div className="credits-license">
                License: {entry.licenseName}
                {" · "}
                <a
                  href={entry.imagePageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="credits-link"
                >
                  View on {entry.sourceName}
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="info-section">
        <h2 className="info-h2">Quotes</h2>
        <p className="info-muted">
          Quotes are shown only when they have been verified through archival or
          official sources. Quotes with lower confidence are hidden by default.
        </p>
        <ul className="credits-list">
          {quizData.results.map((r) => (
            <li key={r.pm} className="credits-item">
              <div className="credits-pm-name">
                {r.pm}
                {!r.quote.show && (
                  <span className="credits-badge">not shown</span>
                )}
              </div>
              <div className="credits-attribution">
                "{r.quote.text}"
                {r.quote.translation && (
                  <span className="credits-translation"> — {r.quote.translation}</span>
                )}
              </div>
              <div className="credits-license">
                Source: {r.quote.sourceTitle}
                {" · Status: "}
                {r.quote.status.replace(/_/g, " ")}
                {" · "}
                <a
                  href={r.quote.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="credits-link"
                >
                  View source
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="info-section">
        <h2 className="info-h2">Quiz content</h2>
        <p>
          All quiz questions, answer options, PM profiles, strengths, and result summaries
          were written specifically for this project as editorial personality reflections.
          They describe broad leadership styles only and are not historical or factual claims.
        </p>
      </section>
    </main>
  );
}
