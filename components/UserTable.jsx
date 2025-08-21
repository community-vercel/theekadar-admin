'use client';

import { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaEdit, 
  FaTrashAlt, 
  FaFileAlt, 
  FaUser, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaShieldAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSearch,
  FaUserCircle
} from 'react-icons/fa';
import UpdateUserModal from './UpdateUserModal';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    verified: { icon: FaCheckCircle, color: 'green', bg: 'bg-green-100', text: 'text-green-800' },
    approved: { icon: FaCheckCircle, color: 'green', bg: 'bg-green-100', text: 'text-green-800' },
    pending: { icon: FaClock, color: 'yellow', bg: 'bg-yellow-100', text: 'text-yellow-800' },
    rejected: { icon: FaTimesCircle, color: 'red', bg: 'bg-red-100', text: 'text-red-800' },
    notVerified: { icon: FaTimesCircle, color: 'gray', bg: 'bg-gray-100', text: 'text-gray-800' }
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <Icon className="text-xs" />
      {status}
    </span>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      
      <div className="flex space-x-1">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 text-sm font-medium rounded-lg ${
                page === currentPage
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

// Modal Component
const Modal = ({ isOpen, onClose, title, message, onConfirm, confirmButtonClass, cancelButtonClass }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
        >
          <div>
            <div className="mt-3 text-center sm:mt-0 sm:text-left">
              <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">{message}</p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              onClick={onConfirm}
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none sm:ml-3 sm:w-auto sm:text-sm ${confirmButtonClass}`}
            >
              Confirm
            </button>
            <button
              onClick={onClose}
              className={`mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:mt-0 sm:w-auto sm:text-sm ${cancelButtonClass}`}
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};


const UserRow = memo(({ user, profile, verification, index, onOpenModal }) => {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, delay: index * 0.02 }}
      className="group hover:bg-indigo-50/50 transition-colors duration-200"
    >
      {/* User Info */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-sm">
            {(profile?.name || user.email).charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{profile?.name || 'N/A'}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      </td>

      {/* Role */}
      <td className="px-6 py-4">
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
          <FaShieldAlt />
          {user.role}
        </span>
      </td>

      {/* Location */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <FaMapMarkerAlt className="text-xs" />
          <span>{profile?.city || 'N/A'}</span>
          {profile?.town && <span>, {profile.town}</span>}
        </div>
      </td>

      {/* Verification Status */}
      <td className="px-6 py-4">
        <StatusBadge status={user.isVerified ? 'verified' : 'notVerified'} />
      </td>

      {/* Document */}
      <td className="px-6 py-4">
        {verification?.documentUrl ? (
          <motion.a
            href={verification.documentUrl}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md border border-blue-200 hover:bg-blue-100 transition-colors"
          >
            <FaFileAlt />
            {verification.documentType || 'View'}
          </motion.a>
        ) : (
          <span className="text-xs text-gray-400">No document</span>
        )}
      </td>

      {/* Verification Status */}
      <td className="px-6 py-4">
        <StatusBadge status={verification?.status || 'pending'} />
      </td>

      {/* Created Date */}
      <td className="px-6 py-4 text-sm text-gray-600">
        {new Date(user.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onOpenModal('update', user._id, { user, profile })}
            className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 shadow-sm transition-colors"
            title="Edit User"
          >
            <FaEdit className="text-sm" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onOpenModal('delete', user._id)}
            className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 shadow-sm transition-colors"
            title="Delete User"
          >
            <FaTrashAlt className="text-sm" />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
});

const UserCard = memo(({ user, profile, verification, index, onOpenModal }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-200"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm">
            <FaUserCircle className="text-xl" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">{profile?.name || 'Unnamed User'}</h4>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <FaEnvelope className="text-xs" />
              {user.email}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onOpenModal('update', user._id, { user, profile })}
            className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 shadow-sm"
            title="Edit User"
          >
            <FaEdit className="text-sm" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onOpenModal('delete', user._id)}
            className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 shadow-sm"
            title="Delete User"
          >
            <FaTrashAlt className="text-sm" />
          </motion.button>
        </div>
      </div>

      {/* Details Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <FaShieldAlt className="text-indigo-500" />
            <span className="text-sm font-medium text-gray-700">Role:</span>
          </div>
          <span className="text-sm font-semibold text-gray-900 capitalize">{user.role}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-green-500" />
            <span className="text-sm font-medium text-gray-700">Location:</span>
          </div>
          <span className="text-sm font-semibold text-gray-900">
            {profile?.city || 'N/A'}{profile?.town && profile?.city ? `, ${profile.town}` : profile?.town || ''}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <StatusBadge status={user.isVerified ? 'verified' : 'notVerified'} />
        </div>

        {verification && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Verification:</span>
            <StatusBadge status={verification.status || 'pending'} />
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
          className="flex items-center gap-2 p-3 mt-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors"
        >
          <FaFileAlt />
          <span className="text-sm font-medium">View Document ({verification.documentType || 'File'})</span>
        </motion.a>
      )}

      {/* Join Date */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Joined {new Date(user.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
    </motion.div>
  );
});

// Main UserTable Component
const UserTable = memo(({
  users = [],
  profiles = [],
  verifications = [],
  totalPages = 1,
  currentPage = 1,
  setCurrentPage = () => {},
  onDelete = () => {},
  onUpdate = () => {},
  searchQuery = '',
}) => {
  const [modal, setModal] = useState({ type: null, userId: null, profile: null });

  const openModal = useCallback((type, userId, profile = null) => {
    setModal({ type, userId, profile });
  }, []);

  const closeModal = useCallback(() => {
    setModal({ type: null, userId: null, profile: null });
  }, []);

  const handleDelete = useCallback(async () => {
    if (!modal.userId) return;
    try {
      // Replace with your actual delete API call
      // await deleteUser(modal.userId);
      console.log('Deleting user:', modal.userId);
      onDelete(modal.userId);
      closeModal();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }, [modal.userId, onDelete, closeModal]);

  const sortedUsers = users
    .filter(user => user && user._id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (sortedUsers.length === 0 && searchQuery) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <FaSearch className="mx-auto text-4xl text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
        <p className="text-gray-500">
          No users match your search for <span className="font-semibold">"{searchQuery}"</span>
        </p>
      </motion.div>
    );
  }

  if (sortedUsers.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <FaUser className="mx-auto text-4xl text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No users yet</h3>
        <p className="text-gray-500">Users will appear here once they register</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Desktop Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hidden lg:block overflow-x-auto rounded-xl shadow-lg border border-gray-200 bg-white"
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-indigo-600 to-blue-600">
            <tr>
              {[
                'User',
                'Role',
                'Location',
                'Account Status',
                'Document',
                'Verification',
                'Joined',
                'Actions',
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            <AnimatePresence>
              {sortedUsers.map((user, idx) => {
                const profile = profiles.find(p => p?.userId?._id === user._id);
                const verification = verifications.find(v => v?.userId?._id === user._id);
                return (
                  <UserRow
                    key={user._id}
                    user={user}
                    profile={profile}
                    verification={verification}
                    index={idx}
                    onOpenModal={openModal}
                  />
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>

      <div className="lg:hidden space-y-4">
        <AnimatePresence>
          {sortedUsers.map((user, idx) => {
            const profile = profiles.find(p => p?.userId?._id === user._id);
            const verification = verifications.find(v => v?.userId?._id === user._id);
            return (
              <UserCard
                key={user._id}
                user={user}
                profile={profile}
                verification={verification}
                index={idx}
                onOpenModal={openModal}
              />
            );
          })}
        </AnimatePresence>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={modal.type === 'delete'}
        onClose={closeModal}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={handleDelete}
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        cancelButtonClass="bg-gray-300 hover:bg-gray-400 text-gray-700"
      />

       <UpdateUserModal
          isOpen={modal.type === 'update'}
          onClose={closeModal}
          userId={modal.userId}
          initialData={modal.profile}
          onUserUpdated={onUpdate}
        />
    </div>
  );
});

export default UserTable;