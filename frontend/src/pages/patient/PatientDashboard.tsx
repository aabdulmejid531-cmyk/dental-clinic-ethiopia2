import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabaseClient';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Calendar, Clock, User, FileText, Plus, Stethoscope, MessageSquare, Sparkles, Activity, ChevronRight, Bell, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

function ToothSVG({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className}>
      <path d="M50 10C30 10 10 20 10 42C10 55 15 72 20 78C25 85 35 95 50 95C65 95 75 85 80 78C85 72 90 55 90 42C90 20 70 10 50 10Z" fill="currentColor" opacity="0.15" />
      <path d="M50 15C32 15 15 24 15 44C15 56 19 70 24 76C28 82 37 90 50 90C63 90 72 82 76 76C81 70 85 56 85 44C85 24 68 15 50 15Z" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function SmileGraphic({ className = 'w-full' }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 120" fill="none" className={className}>
      <ellipse cx="150" cy="60" rx="130" ry="50" stroke="currentColor" strokeWidth="1.5" opacity="0.15" />
      <path d="M70 55 Q110 35 150 55 Q190 35 230 55" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.25" />
      <path d="M80 70 Q150 115 220 70" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.2" />
      <circle cx="110" cy="48" r="5" fill="currentColor" opacity="0.2" />
      <circle cx="190" cy="48" r="5" fill="currentColor" opacity="0.2" />
    </svg>
  );
}

const healthTips = [
  { icon: Sparkles, tip: 'Brush 2 minutes, 2 times daily' },
  { icon: Activity, tip: 'Floss once a day to prevent gum disease' },
  { icon: Shield, tip: 'Visit your dentist every 6 months' },
];

export const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const { data: apts } = await supabase
        .from('appointments')
        .select('*, doctor:profiles!doctor_id(full_name)')
        .eq('patient_id', user?.id)
        .order('datetime', { ascending: true });
      setAppointments(apts || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center"><div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4" /><p className="text-gray-500">Loading your dashboard...</p></div>
      </div>
    );
  }

  const upcoming = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed');
  const completed = appointments.filter(a => a.status === 'completed');
  const nextApt = upcoming[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10"><div className="absolute -top-10 -right-10 w-60 h-60 bg-white rounded-full blur-3xl" /><div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-300 rounded-full blur-3xl" /></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex items-center gap-6">
          <div className="hidden sm:block"><ToothSVG className="w-20 h-20 text-blue-200" /></div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Welcome back, {user?.user_metadata?.full_name || 'Patient'}!</h1>
            <p className="text-blue-100 mt-1 text-lg">Here's your dental health overview</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Calendar, label: 'Upcoming', value: upcoming.length, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
            { icon: Clock, label: 'Next Visit', value: nextApt ? new Date(nextApt.datetime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'None', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', small: true },
            { icon: User, label: 'Doctor', value: nextApt?.doctor?.full_name || 'Not assigned', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
            { icon: Activity, label: 'Completed', value: completed.length, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="p-4 md:p-5 border-0 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${stat.bg}`}><Icon className={`h-5 w-5 ${stat.color}`} /></div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.label}</p>
                    <p className={`font-bold text-gray-900 dark:text-white truncate ${stat.small ? 'text-sm' : 'text-lg'}`}>{stat.value}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-6 border-0 shadow-md">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3"><Calendar className="h-5 w-5 text-blue-600" /><h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Appointments</h2></div>
                <Link to="/appointments"><Button size="sm" className="shadow-sm"><Plus className="h-4 w-4 mr-1" /> Book New</Button></Link>
              </div>
              {upcoming.length ? (
                <div className="space-y-3">
                  {upcoming.slice(0, 4).map((apt, i) => (
                    <div key={apt.id} className={`flex items-center justify-between p-4 rounded-xl transition-all hover:shadow-sm ${i === 0 ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 ring-1 ring-blue-200 dark:ring-blue-800' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${apt.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">Dr. {apt.doctor?.full_name || 'To be assigned'}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(apt.datetime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {new Date(apt.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          {apt.reason && <p className="text-xs text-gray-500 mt-0.5">{apt.reason}</p>}
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${apt.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'}`}>{apt.status}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <ToothSVG className="w-24 h-24 text-blue-200 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No Appointments Yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-5">Take the first step toward a healthier smile!</p>
                  <Link to="/appointments"><Button size="lg" className="shadow-lg"><Sparkles className="h-5 w-5 mr-2" /> Book Your First Appointment</Button></Link>
                </div>
              )}
            </Card>

            <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10">
              <div className="flex items-center gap-3 mb-4"><Sparkles className="h-5 w-5 text-green-600" /><h2 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Dental Tips</h2></div>
              <div className="space-y-3">
                {healthTips.map((t, i) => {
                  const Icon = t.icon;
                  return <div key={i} className="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-800/40 rounded-xl"><Icon className="h-5 w-5 text-green-600" /><span className="text-sm text-gray-700 dark:text-gray-300">{t.tip}</span></div>;
                })}
              </div>
              <div className="mt-4">
                <SmileGraphic className="w-full h-16 text-green-600" />
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 border-0 shadow-md">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Bell className="h-5 w-5 text-blue-600" /> Quick Actions</h2>
              <div className="space-y-2">
                {[
                  { to: '/appointments', icon: Plus, label: 'Book Appointment', desc: 'Schedule a visit', color: 'text-blue-600' },
                  { to: '/medical-records', icon: FileText, label: 'Medical Records', desc: 'View your history', color: 'text-purple-600' },
                  { to: '/ai-chat', icon: Stethoscope, label: 'Symptom Checker', desc: 'AI-powered analysis', color: 'text-green-600' },
                  { to: '/ai-chat', icon: MessageSquare, label: 'Ask AI Assistant', desc: 'Get dental answers', color: 'text-orange-600' },
                  { to: '/profile', icon: User, label: 'My Profile', desc: 'Update your info', color: 'text-gray-600' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.label} to={item.to} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group">
                      <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 ${item.color}`}><Icon className="h-4 w-4" /></div>
                      <div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p><p className="text-xs text-gray-500">{item.desc}</p></div>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </Link>
                  );
                })}
              </div>
            </Card>

            <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
              <div className="flex items-center gap-2 mb-3"><Sparkles className="h-5 w-5" /><h3 className="font-semibold">Your Smile Stats</h3></div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-white/10 rounded-xl"><span className="text-sm text-blue-100">Total Visits</span><span className="font-bold text-lg">{appointments.length}</span></div>
                <div className="flex justify-between items-center p-2 bg-white/10 rounded-xl"><span className="text-sm text-blue-100">Completed</span><span className="font-bold text-lg">{completed.length}</span></div>
                <div className="flex justify-between items-center p-2 bg-white/10 rounded-xl"><span className="text-sm text-blue-100">Upcoming</span><span className="font-bold text-lg">{upcoming.length}</span></div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
