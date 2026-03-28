interface DisclaimerPageProps {
  onNavigate: (page: string) => void;
}

export function DisclaimerPage({ onNavigate }: DisclaimerPageProps) {
  return (
    <main className="info-page">
      <button type="button" className="info-back-link" onClick={() => onNavigate("quiz")}>
        ← Back to quiz
      </button>

      <h1 className="info-title">Disclaimer</h1>

      <section className="info-section">
        <h2 className="info-h2">For fun and reflection only</h2>
        <p>
          This quiz is a light personality match based on broad leadership styles.
          It is designed for entertainment and gentle self-reflection. It is not
          a historical, political, or factual assessment of any kind.
        </p>
      </section>

      <section className="info-section">
        <h2 className="info-h2">Not a political statement</h2>
        <p>
          This quiz does not endorse, promote, or criticise any political party,
          ideology, leader, or policy. The PM profiles describe broad leadership
          archetypes and do not represent the full complexity of any person's
          record, values, or legacy.
        </p>
      </section>

      <section className="info-section">
        <h2 className="info-h2">Not a psychological assessment</h2>
        <p>
          Results are not based on psychology, personality science, or any
          validated assessment framework. No claim is made about your actual
          personality, intelligence, values, or character.
        </p>
      </section>

      <section className="info-section">
        <h2 className="info-h2">Respectful intent</h2>
        <p>
          All PM profiles are written with care and respect. They focus on
          positive leadership qualities and broad stylistic traits. They are
          not intended to be political commentary or historical analysis.
        </p>
      </section>

      <section className="info-section">
        <h2 className="info-h2">Result disclaimer</h2>
        <p>
          Your result is a playful interpretation based on your answers. It is
          not a factual, political, or psychological assessment of you or any
          public figure.
        </p>
      </section>

      <section className="info-section">
        <h2 className="info-h2">Quotes</h2>
        <p>
          Where quotes are shown, they are attributed to a named source such as
          a speech, address, interview, or published work. They are shared for
          contextual and reflective purposes only. Attribution details are listed
          in Sources &amp; Credits.
        </p>
      </section>
    </main>
  );
}
