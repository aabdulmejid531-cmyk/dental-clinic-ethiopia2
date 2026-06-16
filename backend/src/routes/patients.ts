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
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json(data);
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

    const { full_name, phone, address, emergency_contact } = req.body;

    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name,
        phone,
        address,
        emergency_contact
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
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

    const { data, error } = await supabase
      .from('medical_records')
      .select(`
        *,
        doctor:profiles!doctor_id(full_name)
      `)
      .eq('patient_id', id)
      .order('visit_date', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
