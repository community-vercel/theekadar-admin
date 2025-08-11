// components/UserTable.jsx
'use client';

import { deleteUser } from '../lib/api';

export default function UserTable({ users, profiles }) {
  const handleDelete = async (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        window.location.reload();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">City</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Town</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Verification</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const profile = profiles.find((p) => p.userId._id === user._id);
            return (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b">{user.email}</td>
                <td className="px-6 py-4 border-b">{profile?.name || 'N/A'}</td>
                <td className="px-6 py-4 border-b">{user.role}</td>
                <td className="px-6 py-4 border-b">{profile?.city || 'N/A'}</td>
                <td className="px-6 py-4 border-b">{profile?.town || 'N/A'}</td>
                <td className="px-6 py-4 border-b">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      profile?.verificationStatus === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : profile?.verificationStatus === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {profile?.verificationStatus || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 border-b">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}