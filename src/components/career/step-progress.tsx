import type { CareerStep } from "@/types/career";

interface StepProgressProps {
  steps: CareerStep[];
  currentStepIndex: number;
  currentStepTitle: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  progressPercent: number;
}

export function StepProgress({
  steps,
  currentStepIndex,
  currentStepTitle,
  currentQuestionIndex,
  totalQuestions,
  progressPercent,
}: StepProgressProps) {
  return (
    <header className="flow-header">
      <div className="flow-meta-row">
        <span className="flow-badge">AILA</span>
        <span className="flow-counter">
          Pergunta {currentQuestionIndex + 1} de {totalQuestions}
        </span>
      </div>

      <div className="flow-step-row">
        {steps.map((step, index) => {
          const state =
            index < currentStepIndex
              ? "done"
              : index === currentStepIndex
                ? "current"
                : "upcoming";

          return (
            <div key={step.id} className={`step-chip step-${state}`}>
              <span>{step.title}</span>
              <strong>{step.subtitle}</strong>
            </div>
          );
        })}
      </div>

      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progressPercent)}
      >
        <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
      </div>

      <p className="flow-step-label">Seção atual: {currentStepTitle}</p>
    </header>
  );
}
