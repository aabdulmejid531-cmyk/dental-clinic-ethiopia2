import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Card } from '../../components/ui/Card';
import { Users, Calendar, FileText, Settings, Shield, CheckCircle, XCircle, AlertTriangle, Search, Activity, Trash2, Star, RefreshCw } from 'lucide-react';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: string;
}

function AdminSVG({ className = 'w-full' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 100" fill="none" className={className}>
      <rect x="60" y="20" width="80" height="60" rx="8" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
      <path d="M80 45 L95 55 L120 35" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
      <circle cx="100" cy="30" r="6" stroke="currentColor" strokeWidth="1.5" opacity="0.15" />
      <line x1="70" y1="70" x2="130" y2="70" stroke="currentColor" strokeWidth="1" opacity="0.1" />
      <line x1="70" y1="75" x2="120" y2="75" stroke="currentColor" strokeWidth="1" opacity="0.1" />
    </svg>
  );
}

export const AdminPanel = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [stats, setStats] = useState({ users: 0, appointments: 0, doctors: 0, records: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const { data: p } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      const { count: u } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: a } = await supabase.from('appointments').select('*', { count: 'exact', head: true });
      const { count: d } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'doctor');
      const { count: r } = await supabase.from('medical_records').select('*', { count: 'exact', head: true });

      setProfiles(p || []);
      setStats({ users: u || 0, appointments: a || 0, doctors: d || 0, records: r || 0 });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (userId: string, newRole: string) => {
    try {
      const { error: profileError } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
      if (profileError) throw profileError;

      const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { role: newRole }
      });
      if (authError && !authError.message?.includes('not')) throw authError;

      setSuccessMsg(`User role updated to "${newRole}" successfully!`);
      setEditingRole(null);
      fetchAll();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (error: any) {
      setErrorMsg(error?.message || 'Failed to update role');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const { error: profileError } = await supabase.from('profiles').delete().eq('id', userId);
      if (profileError) throw profileError;

      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      if (authError && !authError.message?.includes('not')) throw authError;

      setSuccessMsg('User deleted successfully');
      setConfirmDelete(null);
      fetchAll();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (error: any) {
      setErrorMsg(error?.message || 'Failed to delete user');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  const filteredProfiles = profiles.filter(p =>
    p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roleBadge = (role: string) => {
    const styles: Record<string, string> = {
      admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
      doctor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
      patient: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    };
    return styles[role] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center"><div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4" /><p className="text-gray-500">Loading admin panel...</p></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10"><div className="absolute -top-10 right-20 w-60 h-60 bg-white rounded-full blur-3xl" /><div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-300 rounded-full blur-3xl" /></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex items-center gap-6">
          <div className="hidden sm:block"><AdminSVG className="w-32 h-20 text-purple-200" /></div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-purple-100 mt-1 text-lg">Manage users, roles, and system settings</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {(successMsg || errorMsg) && !editingRole && !confirmDelete && (
          <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 shadow-sm ${successMsg ? 'bg-green-50 dark:bg-green-900/30 border border-green-200' : 'bg-red-50 dark:bg-red-900/30 border border-red-200'}`}>
            {successMsg ? <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" /> : <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />}
            <p className={`text-sm ${successMsg ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>{successMsg || errorMsg}</p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: 'Total Users', value: stats.users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
            { icon: Calendar, label: 'Appointments', value: stats.appointments, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
            { icon: Activity, label: 'Doctors', value: stats.doctors, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
            { icon: FileText, label: 'Medical Records', value: stats.records, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
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

        <Card className="p-6 border-0 shadow-md mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">User Management</h2>
              <span className="text-sm text-gray-500">({profiles.length} users)</span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none sm:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search users..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white" />
              </div>
              <button onClick={fetchAll} className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors" title="Refresh"><RefreshCw className="h-4 w-4" /></button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left pb-3 font-medium text-gray-500 dark:text-gray-400">User</th>
                  <th className="text-left pb-3 font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">Email</th>
                  <th className="text-left pb-3 font-medium text-gray-500 dark:text-gray-400">Role</th>
                  <th className="text-right pb-3 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProfiles.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">{p.full_name?.[0]?.toUpperCase() || '?'}</span>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{p.full_name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="py-3 text-gray-500 hidden md:table-cell">{p.email}</td>
                    <td className="py-3">
                      {editingRole === p.id ? (
                        <div className="flex items-center gap-2">
                          <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)}
                            className="text-xs px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white">
                            <option value="patient">Patient</option>
                            <option value="doctor">Doctor</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button onClick={() => updateRole(p.id, selectedRole)} className="text-xs text-green-600 hover:text-green-700 font-medium"><CheckCircle className="h-4 w-4" /></button>
                          <button onClick={() => setEditingRole(null)} className="text-xs text-gray-400 hover:text-gray-600"><XCircle className="h-4 w-4" /></button>
                        </div>
                      ) : (
                        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${roleBadge(p.role)}`}>
                          {p.role}
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setEditingRole(p.id); setSelectedRole(p.role); }}
                          className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors" title="Change role">
                          <Star className="h-4 w-4" />
                        </button>
                        {confirmDelete === p.id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => deleteUser(p.id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg" title="Confirm delete"><CheckCircle className="h-4 w-4" /></button>
                            <button onClick={() => setConfirmDelete(null)} className="p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" title="Cancel"><XCircle className="h-4 w-4" /></button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmDelete(p.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete user">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProfiles.length === 0 && (
            <div className="text-center py-10">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No users found{searchTerm ? ` matching "${searchTerm}"` : ''}</p>
            </div>
          )}
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10">
            <div className="flex items-center gap-3 mb-4"><Calendar className="h-5 w-5 text-blue-600" /><h3 className="font-semibold text-gray-900 dark:text-white">Appointments Overview</h3></div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.appointments}</p>
            <p className="text-sm text-gray-500">Total appointments in system</p>
            <p className="text-sm text-gray-500 mt-1">{stats.doctors} doctors available</p>
          </Card>
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10">
            <div className="flex items-center gap-3 mb-4"><Users className="h-5 w-5 text-green-600" /><h3 className="font-semibold text-gray-900 dark:text-white">User Distribution</h3></div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span className="inline-block w-3 h-3 bg-green-400 rounded-full mr-2" />
              Patients: {stats.users - stats.doctors - profiles.filter(p => p.role === 'admin').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span className="inline-block w-3 h-3 bg-blue-400 rounded-full mr-2" />
              Doctors: {stats.doctors}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="inline-block w-3 h-3 bg-purple-400 rounded-full mr-2" />
              Admins: {profiles.filter(p => p.role === 'admin').length}
            </p>
          </Card>
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10">
            <div className="flex items-center gap-3 mb-4"><Settings className="h-5 w-5 text-purple-600" /><h3 className="font-semibold text-gray-900 dark:text-white">Quick Actions</h3></div>
            <div className="space-y-2">
              <button onClick={fetchAll} className="w-full flex items-center gap-2 p-2.5 bg-white dark:bg-gray-800 rounded-xl hover:shadow-sm transition-shadow text-sm text-gray-700 dark:text-gray-300"><RefreshCw className="h-4 w-4 text-purple-600" /> Refresh all data</button>
              <button className="w-full flex items-center gap-2 p-2.5 bg-white dark:bg-gray-800 rounded-xl hover:shadow-sm transition-shadow text-sm text-gray-700 dark:text-gray-300"><FileText className="h-4 w-4 text-blue-600" /> View all appointments</button>
              <button className="w-full flex items-center gap-2 p-2.5 bg-white dark:bg-gray-800 rounded-xl hover:shadow-sm transition-shadow text-sm text-gray-700 dark:text-gray-300"><Star className="h-4 w-4 text-amber-600" /> System settings</button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
