import React, { useState } from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { useProblems } from '../hooks/useProblems';
import { useDarkMode } from '../contexts/DarkModeContext';

const LogicFormulaBuilder = () => {
  const [formula, setFormula] = useState([]);
  const [latexFormula, setLatexFormula] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  
  const { darkMode } = useDarkMode();
  const { currentProblem, nextProblem, problems, currentProblemIndex } = useProblems();

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
    setTotalAnswered(prev => prev + 1);
    if (latexFormula.trim() === currentProblem.solution) {
      setIsSuccess(true);
      setModalMessage('Ottimo lavoro! Premi "Prossimo problema" per continuare.');
      setCorrectAnswers(prev => prev + 1);
    } else {
      setIsSuccess(false);
      setModalMessage('La tua risposta non è corretta. Riprova!');
    }
    setModalOpen(true);
  };

  const handleNextProblem = () => {
    nextProblem();
    resetFormula();
    setModalOpen(false);
  };

  const connectives = [
    { id: 'not', latex: '\\neg' },
    { id: 'and', latex: '\\land' },
    { id: 'or', latex: '\\lor' },
    { id: 'implies', latex: '\\to' },
    { id: 'iff', latex: '\\leftrightarrow' },
  ];

  const propositionalVariables = [
    { id: 'P', latex: 'P' },
    { id: 'Q', latex: 'Q' },
    { id: 'R', latex: 'R' },
    { id: 'S', latex: 'S' },
  ];

  const otherSymbols = [
    { id: '(', latex: '(' },
    { id: ')', latex: ')' },
    { id: ',', latex: ',' },
  ];

  const renderButtons = (elements) => (
    elements.map((item) => (
      <button
        key={item.id}
        onClick={() => addToFormula(item)}
        className="p-3 bg-blue-600 rounded-lg text-white text-lg hover:bg-blue-700 transition-colors flex-1"
      >
        <InlineMath math={item.latex} />
      </button>
    ))
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Progress Tracker */}
      <section className="mb-8 bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Progresso</h2>
        <div className="text-lg">
          <span className="font-bold text-green-600">{correctAnswers}</span>
          <span className="text-gray-600"> corrette su </span>
          <span className="font-bold text-blue-600">{totalAnswered}</span>
          <span className="text-gray-600"> totali</span>
        </div>
        <div className="text-lg">
          <span className="text-gray-600">Domanda </span>
          <span className="font-bold text-blue-600">{currentProblemIndex + 1}</span>
          <span className="text-gray-600"> di </span>
          <span className="font-bold text-blue-600">{problems.length}</span>
        </div>
      </section>

      {/* Problem Display Section */}
      <section className="mb-8 bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Problema</h2>
        <p className="text-lg text-gray-700">{currentProblem.text}</p>
      </section>

      {/* Formula Output Section */}
      <section className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">La tua formula</h2>
        <div className="bg-gray-100 p-4 rounded-lg min-h-[60px] flex items-center justify-center">
          <InlineMath math={latexFormula || '\\text{La tua formula apparirà qui}'} />
        </div>
      </section>

      {/* Button Grid Section */}
      <section className="mb-8 bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Costruisci la tua formula</h2>
        <div className="space-y-4">
          <div className="flex justify-between gap-2">
            {renderButtons(connectives)}
          </div>
          <div className="flex justify-between gap-2">
            {renderButtons(propositionalVariables)}
          </div>
          <div className="flex justify-between gap-2">
            {renderButtons(otherSymbols)}
            <button
              onClick={backspace}
              className="p-3 bg-red-500 rounded-lg text-white text-lg hover:bg-red-600 transition-colors flex-1"
            >
              ⌫
            </button>
          </div>
        </div>
      </section>

      {/* Action Buttons Section */}
      <section className="flex flex-col gap-4">
        <button
          onClick={checkSolution}
          className="w-full p-4 bg-green-600 text-white text-xl font-bold rounded-lg hover:bg-green-700 transition-colors"
        >
          Verifica soluzione
        </button>
        <div className="flex gap-4">
          <button
            onClick={resetFormula}
            className="flex-1 p-3 bg-gray-500 text-white text-lg rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancella
          </button>
          <button
            onClick={handleNextProblem}
            className="flex-1 p-3 bg-blue-500 text-white text-lg rounded-lg hover:bg-blue-600 transition-colors"
          >
            Prossimo problema
          </button>
        </div>
      </section>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className={`text-xl font-bold ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
              {isSuccess ? 'Ottimo lavoro!' : 'Riprova!'}
            </h3>
            <p className="my-4">{modalMessage}</p>
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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