'use client';

import { memo } from 'react';

const StatusBadge = memo(({ status }) => {
  const statusStyles = {
    verified: 'bg-green-100 text-green-800 ring-green-200',
    notVerified: 'bg-red-100 text-red-800 ring-red-200',
    pending: 'bg-yellow-100 text-yellow-800 ring-yellow-200',
    approved: 'bg-blue-100 text-blue-800 ring-blue-200',
    rejected: 'bg-red-100 text-red-800 ring-red-200',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ring-1 ring-inset ${
        statusStyles[status] || 'bg-gray-100 text-gray-800 ring-gray-200'
      }`}
      aria-label={`Status: ${status}`}
    >
      {status.replace(/([A-Z])/g, ' $1').trim()}
    </span>
  );
});

export default StatusBadge;