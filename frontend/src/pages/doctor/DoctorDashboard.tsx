import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabaseClient';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Calendar, Clock, Users, CheckCircle, XCircle, Search, ChevronRight, Activity, UserCheck, Bell, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

function DoctorSVG({ className = 'w-full' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 100" fill="none" className={className}>
      <circle cx="100" cy="40" r="25" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
      <circle cx="90" cy="35" r="3" fill="currentColor" opacity="0.3" />
      <circle cx="110" cy="35" r="3" fill="currentColor" opacity="0.3" />
      <path d="M88 48 Q100 58 112 48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.25" />
      <rect x="70" y="65" width="60" height="25" rx="8" stroke="currentColor" strokeWidth="1.5" opacity="0.15" />
      <line x1="80" y1="78" x2="120" y2="78" stroke="currentColor" strokeWidth="1" opacity="0.15" />
      <circle cx="40" cy="70" r="8" stroke="currentColor" strokeWidth="1" opacity="0.1" />
      <circle cx="160" cy="70" r="8" stroke="currentColor" strokeWidth="1" opacity="0.1" />
      <line x1="100" y1="65" x2="100" y2="55" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.15" />
      <line x1="95" y1="60" x2="105" y2="60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.15" />
    </svg>
  );
}

export const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllPatients, setShowAllPatients] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const { data: apts } = await supabase
        .from('appointments')
        .select('*, patient:profiles!patient_id(full_name, email)')
        .eq('doctor_id', user?.id)
        .order('datetime', { ascending: true });

      const { data: pts } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone')
        .eq('role', 'patient');

      setAppointments(apts || []);
      setPatients(pts || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center"><div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600 mx-auto mb-4" /><p className="text-gray-500">Loading your practice...</p></div>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter(a => a.datetime.startsWith(today));
  const pendingAppts = appointments.filter(a => a.status === 'pending');
  const completedAppts = appointments.filter(a => a.status === 'completed');

  const filteredPatients = patients.filter(p =>
    p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const todayWithAppointments = todayAppts.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10"><div className="absolute -top-10 -right-10 w-60 h-60 bg-white rounded-full blur-3xl" /><div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-300 rounded-full blur-3xl" /></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-6">
            <div className="hidden sm:block"><DoctorSVG className="w-32 h-20 text-emerald-200" /></div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Dr. {user?.user_metadata?.full_name || 'Doctor'}</h1>
              <p className="text-emerald-100 mt-1 text-lg">{todayAppts.length} appointment{todayAppts.length !== 1 ? 's' : ''} scheduled for today</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Calendar, label: 'Today', value: todayAppts.length, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
            { icon: Clock, label: 'Pending', value: pendingAppts.length, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
            { icon: Users, label: 'My Patients', value: patients.length, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
            { icon: Activity, label: 'Completed', value: completedAppts.length, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="p-4 md:p-5 border-0 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${stat.bg}`}><Icon className={`h-5 w-5 ${stat.color}`} /></div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className={`p-6 border-0 shadow-md ${todayWithAppointments ? '' : 'bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/10'}`}>
              <div className="flex items-center gap-3 mb-5"><Calendar className="h-5 w-5 text-emerald-600" /><h2 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Schedule</h2><span className="text-sm text-gray-500 ml-auto">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span></div>
              {todayAppts.length ? (
                <div className="space-y-3">
                  {todayAppts.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()).map((apt, i) => (
                    <div key={apt.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow ring-1 ring-gray-100 dark:ring-gray-700">
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center min-w-[48px]">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{new Date(apt.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {i < todayAppts.length - 1 && <div className="w-0.5 h-8 bg-gray-200 dark:bg-gray-600 mt-1" />}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{apt.patient?.full_name || 'Patient'}</p>
                          <p className="text-sm text-gray-500">{apt.reason || 'General visit'}</p>
                          {apt.patient?.email && <p className="text-xs text-gray-400">{apt.patient.email}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {apt.status === 'pending' && (
                          <><Button size="sm" onClick={() => handleStatusUpdate(apt.id, 'confirmed')} className="bg-emerald-600 hover:bg-emerald-700"><CheckCircle className="h-3 w-3 mr-1" /> Accept</Button><button onClick={() => handleStatusUpdate(apt.id, 'cancelled')} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><XCircle className="h-4 w-4" /></button></>
                        )}
                        {apt.status === 'confirmed' && (
                          <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(apt.id, 'completed')} className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"><CheckCircle className="h-3 w-3 mr-1" /> Complete</Button>
                        )}
                        {apt.status === 'completed' && <span className="text-xs text-emerald-600 font-medium flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Done</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8"><Calendar className="h-12 w-12 text-amber-400 mx-auto mb-3" /><p className="text-gray-600 dark:text-gray-400 font-medium">No appointments today</p><p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Enjoy your day, Doctor!</p></div>
              )}
            </Card>

            <Card className="p-6 border-0 shadow-md">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3"><Users className="h-5 w-5 text-blue-600" /><h2 className="text-lg font-semibold text-gray-900 dark:text-white">Patient Directory</h2><span className="text-sm text-gray-500">({patients.length} total)</span></div>
                <div className="relative w-56"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search patients..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" /></div>
              </div>
              {filteredPatients.length ? (
                <div className="space-y-2">
                  {(showAllPatients ? filteredPatients : filteredPatients.slice(0, 5)).map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center"><span className="text-sm font-medium text-blue-600 dark:text-blue-400">{p.full_name?.[0] || '?'}</span></div>
                        <div><p className="text-sm font-medium text-gray-900 dark:text-white">{p.full_name}</p><p className="text-xs text-gray-500">{p.email}</p></div>
                      </div>
                      <Link to={`/medical-records`} className="text-xs text-blue-600 hover:underline flex items-center gap-1">Records <ChevronRight className="h-3 w-3" /></Link>
                    </div>
                  ))}
                  {filteredPatients.length > 5 && !showAllPatients && (
                    <button onClick={() => setShowAllPatients(true)} className="w-full text-center text-sm text-blue-600 hover:text-blue-700 py-2 font-medium">Show all {filteredPatients.length} patients</button>
                  )}
                  {showAllPatients && filteredPatients.length > 5 && (
                    <button onClick={() => setShowAllPatients(false)} className="w-full text-center text-sm text-gray-500 hover:text-gray-700 py-2 font-medium">Show less</button>
                  )}
                </div>
              ) : (
                <div className="text-center py-6"><Users className="h-10 w-10 text-gray-300 mx-auto mb-2" /><p className="text-gray-500">No patients found{searchTerm ? ` matching "${searchTerm}"` : ''}</p></div>
              )}
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/10">
              <div className="flex items-center gap-2 mb-4"><Bell className="h-5 w-5 text-amber-600" /><h3 className="font-semibold text-gray-900 dark:text-white">Pending ({pendingAppts.length})</h3></div>
              {pendingAppts.length ? (
                <div className="space-y-3">
                  {pendingAppts.slice(0, 4).map((apt) => (
                    <div key={apt.id} className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{apt.patient?.full_name || 'Patient'}</p>
                        <span className="text-xs text-gray-500">{new Date(apt.datetime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{new Date(apt.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — {apt.reason || 'Visit'}</p>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleStatusUpdate(apt.id, 'confirmed')} className="flex-1 text-xs bg-emerald-600 hover:bg-emerald-700"><CheckCircle className="h-3 w-3 mr-1" /> Accept</Button>
                        <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(apt.id, 'cancelled')} className="flex-1 text-xs border-red-200 text-red-600 hover:bg-red-50"><XCircle className="h-3 w-3 mr-1" /> Decline</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6"><CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" /><p className="text-sm text-gray-500">All caught up! No pending requests.</p></div>
              )}
            </Card>

            <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-emerald-600 to-teal-600 text-white">
              <Sparkles className="h-6 w-6 mb-3" />
              <h3 className="font-semibold mb-2">Today's Summary</h3>
              <div className="space-y-2 text-emerald-100">
                <div className="flex justify-between"><span>Appointments</span><span className="font-bold">{todayAppts.length}</span></div>
                <div className="flex justify-between"><span>Pending actions</span><span className="font-bold">{pendingAppts.length}</span></div>
                <div className="flex justify-between"><span>Patients</span><span className="font-bold">{patients.length}</span></div>
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-500/30">
                <Link to="/appointments" className="flex items-center gap-1 text-emerald-200 hover:text-white text-sm transition-colors">View full schedule <ChevronRight className="h-3 w-3" /></Link>
              </div>
            </Card>

            <Card className="p-6 border-0 shadow-md">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><UserCheck className="h-5 w-5 text-blue-600" /> Quick Links</h3>
              <div className="space-y-2">
                {[
                  { to: '/appointments', label: 'All Appointments', desc: 'Full schedule view' },
                  { to: '/medical-records', label: 'Medical Records', desc: 'Patient records management' },
                  { to: '/ai-chat', label: 'AI Diagnosis Assistant', desc: 'Get AI assistance' },
                ].map((l) => (
                  <Link key={l.label} to={l.to} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div><p className="text-sm font-medium text-gray-900 dark:text-white">{l.label}</p><p className="text-xs text-gray-500">{l.desc}</p></div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
