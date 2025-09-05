'use client';

import { useState } from 'react';

export default function SearchForm({ onSearch }) {
  const [city, setCity] = useState('');
  const [town, setTown] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(city, town);
  };
  
  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 flex flex-col gap-4 sm:flex-row sm:gap-4"
    >
      <input
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="flex-1 p-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 text-gray-900 sm:p-4 sm:text-base"
      />
      <input
        type="text"
        placeholder="Town"
        value={town}
        onChange={(e) => setTown(e.target.value)}
        className="flex-1 p-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 text-gray-900 sm:p-4 sm:text-base"
      />
      <button
        type="submit"
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition duration-300 sm:py-4"
      >
        Search
      </button>
    </form>
  );
}