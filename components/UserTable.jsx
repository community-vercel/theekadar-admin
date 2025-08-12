'use client';

import { memo, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UserRow from './UserRow';
import Pagination from './Pagination';
import Modal from './Modal';
import UpdateUserModal from './UpdateUserModal';
import { deleteUser } from '../lib/api';
import toast from 'react-hot-toast';
import UserCard from './UserCard';

const UserTable = memo(
  ({ users, profiles, verifications, totalPages, currentPage, setCurrentPage, onDelete, onUpdate, searchQuery }) => {
    const [modalState, setModalState] = useState({
      type: null,
      userId: null,
      profile: null,
    });

    const openModal = useCallback((type, userId, profile = null) => {
      setModalState({ type, userId, profile });
    }, []);

    const closeModal = useCallback(() => {
      setModalState({ type: null, userId: null, profile: null });
    }, []);

    const handleDelete = useCallback(async () => {
      try {
        await deleteUser(modalState.userId);
        toast.success('User deleted successfully', { position: 'top-right' });
        onDelete(modalState.userId);
        closeModal();
      } catch (error) {
        toast.error(`Error deleting user: ${error.message}`, { position: 'top-right' });
      }
    }, [modalState.userId, onDelete, closeModal]);

    return (
      <div className="container max-w-full">
        {users.length === 0 && searchQuery ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10 text-gray-600 text-lg"
          >
            No users found for "{searchQuery}".
          </motion.div>
        ) : (
          <>
            {/* Table for Desktop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
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
                      'Document Type',
                      'Document',
                      'Submitted At',
                      'Verification Status',
                      'Actions',
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-4 py-3 md:px-6 md:py-4 text-left text-xs md:text-sm font-semibold tracking-wider uppercase"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <AnimatePresence>
                    {users.map((user, idx) => (
                      <UserRow
                        key={user._id}
                        user={user}
                        profile={profiles.find((p) => p.userId._id === user._id)}
                        verification={verifications.find((v) => v.userId._id === user._id)}
                        index={idx}
                        onOpenModal={openModal}
                      />
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </motion.div>

            {/* Card Layout for Mobile */}
            <div className="md:hidden space-y-4">
              <AnimatePresence>
                {users.map((user, idx) => (
                  <UserCard
                    key={user._id}
                    user={user}
                    profile={profiles.find((p) => p.userId._id === user._id)}
                    verification={verifications.find((v) => v.userId._id === user._id)}
                    index={idx}
                    onOpenModal={openModal}
                  />
                ))}
              </AnimatePresence>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        <Modal
          isOpen={modalState.type === 'delete'}
          onClose={closeModal}
          title="Confirm Delete"
          message="Are you sure you want to delete this user?"
          onConfirm={handleDelete}
        />

        <UpdateUserModal
          isOpen={modalState.type === 'update'}
          onClose={closeModal}
          userId={modalState.userId}
          initialData={modalState.profile}
          onUserUpdated={onUpdate}
        />
      </div>
    );
  }
);

export default UserTable;