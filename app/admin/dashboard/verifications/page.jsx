// app/admin/dashboard/verifications/page.jsx
'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '../../../../components/AdminLayout';
import VerificationTable from '../../../../components/VerificationTable';
import { fetchPendingVerifications } from '../../../../lib/api';

export default function VerificationsPage() {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVerifications = async () => {
      try {
        const data = await fetchPendingVerifications();
        setVerifications(data);
      } catch (error) {
        console.error('Error fetching verifications:', error);
      } finally {
        setLoading(false);
      }
    };
    loadVerifications();
  }, []);

  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Pending Verifications</h2>
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <VerificationTable verifications={verifications} />
        )}
      </div>
    </AdminLayout>
  );
}