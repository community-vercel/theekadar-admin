'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaFileAlt, FaUser, FaEnvelope, FaMapMarkerAlt, FaShieldAlt } from 'react-icons/fa';
import StatusBadge from './StatusBadge';

const UserCard = memo(({ user, profile, verification, index, onOpenModal }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
      className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg border border-gray-200 hover:border-indigo-300 transition-all duration-300"
    >
      <div className="space-y-4">
        {/* Header with Avatar and Actions */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <FaUser className="text-white text-lg" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-800">{profile?.name || 'Unnamed User'}</h4>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <FaShieldAlt />
                <span className="capitalize">{user.role}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onOpenModal('update', user._id, { user, profile })}
              className="p-2.5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
              title="Edit User"
              aria-label="Edit User"
            >
              <FaEdit className="text-sm" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onOpenModal('delete', user._id)}
              className="p-2.5 rounded-full bg-gradient-to-br from-red-500 to-pink-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
              title="Delete User"
              aria-label="Delete User"
            >
              <FaTrash className="text-sm" />
            </motion.button>
          </div>
        </div>

        {/* User Details Grid */}
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <FaEnvelope className="text-indigo-500" />
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</p>
              <p className="text-sm font-medium text-gray-800 truncate">{user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <FaMapMarkerAlt className="text-green-500" />
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Location</p>
              <p className="text-sm font-medium text-gray-800">
                {profile?.city || 'N/A'} {profile?.town && profile?.city && '•'} {profile?.town || ''}
              </p>
            </div>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">Status:</span>
            <StatusBadge status={user.isVerified ? 'verified' : 'notVerified'} />
          </div>
          {verification && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Verification:</span>
              <StatusBadge status={verification?.status || 'pending'} />
            </div>
          )}
        </div>

        {/* Document Link */}
        {verification?.documentUrl && (
          <motion.a
            href={verification.documentUrl}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg text-blue-700 hover:text-blue-800 hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 transition-all duration-200"
            aria-label="View Document"
          >
            <FaFileAlt />
            <span className="text-sm font-medium">View Document</span>
          </motion.a>
        )}
      </div>
    </motion.div>
  );
});

export default UserCard;

