import { useState, type FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDoctorAppointments, useUpdateAppointmentStatus } from '../hooks/useAppointments';
import { useTreatmentPlan } from '../hooks/useAI';
import { StatusPill } from '../components/ui/StatusPill';
import { supabase } from '../services/supabaseClient';
import type { Appointment } from '../services/database.types';
import type { Language } from '../utils/translations';

export function DoctorDashboard({ lang }: { lang: Language }) {
  const { profile, user } = useAuth();
  const today = new Date().toISOString().split('T')[0];
  const { data: appointments, isLoading } = useDoctorAppointments(user?.id, today);
  const updateStatus = useUpdateAppointmentStatus();
  const treatmentPlan = useTreatmentPlan();

  const [selected, setSelected] = useState<Appointment | null>(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSaveRecord(e: FormEvent) {
    e.preventDefault();
    if (!selected || !user) return;
    setSaving(true);
    setSavedMsg(null);
    try {
      const { error } = await supabase.from('medical_records').insert({
        patient_id: selected.patient_id,
        doctor_id: user.id,
        diagnosis,
        treatment_plan: treatmentPlan.data?.steps.join('\n') ?? null,
        ai_suggestions: treatmentPlan.data ? JSON.stringify(treatmentPlan.data) : null,
        visit_date: today
      });
      if (error) throw error;
      await updateStatus.mutateAsync({ id: selected.id, status: 'completed' });
      setSavedMsg('Record saved and appointment marked complete.');
      setDiagnosis('');
    } catch (err) {
      setSavedMsg(err instanceof Error ? err.message : 'Could not save this record.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">Doctor dashboard</p>
        <h1 className="font-display text-3xl font-medium text-teal-900">
          Today · {profile?.full_name ?? ''}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Today's appointments */}
        <div className="card">
          <h2 className="font-display text-lg font-semibold text-teal-900">Today's appointments</h2>
          <div className="mt-4 space-y-3">
            {isLoading && <p className="text-sm text-ink/50">Loading…</p>}
            {!isLoading && appointments?.length === 0 && (
              <p className="rounded-xl border border-dashed border-teal-700/20 p-6 text-center text-sm text-ink/50">
                No appointments scheduled for today.
              </p>
            )}
            {appointments?.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setSelected(a)}
                className={`block w-full rounded-xl border p-4 text-left transition ${
                  selected?.id === a.id
                    ? 'border-teal-700 bg-teal-700/5'
                    : 'border-teal-700/10 hover:border-teal-700/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-teal-900">
                    {new Date(a.datetime).toLocaleTimeString(lang === 'am' ? 'am-ET' : 'en-GB', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <StatusPill status={a.status} />
                </div>
                <p className="mt-1 text-sm text-ink/60">{a.reason}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Diagnosis + AI treatment plan */}
        <div className="card">
          <h2 className="font-display text-lg font-semibold text-teal-900">Write diagnosis</h2>
          {!selected ? (
            <p className="mt-4 rounded-xl border border-dashed border-teal-700/20 p-6 text-center text-sm text-ink/50">
              Select an appointment to write up a diagnosis and treatment plan.
            </p>
          ) : (
            <form onSubmit={handleSaveRecord} className="mt-4 space-y-4">
              <div>
                <label className="label-field" htmlFor="diagnosis">Diagnosis</label>
                <textarea
                  id="diagnosis"
                  required
                  rows={3}
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="input-field resize-none"
                  placeholder="e.g. Deep caries on tooth 36, moderate gingivitis"
                />
              </div>

              <button
                type="button"
                disabled={!diagnosis.trim() || treatmentPlan.isPending}
                onClick={() => treatmentPlan.mutate({ diagnosis, language: lang })}
                className="btn-secondary"
              >
                {treatmentPlan.isPending ? 'Generating…' : 'Suggest treatment plan with AI'}
              </button>

              {treatmentPlan.data && (
                <div className="rounded-xl border border-teal-700/10 bg-sand-50 p-4 text-sm">
                  <p className="font-semibold text-teal-800">Suggested steps</p>
                  <ol className="mt-1.5 list-decimal space-y-1 pl-5 text-ink/70">
                    {treatmentPlan.data.steps.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                  <p className="mt-3 font-semibold text-teal-800">
                    Estimated cost: {treatmentPlan.data.estimatedCostBirr.low.toLocaleString()}–
                    {treatmentPlan.data.estimatedCostBirr.high.toLocaleString()} Birr
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-wide text-ink/40">
                    AI-generated — review before sharing with the patient.
                  </p>
                </div>
              )}

              {savedMsg && <p className="text-sm text-teal-700">{savedMsg}</p>}

              <button type="submit" disabled={saving} className="btn-primary w-full">
                {saving ? 'Saving…' : 'Save record & mark complete'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
