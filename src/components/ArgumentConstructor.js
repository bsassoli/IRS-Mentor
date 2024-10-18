import React, { useState, useEffect } from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { useDarkMode } from '../contexts/DarkModeContext';
import ButtonGrid from './ButtonGrid';

const ArgumentConstructor = ({ onCorrectAnswer, onIncorrectAnswer, onNextProblem, problem }) => {
  const [premises, setPremises] = useState([]);
  const [conclusion, setConclusion] = useState('');
  const [latexFormula, setLatexFormula] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { darkMode } = useDarkMode();

  useEffect(() => {
    // Reset the argument when the problem changes
    setPremises([]);
    setConclusion('');
    setLatexFormula('');
  }, [problem]);

  const addToPremises = (element) => {
    setPremises([...premises, element]);
    updateLatexFormula([...premises, element], conclusion);
  };

  const addToConclusion = (element) => {
    setConclusion(element);
    updateLatexFormula(premises, element);
  };

  const updateLatexFormula = (updatedPremises, updatedConclusion) => {
    const premisesLatex = updatedPremises.map(p => p.latex).join(', ');
    const conclusionLatex = updatedConclusion.latex || '';
    setLatexFormula(`${premisesLatex} \\vdash ${conclusionLatex}`);
  };

  const resetArgument = () => {
    setPremises([]);
    setConclusion('');
    setLatexFormula('');
  };

  const backspace = () => {
    if (conclusion) {
      setConclusion('');
    } else if (premises.length > 0) {
      const newPremises = premises.slice(0, -1);
      setPremises(newPremises);
    }
    updateLatexFormula(premises, conclusion);
  };

  const checkSolution = () => {
    const userSolution = latexFormula.trim();
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
      <h2 className={`text-3xl font-bold mb-4 font-['EB_Garamond'] ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Costruisci l'argomento</h2>
      <p className={`text-2xl mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{problem.text}</p>
      
      <div className={`mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg`}>
        <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Frasi e variabili proposizionali:</h3>
        <ul className="list-disc list-inside grid grid-cols-1 gap-2">
          {Object.entries(problem.variables).map(([key, value]) => (
            <li key={key} className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <span className="font-bold">{key}:</span> {value}
            </li>
          ))}
        </ul>
      </div>

      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-6`}>
        <InlineMath math={latexFormula || '\\text{Il tuo argomento apparirà qui}'} />
      </div>

      <ButtonGrid 
        addToFormula={(element) => {
          if (!conclusion) {
            addToPremises(element);
          } else {
            addToConclusion(element);
          }
        }} 
        backspace={backspace} 
        darkMode={darkMode} 
      />

      <div className="flex flex-col gap-4 mt-6">
        <button
          onClick={() => setConclusion({ latex: '\\therefore' })}
          className={`w-full p-3 ${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white text-lg rounded-lg transition-colors`}
        >
          Aggiungi conclusione
        </button>
        <button
          onClick={checkSolution}
          className={`w-full p-4 ${darkMode ? 'bg-green-700 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'} text-white text-xl font-bold rounded-lg transition-colors`}
        >
          Verifica argomento
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
