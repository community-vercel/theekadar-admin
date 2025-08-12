// components/SearchForm.jsx
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
    <form onSubmit={handleSubmit} className="mb-8 flex gap-4">
      <input
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="flex-1 p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
      />
      <input
        type="text"
        placeholder="Town"
        value={town}
        onChange={(e) => setTown(e.target.value)}
        className="flex-1 p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
      />
      <button
        type="submit"
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition duration-300"
      >
        Search
      </button>
    </form>
  );
}