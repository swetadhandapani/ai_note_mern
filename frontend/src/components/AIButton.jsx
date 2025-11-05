import React, { useState } from 'react';

export default function AIButton({ label, onClick }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      await onClick(); // triggers the parent AI function
    } catch (err) {
      console.error(err);
      alert('AI request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-3 py-1 border rounded transition ${
        loading
          ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
          : 'hover:bg-blue-600 hover:text-white'
      }`}
    >
      {loading ? 'Thinking...' : label}
    </button>
  );
}
