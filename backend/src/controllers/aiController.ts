import { supabase } from '../services/supabaseService';
import { aiService } from '../services/openaiService';

export const aiController = {
  async chatWithPatient(patientId: string, sessionId: string, sender: string, message: string) {
    if (!patientId || !message) {
      throw new Error('Missing required fields');
    }

    const { data, error } = await supabase
      .from('ai_chat_messages')
      .insert({
        session_id: sessionId,
        sender,
        message
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (sender === 'patient') {
      const { error: sessionError } = await supabase
        .from('ai_chat_sessions')
        .upsert({
          id: sessionId,
          patient_id: patientId,
          language: 'en'
        })
        .select()
        .single();

      if (sessionError) {
        console.error('Error updating session:', sessionError);
      }
    }

    return data;
  },

  async getChatSessions(patientId: string) {
    const { data, error } = await supabase
      .from('ai_chat_sessions')
      .select('*')
      .eq('patient_id', patientId)
      .order('started_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async getChatMessages(sessionId: string) {
    const { data, error } = await supabase
      .from('ai_chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async symptomChecker(patientId: string, symptoms: string[]) {
    if (!patientId || !symptoms || !Array.isArray(symptoms)) {
      throw new Error('Missing required fields or invalid symptoms format');
    }

    const result = await aiService.symptomChecker(symptoms);

    return result;
  },

  async generateTreatmentPlan(patientId: string, diagnosis: string) {
    if (!patientId || !diagnosis) {
      throw new Error('Missing required fields');
    }

    const result = await aiService.generateTreatmentPlan(diagnosis);

    return result;
  }
};
