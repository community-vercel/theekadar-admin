'use client';

import { useState, useEffect, memo } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useDebounce } from 'use-debounce';

// Custom hook for debouncing (install use-debounce: npm install use-debounce)
const SearchBar = memo(({ searchQuery, setSearchQuery }) => {
  const [inputValue, setInputValue] = useState(searchQuery);
  const [debouncedValue] = useDebounce(inputValue, 500);

  useEffect(() => {
    setSearchQuery(debouncedValue);
  }, [debouncedValue, setSearchQuery]);

  const handleClear = () => {
    setInputValue('');
    setSearchQuery('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative mb-6"
    >
      <div className="flex items-center border border-gray-300 rounded-lg shadow-md focus-within:ring-2 focus-within:ring-indigo-500 transition bg-white">
        <FaSearch className="ml-3 text-gray-400" aria-hidden="true" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search by email, name, or role..."
          className="w-full p-3 text-sm md:text-base text-gray-700 rounded-lg focus:outline-none"
          aria-label="Search users"
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="mr-3 text-gray-400 hover:text-gray-600 transition"
            aria-label="Clear search"
          >
            <FaTimes />
          </button>
        )}
      </div>
    </motion.div>
  );
});

export default SearchBar;