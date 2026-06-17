import { supabase } from '../services/supabaseService';

export const appointmentsController = {
  async createAppointment(appointmentData: any) {
    const { patientId, doctorId, datetime, reason, notes } = appointmentData;

    if (!patientId || !doctorId || !datetime) {
      throw new Error('Missing required fields');
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
      throw new Error(error.message);
    }

    return data;
  },

  async getAppointments(userId: string, role: string) {
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
      throw new Error(error.message);
    }

    return data;
  },

  async getAppointment(id: string, userId: string, role: string) {
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
      throw new Error('Appointment not found');
    }

    return data;
  },

  async updateAppointmentStatus(id: string, status: string, userId: string, role: string) {
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      throw new Error('Invalid status');
    }

    const { data, error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error('Appointment not found');
    }

    return data;
  }
};
