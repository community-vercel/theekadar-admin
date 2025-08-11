// components/AdminLayout.jsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAdmin } from '../lib/auth';

export default function AdminLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin()) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logo.png" alt="Theekadar Logo" className="h-10 mr-3" />
            <h1 className="text-xl font-bold">Theekadar Admin</h1>
          </div>
          <div className="space-x-6">
            <a href="/admin/dashboard/users" className="hover:text-blue-200 transition">Users</a>
            <a href="/admin/dashboard/verifications" className="hover:text-blue-200 transition">Verifications</a>
            <a href="/admin/dashboard/search" className="hover:text-blue-200 transition">Search Users</a>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-6">{children}</main>
    </div>
  );
}