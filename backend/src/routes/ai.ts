import express, { Request, Response } from 'express';
import { supabase } from '../services/supabaseService';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { patientId, sessionId, sender, message } = req.body;

    if (!patientId || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
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
      return res.status(500).json({ error: error.message });
    }

    if (sender === 'patient') {
      const { data: session, error: sessionError } = await supabase
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

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/sessions/:patientId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    const { userId } = req.user;

    if (patientId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('ai_chat_sessions')
      .select('*')
      .eq('patient_id', patientId)
      .order('started_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/messages/:sessionId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { userId } = req.user;

    const { data: session, error: sessionError } = await supabase
      .from('ai_chat_sessions')
      .select('patient_id')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.patient_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('ai_chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
