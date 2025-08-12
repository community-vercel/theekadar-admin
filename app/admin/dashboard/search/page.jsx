// app/admin/dashboard/search/page.jsx
'use client';

import { useState } from 'react';
import AdminLayout from '../../../../components/AdminLayout';
import SearchForm from '../../../../components/SearchForm';
import { searchUsersByLocation } from '../../../../lib/api';

export default function SearchUsersPage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (city, town) => {
    setLoading(true);
    try {
      const data = await searchUsersByLocation(city, town);
      setProfiles(data);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white p-12 rounded-3xl shadow-2xl animate-fadeIn">
        <h2 className="text-5xl font-extrabold text-gray-800 mb-8 tracking-tight">Search Users by Location</h2>
        <SearchForm onSearch={handleSearch} />
        {loading ? (
          <div className="flex justify-center">
            <svg
              className="animate-spin h-12 w-12 text-blue-600"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
            </svg>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-3xl shadow-2xl">
              <thead className="bg-gradient-to-r from-blue-100 to-indigo-100">
                <tr>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700">Role</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700">City</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700">Town</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700">Verified</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700">Verification Status</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((profile) => (
                  <tr key={profile.userId._id} className="hover:bg-gray-50 transition duration-300">
                    <td className="px-6 py-5 border-b">{profile.userId.email}</td>
                    <td className="px-6 py-5 border-b">{profile.name || 'N/A'}</td>
                    <td className="px-6 py-5 border-b">{profile.userId.role}</td>
                    <td className="px-6 py-5 border-b">{profile.city}</td>
                    <td className="px-6 py-5 border-b">{profile.town}</td>
                    <td className="px-6 py-5 border-b">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          profile.userId.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {profile.userId.isVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </td>
                    <td className="px-6 py-5 border-b">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          profile.verificationStatus === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : profile.verificationStatus === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {profile.verificationStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}