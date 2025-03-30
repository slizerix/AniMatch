import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="flex flex-col justify-center items-center py-12 text-center animate-pulse">
      <div className="text-xl font-semibold text-purple-600 dark:text-purple-300 mb-4">
        🔮 Finding your perfect anime match...
      </div>

      <div className="w-24 h-24 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        Channeling your vibes into the AniMatch engine...
      </div>
    </div>
  );
};

export default LoadingScreen;