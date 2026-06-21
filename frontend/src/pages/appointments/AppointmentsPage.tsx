import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabaseClient';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Calendar, Clock, FileText, Plus, X, CheckCircle, User, AlertTriangle, Loader2, Sparkles, HelpCircle } from 'lucide-react';

function ToothSVG({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className}>
      <path d="M50 10C30 10 10 20 10 42C10 55 15 72 20 78C25 85 35 95 50 95C65 95 75 85 80 78C85 72 90 55 90 42C90 20 70 10 50 10Z" fill="currentColor" opacity="0.2" />
      <path d="M50 15C32 15 15 24 15 44C15 56 19 70 24 76C28 82 37 90 50 90C63 90 72 82 76 76C81 70 85 56 85 44C85 24 68 15 50 15Z" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <line x1="35" y1="45" x2="45" y2="45" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="55" y1="45" x2="65" y2="45" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M40 60 Q50 70 60 60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function SmileSVG({ className = 'w-full h-full' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 120" fill="none" className={className}>
      <ellipse cx="100" cy="60" rx="88" ry="54" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      <path d="M45 50 Q70 38 100 50 Q130 38 155 50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      <path d="M50 65 Q100 100 150 65" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
      <circle cx="68" cy="45" r="4" fill="currentColor" opacity="0.4" />
      <circle cx="132" cy="45" r="4" fill="currentColor" opacity="0.4" />
      <path d="M80 80 L85 86 L90 80 L95 86 L100 80 L105 86 L110 80 L115 86 L120 80" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

function DentalClinicSVG({ className = 'w-full' }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 180" fill="none" className={className}>
      <rect x="40" y="60" width="220" height="100" rx="8" stroke="currentColor" strokeWidth="2" opacity="0.2" />
      <rect x="60" y="75" width="180" height="70" rx="4" stroke="currentColor" strokeWidth="1.5" opacity="0.15" />
      <line x1="70" y1="95" x2="230" y2="95" stroke="currentColor" strokeWidth="1" opacity="0.1" />
      <path d="M120 105 L135 130 L150 105 L165 130 L180 105" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <circle cx="105" cy="105" r="8" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
      <circle cx="195" cy="105" r="8" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
      <path d="M100 140 L105 150 L110 140" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
      <path d="M145 140 L150 150 L155 140" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
      <path d="M190 140 L195 150 L200 140" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
    </svg>
  );
}

function HappyPatientSVG({ className = 'w-full' }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 180" fill="none" className={className}>
      <circle cx="150" cy="85" r="50" stroke="currentColor" strokeWidth="2" opacity="0.2" />
      <circle cx="135" cy="75" r="4" fill="currentColor" opacity="0.3" />
      <circle cx="165" cy="75" r="4" fill="currentColor" opacity="0.3" />
      <path d="M130 95 Q150 115 170 95" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
      <path d="M120 135 L135 120 L150 135 L165 120 L180 135" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.2" />
      <path d="M90 155 Q150 175 210 155" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.15" />
      <circle cx="100" cy="50" r="15" stroke="currentColor" strokeWidth="1" opacity="0.15" strokeDasharray="3 3" />
      <circle cx="200" cy="55" r="12" stroke="currentColor" strokeWidth="1" opacity="0.15" strokeDasharray="3 3" />
      <path d="M140 160 L145 170 L150 160 L155 170 L160 160" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.15" />
    </svg>
  );
}

interface ModalFeedback {
  type: 'success' | 'error';
  message: string;
}

export const AppointmentsPage = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [useFallbackDoctors, setUseFallbackDoctors] = useState(false);
  const [feedback, setFeedback] = useState<ModalFeedback | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
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
        setDoctors([{ id: 'any', full_name: 'Any Available Doctor' }]);
        setUseFallbackDoctors(true);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors([{ id: 'any', full_name: 'Any Available Doctor' }]);
      setUseFallbackDoctors(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setFeedback(null);

    if (!formData.datetime) {
      setFeedback({ type: 'error', message: 'Please select a date and time for your appointment.' });
      setSubmitLoading(false);
      return;
    }

    const selectedDate = new Date(formData.datetime);
    const now = new Date();
    if (selectedDate < new Date(now.getTime() - 60000)) {
      setFeedback({ type: 'error', message: 'Cannot book an appointment in the past. Please select a future date and time.' });
      setSubmitLoading(false);
      return;
    }

    if (!formData.reason) {
      setFeedback({ type: 'error', message: 'Please select a reason for your visit.' });
      setSubmitLoading(false);
      return;
    }

    try {
      const insertData: any = {
        patient_id: user?.id,
        datetime: formData.datetime,
        reason: formData.reason,
        notes: formData.notes || null,
        status: 'pending'
      };

      if (formData.doctorId && formData.doctorId !== 'any') {
        insertData.doctor_id = formData.doctorId;
      }

      const { error } = await supabase.from('appointments').insert(insertData);

      if (error) {
        if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
          setFeedback({
            type: 'error',
            message: 'The appointments table does not exist yet. Check the SQL migration files in supabase/migrations/ and run them in your Supabase SQL Editor.'
          });
        } else {
          setFeedback({ type: 'error', message: `Booking failed: ${error.message}` });
        }
        setSubmitLoading(false);
        return;
      }

      setIsBooking(false);
      setFormData({ doctorId: '', datetime: '', reason: '', notes: '' });
      setFeedback({ type: 'success', message: 'Appointment booked successfully! You will receive a confirmation once the doctor approves.' });
      fetchAppointments();
      setTimeout(() => setFeedback(null), 6000);
    } catch (error: any) {
      console.error('Error booking appointment:', error);
      setFeedback({ type: 'error', message: error?.message || 'Failed to book appointment. Please try again.' });
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
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading your appointments...</p>
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
          <div className="absolute top-5 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-5 right-20 w-80 h-80 bg-indigo-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-6">
            <div className="hidden sm:block w-28 h-20">
              <SmileSVG className="w-full h-full text-blue-200" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">My Appointments</h1>
              <p className="text-blue-100 mt-2 text-lg">Schedule, manage, and track your dental visits</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {feedback && feedback.type === 'success' && !isBooking && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl flex items-start gap-3 shadow-sm">
            <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">Success!</p>
              <p className="text-green-700 dark:text-green-300 text-sm whitespace-pre-line">{feedback.message}</p>
            </div>
          </div>
        )}

        {feedback && feedback.type === 'error' && !isBooking && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3 shadow-sm">
            <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-800 dark:text-red-200">Error</p>
              <p className="text-red-700 dark:text-red-300 text-sm whitespace-pre-line">{feedback.message}</p>
            </div>
          </div>
        )}

        {useFallbackDoctors && !isBooking && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl flex items-start gap-3 shadow-sm">
            <HelpCircle className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-blue-800 dark:text-blue-200">No Doctors Registered Yet</p>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                No doctors found in the system. You can still book with "Any Available Doctor" and the admin will assign one. 
                To add doctors, insert rows into the profiles table with role='doctor'.
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
                <Button onClick={() => { setFeedback(null); setIsBooking(true); }} className="shadow-sm">
                  <Plus className="h-4 w-4 mr-2" /> Book New
                </Button>
              </div>

              {upcoming.length ? (
                <div className="space-y-3">
                  {upcoming.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750 rounded-xl hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="hidden sm:block mt-1">
                          <ToothSVG className="w-10 h-10 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-lg">Dr. {apt.doctor?.full_name || 'To be assigned'}</p>
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
                              {apt.reason}
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
                  <ToothSVG className="w-20 h-20 text-blue-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Upcoming Appointments</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    Your smile matters! Book your first appointment and take the first step toward better dental health.
                  </p>
                  <Button onClick={() => { setFeedback(null); setIsBooking(true); }} size="lg" className="shadow-lg">
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
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Dr. {apt.doctor?.full_name || 'To be assigned'}</p>
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
              <div className="mb-4">
                <DentalClinicSVG className="w-full h-32 text-blue-500" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Modern Dental Care</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Regular dental checkups every 6 months can prevent up to 80% of dental problems. 
                Early detection saves time, money, and discomfort.
              </p>
            </Card>

            <Card className="p-6 shadow-md border-0">
              <div className="mb-4">
                <HappyPatientSVG className="w-full h-32 text-green-500" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Patient Satisfaction</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                98% of our patients report high satisfaction with their treatment. 
                We combine modern technology with compassionate care for the best results.
              </p>
            </Card>
          </div>
        </div>

        {isBooking && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
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

              {feedback && (
                <div className={`mb-4 p-4 rounded-xl flex items-start gap-3 ${
                  feedback.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
                }`}>
                  {feedback.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  )}
                  <p className={`text-sm whitespace-pre-line ${
                    feedback.type === 'success' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                  }`}>{feedback.message}</p>
                </div>
              )}

              {(!feedback || feedback.type !== 'success') && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Doctor</label>
                    <select value={formData.doctorId} onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white bg-white transition-colors">
                      <option value="any">Any Available Doctor</option>
                      {doctors.map((d) => (
                        d.id !== 'any' && (
                          <option key={d.id} value={d.id}>Dr. {d.full_name}</option>
                        )
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date & Time</label>
                    <Input type="datetime-local" value={formData.datetime}
                      onChange={(e) => setFormData({ ...formData, datetime: e.target.value })}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full rounded-xl"
                      required />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reason for Visit</label>
                    <select value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required>
                      <option value="">Select a reason...</option>
                      <option value="General Checkup">General Checkup</option>
                      <option value="Toothache / Pain">Toothache / Pain</option>
                      <option value="Teeth Cleaning">Teeth Cleaning</option>
                      <option value="Teeth Whitening">Teeth Whitening</option>
                      <option value="Filling / Cavity">Filling / Cavity</option>
                      <option value="Root Canal">Root Canal</option>
                      <option value="Tooth Extraction">Tooth Extraction</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Follow-up Visit">Follow-up Visit</option>
                      <option value="Braces / Orthodontics">Braces / Orthodontics</option>
                      <option value="Dental Implant">Dental Implant</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Additional Notes</label>
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
              )}

              {feedback && feedback.type === 'success' && (
                <div className="text-center pt-4">
                  <Button onClick={() => { setIsBooking(false); setFeedback(null); }} className="rounded-xl">
                    Done
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
