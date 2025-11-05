import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';

export default function NoteEditor({ note = null, onSave, aiAction, onCancel }) {
  const { register, handleSubmit, setValue } = useForm();
  const [aiResult, setAiResult] = useState(null);
  const [aiTitle, setAiTitle] = useState('');
  const [position, setPosition] = useState({ x: 0, y: 0 }); // draggable position
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (note) {
      setValue('title', note.title);
      setValue('content', note.content);
    }
  }, [note, setValue]);

  const submit = async (data) => {
    await onSave(data);
    setValue('title', '');
    setValue('content', '');
  };

  const callAI = async (mode) => {
    const content = document.querySelector('textarea[name="content"]').value;
    if (!content) {
      alert('Write something first');
      return;
    }
    try {
      const res = await aiAction(mode, content);
      let resultText = '';
      let title = '';

      if (mode === 'summary' && res.summary) {
        title = 'AI Summary';
        resultText = res.summary;
      } else if (mode === 'improve' && res.improved) {
        title = 'AI Improved Content';
        resultText = res.improved;
        setValue('content', res.improved);
      } else if (mode === 'tags' && res.tags) {
        title = 'AI Suggested Tags';
        resultText = res.tags.join(', ');
      } else {
        title = 'AI Response';
        resultText = JSON.stringify(res, null, 2);
      }

      setAiTitle(title);
      setAiResult(resultText);
      setPosition({ x: 0, y: 0 }); // center on open
    } catch (err) {
      console.error(err);
      setAiTitle('Error');
      setAiResult('AI request failed.');
    }
  };

  // 📋 Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(aiResult);
      alert('Copied to clipboard!');
    } catch (err) {
      alert('Failed to copy.');
    }
  };

  // 💾 Download as text file
  const handleDownload = () => {
    const blob = new Blob([aiResult], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${aiTitle.replace(/\s+/g, '_')}.txt`;
    link.click();
  };

  // 🖱️ Draggable handlers
  const handleMouseDown = (e) => {
    setDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    }
  };

  const handleMouseUp = () => setDragging(false);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  return (
    <>
      {/* Main Note Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
        <div className="bg-white dark:bg-gray-800 w-full max-w-3xl rounded-xl shadow-2xl p-6 space-y-4 transition-colors">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {note ? 'Edit Note' : 'Add Note'}
          </h3>

          <form onSubmit={handleSubmit(submit)} className="space-y-4">
            <input
              {...register('title')}
              name="title"
              placeholder="Note title..."
              className="w-full p-3 border rounded text-gray-900 dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              {...register('content')}
              name="content"
              placeholder="Write your note here..."
              rows="8"
              className="w-full p-3 border rounded text-gray-900 dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
            ></textarea>

            <div className="flex flex-wrap gap-2 justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
              >
                Save
              </button>

              <button
                type="button"
                onClick={() => callAI('summary')}
                className="px-4 py-2 border rounded text-gray-700 dark:text-gray-200 border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                AI → Summary
              </button>

              <button
                type="button"
                onClick={() => callAI('improve')}
                className="px-4 py-2 border rounded text-gray-700 dark:text-gray-200 border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                AI → Improve
              </button>

              <button
                type="button"
                onClick={() => callAI('tags')}
                className="px-4 py-2 border rounded text-gray-700 dark:text-gray-200 border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                AI → Tags
              </button>

              {onCancel && (
                <button
                  onClick={onCancel}
                  type="button"
                  className="px-4 py-2 border rounded text-red-600 dark:text-red-400 border-gray-400 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* 🧠 Draggable AI Result Modal */}
      {aiResult && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div
            className="absolute bg-white dark:bg-gray-800 w-full max-w-lg rounded-xl shadow-2xl p-6 space-y-4 cursor-grab active:cursor-grabbing transition-all"
            style={{
              transform: `translate(${position.x}px, ${position.y}px)`,
            }}
          >
            {/* Draggable header */}
            <div
              onMouseDown={handleMouseDown}
              className="cursor-move border-b border-gray-300 dark:border-gray-600 pb-2 flex justify-between items-center"
            >
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {aiTitle}
              </h4>
              <span className="text-sm text-gray-500">(Drag me)</span>
            </div>

            <div className="max-h-80 overflow-y-auto text-gray-800 dark:text-gray-200 whitespace-pre-wrap border border-gray-200 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-700/50">
              {aiResult}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCopy}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition"
              >
                📋 Copy
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition"
              >
                💾 Download
              </button>
              <button
                onClick={() => setAiResult(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
