"use client";

import { useMemo, useState } from "react";
import {
  CAREER_QUESTIONS,
  CAREER_STEPS,
  INITIAL_FORM_VALUES,
  isArrayField,
  isQuestionAnswered,
} from "@/data/career-questionnaire";
import { QuestionCard } from "@/components/career/question-card";
import { StepProgress } from "@/components/career/step-progress";
import { ResultScreen } from "@/components/career/result-screen";
import { requestCareerResult } from "@/services/career-result-service";
import type {
  CareerFormValues,
  CareerQuestion,
  CareerResult,
} from "@/types/career";

type CareerFlowProps = {
  initialStarted?: boolean;
};

export function CareerFlow({ initialStarted = false }: CareerFlowProps) {
  const [started, setStarted] = useState(initialStarted);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [values, setValues] = useState<CareerFormValues>(INITIAL_FORM_VALUES);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<CareerResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const currentQuestion: CareerQuestion = CAREER_QUESTIONS[currentQuestionIndex];
  const totalQuestions = CAREER_QUESTIONS.length;
  const steps = CAREER_STEPS;

  const currentStepIndex = useMemo(
    () => steps.findIndex((step) => step.id === currentQuestion.stepId),
    [currentQuestion.stepId, steps]
  );
  const currentStepTitle = steps[currentStepIndex]?.subtitle ?? "";
  const progressPercent = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const canAdvance = isQuestionAnswered(currentQuestion, values);

  function handleStart(): void {
    setStarted(true);
  }

  function handleReset(): void {
    setStarted(false);
    setCurrentQuestionIndex(0);
    setValues(INITIAL_FORM_VALUES);
    setResult(null);
    setIsSubmitting(false);
    setErrorMessage("");
  }

  function setField(questionId: keyof CareerFormValues, rawValue: string): void {
    setErrorMessage("");

    if (isArrayField(questionId)) {
      setValues((previous) => {
        const selected = previous[questionId];
        const alreadySelected = selected.includes(rawValue);

        return {
          ...previous,
          [questionId]: alreadySelected
            ? selected.filter((item) => item !== rawValue)
            : [...selected, rawValue],
        };
      });
      return;
    }

    if (questionId === "age") {
      const parsed = Number(rawValue);

      setValues((previous) => ({
        ...previous,
        [questionId]: Number.isFinite(parsed) ? parsed : null,
      }));
      return;
    }

    setValues((previous) => ({
      ...previous,
      [questionId]: rawValue,
    }));
  }

  function goBack(): void {
    setCurrentQuestionIndex((previous) => Math.max(previous - 1, 0));
  }

  function goNext(): void {
    if (!canAdvance) {
      setErrorMessage("Responda a esta pergunta para continuar.");
      return;
    }

    setCurrentQuestionIndex((previous) =>
      Math.min(previous + 1, totalQuestions - 1)
    );
  }

  async function submit(): Promise<void> {
    if (!canAdvance) {
      setErrorMessage("Preencha a resposta para gerar seu resultado.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await requestCareerResult(values);
      setResult(response);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Erro inesperado ao gerar o resultado."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (result) {
    return <ResultScreen values={values} result={result} onRestart={handleReset} />;
  }

  if (!started) {
    return (
      <section className="intro-shell">
        <div className="intro-panel">
          <p className="intro-tag">AI CAREER SYSTEM</p>
          <h1>Seu próximo passo para uma carreira internacional</h1>
          <p>
            Descubra carreiras, países e um plano de estudos realista com base
            no seu perfil.
          </p>
          <button type="button" className="primary-btn" onClick={handleStart}>
            Iniciar diagnóstico
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="flow-shell">
      <StepProgress
        steps={steps}
        currentStepIndex={currentStepIndex}
        currentStepTitle={currentStepTitle}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        progressPercent={progressPercent}
      />

      <QuestionCard
        question={currentQuestion}
        value={values[currentQuestion.id]}
        disabled={isSubmitting}
        errorMessage={errorMessage}
        onChange={setField}
      />

      <footer className="flow-actions">
        <button
          type="button"
          className="ghost-btn"
          onClick={goBack}
          disabled={isFirstQuestion || isSubmitting}
        >
          Voltar
        </button>

        {!isLastQuestion ? (
          <button
            type="button"
            className="primary-btn"
            onClick={goNext}
            disabled={isSubmitting}
          >
            Próxima pergunta
          </button>
        ) : (
          <button
            type="button"
            className="primary-btn"
            onClick={submit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Gerando análise..." : "Ver resultado"}
          </button>
        )}

        <button
          type="button"
          className="ghost-btn"
          onClick={handleReset}
          disabled={isSubmitting}
        >
          Reiniciar
        </button>
      </footer>
    </section>
  );
}

