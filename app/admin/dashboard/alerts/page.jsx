// app/admin/page.js
'use client';

import { useState, useEffect } from 'react';
import BroadcastForm from '../../../../components/BroadcastForm';
import RoleForm from '../../../../components/RoleForm';
import ResponseDetails from '../../../../components/ResponseDetails';
import AdminLayout from '@/components/AdminLayout';

const API_BASE = '/api/admin'; // Adjust to your API base URL

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseDetails, setResponseDetails] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const showAlert = (message, type) => {
    setSuccessMessage(type === 'success' ? message : '');
    setErrorMessage(type === 'error' ? message : '');
    setTimeout(() => {
      setSuccessMessage('');
      setErrorMessage('');
    }, 5000);
  };

  const showLoading = (show) => {
    setLoading(show);
  };

  const showResponseDetails = (response) => {
    setResponseDetails(response);
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/broadcast-stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setStats(result.stats);
      } else {
        setStats({ error: true });
      }
    } catch (error) {
      console.error('Stats loading error:', error);
      setStats({ error: true });
    }
  };

  return (
    <AdminLayout>
    <div className="max-w-full mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white p-8 text-center">
        <h1 className="text-4xl font-bold mb-2">🚀 Broadcast Notifications</h1>
        <p className="text-lg opacity-90">Send custom notifications to all users or specific roles</p>
      </div>

      {/* Main Content */}
      <div className="p-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {stats?.error ? (
            <div className="bg-gradient-to-br from-[#ffecd2] to-[#fcb69f] text-white p-6 rounded-2xl text-center transform transition-all hover:-translate-y-1 hover:shadow-xl">
              <h3 className="text-2xl font-bold mb-2">❌</h3>
              <p className="text-base opacity-90">Failed to load stats</p>
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-br from-[#f093fb] to-[#f5576c] text-white p-6 rounded-2xl text-center transform transition-all hover:-translate-y-1 hover:shadow-xl">
                <h3 className="text-2xl font-bold mb-2">{stats?.totalUsers || '0'}</h3>
                <p className="text-base opacity-90">Total Users</p>
              </div>
              <div className="bg-gradient-to-br from-[#f093fb] to-[#f5576c] text-white p-6 rounded-2xl text-center transform transition-all hover:-translate-y-1 hover:shadow-xl">
                <h3 className="text-2xl font-bold mb-2">{stats?.usersWithFCM || '0'}</h3>
                <p className="text-base opacity-90">Users with FCM Token</p>
              </div>
              <div className="bg-gradient-to-br from-[#f093fb] to-[#f5576c] text-white p-6 rounded-2xl text-center transform transition-all hover:-translate-y-1 hover:shadow-xl">
                <h3 className="text-2xl font-bold mb-2">{stats?.fcmCoverage || '0%'}</h3>
                <p className="text-base opacity-90">FCM Coverage</p>
              </div>
              <div className="bg-gradient-to-br from-[#f093fb] to-[#f5576c] text-white p-6 rounded-2xl text-center transform transition-all hover:-translate-y-1 hover:shadow-xl">
                <h3 className="text-2xl font-bold mb-2">{stats?.roleBreakdown?.length || 0}</h3>
                <p className="text-base opacity-90">Active Roles</p>
              </div>
            </>
          )}
        </div>

        {/* Alerts */}
        {successMessage && (
          <div className="bg-gradient-to-br from-[#84fab0] to-[#8fd3f4] text-green-800 p-4 rounded-2xl mb-5 border border-green-200">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-gradient-to-br from-[#ffecd2] to-[#fcb69f] text-red-800 p-4 rounded-2xl mb-5 border border-red-200">
            {errorMessage}
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center p-5">
            <div className="border-4 border-gray-200 border-t-[#667eea] rounded-full w-10 h-10 animate-spin mx-auto mb-2"></div>
            <p>Sending notifications...</p>
          </div>
        )}

        {/* Forms and Response Details */}
        <BroadcastForm
          showAlert={showAlert}
          showLoading={showLoading}
          showResponseDetails={showResponseDetails}
          loadStats={loadStats}
        />
        <RoleForm
          showAlert={showAlert}
          showLoading={showLoading}
          showResponseDetails={showResponseDetails}
        />
        <ResponseDetails response={responseDetails} />
      </div>
    </div>
    </AdminLayout>
  );
}