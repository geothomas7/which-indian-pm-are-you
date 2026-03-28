interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="quiz-footer">
      <nav className="quiz-footer-nav" aria-label="Site navigation">
        <button type="button" className="quiz-footer-link" onClick={() => onNavigate("about")}>About</button>
        <span className="quiz-footer-sep" aria-hidden="true">·</span>
        <button type="button" className="quiz-footer-link" onClick={() => onNavigate("sources")}>Sources &amp; Credits</button>
        <span className="quiz-footer-sep" aria-hidden="true">·</span>
        <button type="button" className="quiz-footer-link" onClick={() => onNavigate("privacy")}>Privacy</button>
        <span className="quiz-footer-sep" aria-hidden="true">·</span>
        <button type="button" className="quiz-footer-link" onClick={() => onNavigate("disclaimer")}>Disclaimer</button>
      </nav>
      <p className="quiz-footer-disclaimer">
        For fun and reflection only. This quiz matches broad leadership-style traits and does not represent historical judgment, political endorsement, or real-life similarity.
      </p>
      <p className="quiz-footer-privacy">
        This site may store quiz progress locally in your browser to improve your experience.
      </p>
    </footer>
  );
}
