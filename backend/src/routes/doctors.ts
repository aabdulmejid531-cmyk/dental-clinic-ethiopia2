import express, { Request, Response } from 'express';
import { doctorsController } from '../controllers/doctorsController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const result = await doctorsController.getDoctorProfile(req.user.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/appointments/today', authenticateToken, async (req: Request, res: Response) => {
  try {
    const result = await doctorsController.getTodayAppointments(req.user.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/patients', authenticateToken, async (req: Request, res: Response) => {
  try {
    const result = await doctorsController.getPatients(req.user.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
