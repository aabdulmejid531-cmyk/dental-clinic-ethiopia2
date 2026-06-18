import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabaseClient';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Calendar, Clock, User, FileText, Plus, Stethoscope, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PatientDashboard = () => {
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
        .select('*, doctor:profiles!doctor_id(full_name)')
        .eq('patient_id', user?.id)
        .order('datetime', { ascending: true });

      setAppointments(apts || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const upcoming = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed');
  const nextApt = upcoming[0];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.user_metadata?.full_name || 'Patient'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Here's your dental health overview
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{upcoming.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Next Visit</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {nextApt ? new Date(nextApt.datetime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'None'}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Doctor</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
                  {nextApt?.doctor?.full_name || 'Not assigned'}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Records</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{appointments.length}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Upcoming Appointments</h2>
                <Link to="/appointments">
                  <Button size="sm"><Plus className="h-4 w-4 mr-2" /> Book New</Button>
                </Link>
              </div>

              {upcoming.length ? (
                <div className="space-y-4">
                  {upcoming.slice(0, 3).map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Dr. {apt.doctor?.full_name || 'Doctor'}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(apt.datetime).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {new Date(apt.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {apt.reason ? ` - ${apt.reason}` : ''}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        apt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>{apt.status}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">No upcoming appointments</p>
                  <Link to="/appointments">
                    <Button className="mt-4">Book Your First Appointment</Button>
                  </Link>
                </div>
              )}
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link to="/appointments" className="block w-full text-left p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  <div className="flex items-center">
                    <Plus className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Book Appointment</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Schedule a new visit</p>
                    </div>
                  </div>
                </Link>
                <Link to="/medical-records" className="block w-full text-left p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-purple-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Medical Records</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">View your dental history</p>
                    </div>
                  </div>
                </Link>
                <Link to="/ai-chat" className="block w-full text-left p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  <div className="flex items-center">
                    <Stethoscope className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">AI Symptom Checker</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Check symptoms anytime</p>
                    </div>
                  </div>
                </Link>
                <Link to="/ai-chat" className="block w-full text-left p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 text-orange-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Ask AI Assistant</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Get dental health answers</p>
                    </div>
                  </div>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
