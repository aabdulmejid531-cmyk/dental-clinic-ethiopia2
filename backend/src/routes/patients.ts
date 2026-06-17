import express, { Request, Response } from 'express';
import { patientsController } from '../controllers/patientsController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const result = await patientsController.getPatientProfile(req.user.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    if (id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const result = await patientsController.updatePatientProfile(userId, req.body);
    res.json(result);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id/medical-records', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    if (id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const result = await patientsController.getMedicalRecords(id);
    res.json(result);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
