// app/admin/dashboard/users/page.jsx
'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '../../../../components/AdminLayout';
import UserTable from '../../../../components/UserTable';
import { fetchUsers } from '../../../../lib/api';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetchUsers();
        setUsers(response.users);
        setProfiles(response.profiles);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Manage Users</h2>
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <UserTable users={users} profiles={profiles} />
        )}
      </div>
    </AdminLayout>
  );
}