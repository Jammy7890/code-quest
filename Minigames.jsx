import React from 'react';

const games = [
  { id: '1', title: 'Code Syntax Match', desc: 'Match JS terms with their definitions.' },
  { id: '2', title: 'Bug Hunter', desc: 'Find and fix syntax errors against the clock.' },
];

function Minigames() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight mb-1 text-slate-800">
          Minigames
        </h1>
        <p className="text-slate-600">
          Prefer playing over flipping cards? Sharpen your skills with these quick games.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {games.map((game) => (
          <div key={game.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-lg text-slate-800 mb-2">{game.title}</h3>
            <p className="text-sm text-slate-600 mb-4">{game.desc}</p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              Play Game
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Minigames;
