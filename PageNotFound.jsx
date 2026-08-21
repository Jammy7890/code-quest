import React from 'react';
import { Link } from 'react-router-dom';

function PageNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="space-y-3">
        <h2 className="text-2xl font-medium text-slate-800">
          Page Not Found
        </h2>
        <p className="text-slate-600">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/" 
          className="inline-block px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

export default PageNotFound;
