// UserRow.jsx - Simplified & Stylish Desktop Row
'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaFileAlt } from 'react-icons/fa';
import StatusBadge from './StatusBadge';

const UserRow = memo(({ user, profile, verification, index, onOpenModal }) => {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`group transition-colors ${
        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
      } hover:bg-indigo-50/40`}
    >
      {/* Email */}
      <td className="px-6 py-4">
        <p className="text-sm font-medium text-gray-800 group-hover:text-indigo-700">
          {user.email}
        </p>
      </td>

      {/* Name + Avatar */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-sm">
            {(profile?.name || user.email).charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-semibold text-gray-900">
            {profile?.name || 'N/A'}
          </span>
        </div>
      </td>

      {/* Role */}
      <td className="px-6 py-4">
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize group-hover:bg-indigo-100 group-hover:text-indigo-800 transition">
          {user.role}
        </span>
      </td>

      {/* City */}
      <td className="px-6 py-4 text-sm text-gray-600">{profile?.city || 'N/A'}</td>

      {/* Town */}
      <td className="px-6 py-4 text-sm text-gray-600">{profile?.town || 'N/A'}</td>

      {/* Verification */}
      <td className="px-6 py-4">
        <StatusBadge status={user.isVerified ? 'verified' : 'notVerified'} />
      </td>

      {/* Document Type */}
      <td className="px-6 py-4 text-sm text-gray-600">
        {verification?.documentType || 'N/A'}
      </td>

      {/* Document Link */}
      <td className="px-6 py-4">
        {verification?.documentUrl ? (
          <motion.a
            href={verification.documentUrl}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md border border-blue-200 hover:bg-blue-100"
          >
            <FaFileAlt /> View
          </motion.a>
        ) : (
          <span className="text-sm text-gray-400">N/A</span>
        )}
      </td>

      {/* Submitted At */}
      <td className="px-6 py-4 text-sm text-gray-600">
        {verification?.submittedAt
          ? new Date(verification.submittedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : 'N/A'}
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <StatusBadge status={verification?.status || 'pending'} />
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex gap-2 opacity-70 group-hover:opacity-100 transition">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onOpenModal('update', user._id, { user, profile })}
            className="p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 shadow"
            title="Edit User"
          >
            <FaEdit className="text-sm" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onOpenModal('delete', user._id)}
            className="p-2 rounded-md bg-red-500 text-white hover:bg-red-600 shadow"
            title="Delete User"
          >
            <FaTrash className="text-sm" />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
})

export default UserRow;
