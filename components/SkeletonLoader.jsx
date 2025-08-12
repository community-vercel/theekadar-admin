'use client';

import { memo } from 'react';

const SkeletonLoader = memo(() => {
  return (
    <div className="animate-pulse space-y-4">
      {/* Table Skeleton for Desktop */}
      <div className="hidden md:block">
        <div className="h-8 bg-gray-200 rounded w-full"></div>
        {[...Array(5)].map((_, index) => (
          <div key={index} className="h-12 bg-gray-200 rounded w-full mt-2"></div>
        ))}
      </div>
      {/* Card Skeleton for Mobile */}
      <div className="md:hidden space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="h-32 bg-gray-200 rounded-lg w-full"></div>
        ))}
      </div>
    </div>
  );
});

export default SkeletonLoader;