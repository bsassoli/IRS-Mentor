import React from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const WFFInteraction = ({ problem, darkMode, onSuccess, onError, onNextProblem }) => {
  const checkAnswer = (userAnswer) => {
    if (userAnswer === problem.isWellFormed) {
      onSuccess();
    } else {
      onError();
    }
  };

  return (
    <div className="space-y-6">
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex justify-center`}>
        <InlineMath math={problem.formula} />
      </div>

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
    </div>
  );
};

export default WFFInteraction;