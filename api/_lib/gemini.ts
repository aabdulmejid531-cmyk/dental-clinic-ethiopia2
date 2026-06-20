/**
 * Shared helper for calling Google Gemini's free-tier API from Vercel
 * serverless functions. Swap GEMINI_MODEL or this whole file for an
 * OpenAI call if you'd rather use GPT — the rest of the app only talks
 * to /api/ai/*, so it doesn't care which provider sits behind it.
 */

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

export async function callGemini(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set. Add it in Vercel → Project → Settings → Environment Variables.');
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 700 }
      })
    }
  );

  if (!res.ok) {
    const detail = await res.text().catch(() => res.statusText);
    throw new Error(`Gemini API error (${res.status}): ${detail}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? '').join('');
  if (!text) throw new Error('Gemini returned an empty response.');
  return text.trim();
}

/** Pulls the first {...} or [...] block out of a model reply and parses it as JSON. */
export function extractJSON<T>(raw: string): T {
  const match = raw.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  if (!match) throw new Error('Could not find JSON in the AI response.');
  return JSON.parse(match[0]) as T;
}
