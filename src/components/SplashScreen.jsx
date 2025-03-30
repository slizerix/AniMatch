import React from 'react';

const SplashScreen = ({ onStart }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-8 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <img
        src="/animatch-logo.png"
        alt="AniMatch Logo"
        className="w-[300px] max-w-full h-auto mb-6 drop-shadow-2xl"
      />

        <div className="text-gray-700 dark:text-gray-300 max-w-xl mb-8 space-y-3 text-base sm:text-lg leading-relaxed text-center" >
        <p>
            <span className="font-semibold text-purple-600 dark:text-purple-400">AniMatch</span> is an intelligent anime recommender.
        </p>
        <p>
            Answer a few quick questions, and we’ll match you with an anime that fits your mood, favorite settings, and style preferences.
        </p>
        <p>
            No more endless scrolling — let the matching begin! 🎯
        </p>
        </div>

      <button
        onClick={onStart}
        className="bg-purple-600 text-white text-lg px-6 py-3 rounded-lg shadow-lg hover:bg-purple-700 transition transform hover:scale-105"
      >
        ✨ Start Animatching
      </button>
    </div>
  );
};

export default SplashScreen;
