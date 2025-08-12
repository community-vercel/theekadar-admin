// app/login/page.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../../lib/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { token, user } = await login(email, password);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      if (user.role === 'admin') {
        toast.success('Logged in successfully!', { duration: 4000 });
        router.push('/admin/dashboard');
      } else {
        toast.error('Access denied. Admins only.');
        localStorage.clear();
      }
    } catch (err) {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
      <div className="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-lg transform transition-all duration-500 hover:scale-105 animate-fadeIn">
        <div className="flex justify-center mb-8">
          <img src="/logo.png" alt="Theekadar Logo" className="h-24 animate-pulse" />
        </div>
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold text-lg mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 bg-gray-50"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-8">
            <label className="block text-gray-700 font-semibold text-lg mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 bg-gray-50"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition duration-300 flex items-center justify-center disabled:opacity-50"
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
              </svg>
            )}
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}