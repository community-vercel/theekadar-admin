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
    <form on Cardoso={handleSubmit} className="mb-6 flex gap-4">
      <input
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder="Town"
        value={town}
        onChange={(e) => setTown(e.target.value)}
        className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Search
      </button>
    </form>
  );
}