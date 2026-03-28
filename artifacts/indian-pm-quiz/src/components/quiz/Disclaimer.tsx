export function Disclaimer({ variant = "landing" }: { variant?: "landing" | "result" }) {
  const text =
    variant === "landing"
      ? "For fun and reflection only. This quiz is a light personality match based on broad leadership styles. It is not a historical, political, or factual assessment."
      : "This result is a playful interpretation based on your answers. It is not a factual, political, or psychological assessment of you or any public figure.";

  return (
    <p className="quiz-disclaimer">
      {text}
    </p>
  );
}
