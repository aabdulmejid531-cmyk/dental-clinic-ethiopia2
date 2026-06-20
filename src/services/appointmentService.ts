import { supabase } from './supabaseClient';
import type { Appointment, AppointmentStatus } from './database.types';

export async function listMyAppointments(patientId: string): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('patient_id', patientId)
    .order('datetime', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Appointment[];
}

export async function listDoctorAppointments(doctorId: string, day: string): Promise<Appointment[]> {
  const start = `${day}T00:00:00`;
  const end = `${day}T23:59:59`;
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('doctor_id', doctorId)
    .gte('datetime', start)
    .lte('datetime', end)
    .order('datetime', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Appointment[];
}

export async function bookAppointment(input: {
  patientId: string;
  doctorId?: string;
  datetime: string;
  reason: string;
}): Promise<Appointment> {
  const payload = {
    patient_id: input.patientId,
    doctor_id: input.doctorId ?? null,
    datetime: input.datetime,
    reason: input.reason,
    status: 'pending' as const
  };
  const { data, error } = await supabase.from('appointments').insert(payload).select().single();
  if (error) throw error;
  return data as Appointment;
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Promise<void> {
  const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
  if (error) throw error;
}
