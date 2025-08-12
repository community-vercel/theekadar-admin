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
      <div className="bg-white p-10 rounded-2xl shadow-2xl">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-8">Pending Verifications</h2>
        {loading ? (
          <div className="flex justify-center">
            <svg
              className="animate-spin h-10 w-10 text-blue-600"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
            </svg>
          </div>
        ) : (
          <VerificationTable verifications={verifications} />
        )}
      </div>
    </AdminLayout>
  );
}