'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../../../components/AdminLayout';
import UserTable from '../../../../components/UserTable';
import { fetchUsers } from '../../../../lib/api';
import toast from 'react-hot-toast';
import SkeletonLoader from '../../../../components/SkeletonLoader';
import SearchBar from '../../../../components/SearchBar';
import { FaUsers, FaUserCheck, FaUserClock, FaSync, FaSearch } from 'react-icons/fa';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [profile, setProfile] = useState([]);
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
      setProfile(response.profiles || []);
      setVerifications(response.verifications || []);
      setTotalPages(response.totalPages || 1);
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
    console.log('Deleting user:', userId);
    setUsers((prev) => prev.filter((user) => user._id !== userId));
    setProfiles((prev) => prev.filter((p) => p.userId._id !== userId));
    setProfile((prev) => prev.filter((p) => p.userId._id !== userId));
    setVerifications((prev) => prev.filter((v) => v.userId._id !== userId));
  }, []);

  const handleUpdate = useCallback((userId, updatedUser) => {
    console.log('Handling update in UsersPage:', { userId, updatedUser });
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

    setProfile((prev) => {
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
    console.log('Recalculating filteredUsers with searchQuery:', searchQuery);
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
    
    console.log('Recalculating stats:', { totalUsers, verifiedUsers, pendingVerifications });
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

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                User Management
              </h1>
              <p className="text-gray-600">
                Manage users, verifications, and account settings
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <FaSync className={`text-lg ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Total Users</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="bg-blue-400 bg-opacity-30 rounded-lg p-3">
                <FaUsers className="text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium mb-1">Verified Users</p>
                <p className="text-3xl font-bold">{stats.verified}</p>
              </div>
              <div className="bg-emerald-400 bg-opacity-30 rounded-lg p-3">
                <FaUserCheck className="text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium mb-1">Pending Verifications</p>
                <p className="text-3xl font-bold">{stats.pending}</p>
              </div>
              <div className="bg-amber-400 bg-opacity-30 rounded-lg p-3">
                <FaUserClock className="text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users by name, email, or role..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
              />
            </div>
          </div>

          {/* Table Container */}
          {loading ? (
            <SkeletonLoader />
          ) : (
            <UserTable
              users={filteredUsers}
              profiles={profiles}
              profile={profile}
              verifications={verifications}
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              searchQuery={searchQuery}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}