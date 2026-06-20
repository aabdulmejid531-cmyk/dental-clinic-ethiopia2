import { useState, type FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useBookAppointment, usePatientAppointments } from '../hooks/useAppointments';
import { useSymptomCheck } from '../hooks/useAI';
import { StatusPill } from '../components/ui/StatusPill';
import type { Language } from '../utils/translations';

const SYMPTOM_OPTIONS = [
  'Toothache',
  'Bleeding gums',
  'Sensitivity to cold/hot',
  'Swelling',
  'Bad breath',
  'Loose tooth',
  'Jaw pain'
];

const URGENCY_STYLES: Record<string, string> = {
  low: 'bg-teal-500/10 text-teal-700 border-teal-500/30',
  medium: 'bg-gold-400/15 text-gold-600 border-gold-400/30',
  high: 'bg-coral-400/10 text-coral-500 border-coral-400/30'
};

export function PatientDashboard({ lang }: { lang: Language }) {
  const { profile, user } = useAuth();
  const { data: appointments, isLoading } = usePatientAppointments(user?.id);
  const bookAppointment = useBookAppointment();
  const symptomCheck = useSymptomCheck();

  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00');
  const [reason, setReason] = useState('');
  const [bookError, setBookError] = useState<string | null>(null);
  const [bookSuccess, setBookSuccess] = useState(false);

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  async function handleBook(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBookError(null);
    setBookSuccess(false);
    try {
      await bookAppointment.mutateAsync({
        patientId: user.id,
        datetime: `${date}T${time}:00`,
        reason
      });
      setBookSuccess(true);
      setReason('');
    } catch (err) {
      setBookError(err instanceof Error ? err.message : 'Could not book this appointment.');
    }
  }

  function toggleSymptom(s: string) {
    setSelectedSymptoms((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">Patient dashboard</p>
        <h1 className="font-display text-3xl font-medium text-teal-900">
          {lang === 'am' ? `እንኳን ደህና መጡ፣ ${profile?.full_name ?? ''}` : `Welcome back, ${profile?.full_name?.split(' ')[0] ?? ''}`}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Book appointment */}
        <div className="card lg:col-span-1">
          <h2 className="font-display text-lg font-semibold text-teal-900">Book an appointment</h2>
          <form onSubmit={handleBook} className="mt-4 space-y-4">
            <div>
              <label className="label-field" htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field" htmlFor="time">Time</label>
              <input
                id="time"
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field" htmlFor="reason">Reason for visit</label>
              <textarea
                id="reason"
                required
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="input-field resize-none"
                placeholder="Routine cleaning, tooth pain, follow-up…"
              />
            </div>
            {bookError && <p className="text-sm text-coral-500">{bookError}</p>}
            {bookSuccess && (
              <p className="text-sm text-teal-700">
                Request sent — we'll confirm shortly and notify you here.
              </p>
            )}
            <button type="submit" disabled={bookAppointment.isPending} className="btn-primary w-full">
              {bookAppointment.isPending ? 'Booking…' : 'Request appointment'}
            </button>
          </form>
        </div>

        {/* Upcoming appointments */}
        <div className="card lg:col-span-2">
          <h2 className="font-display text-lg font-semibold text-teal-900">Your appointments</h2>
          <div className="mt-4 space-y-3">
            {isLoading && <p className="text-sm text-ink/50">Loading appointments…</p>}
            {!isLoading && appointments?.length === 0 && (
              <p className="rounded-xl border border-dashed border-teal-700/20 p-6 text-center text-sm text-ink/50">
                No appointments yet — book your first visit using the form.
              </p>
            )}
            {appointments?.map((a) => (
              <div
                key={a.id}
                className="flex flex-col gap-2 rounded-xl border border-teal-700/10 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-teal-900">
                    {new Date(a.datetime).toLocaleString(lang === 'am' ? 'am-ET' : 'en-GB', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p className="text-sm text-ink/60">{a.reason}</p>
                </div>
                <StatusPill status={a.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Symptom checker */}
        <div className="card lg:col-span-3">
          <h2 className="font-display text-lg font-semibold text-teal-900">Quick symptom check</h2>
          <p className="mt-1 text-sm text-ink/55">
            Select what you're feeling. This gives you a sense of urgency — it never replaces a real exam.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {SYMPTOM_OPTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleSymptom(s)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                  selectedSymptoms.includes(s)
                    ? 'border-teal-700 bg-teal-700 text-white'
                    : 'border-teal-700/20 bg-white text-teal-800 hover:bg-teal-700/5'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={selectedSymptoms.length === 0 || symptomCheck.isPending}
            onClick={() => symptomCheck.mutate({ symptoms: selectedSymptoms, language: lang })}
            className="btn-secondary mt-4"
          >
            {symptomCheck.isPending ? 'Checking…' : 'Check urgency'}
          </button>

          {symptomCheck.data && (
            <div className="mt-5 rounded-xl border border-teal-700/10 bg-sand-50 p-5">
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase ${
                  URGENCY_STYLES[symptomCheck.data.urgency]
                }`}
              >
                {symptomCheck.data.urgency} urgency
              </span>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink/70">
                {symptomCheck.data.possibleConditions.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <p className="mt-3 text-sm font-medium text-teal-800">{symptomCheck.data.recommendedAction}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
