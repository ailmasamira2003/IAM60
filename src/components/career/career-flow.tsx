"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CAREER_STEPS,
  INITIAL_FORM_VALUES,
  getVisibleCareerQuestions,
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

  const steps = CAREER_STEPS;
  const questions = useMemo(() => getVisibleCareerQuestions(values), [values]);
  const totalQuestions = questions.length;
  const safeCurrentQuestionIndex = Math.min(currentQuestionIndex, totalQuestions - 1);
  const currentQuestion: CareerQuestion = questions[safeCurrentQuestionIndex];

  useEffect(() => {
    setCurrentQuestionIndex((previous) => Math.min(previous, totalQuestions - 1));
  }, [totalQuestions]);

  const currentStepIndex = useMemo(
    () => steps.findIndex((step) => step.id === currentQuestion.stepId),
    [currentQuestion.stepId, steps]
  );
  const currentStepTitle = steps[currentStepIndex]?.subtitle ?? "";
  const progressPercent = ((safeCurrentQuestionIndex + 1) / totalQuestions) * 100;
  const isFirstQuestion = safeCurrentQuestionIndex === 0;
  const isLastQuestion = safeCurrentQuestionIndex === totalQuestions - 1;
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

    if (questionId === "currentlyWorking") {
      setValues((previous) => ({
        ...previous,
        currentlyWorking: rawValue,
        workInGraduationArea:
          rawValue === "Sim" ? previous.workInGraduationArea : "",
        currentProfession: rawValue === "Sim" ? previous.currentProfession : "",
      }));
      return;
    }

    if (questionId === "intendsCareerChange") {
      setValues((previous) => ({
        ...previous,
        intendsCareerChange: rawValue,
        targetProfession: rawValue === "Sim" ? previous.targetProfession : "",
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

  const goNext = useCallback((): void => {
    if (!canAdvance) {
      setErrorMessage("Responda a esta pergunta para continuar.");
      return;
    }

    setCurrentQuestionIndex((previous) =>
      Math.min(previous + 1, totalQuestions - 1)
    );
  }, [canAdvance, totalQuestions]);

  const submit = useCallback(async (): Promise<void> => {
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
  }, [canAdvance, values]);

  useEffect(() => {
    if (!started || result) {
      return;
    }

    function handleGlobalEnter(event: KeyboardEvent): void {
      if (event.key !== "Enter" || event.isComposing) {
        return;
      }

      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
        return;
      }

      if (isSubmitting) {
        return;
      }

      const target = event.target;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      if (target.tagName === "TEXTAREA") {
        return;
      }

      if (target.closest(".flow-actions")) {
        return;
      }

      const isChoiceButton = target.classList.contains("choice-btn");
      if (isChoiceButton && !canAdvance) {
        return;
      }

      event.preventDefault();

      if (isLastQuestion) {
        void submit();
        return;
      }

      goNext();
    }

    window.addEventListener("keydown", handleGlobalEnter);

    return () => {
      window.removeEventListener("keydown", handleGlobalEnter);
    };
  }, [canAdvance, goNext, isLastQuestion, isSubmitting, result, started, submit]);

  if (result) {
    return <ResultScreen values={values} result={result} />;
  }

  if (!started) {
    return (
      <section className="intro-shell">
        <div className="intro-panel">
          <p className="intro-tag">AILA</p>
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
        currentQuestionIndex={safeCurrentQuestionIndex}
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
