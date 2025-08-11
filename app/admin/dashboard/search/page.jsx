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
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Search Users by Location</h2>
        <SearchForm onSearch={handleSearch} />
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">City</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Town</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Verification</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((profile) => (
                  <tr key={profile.userId._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 border-b">{profile.userId.email}</td>
                    <td className="px-6 py-4 border-b">{profile.name || 'N/A'}</td>
                    <td className="px-6 py-4 border-b">{profile.city}</td>
                    <td className="px-6 py-4 border-b">{profile.town}</td>
                    <td className="px-6 py-4 border-b">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
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