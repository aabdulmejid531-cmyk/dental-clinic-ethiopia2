import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabaseClient';
import { Card } from '../../components/ui/Card';
import { FileText, Calendar, User, Stethoscope } from 'lucide-react';

interface MedicalRecord {
  id: string;
  patient_id: string;
  doctor_id: string | null;
  diagnosis: string;
  treatment: string;
  notes: string | null;
  visit_date: string;
  next_visit_date: string | null;
  created_at: string;
  doctor?: { full_name: string } | null;
}

export const MedicalRecordsPage = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecords();
  }, [user]);

  const fetchRecords = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('medical_records')
        .select(`
          *,
          doctor:profiles!doctor_id(full_name)
        `)
        .eq('patient_id', user.id)
        .order('visit_date', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch records');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Medical Records
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Your complete dental history and records
          </p>
        </div>

        {error && (
          <div className="p-4 mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {records.length === 0 && !error ? (
          <Card className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Medical Records Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your medical records will appear here after your first visit.
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {records.map((record) => (
              <Card key={record.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Visit Date: {new Date(record.visit_date).toLocaleDateString()}
                      </p>
                      {record.doctor && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Dr. {record.doctor.full_name}
                        </p>
                      )}
                    </div>
                  </div>
                  {record.next_visit_date && (
                    <span className="text-sm text-blue-600 dark:text-blue-400">
                      Next: {new Date(record.next_visit_date).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Stethoscope className="h-4 w-4 text-red-500" />
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Diagnosis
                      </p>
                    </div>
                    <p className="text-gray-900 dark:text-white">{record.diagnosis}</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4 text-green-500" />
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Treatment
                      </p>
                    </div>
                    <p className="text-gray-900 dark:text-white">{record.treatment}</p>
                  </div>
                </div>

                {record.notes && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Notes
                    </p>
                    <p className="text-gray-900 dark:text-white">{record.notes}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
