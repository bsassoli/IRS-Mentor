// src/components/interactions/ArgumentConstructorInteraction.js
// Description: This component allows the user to construct an argument by selecting logical connectives and propositional variables.

import React, { useState, useEffect } from 'react';
import { InlineMath } from 'react-katex';
import ButtonGrid from '../ButtonGrid';

const ArgumentConstructorInteraction = ({
  problem,
  darkMode,
  onSuccess,
  onError,
  onNextProblem,
  normalizeInput
}) => {
  const [argument, setArgument] = useState([]);
  const [latexArgument, setLatexArgument] = useState('');

  useEffect(() => {
    setArgument([]);
    setLatexArgument('');
  }, [problem]);

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

  const checkSolution = () => {
    const userSolution = normalizeInput(latexArgument);
    const correctAnswers = Array.isArray(problem.solution)
      ? problem.solution.map(solution => normalizeInput(solution))
      : [normalizeInput(problem.solution)];

    // Debug output
    console.group('Solution Check');
    console.log('User Input (Raw):', latexArgument);
    console.log('User Input (Normalized):', userSolution);
    console.log('Correct Answers (Raw):', problem.solution);
    console.log('Correct Answers (Normalized):', correctAnswers);
    console.log('Match Found:', correctAnswers.includes(userSolution));
    console.groupEnd();

    if (correctAnswers.includes(userSolution)) {
      onSuccess();
    } else {
      onError();
    }
  };

  return (
    <div className="space-y-6">
      {/* Argument Input Area */}
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} min-h-[80px] flex items-center`}>
        <InlineMath math={latexArgument || '\\text{La tua soluzione apparirà qui}'} />
      </div>

      {/* Button Grid */}
      <ButtonGrid
        addToFormula={addToArgument}
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
            onClick={resetArgument}
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

export default ArgumentConstructorInteraction;