interface PrivacyPageProps {
  onNavigate: (page: string) => void;
}

export function PrivacyPage({ onNavigate }: PrivacyPageProps) {
  return (
    <main className="info-page">
      <button type="button" className="info-back-link" onClick={() => onNavigate("quiz")}>
        ← Back to quiz
      </button>

      <h1 className="info-title">Privacy</h1>

      <section className="info-section">
        <h2 className="info-h2">No data collection</h2>
        <p>
          This site does not collect, store, or share any personal information.
          There are no accounts, no sign-ups, no tracking pixels, and no analytics.
        </p>
      </section>

      <section className="info-section">
        <h2 className="info-h2">Local storage</h2>
        <p>
          Your quiz progress — which questions you have answered and which options
          you selected — is stored locally in your browser using localStorage.
          This data never leaves your device and is only used to let you resume
          the quiz if you close or refresh the page.
        </p>
        <p>
          You can clear this data at any time by clearing your browser's site data
          or by clicking Retake on the result screen.
        </p>
      </section>

      <section className="info-section">
        <h2 className="info-h2">External connections</h2>
        <p>
          Where a portrait is shown on the result screen, the image is loaded
          directly from Wikimedia Commons. This is a standard image request —
          no personal data is sent — but Wikimedia's servers will receive your
          IP address as part of that request, as with any external image on the web.
        </p>
        <p>
          The Sources &amp; Credits page links to Wikimedia Commons and other public
          archival sites for attribution. These links open in a new tab and are
          subject to their own privacy policies.
        </p>
        <p>
          The share buttons (WhatsApp, X) open in a new tab and are subject to
          those platforms' own terms and privacy policies.
        </p>
      </section>

      <section className="info-section">
        <h2 className="info-h2">Cookies</h2>
        <p>
          This site does not use cookies.
        </p>
      </section>

      <section className="info-section">
        <h2 className="info-h2">Static site</h2>
        <p>
          This is a fully static web application. No server processes your data.
          No backend stores anything. All quiz logic runs entirely in your browser.
        </p>
      </section>
    </main>
  );
}
