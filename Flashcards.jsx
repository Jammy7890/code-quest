import React, { useState } from 'react';

const sampleCards = [
  { id: 1, front: 'What is a closure in JavaScript?', back: 'A function bundled together with references to its surrounding state.' },
  { id: 2, front: 'What does JSX stand for?', back: 'JavaScript XML.' },
  { id: 3, front: 'What is useState used for?', back: 'A React Hook that lets you add state variables to your components.' },
];

function Flashcards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [review, setReview] = useState(0);

  const resetStats = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnown(0);
    setReview(0);
  };

  const handleNext = (isKnown) => {
    if (isKnown) setKnown((prev) => prev + 1);
    else setReview((prev) => prev + 1);

    setIsFlipped(false);
    if (currentIndex < sampleCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const currentCard = sampleCards[currentIndex];

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Flashcards</h1>
        <button
          onClick={resetStats}
          className="text-sm text-slate-500 hover:text-slate-800 underline"
        >
          Reset
        </button>
      </div>

      <div className="flex gap-4 text-sm font-medium">
        <span className="text-green-600">Mastered: {known}</span>
        <span className="text-amber-600">Needs Review: {review}</span>
      </div>

      {currentIndex < sampleCards.length ? (
        <div className="space-y-4">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[220px] bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex items-center justify-center text-center cursor-pointer hover:border-slate-300 transition-all"
          >
            <p className="text-lg font-medium text-slate-800">
              {isFlipped ? currentCard.back : currentCard.front}
            </p>
          </div>
          <p className="text-center text-xs text-slate-400">Click card to flip</p>

          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={() => handleNext(false)}
              className="px-5 py-2.5 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium hover:bg-amber-200"
            >
              Need Review
            </button>
            <button
              onClick={() => handleNext(true)}
              className="px-5 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
            >
              Got It Right
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-4">
          <h2 className="text-xl font-bold text-slate-800">All Done!</h2>
          <p className="text-slate-600">You reviewed all available flashcards in this deck.</p>
          <button
            onClick={resetStats}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}

export default Flashcards;
