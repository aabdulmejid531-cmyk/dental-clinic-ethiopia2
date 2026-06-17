import express, { Request, Response } from 'express';
import { appointmentsController } from '../controllers/appointmentsController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticateToken, requireRole(['patient', 'doctor', 'admin']), async (req: Request, res: Response) => {
  try {
    const result = await appointmentsController.createAppointment(req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Missing required fields')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userId, role } = req.user;
    const result = await appointmentsController.getAppointments(userId, role);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;
    const result = await appointmentsController.getAppointment(id, userId, role);
    res.json(result);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Appointment not found')) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/:id/status', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { userId, role } = req.user;
    const result = await appointmentsController.updateAppointmentStatus(id, status, userId, role);
    res.json(result);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Invalid status')) {
      return res.status(400).json({ error: error.message });
    }
    if (error instanceof Error && error.message.includes('Appointment not found')) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
