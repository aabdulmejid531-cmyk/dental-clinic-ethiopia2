import type { Language, Urgency } from './database.types';

export interface ChatResponse {
  reply: string;
}

export interface SymptomCheckResponse {
  possibleConditions: string[];
  urgency: Urgency;
  recommendedAction: string;
}

export interface TreatmentPlanResponse {
  steps: string[];
  estimatedCostBirr: { low: number; high: number };
  postOpInstructions: string[];
}

async function postJSON<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(`AI request failed (${res.status}): ${errText}`);
  }
  return res.json() as Promise<T>;
}

export function chatWithAI(message: string, language: Language, patientId?: string) {
  return postJSON<ChatResponse>('/api/ai/chat', { message, language, patientId });
}

export function checkSymptoms(symptoms: string[], language: Language) {
  return postJSON<SymptomCheckResponse>('/api/ai/symptom-check', { symptoms, language });
}

export function generateTreatmentPlan(diagnosis: string, language: Language) {
  return postJSON<TreatmentPlanResponse>('/api/ai/treatment-plan', { diagnosis, language });
}
