import { useState, useEffect, useRef } from "react";

interface ShareModalProps {
  pmName: string;
  archetype: string;
  onClose: () => void;
}

export function ShareModal({ pmName, archetype, onClose }: ShareModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const shareUrl = window.location.origin + window.location.pathname;
  const shareText = `I got ${pmName} — ${archetype}. Which Indian Prime Minister are you most like?`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  useEffect(() => {
    closeRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // ignore
    }
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div
      className="quiz-modal-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Share your result"
    >
      <div className="quiz-modal">
        <div className="quiz-modal-header">
          <h2 className="quiz-modal-title">Share your result</h2>
          <button
            type="button"
            className="quiz-modal-close"
            onClick={onClose}
            ref={closeRef}
            aria-label="Close share modal"
          >
            ✕
          </button>
        </div>

        <p className="quiz-modal-preview">
          "{shareText}"
        </p>

        <div className="quiz-modal-actions">
          <button type="button" className="quiz-modal-btn" onClick={copyLink}>
            {copiedLink ? "✓ Link copied!" : "Copy link"}
          </button>
          <button type="button" className="quiz-modal-btn" onClick={copyText}>
            {copiedText ? "✓ Text copied!" : "Copy result text"}
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="quiz-modal-btn quiz-modal-btn--whatsapp"
          >
            Share on WhatsApp
          </a>
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="quiz-modal-btn quiz-modal-btn--twitter"
          >
            Share on X
          </a>
        </div>

        <button type="button" className="quiz-modal-cancel" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
