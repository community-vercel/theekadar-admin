'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';

const Pagination = memo(({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-between items-center px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-t border-gray-200">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
          currentPage === 1
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
        aria-label="Previous Page"
      >
        Previous
      </motion.button>
      <div className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
          currentPage === totalPages
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
        aria-label="Next Page"
      >
        Next
      </motion.button>
    </div>
  );
});

export default Pagination;