import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  bookAppointment,
  listDoctorAppointments,
  listMyAppointments,
  updateAppointmentStatus
} from '../services/appointmentService';
import type { AppointmentStatus } from '../services/database.types';

export function usePatientAppointments(patientId: string | undefined) {
  return useQuery({
    queryKey: ['appointments', 'patient', patientId],
    queryFn: () => listMyAppointments(patientId as string),
    enabled: Boolean(patientId)
  });
}

export function useDoctorAppointments(doctorId: string | undefined, day: string) {
  return useQuery({
    queryKey: ['appointments', 'doctor', doctorId, day],
    queryFn: () => listDoctorAppointments(doctorId as string, day),
    enabled: Boolean(doctorId)
  });
}

export function useBookAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    }
  });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) =>
      updateAppointmentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    }
  });
}
