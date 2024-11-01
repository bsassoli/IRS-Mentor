// src/components/interactions/LogicFormulaInteraction.js
// Description: This component allows the user to input a logical formula by selecting logical connectives and propositional variables.

import React, { useState, useEffect } from 'react';
import { InlineMath } from 'react-katex';
import ButtonGrid from '../ButtonGrid';

const LogicFormulaInteraction = ({
  problem,
  darkMode,
  onSuccess,
  onError,
  onNextProblem,
  normalizeInput
}) => {
  const [formula, setFormula] = useState([]);
  const [latexFormula, setLatexFormula] = useState('');

  useEffect(() => {
    // Reset formula when problem changes
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
    const userSolution = normalizeInput(latexFormula.trim());
    const correctAnswers = Array.isArray(problem.solution)
      ? problem.solution.map(normalizeInput)
      : [normalizeInput(problem.solution)];

    if (correctAnswers.includes(userSolution)) {
      onSuccess();
      resetFormula();
    } else {
      onError();
      resetFormula();
    }
  };

  // Render variables if present
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
    <div className="space-y-6">
      {/* Variables Section */}
      {problem.variables && (Array.isArray(problem.variables) || Object.keys(problem.variables).length > 0) && (
        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg`}>
          <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            Variabili proposizionali:
          </h3>
          <ul className="grid grid-cols-2 gap-2">
            {renderVariables()}
          </ul>
        </div>
      )}

      {/* Formula Input Display */}
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} min-h-[80px] flex items-center`}>
        <InlineMath math={latexFormula || '\\text{La tua formula apparirà qui}'} />
      </div>

      {/* Button Grid */}
      <ButtonGrid
        addToFormula={addToFormula}
        backspace={backspace}
        darkMode={darkMode}
      />

      {/* Action Buttons */}
      <div className="flex flex-col gap-4">
        <button
          onClick={checkSolution}
          className={`w-full p-4 ${darkMode ? 'bg-green-700 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'} 
            text-white text-xl font-bold rounded-lg transition-colors`}
        >
          Verifica soluzione
        </button>
        <div className="flex gap-4">
          <button
            onClick={resetFormula}
            className={`flex-1 p-3 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-500 hover:bg-gray-600'} 
              text-white text-lg rounded-lg transition-colors`}
          >
            Cancella
          </button>
          <button
            onClick={onNextProblem}
            className={`flex-1 p-3 ${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-500 hover:bg-blue-600'} 
              text-white text-lg rounded-lg transition-colors`}
          >
            Prossimo problema
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogicFormulaInteraction;