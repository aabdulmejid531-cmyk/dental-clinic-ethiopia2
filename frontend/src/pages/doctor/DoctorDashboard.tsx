import { useAuth } from '../../contexts/AuthContext';
import { useAppointments } from '../../hooks/useAppointments';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Calendar, Clock, Users, FileText } from 'lucide-react';

export const DoctorDashboard = () => {
  const { user } = useAuth();
  const { appointments, isLoading } = useAppointments();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const todayAppointments = appointments?.filter(apt => {
    const today = new Date().toISOString().split('T')[0];
    return apt.datetime.startsWith(today);
  }) || [];

  const pendingAppointments = appointments?.filter(apt => apt.status === 'pending') || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome, Dr. {user?.user_metadata?.full_name || 'Doctor'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your patients and appointments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Today's Appointments
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {todayAppointments.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pending Confirmations
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {pendingAppointments.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Patients
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  45
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Medical Records
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  128
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Today's Appointments
            </h2>
            {todayAppointments.length ? (
              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {appointment.patient?.full_name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(appointment.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>{
                        appointment.status
                      }</span>
                      <Button size="sm" variant="outline">
                        {appointment.status === 'pending' ? 'Confirm' : 'View'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No appointments today</p>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <p className="font-medium text-gray-900 dark:text-white">Add New Patient</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Register a new patient in the system</p>
              </button>
              <button className="w-full text-left p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <p className="font-medium text-gray-900 dark:text-white">View Patient Queue</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Check waiting patients</p>
              </button>
              <button className="w-full text-left p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <p className="font-medium text-gray-900 dark:text-white">Generate Reports</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Create daily/weekly reports</p>
              </button>
              <button className="w-full text-left p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <p className="font-medium text-gray-900 dark:text-white">AI Diagnosis Assistant</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get AI assistance for diagnoses</p>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
