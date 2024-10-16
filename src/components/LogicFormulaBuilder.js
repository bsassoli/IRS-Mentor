import React, { useState, useEffect } from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { useDarkMode } from '../contexts/DarkModeContext';
import ButtonGrid from './ButtonGrid';
import { normalizeFormula } from '../utils/formulaUtils';

const LogicFormulaBuilder = ({ onCorrectAnswer, onIncorrectAnswer, onNextProblem, problem }) => {
  const [formula, setFormula] = useState([]);
  const [latexFormula, setLatexFormula] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { darkMode } = useDarkMode();

  useEffect(() => {
    // Reset the formula when the problem changes
    setFormula([]);
    setLatexFormula('');
  }, [problem]);

  const addToFormula = (element) => {
    setFormula([...formula, element]);
    setLatexFormula(prevFormula => prevFormula + ' ' + element.latex);
  };

  const resetFormula = () => {
    setFormula([]);
    setLatexFormula('');
  };

  const backspace = () => {
    if (formula.length > 0) {
      const newFormula = formula.slice(0, -1);
      setFormula(newFormula);
      setLatexFormula(newFormula.map(f => f.latex).join(' '));
    }
  };

  const checkSolution = () => {
    const userSolution = normalizeFormula(latexFormula.trim());
    const correctAnswers = problem.solution.map(normalizeFormula);
    console.log(userSolution, correctAnswers);
    if (correctAnswers.includes(userSolution)) {
      setIsSuccess(true);
      setModalMessage('Ottimo lavoro! Passando alla prossima domanda...');
      onCorrectAnswer();
      setTimeout(() => {
        onNextProblem();
        resetFormula();
        setModalOpen(false);
      }, 2000);
    } else {
      setIsSuccess(false);
      setModalMessage('La tua risposta non è corretta. Riprova!');
      onIncorrectAnswer();
      resetFormula();
    }
    setModalOpen(true);
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
      <h2 className={`text-3xl font-bold mb-4 font-['EB_Garamond'] ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Problema</h2>
      <p className={`text-2xl mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{problem.text}</p>

    {/* Aggiungiamo la sezione per mostrare le variabili proposizionali */}
    <div className={`mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg`}>
        <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Variabili proposizionali:</h3>
        <ul className="list-disc list-inside grid grid-cols-2 gap-2">
          {Object.entries(problem.variables).map(([key, value]) => (
            <li key={key} className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <span className="font-bold">{key}:</span> {value}
            </li>
          ))}
        </ul>
      </div>

      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-6`}>
        <InlineMath math={latexFormula || '\\text{La tua formula apparirà qui}'} />
      </div>

      <ButtonGrid addToFormula={addToFormula} backspace={backspace} darkMode={darkMode} />

      <div className="flex flex-col gap-4 mt-6">
        <button
          onClick={checkSolution}
          className={`w-full p-4 ${darkMode ? 'bg-green-700 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'} text-white text-xl font-bold rounded-lg transition-colors`}
        >
          Verifica soluzione
        </button>
        <button
          onClick={resetFormula}
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

export default LogicFormulaBuilder;
