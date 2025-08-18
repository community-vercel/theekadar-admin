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
    const [modalState, setModalState] = useState({
      type: null,
      userId: null,
      profile: null,
    });

    // Debug log to confirm prop updates
    console.log('UserTable re-rendered with props:', { users, profiles, verifications });

    const openModal = useCallback((type, userId, profile = null) => {
      console.log('Opening modal:', { type, userId, profile });
      setModalState({ type, userId, profile });
    }, []);

    const closeModal = useCallback(() => {
      console.log('Closing modal');
      setModalState({ type: null, userId: null, profile: null });
    }, []);

    const handleDelete = useCallback(async () => {
      if (!modalState.userId) {
        toast.error('No user selected for deletion', { position: 'top-right' });
        return;
      }
      try {
        await deleteUser(modalState.userId);
        toast.success('User deleted successfully', { position: 'top-right' });
        onDelete(modalState.userId);
        closeModal();
      } catch (error) {
        toast.error(`Error deleting user: ${error.message}`, { position: 'top-right' });
      }
    }, [modalState.userId, onDelete, closeModal]);

    // Sort and filter valid users
    const sortedUsers = users
      .filter((user) => user && user._id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Animation variants
    const tableVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    };

    const cardVariants = {
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
      exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
    };

    return (
      <div className="container max-w-full px-4 sm:px-6 lg:px-8 py-6">
        {sortedUsers.length === 0 && searchQuery ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 text-gray-500 text-lg font-medium bg-white rounded-lg shadow-md"
          >
            No users found for &quot;{searchQuery}&quot;.
          </motion.div>
        ) : (
          <>
            {/* Table for Desktop */}
            <motion.div
              variants={tableVariants}
              initial="hidden"
              animate="visible"
              className="hidden md:block overflow-x-auto rounded-2xl shadow-2xl border border-gray-100 bg-white"
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
                <tbody className="divide-y divide-gray-100 bg-gray-50">
                  <AnimatePresence>
                    {sortedUsers.map((user, idx) => {
                      const userProfile = profiles?.find((p) => p?.userId?._id === user._id) || null;
                      const userVerification = verifications?.find((v) => v?.userId?._id === user._id) || null;

                      return (
                        <UserRow
                          key={user._id}
                          user={user}
                          profile={userProfile}
                          verification={userVerification}
                          index={idx}
                          onOpenModal={openModal}
                        />
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </motion.div>

            {/* Card Layout for Mobile */}
            <div className="md:hidden space-y-6 py-6">
              <AnimatePresence>
                {sortedUsers.map((user, idx) => {
                  const userProfile = profiles?.find((p) => p?.userId?._id === user._id) || null;
                  const userVerification = verifications?.find((v) => v?.userId?._id === user._id) || null;

                  return (
                    <motion.div
                      key={user._id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <UserCard
                        user={user}
                        profile={userProfile}
                        verification={userVerification}
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

        <Modal
          isOpen={modalState.type === 'delete'}
          onClose={closeModal}
          title="Confirm Delete"
          message="Are you sure you want to delete this user?"
          onConfirm={handleDelete}
          confirmButtonClass="bg-red-600 hover:bg-red-700"
          cancelButtonClass="bg-gray-300 hover:bg-gray-400"
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
  },
  // Memo comparison function to ensure re-render on prop changes
  (prevProps, nextProps) => {
    return (
      prevProps.users === nextProps.users &&
      prevProps.profiles === nextProps.profiles &&
      prevProps.verifications === nextProps.verifications &&
      prevProps.totalPages === nextProps.totalPages &&
      prevProps.currentPage === nextProps.currentPage &&
      prevProps.searchQuery === nextProps.searchQuery
    );
  }
);

export default UserTable;