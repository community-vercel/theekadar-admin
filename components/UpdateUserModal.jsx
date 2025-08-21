'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaTimes, 
  FaUser, 
  FaShieldAlt, 
  FaFileAlt,
  FaSpinner,
  FaExclamationTriangle 
} from 'react-icons/fa';
import { updateUserByAdmin, verifyWorker } from '../lib/api';
import toast from 'react-hot-toast';

export default function UpdateUserModal({ isOpen, onClose, userId, initialData, onUserUpdated }) {
  console.log('initial data',initialData)
  const [formData, setFormData] = useState({
    role: initialData?.user?.role || 'client',
    isVerified: initialData?.user?.isVerified || false,
    verificationStatus: initialData?.profile?.status || 'pending',
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (initialData) {
      setFormData({
        role: initialData.user?.role || 'client',
        isVerified: initialData.user?.isVerified || false,
        verificationStatus: initialData?.profile?.status || 'pending',
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (formData.role === 'client' && activeTab === 'verification') {
      setActiveTab('basic');
    }
  }, [formData.role, activeTab]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }, []);

const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!formData.role) {
        toast.error('Role is required', {
          position: 'top-right',
          duration: 3000,
          icon: '⚠️',
        });
        return;
      }

      setLoading(true);
      try {
        const payload = {
          email: initialData.user?.email,
          role: formData.role,
          isVerified: formData.isVerified,
        };

        if (formData.role !== 'client') {
          payload.verificationStatus = formData.verificationStatus;
        }

        const response = await updateUserByAdmin(userId, payload);
        toast.success('User updated successfully! Notification sent to user.', {
          position: 'top-right',
          duration: 3000,
        });
        onUserUpdated(userId, {
          user: { _id: userId, ...payload },
          profile: formData.role !== 'client' ? { userId: { _id: userId }, verificationStatus: formData.verificationStatus } : null,
          verification: formData.role !== 'client' ? { userId: { _id: userId }, status: formData.verificationStatus } : null,
        });
      } catch (error) {
        toast.error(`Failed to update user: ${error.message}`, {
          position: 'top-right',
          duration: 4000,
          icon: '❌',
        });
      } finally {
        setLoading(false);
        onClose();
      }
    },
    [formData, userId, initialData, onUserUpdated, onClose]
  );

  const handleVerify = useCallback(
    async (status) => {
      setLoading(true);
      try {
        const response = await verifyWorker(userId, status);
        toast.success(`User ${status} successfully! Notification sent to user.`, {
          position: 'top-right',
          duration: 3000,
        });
        onUserUpdated(userId, {
          user: { _id: userId, email: initialData.user?.email, role: formData.role, isVerified: formData.isVerified },
          profile: { userId: { _id: userId }, verificationStatus: status },
          verification: { userId: { _id: userId }, status },
        });
        onClose();
      } catch (error) {
        toast.error(`Failed to ${status} user: ${error.message}`, {
          position: 'top-right',
          duration: 4000,
          icon: '❌',
        });
      } finally {
        setLoading(false);
      }
    },
    [userId, formData, initialData, onUserUpdated, onClose]
  );



  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="update-user-modal-title"
    >
      <motion.div
        initial={{ scale: 0.9, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 50, opacity: 0 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-indigo-600 px-8 py-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white"
            disabled={loading}
          >
            

            <FaTimes />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <FaUser className="text-white text-xl" />
            </div>
            <div>
              <h3 id="update-user-modal-title" className="text-2xl font-bold text-white">
                Update User
              </h3>
              <p className="text-blue-200 text-sm">
                {initialData?.user?.email || 'User Management'}
              </p>
            </div>
          </div>
        </div>
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex">
            <button
              onClick={() => setActiveTab('basic')}
              className={`flex-1 px-6 py-4 text-sm font-medium ${
                activeTab === 'basic'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaUser className="inline mr-2" />
              Basic Info
            </button>
            {formData.role !== 'client' && (
              <button
                onClick={() => setActiveTab('verification')}
                className={`flex-1 px-6 py-4 text-sm font-medium ${
                  activeTab === 'verification'
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaFileAlt className="inline mr-2" />
                Verification
              </button>
            )}
          </div>
        </div>
        <div className="p-8 max-h-96 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {activeTab === 'basic' && (
                <motion.div
                  key="basic"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700" htmlFor="role">
                      <FaShieldAlt className="inline mr-2 text-indigo-500" />
                      User Role
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 text-gray-900"
                      aria-label="User Role"
                      disabled={loading}
                    >
                      <option value="client">Client</option>
                      <option value="worker">Worker</option>
                      <option value="admin">Admin</option>
                      <option value="thekadar">Thekedar</option>
                    </select>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        id="isVerified"
                        type="checkbox"
                        name="isVerified"
                        checked={formData.isVerified}
                        onChange={handleChange}
                        className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 transition-all duration-200"
                        aria-label="Verified Status"
                        disabled={loading}
                      />
                      <div>
                        <span className="text-sm font-semibold text-gray-700">
                          Account Verified
                        </span>
                        <p className="text-xs text-gray-500">
                          Mark this account as verified and trusted
                        </p>
                      </div>
                    </label>
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'verification' && formData.role !== 'client' && (
                <motion.div
                  key="verification"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700" htmlFor="verificationStatus">
                      <FaFileAlt className="inline mr-2 text-blue-500" />
                      Document Verification Status
                    </label>
                    <select

                      id="verificationStatus"
                      name="verificationStatus"
                      value={formData.verificationStatus}
                      onChange={handleChange}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 text-gray-900"
                      aria-label="Verification Status"
                      disabled={loading}
                    >
                      <option value="pending">Pending Review</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <FaExclamationTriangle className="text-orange-500" />
                      Quick Verification Actions
                    </h4>
                    <div className="flex gap-3">
                      <motion.button
                        type="button"
                        onClick={() => handleVerify('approved')}
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Approve Verification"
                      >
                        {loading ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                        Approve
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={() => handleVerify('rejected')}
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Reject Verification"
                      >
                        {loading ? <FaSpinner className="animate-spin" /> : <FaTimesCircle />}
                        Reject
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200"
                disabled={loading}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <FaSpinner className="animate-spin" />
                    Updating...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}