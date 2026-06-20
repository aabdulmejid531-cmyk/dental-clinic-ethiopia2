import type { AppointmentStatus } from '../../services/database.types';

const STYLES: Record<AppointmentStatus, string> = {
  pending: 'bg-gold-400/15 text-gold-600 border-gold-400/30',
  confirmed: 'bg-teal-500/10 text-teal-700 border-teal-500/30',
  completed: 'bg-teal-700/10 text-teal-800 border-teal-700/20',
  cancelled: 'bg-coral-400/10 text-coral-500 border-coral-400/30'
};

const LABELS: Record<AppointmentStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled'
};

export function StatusPill({ status }: { status: AppointmentStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
