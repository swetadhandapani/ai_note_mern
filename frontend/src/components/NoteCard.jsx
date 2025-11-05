import React from 'react';
import { PencilIcon, Trash2Icon, TagIcon, Clock } from 'lucide-react';

export default function NoteCard({ note, onEdit, onDelete }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md transition-colors hover:shadow-lg hover:-translate-y-1 duration-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 pr-4">
          <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100 truncate">
            {note.title || 'Untitled'}
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 line-clamp-3">
            {note.content}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              title="Edit"
              className="p-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <PencilIcon size={16} />
            </button>
            <button
              onClick={onDelete}
              title="Delete"
              className="p-2 rounded-full border border-gray-300 dark:border-gray-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 transition"
            >
              <Trash2Icon size={16} />
            </button>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
            <Clock size={12} />
            <span>{new Date(note.updatedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      {note.summary && (
        <div className="mt-3 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/40 p-3 rounded-md">
          <strong>Summary:</strong> {note.summary}
        </div>
      )}

      {/* Tags Section */}
      {note.tags?.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <TagIcon size={12} className="mr-1" />
          {note.tags.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
