import { supabase } from '../services/supabaseService';

export const patientsController = {
  async getPatientProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, phone, role')
      .eq('id', userId)
      .single();

    if (error) {
      throw new Error('Patient not found');
    }

    return data;
  },

  async updatePatientProfile(userId: string, profileData: any) {
    const { full_name, phone, address, emergency_contact } = profileData;

    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name,
        phone,
        address,
        emergency_contact
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async getMedicalRecords(patientId: string) {
    const { data, error } = await supabase
      .from('medical_records')
      .select(`
        *,
        doctor:profiles!doctor_id(full_name)
      `)
      .eq('patient_id', patientId)
      .order('visit_date', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
};
