"use client";

import { create } from "zustand";
import { CAREER_QUESTIONS, INITIAL_FORM_VALUES } from "@/data/career-questionnaire";
import type {
  ArrayQuestionField,
  CareerFormValues,
  CareerResult,
  ChatMessage,
  NonArrayQuestionField,
} from "@/types/career";

interface CareerStoreState {
  started: boolean;
  currentQuestionIndex: number;
  values: CareerFormValues;
  isSubmitting: boolean;
  result: CareerResult | null;
  chatMessages: ChatMessage[];
  startFlow: () => void;
  resetFlow: () => void;
  previousQuestion: () => void;
  nextQuestion: () => void;
  setFieldValue: <K extends NonArrayQuestionField>(
    field: K,
    value: CareerFormValues[K]
  ) => void;
  toggleArrayValue: (field: ArrayQuestionField, value: string) => void;
  setSubmitting: (submitting: boolean) => void;
  setResult: (result: CareerResult | null) => void;
  addChatMessage: (message: Omit<ChatMessage, "id">) => void;
  clearChat: () => void;
}

export const useCareerStore = create<CareerStoreState>((set) => ({
  started: false,
  currentQuestionIndex: 0,
  values: INITIAL_FORM_VALUES,
  isSubmitting: false,
  result: null,
  chatMessages: [],
  startFlow: () => set({ started: true }),
  resetFlow: () =>
    set({
      started: false,
      currentQuestionIndex: 0,
      values: INITIAL_FORM_VALUES,
      result: null,
      isSubmitting: false,
      chatMessages: [],
    }),
  previousQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
    })),
  nextQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.min(
        state.currentQuestionIndex + 1,
        CAREER_QUESTIONS.length - 1
      ),
    })),
  setFieldValue: (field, value) =>
    set((state) => ({
      values: {
        ...state.values,
        [field]: value,
      },
    })),
  toggleArrayValue: (field, value) =>
    set((state) => {
      const currentValues = state.values[field];
      const alreadySelected = currentValues.includes(value);

      return {
        values: {
          ...state.values,
          [field]: alreadySelected
            ? currentValues.filter((item) => item !== value)
            : [...currentValues, value],
        },
      };
    }),
  setSubmitting: (submitting) => set({ isSubmitting: submitting }),
  setResult: (result) => set({ result }),
  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [
        ...state.chatMessages,
        {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          ...message,
        },
      ],
    })),
  clearChat: () => set({ chatMessages: [] }),
}));
