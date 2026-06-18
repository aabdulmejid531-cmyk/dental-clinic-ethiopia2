import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Card } from '../../components/ui/Card';
import { Users, Calendar, FileText, Settings, Activity } from 'lucide-react';

export const AdminPanel = () => {
  const [stats, setStats] = useState({
    users: 0,
    appointments: 0,
    doctors: 0,
    records: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { count: users } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: appointments } = await supabase.from('appointments').select('*', { count: 'exact', head: true });
      const { count: doctors } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'doctor');
      const { count: records } = await supabase.from('medical_records').select('*', { count: 'exact', head: true });

      setStats({
        users: users || 0,
        appointments: appointments || 0,
        doctors: doctors || 0,
        records: records || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Users', value: stats.users, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Appointments', value: stats.appointments, icon: Calendar, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Doctors', value: stats.doctors, icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Medical Records', value: stats.records, icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">System overview and management</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.label} className="p-6">
                    <div className="flex items-center">
                      <div className={`p-3 rounded-lg ${stat.bg}`}>
                        <Icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">System running normally</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">All services operational</p>
                    </div>
                    <span className="text-xs text-gray-500">Active</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">Database connected</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Supabase PostgreSQL</p>
                    </div>
                    <span className="text-xs text-gray-500">Online</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{stats.users} registered users</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{stats.doctors} doctors available</p>
                    </div>
                    <span className="text-xs text-gray-500">Info</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">System Status</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="text-gray-900 dark:text-white font-medium">Database</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Healthy</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="text-gray-900 dark:text-white font-medium">Authentication</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Operational</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="text-gray-900 dark:text-white font-medium">AI Services</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-gray-900 dark:text-white font-medium">Storage</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">OK</span>
                  </div>
                </div>
              </Card>
            </div>

            <div className="mt-8">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Management</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-left">
                    <Users className="h-8 w-8 text-blue-600 mb-2" />
                    <p className="font-medium text-gray-900 dark:text-white">Manage Users</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Add, edit, or remove users</p>
                  </button>
                  <button className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-left">
                    <Calendar className="h-8 w-8 text-green-600 mb-2" />
                    <p className="font-medium text-gray-900 dark:text-white">Appointments</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">View all appointments</p>
                  </button>
                  <button className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-left">
                    <Settings className="h-8 w-8 text-purple-600 mb-2" />
                    <p className="font-medium text-gray-900 dark:text-white">System Settings</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Configure system</p>
                  </button>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
