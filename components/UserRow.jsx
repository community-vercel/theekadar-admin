// UserRow.jsx - Optimized Desktop Table Row Component
'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaFileAlt } from 'react-icons/fa';
import StatusBadge from './StatusBadge';

const UserRow = memo(({ user, profile, verification, index, onOpenModal }) => {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`group transition-all duration-300 ${
        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
      } hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 hover:shadow-md`}
    >
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-gray-900 group-hover:text-indigo-700 transition-colors">
          {user.email}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">
              {(profile?.name || user.email).charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {profile?.name || 'N/A'}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize bg-gray-100 text-gray-800 group-hover:bg-indigo-100 group-hover:text-indigo-800 transition-colors">
          {user.role}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">{profile?.city || 'N/A'}</td>
      <td className="px-6 py-4 text-sm text-gray-600">{profile?.town || 'N/A'}</td>
      <td className="px-6 py-4">
        <StatusBadge status={user.isVerified ? 'verified' : 'notVerified'} />
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">{verification?.documentType || 'N/A'}</td>
      <td className="px-6 py-4">
        {verification?.documentUrl ? (
          <motion.a
            href={verification.documentUrl}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 border border-blue-200"
            aria-label="View Document"
          >
            <FaFileAlt />
            View
          </motion.a>
        ) : (
          <span className="text-sm text-gray-400">N/A</span>
        )}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {verification?.submittedAt 
          ? new Date(verification.submittedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })
          : 'N/A'
        }
      </td>
      <td className="px-6 py-4">
        <StatusBadge status={verification?.status || 'pending'} />
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onOpenModal('update', user._id, { user, profile })}
            className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
            title="Edit User"
            aria-label="Edit User"
          >
            <FaEdit className="text-sm" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onOpenModal('delete', user._id)}
            className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-pink-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
            title="Delete User"
            aria-label="Delete User"
          >
            <FaTrash className="text-sm" />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
});
export default UserRow