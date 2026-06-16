import OpenAI from 'openai';
import { supabase } from './supabaseService';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY,
});

export const aiService = {
  async chatWithPatient(message: string, language: string, patientId?: string) {
    const systemPrompt = `You are a dental assistant for an Ethiopian clinic. Answer only dental/health questions. If the user describes pain or emergency, advise visiting a clinic immediately. Reply in ${language === 'am' ? 'Amharic' : 'English'}. Consider local habits (khat, coffee) and common dental issues in Ethiopia. Keep responses concise and practical. Use appropriate cultural context for Ethiopian patients.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;

    if (patientId) {
      await supabase.from('ai_chat_messages').insert({
        session_id: patientId,
        sender: 'ai',
        message: aiResponse
      });
    }

    return aiResponse;
  },

  async symptomChecker(symptoms: string[]) {
    const systemPrompt = `You are a dental triage assistant for Ethiopian patients. Analyze the provided symptoms and give:
    1. Possible dental conditions (list 2-3 most likely)
    2. Urgency level (low/medium/high)
    3. Recommended action (home care, clinic visit, emergency)
    
    Consider common Ethiopian dental issues: khat chewing effects, fluorosis, gum disease patterns, coffee/tea consumption effects.
    
    Respond in JSON format with fields: conditions (array), urgency (string), recommendation (string).`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Symptoms: ${symptoms.join(', ')}` }
      ],
      max_tokens: 300,
      temperature: 0.3,
    });

    const response = completion.choices[0].message.content;
    
    try {
      return JSON.parse(response || '{}');
    } catch {
      return {
        conditions: ['Unable to determine'],
        urgency: 'medium',
        recommendation: 'Please visit a dental clinic for proper evaluation.'
      };
    }
  },

  async generateTreatmentPlan(diagnosis: string) {
    const systemPrompt = `You are an AI dental treatment planner for Ethiopian clinics. Given a diagnosis, provide:
    1. Step-by-step treatment plan
    2. Estimated cost in Ethiopian Birr (ETB)
    3. Post-operative care instructions
    4. Alternative low-cost options if available
    
    Consider local healthcare infrastructure and typical costs in Ethiopia.
    
    Respond in JSON format with fields: plan (array), cost_etb (number), post_op_care (string), alternatives (array).`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Diagnosis: ${diagnosis}` }
      ],
      max_tokens: 500,
      temperature: 0.5,
    });

    const response = completion.choices[0].message.content;
    
    try {
      return JSON.parse(response || '{}');
    } catch {
      return {
        plan: ['Consult with dentist for proper evaluation'],
        cost_etb: 0,
        post_op_care: 'Follow dentist\'s instructions carefully',
        alternatives: ['Public health clinic', 'Charity dental clinic']
      };
    }
  }
};
