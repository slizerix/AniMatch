import React from 'react';

const AnimeResult = ({ anime, onRetry }) => {
  if (!anime) return null;

  const cleanDescription = anime.description
    ? anime.description.replace(/<[^>]*>/g, '')
    : 'No description available.';

  return (
    <div className="mt-8 text-center animate-[fadeIn_0.5s_ease-out_forwards] opacity-0">
      <div className="flex justify-center">
        <img
          src="/animatch-logo.png"
          alt="AniMatch Logo"
          className="w-24 sm:w-32 mx-auto mb-4 drop-shadow-lg"
        />
      </div>

      <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-4">
        {anime.title.english || anime.title.romaji}
      </h2>

      <img
        src={anime.coverImage.large}
        alt={anime.title.romaji}
        className="w-64 mx-auto rounded-lg shadow-lg mb-4"
      />

      <p className="text-gray-700 dark:text-gray-300 mb-2">
        <strong>Genres:</strong> {anime.genres.join(', ')}
      </p>
      <p className="text-gray-700 dark:text-gray-300 mb-2">
        <strong>Episodes:</strong> {anime.episodes}
      </p>
      <p className="text-gray-700 dark:text-gray-300 mb-2">
        <strong>Score:</strong> {anime.averageScore}
      </p>

      <p className="text-gray-600 dark:text-gray-400 mb-6">{cleanDescription}</p>

      <a
        href={anime.siteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-purple-600 dark:text-purple-300 underline hover:text-purple-800 dark:hover:text-purple-400 transition mb-4 block"
      >
        View on AniList →
      </a>

      <button
        onClick={onRetry}
        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition transform hover:scale-105"
      >
        🔁 Try Again
      </button>
    </div>
  );
};

export default AnimeResult;
