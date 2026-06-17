const API_BASE = import.meta.env.VITE_API_URL || '';

export const aiService = {
  async chatWithPatient(message: string, language: string, patientId?: string) {
    const response = await fetch(`${API_BASE}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, language, patientId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'AI chat failed');
    }

    return response.json();
  },

  async symptomChecker(symptoms: string[]) {
    const response = await fetch(`${API_BASE}/api/ai/symptom-check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symptoms }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Symptom check failed');
    }

    return response.json();
  },

  async treatmentPlan(diagnosis: string) {
    const response = await fetch(`${API_BASE}/api/ai/treatment-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ diagnosis }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Treatment plan failed');
    }

    return response.json();
  }
};
