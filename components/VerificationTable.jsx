// components/VerificationTable.jsx
'use client';

import { useState } from 'react';
import { verifyWorker } from '../lib/api';
import Modal from './Modal';
import toast from 'react-hot-toast';

export default function VerificationTable({ verifications }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const handleVerify = async () => {
    try {
      await verifyWorker(selectedUserId, selectedStatus);
      toast.success(`User ${selectedStatus} successfully`);
      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error('Error verifying worker');
      console.error('Error verifying worker:', error);
    }
  };

  const openVerifyModal = (userId, status) => {
    setSelectedUserId(userId);
    setSelectedStatus(status);
    setIsModalOpen(true);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded-2xl shadow-xl">
        <thead className="bg-gradient-to-r from-blue-100 to-indigo-100">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Document Type</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Document</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Submitted At</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {verifications.map((verification) => (
            <tr key={verification._id} className="hover:bg-gray-50 transition duration-200">
              <td className="px-6 py-4 border-b">{verification.userId.email}</td>
              <td className="px-6 py-4 border-b">{verification.documentType}</td>
              <td className="px-6 py-4 border-b">
                <a
                  href={verification.documentUrl}
                  target="_blank"
                  className="text-blue-600 hover:underline transition duration-200"
                >
                  View Document
                </a>
              </td>
              <td className="px-6 py-4 border-b">
                {new Date(verification.submittedAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 border-b flex space-x-3">
                <button
                  onClick={() => openVerifyModal(verification.userId._id, 'approved')}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
                >
                  Approve
                </button>
                <button
                  onClick={() => openVerifyModal(verification.userId._id, 'rejected')}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Confirm ${selectedStatus === 'approved' ? 'Approval' : 'Rejection'}`}
        message={`Are you sure you want to ${selectedStatus} this verification?`}
        onConfirm={handleVerify}
      />
    </div>
  );
}