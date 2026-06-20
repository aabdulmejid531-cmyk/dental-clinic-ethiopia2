import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callGemini, extractJSON } from '../_lib/gemini';
import type { TreatmentPlanResponse } from '../../src/services/aiService';

const SYSTEM_PROMPT = `You are a clinical support assistant helping a licensed dentist in Ethiopia draft a treatment plan.
The dentist gives you a diagnosis; you respond with ONLY a JSON object — no prose, no markdown fences — in this exact shape:
{"steps": string[], "estimatedCostBirr": {"low": number, "high": number}, "postOpInstructions": string[]}
"steps" is a short ordered list of clinical steps (e.g. local anesthesia, caries removal, restoration).
"estimatedCostBirr" should be a realistic Ethiopian private-clinic price range in Birr for the procedure implied by the diagnosis.
"postOpInstructions" is 2-4 short patient-facing care instructions.
This output is a starting draft for the dentist to review and edit — it is never shown to a patient unedited. Write in the requested language.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { diagnosis, language } = req.body ?? {};
    if (!diagnosis || typeof diagnosis !== 'string') {
      res.status(400).json({ error: 'diagnosis is required' });
      return;
    }

    const prompt = `Language: ${language === 'am' ? 'Amharic' : 'English'}\nDiagnosis: ${diagnosis}`;
    const raw = await callGemini(SYSTEM_PROMPT, prompt);
    const parsed = extractJSON<TreatmentPlanResponse>(raw);
    res.status(200).json(parsed);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Treatment plan generation failed' });
  }
}
