import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const languages = [
  { id: 'all', label: 'All Projects', emoji: '🚀' },
  { id: 'js', label: 'JavaScript', emoji: '🟨' },
  { id: 'python', label: 'Python', emoji: '🟦' },
  { id: 'html', label: 'HTML/CSS', emoji: '🟧' },
];

const projectsData = [
  { id: '1', title: 'Interactive Quiz App', lang: 'js', description: 'Build a multiple-choice quiz using JS logic.' },
  { id: '2', title: 'Weather Bot', lang: 'python', description: 'Fetch live weather data using Python APIs.' },
  { id: '3', title: 'Portfolio Website', lang: 'html', description: 'Design a responsive personal webpage.' },
];

function Projects() {
  const [filter, setFilter] = useState('all');

  const filteredProjects = filter === 'all' 
    ? projectsData 
    : projectsData.filter(p => p.lang === filter);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Projects</h1>

      {/* Language Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {languages.map((lang) => (
          <button
            key={lang.id}
            onClick={() => setFilter(lang.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              filter === lang.id 
                ? "bg-blue-600 text-white border-blue-600" 
                : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
            }`}
          >
            <span>{lang.emoji}</span> {lang.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-lg text-slate-800 mb-2">{project.title}</h3>
              <p className="text-sm text-slate-600 mb-4">{project.description}</p>
            </div>
            <Link
              to={`/projects/${project.id}`}
              className="inline-block text-center px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800"
            >
              View Project
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
