import React, { useState } from 'react';
import { request, gql } from 'graphql-request';

const mapAnswersToGenres = (answers) => {
  const genres = [];

  if (answers.mood === 'funny') genres.push('Comedy');
  if (answers.mood === 'emotional') genres.push('Drama', 'Romance');
  if (answers.mood === 'action') genres.push('Action');
  if (answers.mood === 'thoughtful') genres.push('Psychological', 'Thriller');
  if (answers.mood === 'cozy') genres.push('Slice of Life');

  if (answers.setting === 'school') genres.push('School');
  if (answers.setting === 'fantasy') genres.push('Fantasy');
  if (answers.setting === 'modern') genres.push('Supernatural');
  if (answers.setting === 'sci-fi') genres.push('Sci-Fi', 'Mecha');
  if (answers.setting === 'apocalyptic') genres.push('Horror');

  return [...new Set(genres)];
};

const quizSteps = [
  {
    label: "1. What’s your mood?",
    name: "mood",
    options: ["Funny", "Emotional", "Action", "Thoughtful", "Cozy"],
  },
  {
    label: "2. Preferred setting?",
    name: "setting",
    options: ["School", "Fantasy", "Modern", "Sci-fi", "Post-apocalyptic"],
  },
  {
    label: "3. Art style preference?",
    name: "style",
    options: ["Classic", "Modern", "Unique/Experimental"],
  },
  {
    label: "4. Pacing?",
    name: "pace",
    options: ["Fast", "Slow"],
  },
  {
    label: "5. How much time do you have?",
    name: "length",
    options: ["< 12", "12-50", "50 <"],
  },
];

const getEpisodeRange = (lengthChoice) => {
  switch (lengthChoice) {
    case '< 12':
      return { episodes_lesser: 13 };
    case '12-50':
      return { episodes_greater: 12, episodes_lesser: 51 };
    case '50 <':
      return { episodes_greater: 50 };
    default:
      return {};
  }
};

function App() {
  const [answers, setAnswers] = useState({
    mood: '',
    setting: '',
    style: '',
    pace: '',
    length: '',
  });

  const [animeList, setAnimeList] = useState([]);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [step, setStep] = useState(0);

  const clearHistory = () => setHistory([]);
  const enterApp = () => setShowWelcome(false);

  const handleChange = (e) => {
    setAnswers({
      ...answers,
      [e.target.name]: e.target.value,
    });
  };

  const showHistoryItem = (anime) => {
    setSelectedAnime(anime);
    setShowResult(true);
  };

  const handleSubmit = async () => {
    const selectedGenres = mapAnswersToGenres(answers);
    if (selectedGenres.length === 0) {
      alert('Please answer at least mood and setting!');
      return;
    }

    const lengthFilter = getEpisodeRange(answers.length);

    const query = gql`
      query ($genres: [String], $episodes_greater: Int, $episodes_lesser: Int) {
        Page(perPage: 50) {
          media(
            genre_in: $genres,
            type: ANIME,
            sort: SCORE_DESC,
            episodes_greater: $episodes_greater,
            episodes_lesser: $episodes_lesser,
            isAdult: false
          ) {
            title {
              romaji
              english
            }
            coverImage {
              large
            }
            description
            genres
            episodes
            averageScore
            siteUrl
          }
        }
      }
    `;

    const variables = {
      genres: selectedGenres,
      ...lengthFilter,
    };

    try {
      setLoading(true);
      const endpoint = 'https://graphql.anilist.co';
      const data = await request(endpoint, query, variables);
      const results = data.Page.media;

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
    const query = gql`
      query ($page: Int!) {
        Page(page: $page, perPage: 50) {
          media(type: ANIME, sort: SCORE_DESC, isAdult: false) {
            title {
              romaji
              english
            }
            coverImage {
              large
            }
            description
            genres
            episodes
            averageScore
            siteUrl
          }
        }
      }
    `;

    const randomPage = Math.floor(Math.random() * 100) + 1;

    try {
      setLoading(true);
      const endpoint = 'https://graphql.anilist.co';
      const data = await request(endpoint, query, { page: randomPage });
      const list = data.Page.media;

      const randomPick = list[Math.floor(Math.random() * list.length)];
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

  // 👋 Splash screen with logo
  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center text-center px-4 py-8">
        <img
          src="/animatch-logo.png" // logo must be in public folder
          alt="AniMatch Logo"
          className="w-[400px] sm:w-[500px] max-w-full h-auto mb-12 drop-shadow-2xl animate-fade-in"
        />
        <button
          onClick={enterApp}
          className="bg-purple-600 text-white text-lg px-6 py-3 rounded-lg shadow-lg hover:bg-purple-700 transition transform hover:scale-105"
        >
          ✨ Animatching
        </button>
      </div>
    );
  }

  // 👇 Main app content
  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-8">
        {/* Dark mode toggle */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded shadow hover:scale-105 transition"
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-2xl shadow-2xl p-8 w-full max-w-2xl overflow-hidden">
        {!showResult && (
              <>
                <img
                  src="/animatch-logo.png"
                  alt="AniMatch Logo"
                  className="w-48 sm:w-64 mx-auto mb-6"
                />

                <h1 className="text-3xl font-bold text-purple-700 dark:text-purple-300 mb-2 text-center">
                  Anime Recommender 🎌
                </h1>
              </>
            )}

          {loading && (
            <div className="flex flex-col justify-center items-center py-12 text-center animate-pulse">
              <div className="text-xl font-semibold text-purple-600 dark:text-purple-300 mb-4">
                🔮 Finding your perfect anime match...
              </div>

              <div className="w-24 h-24 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                Channeling your vibes into the AniMatch engine...
              </div>
            </div>
          )}

          {!loading && !showResult && (         
            <div className="space-y-6">
              {/* Step Progress */}
              <div className="text-sm text-purple-600 dark:text-purple-300 font-medium text-center">
                Step {step + 1} of {quizSteps.length}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-300 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-full transition-all duration-500"
                  style={{
                    width: `${((step + 1) / quizSteps.length) * 100}%`,
                  }}
                ></div>
              </div>

              {/* Current Question */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg text-center transition-all duration-500 ease-out transform opacity-100 translate-x-0">
                <label className="block text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  {quizSteps[step].label}
                </label>

                <select
                  name={quizSteps[step].name}
                  value={answers[quizSteps[step].name]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="">Select...</option>
                  {quizSteps[step].options.map((option) => (
                    <option key={option} value={option.toLowerCase()}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
                  disabled={step === 0}
                  className={`px-4 py-2 rounded-lg transition ${
                    step === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  ← Back
                </button>
                <div className="mt-6 text-center">
                  <button
                    onClick={handleRandomAnime}
                    className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                  >
                    🎲 Give Me a Random Anime
                  </button>
                </div>

                {step < quizSteps.length - 1 ? (
                  <button
                    onClick={() => setStep((prev) => prev + 1)}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                  >
                    🎯 Get My Anime!
                  </button>
                  

                )}
              </div>
            </div>
          )}

          {!loading && showResult && selectedAnime && (() => {
            const cleanDescription = selectedAnime.description
              ? selectedAnime.description.replace(/<[^>]*>/g, '')
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
                  {selectedAnime.title.english || selectedAnime.title.romaji}
                </h2>
                <img
                  src={selectedAnime.coverImage.large}
                  alt="anime"
                  className="w-64 mx-auto rounded-lg shadow-lg mb-4"
                />
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Genres:</strong> {selectedAnime.genres.join(', ')}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Episodes:</strong> {selectedAnime.episodes}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>Score:</strong> {selectedAnime.averageScore}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{cleanDescription}</p>
                <a
                  href={selectedAnime.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 dark:text-purple-300 underline hover:text-purple-800 dark:hover:text-purple-400 transition mb-4 block"
                >
                  View on AniList →
                </a>

                <button
                  onClick={() => {
                    setShowResult(false);
                    setStep(0);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition"
                >
                  🔁 Try Again
                </button>
                
              </div>
            );
          })()}

          {/* Result History */}
          {!showResult && history.length > 0 && (
            <div className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-purple-600 dark:text-purple-300">
                  🎞️ Your Recent Recommendations
                </h3>
                <button
                  onClick={clearHistory}
                  className="text-sm text-red-500 hover:underline"
                >
                  🧹 Clear History
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-1">
              {history.map((anime, index) => (
                <button
                  key={index}
                  onClick={() => showHistoryItem(anime)}
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
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
