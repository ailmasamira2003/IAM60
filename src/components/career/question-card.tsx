import type { CareerFormValues, CareerQuestion } from "@/types/career";

interface QuestionCardProps {
  question: CareerQuestion;
  value: CareerFormValues[CareerQuestion["id"]];
  disabled: boolean;
  errorMessage: string;
  onChange: (questionId: CareerQuestion["id"], value: string) => void;
}

function renderOptionButton(
  option: string,
  isSelected: boolean,
  disabled: boolean,
  onClick: () => void
) {
  return (
    <button
      type="button"
      key={option}
      className={`choice-btn ${isSelected ? "choice-active" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {option}
    </button>
  );
}

export function QuestionCard({
  question,
  value,
  disabled,
  errorMessage,
  onChange,
}: QuestionCardProps) {
  const normalizedValue = Array.isArray(value)
    ? value
    : typeof value === "number"
      ? String(value)
      : value;

  return (
    <section key={question.id} className="question-card question-transition">
      <p className="question-kicker">Pergunta-chave</p>
      <h2 className="question-title">{question.title}</h2>
      <p className="question-helper">{question.helper}</p>

      {question.type === "text" ? (
        <label className="field-wrapper" htmlFor={question.id}>
          <span className="sr-only">Resposta</span>
          <input
            id={question.id}
            className="text-field"
            type="text"
            placeholder={question.placeholder}
            value={normalizedValue as string}
            onChange={(event) => onChange(question.id, event.target.value)}
            disabled={disabled}
            autoFocus
          />
        </label>
      ) : null}

      {question.type === "number" ? (
        <label className="field-wrapper" htmlFor={question.id}>
          <span className="sr-only">Resposta numérica</span>
          <input
            id={question.id}
            className="text-field"
            type="number"
            min={question.min}
            max={question.max}
            placeholder={question.placeholder}
            value={normalizedValue as string}
            onChange={(event) => onChange(question.id, event.target.value)}
            disabled={disabled}
            autoFocus
          />
        </label>
      ) : null}

      {question.type === "single-choice" ? (
        <div className="choice-grid" role="radiogroup" aria-label={question.title}>
          {(question.options ?? []).map((option) =>
            renderOptionButton(
              option,
              normalizedValue === option,
              disabled,
              () => onChange(question.id, option)
            )
          )}
        </div>
      ) : null}

      {question.type === "multi-choice" ? (
        <div className="choice-grid" role="group" aria-label={question.title}>
          {(question.options ?? []).map((option) =>
            renderOptionButton(
              option,
              (normalizedValue as string[]).includes(option),
              disabled,
              () => onChange(question.id, option)
            )
          )}
        </div>
      ) : null}

      {errorMessage ? <p className="error-message">{errorMessage}</p> : null}
    </section>
  );
}

