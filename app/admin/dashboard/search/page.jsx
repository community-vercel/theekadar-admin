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
      <div className="bg-white p-6 rounded-2xl shadow-2xl animate-fadeIn sm:p-12 sm:rounded-3xl">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 tracking-tight sm:text-5xl sm:mb-8">
          Search Users by Location
        </h2>
        <SearchForm onSearch={handleSearch} />
        {loading ? (
          <div className="flex justify-center">
            <svg
              className="animate-spin h-8 w-8 text-blue-600 sm:h-12 sm:w-12"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
              />
            </svg>
          </div>
        ) : (
          <>
            {/* Card Layout for Mobile */}
            <div className="block sm:hidden space-y-4">
              {profiles.map((profile) => (
                <div
                  key={profile.userId._id}
                  className="bg-white border rounded-xl shadow-md p-4 hover:bg-gray-50 transition duration-300"
                >
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-semibold text-gray-700">Email:</span>
                      <p className="text-xs text-gray-900">{profile.userId.email}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-700">Name:</span>
                      <p className="text-xs text-gray-900">{profile.name || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-700">Role:</span>
                      <p className="text-xs text-gray-900">{profile.userId.role}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-700">City:</span>
                      <p className="text-xs text-gray-900">{profile.city}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-700">Town:</span>
                      <p className="text-xs text-gray-900">{profile.town}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-700">Verified:</span>
                      <p>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            profile.userId.isVerified
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {profile.userId.isVerified ? 'Verified' : 'Not Verified'}
                        </span>
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-700">Verification Status:</span>
                      <p>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            profile.verificationStatus === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : profile.verificationStatus === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {profile.verificationStatus}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Table Layout for Larger Screens */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full bg-white border rounded-2xl shadow-2xl sm:rounded-3xl">
                <thead className="bg-gradient-to-r from-blue-100 to-indigo-100">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 sm:px-6 sm:py-5 sm:text-sm">
                      Email
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 sm:px-6 sm:py-5 sm:text-sm">
                      Name
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 sm:px-6 sm:py-5 sm:text-sm">
                      Role
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 sm:px-6 sm:py-5 sm:text-sm">
                      City
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 sm:px-6 sm:py-5 sm:text-sm">
                      Town
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 sm:px-6 sm:py-5 sm:text-sm">
                      Verified
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 sm:px-6 sm:py-5 sm:text-sm">
                      Verification Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((profile) => (
                    <tr
                      key={profile.userId._id}
                      className="hover:bg-gray-50 transition duration-300"
                    >
                      <td className="px-3 py-3 border-b text-xs sm:px-6 sm:py-5 sm:text-sm text-gray-900">
                        {profile.userId.email}
                      </td>
                      <td className="px-3 py-3 border-b text-xs sm:px-6 sm:py-5 sm:text-sm text-gray-900">
                        {profile.name || 'N/A'}
                      </td>
                      <td className="px-3 py-3 border-b text-xs sm:px-6 sm:py-5 sm:text-sm text-gray-900">
                        {profile.userId.role}
                      </td>
                      <td className="px-3 py-3 border-b text-xs sm:px-6 sm:py-5 sm:text-sm text-gray-900">
                        {profile.city}
                      </td>
                      <td className="px-3 py-3 border-b text-xs sm:px-6 sm:py-5 sm:text-sm text-gray-900">
                        {profile.town}
                      </td>
                      <td className="px-3 py-3 border-b text-xs sm:px-6 sm:py-5 sm:text-sm text-gray-900">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            profile.userId.isVerified
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          } sm:px-3`}
                        >
                          {profile.userId.isVerified ? 'Verified' : 'Not Verified'}
                        </span>
                      </td>
                      <td className="px-3 py-3 border-b text-xs sm:px-6 sm:py-5 sm:text-sm text-gray-900">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            profile.verificationStatus === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : profile.verificationStatus === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          } sm:px-3`}
                        >
                          {profile.verificationStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )}