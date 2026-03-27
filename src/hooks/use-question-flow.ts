"use client";

import { useMemo, useState } from "react";
import {
  CAREER_QUESTIONS,
  CAREER_STEPS,
  isArrayField,
  isQuestionAnswered,
} from "@/data/career-questionnaire";
import { requestCareerResult } from "@/services/career-result-service";
import { useCareerStore } from "@/store/career-store";
import type { CareerQuestion } from "@/types/career";

interface QuestionFlowState {
  currentQuestion: CareerQuestion;
  currentStepIndex: number;
  currentStepTitle: string;
  progressPercent: number;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  canAdvance: boolean;
  errorMessage: string;
}

export function useQuestionFlow() {
  const {
    currentQuestionIndex,
    values,
    isSubmitting,
    previousQuestion,
    nextQuestion,
    setFieldValue,
    toggleArrayValue,
    setSubmitting,
    setResult,
  } = useCareerStore();

  const [errorMessage, setErrorMessage] = useState("");

  const currentQuestion = CAREER_QUESTIONS[currentQuestionIndex];

  const state: QuestionFlowState = useMemo(() => {
    const stepIndex = CAREER_STEPS.findIndex(
      (step) => step.id === currentQuestion.stepId
    );

    return {
      currentQuestion,
      currentStepIndex: stepIndex,
      currentStepTitle: CAREER_STEPS[stepIndex]?.subtitle ?? "",
      progressPercent:
        ((currentQuestionIndex + 1) / CAREER_QUESTIONS.length) * 100,
      isFirstQuestion: currentQuestionIndex === 0,
      isLastQuestion: currentQuestionIndex === CAREER_QUESTIONS.length - 1,
      canAdvance: isQuestionAnswered(currentQuestion, values),
      errorMessage,
    };
  }, [currentQuestion, currentQuestionIndex, errorMessage, values]);

  function setField(questionId: keyof typeof values, rawValue: string): void {
    setErrorMessage("");

    if (isArrayField(questionId)) {
      toggleArrayValue(questionId, rawValue);
      return;
    }

    if (questionId === "age") {
      const parsed = Number(rawValue);
      if (!Number.isFinite(parsed)) {
        setFieldValue(questionId, null);
        return;
      }

      setFieldValue(questionId, parsed);
      return;
    }

    setFieldValue(questionId, rawValue);
  }

  function goNext(): void {
    if (!state.canAdvance) {
      setErrorMessage("Responda a esta pergunta para continuar.");
      return;
    }

    nextQuestion();
  }

  async function submit(): Promise<void> {
    if (!state.canAdvance) {
      setErrorMessage("Preencha a resposta para gerar seu resultado.");
      return;
    }

    setErrorMessage("");
    setSubmitting(true);

    try {
      const result = await requestCareerResult(values);
      setResult(result);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Erro inesperado ao gerar o resultado."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return {
    currentQuestionIndex,
    values,
    isSubmitting,
    state,
    totalQuestions: CAREER_QUESTIONS.length,
    questions: CAREER_QUESTIONS,
    steps: CAREER_STEPS,
    setField,
    goNext,
    goBack: previousQuestion,
    submit,
  };
}


