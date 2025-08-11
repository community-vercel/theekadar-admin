// components/VerificationTable.jsx
'use client';

import { verifyWorker } from '../lib/api';

export default function VerificationTable({ verifications }) {
  const handleVerify = async (userId, status) => {
    try {
      await verifyWorker(userId, status);
      window.location.reload();
    } catch (error) {
      console.error('Error verifying worker:', error);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Document Type</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Document</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Submitted At</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {verifications.map((verification) => (
            <tr key={verification._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 border-b">{verification.userId.email}</td>
              <td className="px-6 py-4 border-b">{verification.documentType}</td>
              <td className="px-6 py-4 border-b">
                <a
                  href={verification.documentUrl}
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  View Document
                </a>
              </td>
              <td className="px-6 py-4 border-b">
                {new Date(verification.submittedAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 border-b">
                <button
                  onClick={() => handleVerify(verification.userId._id, 'approved')}
                  className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition mr-2"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleVerify(verification.userId._id, 'rejected')}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}