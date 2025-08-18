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
        toast.success('Data refreshed successfully!', { 
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
    console.log('Deleting user:', userId); // Debug log
    setUsers((prev) => prev.filter((user) => user._id !== userId));
    setProfiles((prev) => prev.filter((p) => p.userId._id !== userId));
    setVerifications((prev) => prev.filter((v) => v.userId._id !== userId));
  }, []);

  const handleUpdate = useCallback((userId, updatedUser) => {
    console.log('Handling update in UsersPage:', { userId, updatedUser }); // Debug log
    const userData = updatedUser.user || {};
    const profileData = updatedUser.profile || null;
    const verificationData = updatedUser.verification || null;

    setUsers((prev) =>
      prev.map((user) => (user._id === userId ? { ...user, ...userData } : user))
    );

    setProfiles((prev) => {
      if (!profileData) {
        return prev.filter((p) => p.userId._id !== userId);
      }
      const existingProfile = prev.find((p) => p.userId._id === userId);
      if (existingProfile) {
        return prev.map((p) =>
          p.userId._id === userId ? { ...p, ...profileData } : p
        );
      }
      return [...prev, { ...profileData, userId: { _id: userId } }];
    });

    setVerifications((prev) => {
      if (!verificationData) {
        return prev.filter((v) => v.userId._id !== userId);
      }
      const existingVerification = prev.find((v) => v.userId._id === userId);
      if (existingVerification) {
        return prev.map((v) =>
          v.userId._id === userId ? { ...v, ...verificationData } : v
        );
      }
      return [...prev, { ...verificationData, userId: { _id: userId } }];
    });
  }, []);

  const filteredUsers = useMemo(() => {
    console.log('Recalculating filteredUsers with searchQuery:', searchQuery); // Debug log
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

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const verifiedUsers = users.filter((u) => u.isVerified).length;
    const pendingVerifications = verifications.filter((v) => v.status === 'pending').length;
    
    console.log('Recalculating stats:', { totalUsers, verifiedUsers, pendingVerifications }); // Debug log
    return {
      total: totalUsers,
      verified: verifiedUsers,
      pending: pendingVerifications,
    };
  }, [users, verifications]);

  const handleRefresh = useCallback(() => {
    loadUsers(true);
  }, [loadUsers]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Debug log to monitor state changes
  useEffect(() => {
    console.log('UsersPage state updated:', { users, profiles, verifications });
  }, [users, profiles, verifications]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                User Management
              </h1>
              <p className="text-gray-600 text-sm">
                Manage users, verifications, and account settings
              </p>
            </div>
            <motion.button
              onClick={handleRefresh}
              disabled={refreshing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium disabled:opacity-50"
            >
              <FaSync className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-blue-500 p-4 rounded-lg text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Users</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FaUsers className="text-3xl text-blue-200" />
            </div>
          </div>
          <div className="bg-green-500 p-4 rounded-lg text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Verified Users</p>
                <p className="text-2xl font-bold">{stats.verified}</p>
              </div>
              <FaUserCheck className="text-3xl text-green-200" />
            </div>
          </div>
          <div className="bg-orange-500 p-4 rounded-lg text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Pending Verifications</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <FaUserClock className="text-3xl text-orange-200" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
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