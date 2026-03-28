import type { Quote } from "../types";

interface QuoteBlockProps {
  quote: Quote;
  pmName: string;
}

export function QuoteBlock({ quote, pmName }: QuoteBlockProps) {
  if (!quote.show) return null;

  return (
    <figure className="quiz-quote-block">
      <blockquote className="quiz-quote-text" lang={quote.language}>
        <p>"{quote.text}"</p>
      </blockquote>
      {quote.translation && (
        <p className="quiz-quote-translation">{quote.translation}</p>
      )}
      <figcaption className="quiz-quote-attribution">— {pmName}</figcaption>
    </figure>
  );
}
