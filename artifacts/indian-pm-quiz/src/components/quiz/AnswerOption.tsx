interface AnswerOptionProps {
  optionKey: string;
  text: string;
  selected: boolean;
  onSelect: (key: string) => void;
}

export function AnswerOption({ optionKey, text, selected, onSelect }: AnswerOptionProps) {
  return (
    <button
      type="button"
      className={`quiz-answer${selected ? " quiz-answer--selected" : ""}`}
      onClick={() => onSelect(optionKey)}
      aria-pressed={selected}
    >
      <span className="quiz-answer-key" aria-hidden="true">{optionKey}</span>
      <span className="quiz-answer-text">{text}</span>
    </button>
  );
}
