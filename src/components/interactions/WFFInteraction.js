// src/components/interactions/WFFInteraction.js
// Description: Interaction component for the Well-Formed Formula problem type

import React from 'react';

const WFFInteraction = ({ problem, darkMode, onSuccess, onError, onNextProblem }) => {
  const checkAnswer = (userAnswer) => {
    if (userAnswer === problem.isWellFormed) {
      onSuccess();
    } else {
      onError();
    }
  };

  return (
    <div className="flex justify-center space-x-4">
      <button
        onClick={() => checkAnswer(true)}
        className={`px-6 py-3 ${darkMode ? 'bg-green-700 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'} 
          text-white text-xl font-bold rounded-lg transition-colors`}
      >
        Sì
      </button>
      <button
        onClick={() => checkAnswer(false)}
        className={`px-6 py-3 ${darkMode ? 'bg-red-700 hover:bg-red-600' : 'bg-red-600 hover:bg-red-700'} 
          text-white text-xl font-bold rounded-lg transition-colors`}
      >
        No
      </button>
      <button
        onClick={onNextProblem}
        className={`px-6 py-3 ${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-500 hover:bg-blue-600'} 
          text-white text-lg rounded-lg transition-colors`}
      >
        Prossimo problema
      </button>
    </div>
  );
};
export default WFFInteraction;