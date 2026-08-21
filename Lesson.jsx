import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function Lesson() {
  const { id } = useParams();
  const [showTutor, setShowTutor] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  const handleComplete = () => {
    setCompleting(true);
    setTimeout(() => {
      setCompleting(false);
      setCelebrate(true);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-3xl font-bold text-slate-800">Lesson {id || '1'}</h1>
        <Link to="/learn" className="text-blue-600 hover:underline">
          &larr; Back to Learn
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold mb-3">Overview</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Welcome to this lesson! Work through the instructions below and complete the exercise.
        </p>

        {celebrate ? (
          <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-md mb-4">
            🎉 Great job! You completed this lesson!
          </div>
        ) : null}

        <div className="flex gap-3">
          <button
            onClick={handleComplete}
            disabled={completing}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {completing ? 'Completing...' : 'Mark as Complete'}
          </button>
          <button
            onClick={() => setShowTutor(!showTutor)}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200"
          >
            {showTutor ? 'Hide AI Tutor' : 'Ask AI Tutor'}
          </button>
        </div>
      </div>

      {showTutor && (
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-2">AI Tutor Assistant</h3>
          <p className="text-sm text-slate-600">
            How can I help you understand this lesson better?
          </p>
        </div>
      )}
    </div>
  );
}

export default Lesson;
