//src/components/ArgumentConstructor.js
// Description: This component allows the user to construct an argument by selecting logical connectives and propositional variables.

import React, { useState } from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { useDarkMode } from '../contexts/DarkModeContext';
import { HelpCircle } from 'lucide-react';
import ButtonGrid from './ButtonGrid';

const InstructionsPopover = ({ darkMode }) => {
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
              <p className="mb-2"><strong>Formato richiesto:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Separa le premesse con virgole (,)</li>
                <li>Usa il simbolo ∴ per introdurre la conclusione</li>
                <li>Esempio: <InlineMath math={'P, P \\to Q \\therefore Q'} /></li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const ArgumentConstructor = ({ onCorrectAnswer, onIncorrectAnswer, onNextProblem, problem }) => {
  const [argument, setArgument] = useState([]);
  const [latexArgument, setLatexArgument] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { darkMode } = useDarkMode();

  const addToArgument = (element) => {
    setArgument([...argument, element]);
    setLatexArgument(prevArgument => {
      const newArgument = prevArgument + ' ' + element.latex;
      return newArgument.replace(/\s+/g, ' ').trim();
    });
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

  const normalizeEscapes = (latex) => {
    return latex
      .replace(/\\/g, '\\\\') // double the backslashes
      .replace(/\s+/g, '')    // remove all whitespace
      .trim();
  };

  const checkSolution = () => {
    const userSolution = normalizeEscapes(latexArgument);
    console.log('User solution:', userSolution);
    console.log('Problem solutions:', problem.solution);

    const correctAnswers = Array.isArray(problem.solution) ? problem.solution.map(solution => normalizeEscapes(solution)) : [normalizeEscapes(problem.solution)];

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
      {/* Problem Statement Section */}
      <div className="mb-8">
        <h2 className={`text-3xl font-bold mb-4 font-['EB_Garamond'] ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          Problema
        </h2>
        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg`}>
          <p className={`text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {problem.text || 'Nessun testo del problema disponibile'}
          </p>
          {/* Premises Section */}
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

          {/* Conclusion Section */}
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

      {/* Variables Section */}
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

      {/* Argument Input Area with Instructions Button */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <InstructionsPopover darkMode={darkMode} />
        </div>
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} min-h-[80px] flex items-center`}>
          <InlineMath math={latexArgument || '\\text{Il tuo argomento apparirà qui}'} />
        </div>
      </div>

      {/* Button Grid */}
      <ButtonGrid addToFormula={addToArgument} backspace={backspace} darkMode={darkMode} />

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 mt-6">
        <button
          onClick={checkSolution}
          className={`w-full p-4 ${darkMode ? 'bg-green-700 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'} text-white text-xl font-bold rounded-lg transition-colors`}
        >
          Verifica soluzione
        </button>
        <div className="flex gap-4">
          <button
            onClick={resetArgument}
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


      {/* Result Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg`}>
            <h3 className={`text-xl font-bold font-['EB_Garamond'] ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
              {isSuccess ? 'Ottimo lavoro!' : 'Riprova!'}
            </h3>
            <p className={`my-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{modalMessage}</p>
            <button
              onClick={() => setModalOpen(false)}
              className={`px-4 py-2 ${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-500 hover:bg-blue-600'} 
                text-white rounded transition-colors`}
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