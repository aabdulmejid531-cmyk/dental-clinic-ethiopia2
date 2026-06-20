import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callGemini } from '../_lib/gemini';

const SYSTEM_PROMPT = `You are a dental assistant chatbot for Dama Dental, a clinic in Addis Ababa, Ethiopia.
Answer only dental and oral-health questions. Keep replies under 120 words, warm, and practical.
If the user describes severe pain, swelling, trauma, or anything that sounds like an emergency, clearly tell them to visit the clinic or an emergency room — do not try to fully resolve it in chat.
Never state a definitive diagnosis; offer possibilities and next steps, and recommend an in-person exam for anything beyond simple hygiene advice.
Take into account dental patterns common in Ethiopia: khat (chat) chewing and its effect on gums and teeth, fluorosis from groundwater in some regions, staining from coffee and the coffee ceremony, and limited access to care outside major cities.
If the requested language is 'am', reply entirely in Amharic. Otherwise reply in English.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { message, language } = req.body ?? {};
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'message is required' });
      return;
    }

    const prompt = `Patient language: ${language === 'am' ? 'Amharic' : 'English'}\nPatient message: ${message}`;
    const reply = await callGemini(SYSTEM_PROMPT, prompt);
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'AI chat failed' });
  }
}
