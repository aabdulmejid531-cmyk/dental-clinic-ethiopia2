import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callGemini, extractJSON } from '../_lib/gemini';
import type { SymptomCheckResponse } from '../../src/services/aiService';

const SYSTEM_PROMPT = `You are a dental triage assistant for a clinic in Ethiopia.
Given a list of symptoms, respond with ONLY a JSON object — no prose, no markdown fences — in this exact shape:
{"possibleConditions": string[], "urgency": "low" | "medium" | "high", "recommendedAction": string}
"possibleConditions" should list 2-4 plausible, plain-language possibilities (never a certain diagnosis).
"urgency" should be "high" for signs of infection, swelling, trauma, or severe/spreading pain; "medium" for persistent pain or bleeding; "low" for mild or cosmetic concerns.
"recommendedAction" is one short sentence telling the patient what to do next.
Write in the requested language (Amharic for 'am', English otherwise).`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { symptoms, language } = req.body ?? {};
    if (!Array.isArray(symptoms) || symptoms.length === 0) {
      res.status(400).json({ error: 'symptoms must be a non-empty array' });
      return;
    }

    const prompt = `Language: ${language === 'am' ? 'Amharic' : 'English'}\nSymptoms: ${symptoms.join(', ')}`;
    const raw = await callGemini(SYSTEM_PROMPT, prompt);
    const parsed = extractJSON<SymptomCheckResponse>(raw);
    res.status(200).json(parsed);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Symptom check failed' });
  }
}
