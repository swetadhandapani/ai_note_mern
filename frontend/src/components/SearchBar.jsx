import React, { useState, useEffect } from 'react';

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);

  // Handle user typing — debounce search
  const handleChange = (e) => {
    const value = e.target.value;
    setQ(value);

    // If user clears input, show all notes (but avoid spam requests)
    if (value.trim() === '') {
      clearTimeout(typingTimeout);
      const timeout = setTimeout(() => onSearch(''), 300);
      setTypingTimeout(timeout);
    }
  };

  // Explicit search button click
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
        className="flex-1 p-2 border rounded"
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
