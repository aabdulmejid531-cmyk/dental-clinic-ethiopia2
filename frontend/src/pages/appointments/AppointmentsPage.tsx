import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabaseClient';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Calendar, Clock, FileText, Plus, X, CheckCircle } from 'lucide-react';

export const AppointmentsPage = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [formData, setFormData] = useState({
    doctorId: '',
    datetime: '',
    reason: '',
    notes: ''
  });

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('appointments')
        .select('*, doctor:profiles!doctor_id(full_name)')
        .eq('patient_id', user?.id)
        .order('datetime', { ascending: false });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'doctor');

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('appointments').insert({
        patient_id: user?.id,
        doctor_id: formData.doctorId,
        datetime: formData.datetime,
        reason: formData.reason,
        notes: formData.notes,
        status: 'pending'
      });

      if (error) throw error;

      setIsBooking(false);
      setFormData({ doctorId: '', datetime: '', reason: '', notes: '' });
      setSuccessMsg('Appointment booked successfully!');
      fetchAppointments();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment');
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
      if (error) throw error;
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const role = user?.user_metadata?.role || 'patient';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const upcoming = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed');
  const past = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Appointments</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your appointments and schedule new ones</p>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-700 dark:text-green-300">{successMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Upcoming Appointments</h2>
                <Button onClick={() => setIsBooking(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Book New
                </Button>
              </div>

              {upcoming.length ? (
                <div className="space-y-4">
                  {upcoming.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">Dr. {apt.doctor?.full_name || 'Doctor'}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(apt.datetime).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {' '}
                          {new Date(apt.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {apt.reason && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Reason: {apt.reason}</p>}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          apt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>{apt.status}</span>
                        {role === 'patient' && apt.status === 'pending' && (
                          <button onClick={() => handleStatusUpdate(apt.id, 'cancelled')} className="text-red-600 hover:text-red-700 text-sm">Cancel</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">No upcoming appointments</p>
                  <Button className="mt-4" onClick={() => setIsBooking(true)}>Book Your First Appointment</Button>
                </div>
              )}
            </Card>

            {past.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Past Appointments</h2>
                <div className="space-y-3">
                  {past.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Dr. {apt.doctor?.full_name || 'Doctor'}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{new Date(apt.datetime).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        apt.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                      }`}>{apt.status}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Total</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{appointments.length}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Upcoming</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{upcoming.length}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-orange-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Completed</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{past.filter(a => a.status === 'completed').length}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {isBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Book Appointment</h2>
                <button onClick={() => setIsBooking(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Doctor</label>
                  <select value={formData.doctorId} onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" required>
                    <option value="">Select a doctor</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>Dr. {d.full_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date & Time</label>
                  <Input type="datetime-local" value={formData.datetime} onChange={(e) => setFormData({ ...formData, datetime: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason</label>
                  <Input type="text" value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} placeholder="e.g., Toothache, Checkup" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes (Optional)</label>
                  <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" rows={3} />
                </div>
                <div className="flex gap-3 mt-6">
                  <Button type="submit" className="flex-1">Book Appointment</Button>
                  <Button type="button" variant="outline" onClick={() => setIsBooking(false)} className="flex-1">Cancel</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
