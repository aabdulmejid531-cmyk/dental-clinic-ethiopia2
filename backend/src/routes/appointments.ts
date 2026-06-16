import express, { Request, Response } from 'express';
import { supabase } from '../services/supabaseService';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticateToken, requireRole(['patient', 'doctor', 'admin']), async (req: Request, res: Response) => {
  try {
    const { patientId, doctorId, datetime, reason, notes } = req.body;

    if (!patientId || !doctorId || !datetime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabase
      .from('appointments')
      .insert({
        patient_id: patientId,
        doctor_id: doctorId,
        datetime,
        reason,
        notes,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userId, role } = req.user;

    let query = supabase
      .from('appointments')
      .select(`
        *,
        patient:profiles!patient_id(full_name, phone),
        doctor:profiles!doctor_id(full_name, phone)
      `);

    if (role === 'patient') {
      query = query.eq('patient_id', userId);
    } else if (role === 'doctor') {
      query = query.eq('doctor_id', userId);
    }

    const { data, error } = await query.order('datetime', { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;

    let query = supabase
      .from('appointments')
      .select(`
        *,
        patient:profiles!patient_id(full_name, phone),
        doctor:profiles!doctor_id(full_name, phone)
      `)
      .eq('id', id);

    if (role === 'patient' || role === 'doctor') {
      query = query.or(`patient_id.eq.${userId},doctor_id.eq.${userId}`);
    }

    const { data, error } = await query.single();

    if (error) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/:id/status', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { userId, role } = req.user;

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const { data, error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
