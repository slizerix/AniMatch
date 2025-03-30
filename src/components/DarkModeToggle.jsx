import React from 'react';

const DarkModeToggle = ({ darkMode, setDarkMode }) => {
  return (
    <div className="absolute top-4 right-4">
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded shadow hover:scale-105 transition"
      >
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
    </div>
  );
};

export default DarkModeToggle;