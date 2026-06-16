import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAppointments } from '../hooks/useAppointments';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Calendar, Clock, User, FileText, Plus } from 'lucide-react';

export const PatientDashboard = () => {
  const { user } = useAuth();
  const { data: appointments, isLoading } = useAppointments();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome, {user?.user_metadata?.full_name || 'Patient'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your appointments and dental health
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Upcoming Appointments
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {appointments?.filter(apt => apt.status === 'confirmed' || apt.status === 'pending').length || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Next Appointment
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {appointments?.length ? new Date(appointments[0].datetime).toLocaleDateString() : 'None'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Doctor
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {appointments?.[0]?.doctor?.full_name || 'Not assigned'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Medical Records
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  3
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Upcoming Appointments
            </h2>
            {appointments?.length ? (
              <div className="space-y-4">
                {appointments.slice(0, 3).map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {appointment.doctor?.full_name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(appointment.datetime).toLocaleDateString()} at {new Date(appointment.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>{
                      appointment.status
                    }</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No upcoming appointments</p>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Quick Actions
              </h2>
              <Button onClick={() => window.location.href = '/appointments/new'}>
                <Plus className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
            </div>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <p className="font-medium text-gray-900 dark:text-white">View Medical History</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Access your complete dental records</p>
              </button>
              <button className="w-full text-left p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <p className="font-medium text-gray-900 dark:text-white">AI Symptom Checker</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Check your symptoms with AI assistance</p>
              </button>
              <button className="w-full text-left p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <p className="font-medium text-gray-900 dark:text-white">Message Doctor</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Send a message to your dentist</p>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
