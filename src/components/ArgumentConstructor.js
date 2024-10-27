import React, { useState } from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { useDarkMode } from '../contexts/DarkModeContext';
import ButtonGrid from './ButtonGrid';

const ArgumentConstructor = ({ onCorrectAnswer, onIncorrectAnswer, onNextProblem, problem }) => {
  const [argument, setArgument] = useState([]);
  const [latexArgument, setLatexArgument] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { darkMode } = useDarkMode();

  const addToArgument = (element) => {
    setArgument([...argument, element]);
    setLatexArgument(prevArgument => prevArgument + ' ' + element.latex);
  };

  const resetArgument = () => {
    setArgument([]);
    setLatexArgument('');
  };

  const backspace = () => {
    if (argument.length > 0) {
      const newArgument = argument.slice(0, -1);
      setArgument(newArgument);
      setLatexArgument(newArgument.map(f => f.latex).join(' '));
    }
  };

  const checkSolution = () => {
    const userSolution = latexArgument.trim();
    const correctAnswers = problem.solution;
    if (correctAnswers.includes(userSolution)) {
      setIsSuccess(true);
      setModalMessage('Ottimo lavoro! Passando alla prossima domanda...');
      onCorrectAnswer();
      setTimeout(() => {
        onNextProblem();
        resetArgument();
        setModalOpen(false);
      }, 2000);
    } else {
      setIsSuccess(false);
      setModalMessage('La tua risposta non è corretta. Riprova!');
      onIncorrectAnswer();
      resetArgument();
    }
    setModalOpen(true);
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
      <h2 className={`text-3xl font-bold mb-4 font-['EB_Garamond'] ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
        Costruzione dell'Argomento
      </h2>
      <p className={`text-2xl mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{problem.text}</p>
      
      <div className={`mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg`}>
        <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Premesse:</h3>
        <ul className="list-disc list-inside">
          {problem.premises.map((premise, index) => (
            <li key={index} className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{premise}</li>
          ))}
        </ul>
        <h3 className={`text-lg font-semibold mt-4 mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Conclusione:</h3>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{problem.conclusion}</p>
      </div>

      <div className={`mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg`}>
        <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Variabili proposizionali:</h3>
        <ul className="list-disc list-inside grid grid-cols-2 gap-2">
          {problem.variables.map((variable) => (
            <li key={variable.variable} className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <span className="font-bold">{variable.variable}:</span> {variable.text}
            </li>
          ))}
        </ul>
      </div>

      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-6`}>
        <InlineMath math={latexArgument || '\\text{Il tuo argomento apparirà qui}'} />
      </div>

      <ButtonGrid addToFormula={addToArgument} backspace={backspace} darkMode={darkMode} />

      <div className="flex flex-col gap-4 mt-6">
        <button
          onClick={checkSolution}
          className={`w-full p-4 ${darkMode ? 'bg-green-700 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'} text-white text-xl font-bold rounded-lg transition-colors`}
        >
          Verifica soluzione
        </button>
        <button
          onClick={resetArgument}
          className={`w-full p-3 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-500 hover:bg-gray-600'} text-white text-lg rounded-lg transition-colors`}
        >
          Cancella
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

export default ArgumentConstructor;