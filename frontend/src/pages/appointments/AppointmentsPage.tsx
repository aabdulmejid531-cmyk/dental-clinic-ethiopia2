import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabaseClient';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Calendar, Clock, FileText, Plus, X, CheckCircle, User, AlertTriangle, Loader2, Sparkles } from 'lucide-react';

const FALLBACK_DOCTORS = [
  { id: 'fallback-1', full_name: 'Samuel Kebede (Sample)' },
  { id: 'fallback-2', full_name: 'Meron Tadesse (Sample)' },
  { id: 'fallback-3', full_name: 'Daniel Bekele (Sample)' },
];

function ToothIcon({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M12 3C8.5 3 5 4.5 5 9C5 12 6.5 16 8 18C9 19.5 10.5 21 12 21C13.5 21 15 19.5 16 18C17.5 16 19 12 19 9C19 4.5 15.5 3 12 3Z" />
    </svg>
  );
}

function SmileSVG({ className = 'w-full h-full' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 140" fill="none" className={className}>
      <ellipse cx="100" cy="70" rx="90" ry="60" fill="#E8F4FD" stroke="#3B82F6" strokeWidth="2" />
      <path d="M50 60 Q75 50 100 60 Q125 50 150 60" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M55 75 Q100 100 145 75" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="70" cy="55" r="4" fill="#3B82F6" />
      <circle cx="130" cy="55" r="4" fill="#3B82F6" />
      <path d="M80 90 L85 95 L90 90 L95 95 L100 90 L105 95 L110 90 L115 95 L120 90" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export const AppointmentsPage = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [useFallbackDoctors, setUseFallbackDoctors] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
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

      if (data && data.length > 0) {
        setDoctors(data);
        setUseFallbackDoctors(false);
      } else {
        setDoctors(FALLBACK_DOCTORS);
        setUseFallbackDoctors(true);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors(FALLBACK_DOCTORS);
      setUseFallbackDoctors(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setErrorMsg('');

    if (!formData.datetime) {
      setErrorMsg('Please select a date and time');
      setSubmitLoading(false);
      return;
    }

    const selectedDate = new Date(formData.datetime);
    if (selectedDate < new Date()) {
      setErrorMsg('Cannot book an appointment in the past');
      setSubmitLoading(false);
      return;
    }

    try {
      if (useFallbackDoctors) {
        setSuccessMsg('Demo mode: Appointment request received! In production, this would be saved to the database. Please add doctors in the Supabase profiles table.');
        setIsBooking(false);
        setFormData({ doctorId: '', datetime: '', reason: '', notes: '' });
        setTimeout(() => setSuccessMsg(''), 6000);
        setSubmitLoading(false);
        return;
      }

      const { error } = await supabase.from('appointments').insert({
        patient_id: user?.id,
        doctor_id: formData.doctorId,
        datetime: formData.datetime,
        reason: formData.reason || 'General checkup',
        notes: formData.notes,
        status: 'pending'
      });

      if (error) throw error;

      setIsBooking(false);
      setFormData({ doctorId: '', datetime: '', reason: '', notes: '' });
      setSuccessMsg('Appointment booked successfully! You will receive a confirmation once the doctor approves.');
      fetchAppointments();
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (error: any) {
      console.error('Error booking appointment:', error);
      if (error?.message?.includes('relation') || error?.message?.includes('does not exist')) {
        setErrorMsg('The appointments table has not been created yet. Please run the SQL setup script in your Supabase dashboard.');
      } else {
        setErrorMsg(error?.message || 'Failed to book appointment. Please try again.');
      }
    } finally {
      setSubmitLoading(false);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your appointments...</p>
        </div>
      </div>
    );
  }

  const upcoming = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed');
  const past = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-5 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-5 right-20 w-40 h-40 bg-indigo-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-6">
            <div className="hidden sm:block">
              <SmileSVG className="w-28 h-20 text-blue-200" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">My Appointments</h1>
              <p className="text-blue-100 mt-2 text-lg">Schedule, manage, and track your dental visits</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl flex items-start gap-3 shadow-sm">
            <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">Success!</p>
              <p className="text-green-700 dark:text-green-300 text-sm">{successMsg}</p>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3 shadow-sm">
            <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-800 dark:text-red-200">Error</p>
              <p className="text-red-700 dark:text-red-300 text-sm">{errorMsg}</p>
            </div>
          </div>
        )}

        {useFallbackDoctors && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-xl flex items-start gap-3 shadow-sm">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-yellow-800 dark:text-yellow-200">Demo Mode</p>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                No doctors found in the database. Sample doctors are shown for demonstration. 
                To enable real booking, add doctors in the Supabase profiles table with role='doctor'.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-6 shadow-md border-0">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Upcoming Appointments</h2>
                </div>
                <Button onClick={() => setIsBooking(true)} className="shadow-sm">
                  <Plus className="h-4 w-4 mr-2" /> Book New
                </Button>
              </div>

              {upcoming.length ? (
                <div className="space-y-3">
                  {upcoming.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750 rounded-xl hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="hidden sm:block mt-1">
                          <ToothIcon className="w-10 h-10 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-lg">Dr. {apt.doctor?.full_name || 'Dental Specialist'}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                            <Calendar className="h-3.5 w-3.5 inline" />
                            {new Date(apt.datetime).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 inline" />
                            {new Date(apt.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {apt.reason && (
                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 flex items-center gap-1">
                              <FileText className="h-3.5 w-3.5 inline" />
                              Reason: {apt.reason}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          apt.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
                        }`}>{apt.status}</span>
                        {role === 'patient' && (apt.status === 'pending' || apt.status === 'confirmed') && (
                          <button onClick={() => handleStatusUpdate(apt.id, 'cancelled')}
                            className="text-xs text-red-500 hover:text-red-700 hover:underline">Cancel</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <ToothIcon className="w-20 h-20 text-blue-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Upcoming Appointments</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    Your smile matters! Book your first appointment and take the first step toward better dental health.
                  </p>
                  <Button onClick={() => setIsBooking(true)} size="lg" className="shadow-lg">
                    <Sparkles className="h-5 w-5 mr-2" /> Book Your First Appointment
                  </Button>
                </div>
              )}
            </Card>

            {past.length > 0 && (
              <Card className="p-6 shadow-md border-0">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="h-6 w-6 text-gray-400" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Past Appointments</h2>
                  <span className="text-sm text-gray-500">({past.length})</span>
                </div>
                <div className="space-y-2">
                  {past.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <User className="h-8 w-8 text-gray-400 bg-gray-200 dark:bg-gray-700 rounded-full p-1.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Dr. {apt.doctor?.full_name || 'Dental Specialist'}</p>
                          <p className="text-xs text-gray-500">{new Date(apt.datetime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        apt.status === 'completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                      }`}>{apt.status}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 shadow-md border-0 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Quick Overview
              </h2>
              <div className="space-y-4">
                {[
                  { icon: Calendar, label: 'Total Visits', value: appointments.length, color: 'text-blue-200' },
                  { icon: Clock, label: 'Upcoming', value: upcoming.length, color: 'text-green-200' },
                  { icon: CheckCircle, label: 'Completed', value: past.filter(a => a.status === 'completed').length, color: 'text-purple-200' },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="flex items-center gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                      <div>
                        <p className="text-sm text-blue-100">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-6 shadow-md border-0">
              <img
                src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=300&fit=crop"
                alt="Dental clinic"
                className="w-full h-36 object-cover rounded-xl mb-4"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Did You Know?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Regular dental checkups every 6 months can prevent up to 80% of dental problems. 
                Early detection saves time, money, and discomfort!
              </p>
            </Card>

            <Card className="p-6 shadow-md border-0">
              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&h=300&fit=crop"
                alt="Happy patient with healthy teeth"
                className="w-full h-36 object-cover rounded-xl mb-4"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Patient Satisfaction</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                98% of our patients report high satisfaction with their treatment. 
                We combine modern technology with compassionate care.
              </p>
            </Card>
          </div>
        </div>

        {isBooking && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-lg w-full shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Book Appointment</h2>
                </div>
                <button onClick={() => setIsBooking(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Doctor
                  </label>
                  <select value={formData.doctorId} onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white bg-white dark:bg-gray-700 transition-colors"
                    required>
                    <option value="">Choose a doctor...</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>Dr. {d.full_name}{d.id.toString().startsWith('fallback') ? ' (Demo)' : ''}</option>
                    ))}
                  </select>
                  {useFallbackDoctors && (
                    <p className="text-xs text-yellow-600 mt-1">Demo doctors shown. Add real doctors in Supabase.</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date & Time
                  </label>
                  <Input type="datetime-local" value={formData.datetime}
                    onChange={(e) => setFormData({ ...formData, datetime: e.target.value })}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full rounded-xl"
                    required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reason for Visit
                  </label>
                  <select value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required>
                    <option value="">Select a reason...</option>
                    <option value="General Checkup">General Checkup</option>
                    <option value="Toothache">Toothache / Pain</option>
                    <option value="Cleaning">Teeth Cleaning</option>
                    <option value="Whitening">Teeth Whitening</option>
                    <option value="Filling">Filling / Cavity</option>
                    <option value="Root Canal">Root Canal</option>
                    <option value="Extraction">Tooth Extraction</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Follow-up">Follow-up Visit</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Additional Notes
                  </label>
                  <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any specific concerns or information for the doctor..."
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors resize-none"
                    rows={3} />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={submitLoading} className="flex-1 py-3 rounded-xl shadow-md">
                    {submitLoading ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Booking...</>
                    ) : (
                      <><Calendar className="h-4 w-4 mr-2" /> Confirm Booking</>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsBooking(false)}
                    className="flex-1 py-3 rounded-xl">
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
