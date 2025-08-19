'use client';

import { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import UserRow from './UserRow';
import UserCard from './UserCard';
import Pagination from './Pagination';
import Modal from './Modal';
import UpdateUserModal from './UpdateUserModal';
import { deleteUser } from '../lib/api';

const UserTable = memo(
  ({
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
      if (!modal.userId) return toast.error('No user selected');
      try {
        await deleteUser(modal.userId);
        toast.success('User deleted');
        onDelete(modal.userId);
        closeModal();
      } catch (error) {
        toast.error(`Delete failed: ${error.message}`);
      }
    }, [modal.userId, onDelete, closeModal]);

    const sortedUsers = users
      .filter((u) => u && u._id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
      <div className="container max-w-full px-0 sm:px-6 lg:px-0 py-6">
        {/* Empty State */}
        {sortedUsers.length === 0 && searchQuery ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-gray-500 text-lg font-medium bg-white rounded-xl shadow-md"
          >
            No users found for <span className="font-semibold">"{searchQuery}"</span>.
          </motion.div>
        ) : (
          <>
            {/* Desktop Table */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="hidden md:block overflow-x-auto rounded-2xl shadow-xl border border-gray-100 bg-white"
            >
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
                  <tr>
                    {[
                      'Email',
                      'Name',
                      'Role',
                      'City',
                      'Town',
                      'Verified',
                      'Doc Type',
                      'Document',
                      'Submitted',
                      'Status',
                      'Actions',
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-gray-50">
                  <AnimatePresence>
                    {sortedUsers.map((user, idx) => {
                      const profile = profiles.find((p) => p?.userId?._id === user._id) || null;
                      const verification =
                        verifications.find((v) => v?.userId?._id === user._id) || null;

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

            {/* Mobile Cards */}
            <div className="md:hidden space-y-6 py-6">
              <AnimatePresence>
                {sortedUsers.map((user, idx) => {
                  const profile = profiles.find((p) => p?.userId?._id === user._id) || null;
                  const verification =
                    verifications.find((v) => v?.userId?._id === user._id) || null;

                  return (
                    <motion.div
                      key={user._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <UserCard
                        user={user}
                        profile={profile}
                        verification={verification}
                        index={idx}
                        onOpenModal={openModal}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {/* Delete Confirmation */}
        <Modal
          isOpen={modal.type === 'delete'}
          onClose={closeModal}
          title="Delete User"
          message="Are you sure you want to delete this user?"
          onConfirm={handleDelete}
          confirmButtonClass="bg-red-600 hover:bg-red-700"
          cancelButtonClass="bg-gray-300 hover:bg-gray-400"
        />

        {/* Update Modal */}
        <UpdateUserModal
          isOpen={modal.type === 'update'}
          onClose={closeModal}
          userId={modal.userId}
          initialData={modal.profile}
          onUserUpdated={onUpdate}
        />
      </div>
    );
  },
  (prev, next) =>
    prev.users === next.users &&
    prev.profiles === next.profiles &&
    prev.verifications === next.verifications &&
    prev.totalPages === next.totalPages &&
    prev.currentPage === next.currentPage &&
    prev.searchQuery === next.searchQuery
);

export default UserTable;
