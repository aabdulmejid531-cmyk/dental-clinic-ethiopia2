import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { supabase } from '../services/supabaseClient';
import type { Appointment, Profile, UserRole } from '../services/database.types';

const ROLES: UserRole[] = ['patient', 'doctor', 'admin'];

export function AdminPanel() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [{ data: p }, { data: a }] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('appointments').select('*')
      ]);
      setProfiles(p ?? []);
      setAppointments(a ?? []);
      setLoading(false);
    }
    load();
  }, []);

  async function changeRole(id: string, role: UserRole) {
    setProfiles((prev) => prev.map((p) => (p.id === id ? { ...p, role } : p)));
    await supabase.from('profiles').update({ role }).eq('id', id);
  }

  const weeklyData = useMemo(() => {
    const buckets = new Map<string, number>();
    appointments.forEach((a) => {
      const d = new Date(a.datetime);
      const week = `Wk of ${new Date(d.setDate(d.getDate() - d.getDay())).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short'
      })}`;
      buckets.set(week, (buckets.get(week) ?? 0) + 1);
    });
    return Array.from(buckets.entries()).map(([week, count]) => ({ week, count }));
  }, [appointments]);

  const statusCounts = useMemo(() => {
    const counts = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
    appointments.forEach((a) => {
      counts[a.status] += 1;
    });
    return counts;
  }, [appointments]);

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">Admin panel</p>
        <h1 className="font-display text-3xl font-medium text-teal-900">Clinic overview</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="card !p-4 text-center">
            <p className="font-display text-2xl font-semibold text-teal-800">{count}</p>
            <p className="text-xs capitalize text-ink/55">{status}</p>
          </div>
        ))}
      </div>

      <div className="card mt-6">
        <h2 className="font-display text-lg font-semibold text-teal-900">Appointments per week</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0F3D3815" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#14242099' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#14242099' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #0F3D3820', fontSize: 12 }} />
              <Bar dataKey="count" fill="#1F6856" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card mt-6">
        <h2 className="font-display text-lg font-semibold text-teal-900">Users</h2>
        {loading ? (
          <p className="mt-4 text-sm text-ink/50">Loading users…</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-teal-700/10 text-xs uppercase tracking-wide text-ink/45">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Phone</th>
                  <th className="py-2 pr-4">Role</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((p) => (
                  <tr key={p.id} className="border-b border-teal-700/5">
                    <td className="py-3 pr-4 font-medium text-ink">{p.full_name}</td>
                    <td className="py-3 pr-4 text-ink/60">{p.phone ?? '—'}</td>
                    <td className="py-3 pr-4">
                      <select
                        value={p.role}
                        onChange={(e) => changeRole(p.id, e.target.value as UserRole)}
                        className="rounded-lg border border-teal-700/20 bg-white px-2 py-1.5 text-sm capitalize"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
