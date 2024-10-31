import React, { useState, useEffect } from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { useDarkMode } from '../contexts/DarkModeContext';
import { HelpCircle } from 'lucide-react';
import ButtonGrid from './ButtonGrid';

const InstructionsPopover = ({ darkMode, instructions }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setIsVisible(true)}
        onClick={() => setIsVisible(!isVisible)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg
          ${darkMode 
            ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          } transition-colors`}
      >
        <HelpCircle size={18} />
        <span>Istruzioni</span>
      </button>

      {isVisible && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsVisible(false)}
          />
          <div
            className={`absolute left-0 top-full mt-2 w-80 p-4 rounded-lg shadow-lg z-20
              ${darkMode ? 'bg-gray-700' : 'bg-white'} border
              ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
            onMouseLeave={() => setIsVisible(false)}
          >
            <div className={`text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {instructions}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const ProblemBuilder = ({ 
  problem,
  onCorrectAnswer,
  onIncorrectAnswer,
  onNextProblem,
  title = "Problema",
  inputPlaceholder = "La tua formula apparirà qui",
  instructions,
  normalizeInput,
  isArgumentBuilder = false
}) => {
  const [formula, setFormula] = useState([]);
  const [latexFormula, setLatexFormula] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { darkMode } = useDarkMode();

  useEffect(() => {
    setFormula([]);
    setLatexFormula('');
  }, [problem]);

  const addToFormula = (element) => {
    setFormula([...formula, element]);
    setLatexFormula(prevFormula => {
      const newFormula = prevFormula + ' ' + element.latex;
      return newFormula.replace(/\s+/g, ' ').trim();
    });
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
    const userSolution = normalizeInput(latexFormula);
    const correctAnswers = Array.isArray(problem.solution) 
      ? problem.solution.map(normalizeInput)
      : [normalizeInput(problem.solution)];

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
      if (!isArgumentBuilder) {
        resetFormula();
      }
    }
    setModalOpen(true);
  };

  const renderVariables = () => {
    if (!problem.variables) return null;

    if (Array.isArray(problem.variables)) {
      return problem.variables.map((v, index) => (
        <li key={index} className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          <span className="font-bold">{v.variable}:</span> {v.text}
        </li>
      ));
    }

    return Object.entries(problem.variables).map(([key, value]) => (
      <li key={key} className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        <span className="font-bold">{key}:</span> {value}
      </li>
    ));
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
      <div className="mb-8">
        <h2 className={`text-3xl font-bold mb-4 font-['EB_Garamond'] ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          {title}
        </h2>
        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg`}>
          <p className={`text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {problem.text}
          </p>
          {problem.premises && problem.premises.length > 0 && (
            <div className="mb-4">
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                Premesse:
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {problem.premises.map((premise, index) => (
                  <li key={index} className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {typeof premise === 'string' ? (
                      <InlineMath math={premise} />
                    ) : (
                      'Formato premessa non valido'
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {problem.conclusion && (
            <div>
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                Conclusione:
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <InlineMath math={String(problem.conclusion)} />
              </p>
            </div>
          )}
        </div>
      </div>

      {problem.variables && (Array.isArray(problem.variables) || Object.keys(problem.variables).length > 0) && (
        <div className="mb-8">
          <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            Variabili proposizionali:
          </h3>
          <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg`}>
            <ul className="grid grid-cols-2 gap-2">
              {renderVariables()}
            </ul>
          </div>
        </div>
      )}

      <div className="mb-6">
        {instructions && (
          <div className="flex items-center justify-between mb-2">
            <InstructionsPopover darkMode={darkMode} instructions={instructions} />
          </div>
        )}
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} min-h-[80px] flex items-center`}>
          <InlineMath math={latexFormula || `\\text{${inputPlaceholder}}`} />
        </div>
      </div>

      <ButtonGrid addToFormula={addToFormula} backspace={backspace} darkMode={darkMode} />

      <div className="flex flex-col gap-4 mt-6">
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
            onClick={onNextProblem}
            className={`flex-1 p-3 ${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-500 hover:bg-blue-600'} text-white text-lg rounded-lg transition-colors`}
          >
            Prossimo problema
          </button>
        </div>
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

export default ProblemBuilder;