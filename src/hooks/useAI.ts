import { useMutation } from '@tanstack/react-query';
import { chatWithAI, checkSymptoms, generateTreatmentPlan } from '../services/aiService';
import type { Language } from '../services/database.types';

export function useAIChat() {
  return useMutation({
    mutationFn: ({
      message,
      language,
      patientId
    }: {
      message: string;
      language: Language;
      patientId?: string;
    }) => chatWithAI(message, language, patientId)
  });
}

export function useSymptomCheck() {
  return useMutation({
    mutationFn: ({ symptoms, language }: { symptoms: string[]; language: Language }) =>
      checkSymptoms(symptoms, language)
  });
}

export function useTreatmentPlan() {
  return useMutation({
    mutationFn: ({ diagnosis, language }: { diagnosis: string; language: Language }) =>
      generateTreatmentPlan(diagnosis, language)
  });
}
