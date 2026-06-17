import { supabase } from '../services/supabaseService';

export const doctorsController = {
  async getDoctorProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, phone, role')
      .eq('id', userId)
      .single();

    if (error) {
      throw new Error('Doctor not found');
    }

    return data;
  },

  async getTodayAppointments(doctorId: string) {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:profiles!patient_id(full_name, phone)
      `)
      .eq('doctor_id', doctorId)
      .eq('datetime', today)
      .order('datetime', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async getPatients(doctorId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, phone, address')
      .eq('role', 'patient')
      .limit(50);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
};
