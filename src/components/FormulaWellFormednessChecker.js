// src/components/FormulaWellFormednessChecker.js

import React, { useState } from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { useDarkMode } from '../contexts/DarkModeContext';

const FormulaWellFormednessChecker = ({ onCorrectAnswer, onIncorrectAnswer, onNextProblem, problem }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { darkMode } = useDarkMode();

  const checkAnswer = (userAnswer) => {
    const isCorrect = userAnswer === problem.isWellFormed;
    if (isCorrect) {
      setIsSuccess(true);
      setModalMessage('Ottimo lavoro! Passando alla prossima domanda...');
      onCorrectAnswer();
      setTimeout(() => {
        onNextProblem();
        setModalOpen(false);
      }, 2000);
    } else {
      setIsSuccess(false);
      setModalMessage('La tua risposta non è corretta. Riprova!');
      onIncorrectAnswer();
    }
    setModalOpen(true);
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
      <h2 className={`text-3xl font-bold mb-4 font-['EB_Garamond'] ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>La seguente formula è ben formata?</h2>
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-6`}>
        {problem.formula && typeof problem.formula === 'string' ? (
          <InlineMath math={problem.formula} />
        ) : (
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Formula non disponibile</p>
        )}
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => checkAnswer(true)}
          className={`px-6 py-3 ${darkMode ? 'bg-green-700 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'} text-white text-xl font-bold rounded-lg transition-colors`}
        >
          Sì
        </button>
        <button
          onClick={() => checkAnswer(false)}
          className={`px-6 py-3 ${darkMode ? 'bg-red-700 hover:bg-red-600' : 'bg-red-600 hover:bg-red-700'} text-white text-xl font-bold rounded-lg transition-colors`}
        >
          No
        </button>
        <button
            onClick={onNextProblem}
            className={`px-6 ${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-500 hover:bg-blue-600'} text-white text-lg rounded-lg transition-colors`}
          >
            Prossimo problema
          </button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg`}>
            <h3 className={`text-xl font-bold font-['EB_Garamond'] ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
              {isSuccess ? 'Ottimo lavoro!' : 'Riprova!'}
            </h3>
            <p className={`my-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{modalMessage}</p>
            <button
              onClick={() => setModalOpen(false)}
              className={`px-4 py-2 ${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded transition-colors`}
            >
              Chiudi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormulaWellFormednessChecker;
