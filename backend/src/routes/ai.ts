import express, { Request, Response } from 'express';
import { aiController } from '../controllers/aiController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const result = await aiController.chatWithPatient(
      req.body.patientId,
      req.body.sessionId,
      req.body.sender,
      req.body.message
    );
    res.json(result);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Missing required fields')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/symptom-check', authenticateToken, async (req: Request, res: Response) => {
  try {
    const result = await aiController.symptomChecker(req.body.patientId, req.body.symptoms);
    res.json(result);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Missing required fields or invalid symptoms format')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/treatment-plan', authenticateToken, async (req: Request, res: Response) => {
  try {
    const result = await aiController.generateTreatmentPlan(req.body.patientId, req.body.diagnosis);
    res.json(result);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Missing required fields')) {
      return res.status(400).json({ error: error.message });
    }
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

    const result = await aiController.getChatSessions(patientId);
    res.json(result);
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

    const result = await aiController.getChatMessages(sessionId);
    res.json(result);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Session not found')) {
      return res.status(404).json({ error: error.message });
    }
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
