import React, { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setQ(value);

    if (value.trim() === '') {
      clearTimeout(typingTimeout);
      const timeout = setTimeout(() => onSearch(''), 300);
      setTypingTimeout(timeout);
    }
  };

  const handleSearch = () => {
    if (typingTimeout) clearTimeout(typingTimeout);
    onSearch(q.trim());
  };

  return (
    <div className="flex gap-2">
      <input
        value={q}
        onChange={handleChange}
        placeholder="Search title..."
        className="flex-1 p-2 border rounded 
                   bg-white text-gray-900 placeholder-gray-500
                   dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button
        onClick={handleSearch}
        className="px-3 py-1 border rounded bg-blue-600 text-white hover:bg-blue-700"
      >
        Search
      </button>
    </div>
  );
}
