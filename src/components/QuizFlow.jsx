import React from 'react';


const QuizFlow = ({ step, setStep, answers, onChange, onSubmit, onRandom }) => {
  
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
      label: "5. How much episodes do you want?",
      name: "length",
      options: ["12 and less", "12-50", "50 and more"],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Step Progress */}
      <div className="text-sm text-purple-600 dark:text-purple-300 font-medium text-center h-5">
        Step {step + 1} of {quizSteps.length}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-300 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
        <div
          className="bg-purple-500 h-full transition-all duration-500"
          style={{
            width: `${((step + 1) / quizSteps.length) * 100}%`,
          }}
        ></div>
      </div>

      {/* Current Question */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg text-center transition-all duration-500 ease-out transform">
        <label className="block text-lg font-semibold text-gray-800 dark:text-white mb-4">
          {quizSteps[step].label}
        </label>

        <select
          name={quizSteps[step].name}
          value={answers[quizSteps[step].name]}
          onChange={onChange}
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
      <div className="flex justify-between items-center">
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

        <button
          onClick={onRandom}
          className="bg-yellow-600 text-white px-6 py-2 rounded-lg transition transform hover:scale-105 active:scale-95 hover:bg-yellow-700"
        >
          🎲 Give Me a Random Anime
        </button>

        {step < quizSteps.length - 1 ? (
          <button
            onClick={() => setStep((prev) => prev + 1)}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition transform hover:scale-105 active:scale-95"
          >
            Next →
          </button>
        ) : (
            <button
            onClick={onSubmit}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition transform hover:scale-105 active:scale-95"
          >
            🎯 Get My Anime!
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizFlow;