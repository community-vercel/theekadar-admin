'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { 
  FaEdit, FaTrash, FaFileAlt, FaUser, 
  FaEnvelope, FaMapMarkerAlt, FaShieldAlt 
} from 'react-icons/fa';
import StatusBadge from './StatusBadge';

const UserCard = memo(({ user, profile, verification, index, onOpenModal }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:border-indigo-300 transition-all duration-200"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
              <FaUser className="text-lg" />
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900">
                {profile?.name || 'Unnamed User'}
              </h4>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <FaShieldAlt />
                <span className="capitalize">{user.role}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onOpenModal('update', user._id, { user, profile })}
              className="p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 shadow-sm"
              title="Edit User"
            >
              <FaEdit className="text-sm" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onOpenModal('delete', user._id)}
              className="p-2 rounded-md bg-red-500 text-white hover:bg-red-600 shadow-sm"
              title="Delete User"
            >
              <FaTrash className="text-sm" />
            </motion.button>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <FaEnvelope className="text-indigo-500" />
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Email</p>
              <p className="text-sm font-medium text-gray-800 truncate">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <FaMapMarkerAlt className="text-green-500" />
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Location</p>
              <p className="text-sm font-medium text-gray-800">
                {profile?.city || 'N/A'} 
                {profile?.town && profile?.city && ' • '} 
                {profile?.town || ''}
              </p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="flex flex-wrap gap-4">
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
        {verification?.documentUrl ? (
          <motion.a
            href={verification.documentUrl}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition"
          >
            <FaFileAlt />
            <span className="text-sm font-medium">View Document</span>
          </motion.a>
        ) : (
          <p className="text-sm text-gray-400 italic">No document submitted</p>
        )}
      </div>
    </motion.div>
  );
});

export default UserCard;
