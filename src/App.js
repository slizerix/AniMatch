import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import QuizFlow from './components/QuizFlow';
import AnimeResult from './components/AnimeResult';
import HistoryList from './components/HistoryList';
import LoadingScreen from './components/LoadingScreen';
import DarkModeToggle from './components/DarkModeToggle';
import { fetchAnimeByQuiz, fetchRandomAnime } from './api/anilist';

function App() {
  const [answers, setAnswers] = useState({
    mood: '',
    setting: '',
    style: '',
    pace: '',
    length: '',
  });

  const [selectedAnime, setSelectedAnime] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [step, setStep] = useState(0);

  const handleChange = (e) => {
    setAnswers({
      ...answers,
      [e.target.name]: e.target.value,
    });
  };

  const clearHistory = () => setHistory([]);
  const enterApp = () => setShowWelcome(false);

  const showHistoryItem = (anime) => {
    setSelectedAnime(anime);
    setShowResult(true);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const results = await fetchAnimeByQuiz(answers);

      if (results.length === 0) {
        alert('No matching anime found. Try different answers!');
        return;
      }

      const randomAnime = results[Math.floor(Math.random() * results.length)];
      setSelectedAnime(randomAnime);
      setShowResult(true);
      setHistory((prev) => [randomAnime, ...prev]);
    } catch (err) {
      console.error(err);
      alert('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const handleRandomAnime = async () => {
    try {
      setLoading(true);
      const results = await fetchRandomAnime();
      const randomPick = results[Math.floor(Math.random() * results.length)];
      setSelectedAnime(randomPick);
      setShowResult(true);
      setHistory((prev) => [randomPick, ...prev]);
    } catch (err) {
      console.error(err);
      alert('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setShowResult(false);
    setStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (showWelcome) return <SplashScreen onStart={enterApp} />;

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-8">
        <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

        <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-2xl shadow-2xl p-8 w-full max-w-3xl overflow-hidden">
          {!showResult && (
            <>
              <img
                src="/animatch-logo.png"
                alt="AniMatch Logo"
                className="w-24 sm:w-32 mx-auto mb-6"
              />
              <h1 className="text-3xl font-bold text-purple-700 dark:text-purple-300 mb-2 text-center">
                Anime Recommender 🎌
              </h1>
            </>
          )}

          {loading && <LoadingScreen />}

          {!loading && !showResult && (
            <QuizFlow
              step={step}
              setStep={setStep}
              answers={answers}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onRandom={handleRandomAnime}
            />
          )}

          {!loading && showResult && selectedAnime && (
            <AnimeResult anime={selectedAnime} onRetry={handleRetry} />
          )}

          <HistoryList
            history={history}
            onSelect={showHistoryItem}
            onClear={clearHistory}
            visible={!showResult}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
