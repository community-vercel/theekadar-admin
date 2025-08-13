// components/LinkdminLayout.jsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAdmin } from '../lib/auth';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin()) {
      toast.error('Admins only. Please log in.', { duration: 4000 });
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully', { duration: 4000 });
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
      <nav className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white p-6 shadow-2xl sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
                     {/* <Link href='/admin/dashboard'> */}

          <Link href='/admin/dashboard' className="flex items-center">
            <img src="/logo.png" alt="Theekadar Logo" className="h-16 mr-4 transition-transform duration-300 hover:scale-110" />
            <h1 className="text-3xl font-extrabold tracking-tight">Theekadar Admin</h1>
          </Link>
                    {/* </Link> */}
          <div className="flex space-x-12">
            <Link
              href="/admin/dashboard"
              className="text-lg font-semibold hover:text-blue-200 transition duration-300"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/dashboard/users"
              className="text-lg font-semibold hover:text-blue-200 transition duration-300"
            >
              Users & Verifications
            </Link>
            <Link
              href="/admin/dashboard/search"
              className="text-lg font-semibold hover:text-blue-200 transition duration-300"
            >
              Search Users
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-6 py-3 rounded-xl hover:bg-red-600 transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-12">{children}</main>
    </div>
  );
}