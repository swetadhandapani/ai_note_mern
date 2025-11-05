import React, { useEffect, useState } from 'react';
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  aiSummary,
  aiImprove,
  aiTags,
} from '../lib/api';
import NoteCard from '../components/NoteCard';
import NoteEditor from '../components/NoteEditor';
import SearchBar from '../components/SearchBar';

export default function NotesPage() {
  const token = localStorage.getItem('token');
  const [notes, setNotes] = useState([]);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null);
  const [showNew, setShowNew] = useState(false); // for "New Note" modal

  // Load notes
  const load = async (q = '') => {
    try {
      const res = await getNotes(token, q);
      setNotes(res);
    } catch (err) {
      console.error(err);
      if (err.message === 'No token, authorization denied') {
        alert('Please login');
        window.location.href = '/login';
      }
    }
  };

  useEffect(() => {
    if (token) load();
    else window.location.href = '/login';
  }, []);

  // CRUD operations
  const handleCreate = async (data) => {
    const n = await createNote(token, data);
    setNotes((prev) => [n, ...prev]);
    setShowNew(false);
  };

  const handleUpdate = async (id, data) => {
    const n = await updateNote(token, id, data);
    setNotes((prev) => prev.map((p) => (p._id === id ? n : p)));
    setEditing(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete note?')) return;
    await deleteNote(token, id);
    setNotes((prev) => prev.filter((p) => p._id !== id));
  };

  // AI actions
  const doAI = async (type, content) => {
    if (type === 'summary') return aiSummary(token, content);
    if (type === 'improve') return aiImprove(token, content);
    if (type === 'tags') return aiTags(token, content);
  };

  // Search functionality
  const onSearch = async (q) => {
    setQuery(q);
    await load(q);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100">Your Notes</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNew(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition"
          >
            + New Note
          </button>
          <SearchBar onSearch={onSearch} />
        </div>
      </div>

      {/* Notes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((n) => (
          <NoteCard
            key={n._id}
            note={n}
            onEdit={() => setEditing(n)}
            onDelete={() => handleDelete(n._id)}
          />
        ))}
        {notes.length === 0 && (
          <div className="text-sm text-gray-500 dark:text-gray-400 col-span-full">
            No notes yet.
          </div>
        )}
      </div>

      {/* Add Note Modal */}
      {showNew && (
        <NoteEditor
          onSave={handleCreate}
          aiAction={doAI}
          onCancel={() => setShowNew(false)}
        />
      )}

      {/* Edit Note Modal */}
      {editing && (
        <NoteEditor
          note={editing}
          onSave={(data) => handleUpdate(editing._id, data)}
          aiAction={doAI}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
}
