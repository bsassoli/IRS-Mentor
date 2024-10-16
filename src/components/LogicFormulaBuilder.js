import React, { useState } from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { useProblems } from '../hooks/useProblems';
import { useDarkMode } from '../contexts/DarkModeContext';
import { normalizeFormula } from '../utils/formulaUtils';
import Header from './Header';
import ButtonGrid from './ButtonGrid';

const LogicFormulaBuilder = () => {
  const [formula, setFormula] = useState([]);
  const [latexFormula, setLatexFormula] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const { darkMode } = useDarkMode();
  const {
    currentProblem,
    nextProblem,
    problems,
    currentProblemIndex
  } = useProblems();

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
    const userSolution = latexFormula.trim();
    const userSolutionNormalized = normalizeFormula(userSolution);
    const correctAnswers = currentProblem.solution.map(normalizeFormula);
    console.log('User Solution:', userSolutionNormalized);
    console.log('Correct Answers:', correctAnswers);
    if (correctAnswers.includes(userSolutionNormalized)) {
      setIsSuccess(true);
      setModalMessage('Ottimo lavoro! Passando alla prossima domanda...');
      setCorrectAnswers(prev => prev + 1);
      setTimeout(() => {
        nextProblem();
        resetFormula();
        setModalOpen(false);
      }, 2000);
    } else {
      setIsSuccess(false);
      setModalMessage('La tua risposta non è corretta. Riprova!');
      resetFormula();
      setIncorrectAnswers(prev => prev + 1);
    }
    setModalOpen(true);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} font-['Istok_Web']`}>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Tracker */}
        <section className={`mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-md flex justify-between items-center`}>
          <h2 className={`text-xl font-bold font-['EB_Garamond'] ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Progresso</h2>
          <div className="text-lg">
            <span className="font-bold text-green-500">{correctAnswers}</span>
            <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}> corrette, </span>
            <span className="font-bold text-red-500">{incorrectAnswers}</span>
            <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}> errate</span>
          </div>
          <div className="text-lg">
            <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Domanda </span>
            <span className="font-bold text-blue-500">{currentProblemIndex + 1}</span>
            <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}> di </span>
            <span className="font-bold text-blue-500">{problems.length}</span>
          </div>
        </section>

        {/* Variables Section */}
        <section className={`mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-md`}>
          <h3 className={`text-lg font-semibold mb-2 font-['EB_Garamond'] ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Variabili:</h3>
          <ul className="list-disc list-inside grid grid-cols-2 gap-2">
            {Object.entries(currentProblem.variables).map(([key, value]) => (
              <li key={key} className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="font-bold">{key}:</span> {value}
              </li>
            ))}
          </ul>
        </section>

        {/* Problem and Formula Section */}
        <section className={`mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
          <h2 className={`text-3xl font-bold mb-4 font-['EB_Garamond'] ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Problema</h2>
          <p className={`text-2xl mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{currentProblem.text}</p>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-6`}>
            <InlineMath math={latexFormula || '\\text{La tua formula apparirà qui}'} />
          </div>

          <ButtonGrid addToFormula={addToFormula} backspace={backspace} darkMode={darkMode} />
        </section>

        {/* Action Buttons Section */}
        <section className="flex flex-col gap-4">
          <button
            onClick={checkSolution}
            className={`w-full p-4 ${darkMode ? 'bg-green-700 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'} text-white text-xl font-bold rounded-lg transition-colors`}
          >
            Verifica soluzione
          </button>
          <div className="flex gap-4">
            <button
              onClick={resetFormula}
              className={`flex-1 p-3 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-500 hover:bg-gray-600'} text-white text-lg rounded-lg transition-colors`}
            >
              Cancella
            </button>
            <button
              onClick={nextProblem}
              className={`flex-1 p-3 ${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-500 hover:bg-blue-600'} text-white text-lg rounded-lg transition-colors`}
            >
              Prossimo problema
            </button>
          </div>
        </section>

        {/* Modal */}
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
    </div>
  );
};

export default LogicFormulaBuilder;