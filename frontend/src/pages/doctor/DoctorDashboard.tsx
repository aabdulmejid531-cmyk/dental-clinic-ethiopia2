import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabaseClient';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Calendar, Clock, Users, FileText, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: apts } = await supabase
        .from('appointments')
        .select('*, patient:profiles!patient_id(full_name, email)')
        .eq('doctor_id', user?.id)
        .order('datetime', { ascending: true });

      setAppointments(apts || []);
    } catch (error) {
      console.error('Error fetching data:', error);
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
      console.error('Error updating appointment:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter(a => a.datetime.startsWith(today));
  const pendingAppts = appointments.filter(a => a.status === 'pending');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome, Dr. {user?.user_metadata?.full_name || 'Doctor'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your patients and appointments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Schedule</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{todayAppts.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingAppts.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{appointments.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{appointments.filter(a => a.status === 'completed').length}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Today's Appointments</h2>
            {todayAppts.length ? (
              <div className="space-y-3">
                {todayAppts.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{apt.patient?.full_name || 'Patient'}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(apt.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {apt.reason ? ` - ${apt.reason}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        apt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>{apt.status}</span>
                      {apt.status === 'pending' && (
                        <Button size="sm" onClick={() => handleStatusUpdate(apt.id, 'confirmed')}>
                          <CheckCircle className="h-3 w-3 mr-1" /> Confirm
                        </Button>
                      )}
                      {apt.status === 'confirmed' && (
                        <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(apt.id, 'completed')}>
                          <CheckCircle className="h-3 w-3 mr-1" /> Complete
                        </Button>
                      )}
                      {(apt.status === 'pending' || apt.status === 'confirmed') && (
                        <button onClick={() => handleStatusUpdate(apt.id, 'cancelled')} className="text-red-500 hover:text-red-700">
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">No appointments scheduled for today</p>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Pending Confirmations</h2>
            {pendingAppts.length ? (
              <div className="space-y-3">
                {pendingAppts.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{apt.patient?.full_name || 'Patient'}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(apt.datetime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {
                        new Date(apt.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      }</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleStatusUpdate(apt.id, 'confirmed')}>
                        <CheckCircle className="h-3 w-3 mr-1" /> Accept
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(apt.id, 'cancelled')}>
                        <XCircle className="h-3 w-3 mr-1" /> Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-4">No pending confirmations</p>
            )}

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h2>
              <div className="space-y-2">
                <Link to="/appointments" className="block w-full text-left p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  <p className="font-medium text-gray-900 dark:text-white">All Appointments</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">View full schedule</p>
                </Link>
                <Link to="/medical-records" className="block w-full text-left p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  <p className="font-medium text-gray-900 dark:text-white">Medical Records</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manage patient records</p>
                </Link>
                <Link to="/ai-chat" className="block w-full text-left p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  <p className="font-medium text-gray-900 dark:text-white">AI Diagnosis Assistant</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get AI assistance</p>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
