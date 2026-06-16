import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export const useAppointments = () => {
  const { user } = useAuth();

  const { data: appointments, isLoading, error } = useQuery({
    queryKey: ['appointments', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patient:profiles!patient_id(full_name, phone),
          doctor:profiles!doctor_id(full_name, phone)
        `)
        .or(`patient_id.eq.${user.id},doctor_id.eq.${user.id}`)
        .order('datetime', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const bookAppointment = useMutation({
    mutationFn: async (appointmentData: any) => {
      const { data, error } = await supabase
        .from('appointments')
        .insert(appointmentData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Appointment booked successfully');
    },
    onError: (error) => {
      toast.error(`Failed to book appointment: ${error.message}`);
    },
  });

  return {
    appointments,
    isLoading,
    error,
    bookAppointment,
  };
};

export const useAI = () => {
  const { user } = useAuth();

  const chatMutation = useMutation({
    mutationFn: async ({ message, language }: { message: string; language: string }) => {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, language, patientId: user?.id }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'AI chat failed');
      }

      return response.json();
    },
    onError: (error) => {
      toast.error(`AI chat error: ${error.message}`);
    },
  });

  const symptomChecker = useMutation({
    mutationFn: async (symptoms: string[]) => {
      const response = await fetch('/api/ai/symptom-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Symptom check failed');
      }

      return response.json();
    },
    onError: (error) => {
      toast.error(`Symptom check error: ${error.message}`);
    },
  });

  const treatmentPlan = useMutation({
    mutationFn: async (diagnosis: string) => {
      const response = await fetch('/api/ai/treatment-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diagnosis }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Treatment plan failed');
      }

      return response.json();
    },
    onError: (error) => {
      toast.error(`Treatment plan error: ${error.message}`);
    },
  });

  return {
    chat: chatMutation,
    symptomChecker,
    treatmentPlan,
  };
};
