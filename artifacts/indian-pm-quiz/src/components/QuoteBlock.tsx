import type { Quote } from "../types";

interface QuoteBlockProps {
  quote: Quote;
}

export function QuoteBlock({ quote }: QuoteBlockProps) {
  if (!quote.show) return null;

  return (
    <figure className="quiz-quote-block">
      <blockquote className="quiz-quote-text" lang={quote.language}>
        <p>"{quote.text}"</p>
      </blockquote>
      {quote.translation && (
        <p className="quiz-quote-translation">{quote.translation}</p>
      )}
      <figcaption className="quiz-quote-source">
        <a
          href={quote.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="quiz-quote-source-link"
        >
          {quote.sourceTitle}
        </a>
      </figcaption>
    </figure>
  );
}
