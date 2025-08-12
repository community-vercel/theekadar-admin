'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../../../components/AdminLayout';
import UserTable from '../../../../components/UserTable';
import { fetchUsers } from '../../../../lib/api';
import toast from 'react-hot-toast';
import SkeletonLoader from '../../../../components/SkeletonLoader';
import SearchBar from '../../../../components/SearchBar';
import { FaUsers, FaUserCheck, FaUserClock, FaSync } from 'react-icons/fa';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const pageSize = 10;

  const loadUsers = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const response = await fetchUsers(currentPage, pageSize);
      setUsers(response.users || []);
      setProfiles(response.profiles || []);
      setVerifications(response.verifications || []);
      setTotalPages(response.totalPages || 1);
      
      if (showRefreshing) {
        toast.success('Data refreshed successfully! 🔄', { 
          position: 'top-right',
          duration: 2000
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users. Please try again.', { 
        position: 'top-right',
        duration: 4000,
        icon: '❌'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentPage]);

  const handleDelete = useCallback((userId) => {
    setUsers((prev) => prev.filter((user) => user._id !== userId));
    setProfiles((prev) => prev.filter((p) => p.userId._id !== userId));
    setVerifications((prev) => prev.filter((v) => v.userId._id !== userId));
  }, []);

  const handleUpdate = useCallback((userId, updatedUser) => {
    const userData = updatedUser.user || updatedUser;
    const profileData = updatedUser.profile || null;

    setUsers((prev) =>
      prev.map((user) => (user._id === userId ? { ...user, ...userData } : user))
    );

    setProfiles((prev) => {
      if (userData.role === 'client') {
        return prev.filter((p) => p.userId._id !== userId);
      }
      return prev.map((p) =>
        p.userId._id === userId
          ? { ...p, ...profileData, userId: { ...p.userId, ...userData } }
          : p
      );
    });

    setVerifications((prev) => {
      if (userData.role === 'client') {
        return prev.filter((v) => v.userId._id !== userId);
      }
      return prev.map((v) =>
        v.userId._id === userId
          ? { ...v, status: profileData?.verificationStatus || updatedUser.verification?.status || 'pending' }
          : v
      );
    });
  }, []);

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    const lowerQuery = searchQuery.toLowerCase();
    return users.filter((user) => {
      const profile = profiles.find((p) => p.userId._id === user._id);
      return (
        user.email.toLowerCase().includes(lowerQuery) ||
        (profile?.name?.toLowerCase() || '').includes(lowerQuery) ||
        user.role.toLowerCase().includes(lowerQuery)
      );
    });
  }, [users, profiles, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const verifiedUsers = users.filter(u => u.isVerified).length;
    const pendingVerifications = verifications.filter(v => v.status === 'pending').length;
    
    return {
      total: totalUsers,
      verified: verifiedUsers,
      pending: pendingVerifications
    };
  }, [users, verifications]);

  const handleRefresh = useCallback(() => {
    loadUsers(true);
  }, [loadUsers]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-3xl shadow-xl border border-gray-100"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  User Management
                </span>
              </h1>
              <p className="text-gray-600 text-lg">
                Manage users, verifications, and account settings
              </p>
            </div>
            
            <motion.button
              onClick={handleRefresh}
              disabled={refreshing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
            >
              <FaSync className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <FaUsers className="text-4xl text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Verified Users</p>
                <p className="text-3xl font-bold">{stats.verified}</p>
              </div>
              <FaUserCheck className="text-4xl text-green-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Pending Verifications</p>
                <p className="text-3xl font-bold">{stats.pending}</p>
              </div>
              <FaUserClock className="text-4xl text-orange-200" />
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
        >
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          
          {loading ? (
            <SkeletonLoader />
          ) : (
            <UserTable
              users={filteredUsers}
              profiles={profiles}
              verifications={verifications}
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              searchQuery={searchQuery}
            />
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
}