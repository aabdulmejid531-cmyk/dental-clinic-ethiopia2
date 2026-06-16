import express, { Request, Response } from 'express';
import { supabase } from '../services/supabaseService';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userId } = req.user;

    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, phone, role')
      .eq('id', userId)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/appointments/today', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userId } = req.user;

    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:profiles!patient_id(full_name, phone)
      `)
      .eq('doctor_id', userId)
      .eq('datetime', today)
      .order('datetime', { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/patients', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userId } = req.user;

    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, phone, address')
      .eq('role', 'patient')
      .limit(50);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
