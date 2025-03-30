import React from 'react';

const HistoryList = ({ history, onSelect, onClear, visible = true }) => {
  if (!visible || history.length === 0) return null;

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-purple-600 dark:text-purple-300">
          🎞️ Your Recent Recommendations
        </h3>
        <button
          onClick={onClear}
          className="text-sm text-red-500 hover:underline"
        >
          🧹 Clear History
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-1">
        {history.map((anime, index) => (
          <button
            key={index}
            onClick={() => onSelect(anime)}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-md flex items-center gap-4 w-full text-left hover:ring-2 hover:ring-purple-400 transition"
          >
            <img
              src={anime.coverImage.large}
              alt={anime.title.english || anime.title.romaji}
              className="w-16 h-24 object-cover rounded"
            />
            <div>
              <p className="font-semibold text-gray-800 dark:text-white">
                {anime.title.english || anime.title.romaji}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {anime.episodes} episodes – Score: {anime.averageScore}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;