// src/components/interactions/TruthTableInteraction.js
// Description: This component allows the user to construct a truth table for a given logical formula.

import React, { useState } from 'react';
import { InlineMath } from 'react-katex';

const TruthTableInteraction = ({ problem, darkMode, onSuccess, onError, onNextProblem }) => {
  const [tableValues, setTableValues] = useState(initializeEmptyTable(problem.variables));

  // Initialize empty table based on number of variables
  function initializeEmptyTable(variables) {
    const rows = Math.pow(2, variables.length);
    return Array(rows).fill(null);
  }

  // Check if the table matches the solution
  const checkSolution = () => {
    const isCorrect = tableValues.every((value, index) => 
      value === problem.solution[index]
    );
    
    if (isCorrect) {
      onSuccess();
    } else {
      onError();
    }
  };

  // Toggle a cell's value between true (1), false (0)
  const toggleCell = (rowIndex) => {
    setTableValues(prev => {
      const newValues = [...prev];
      if (newValues[rowIndex] === 1) newValues[rowIndex] = 0;
      else if (newValues[rowIndex] === 0) newValues[rowIndex] = 1;
      else newValues[rowIndex] = 1;
      return newValues;
    });
  };

  return (
    <div className="space-y-6">
      {/* Formula Display */}
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        <p className="text-lg mb-2">Costruisci la tabella di verità per la formula:</p>
        <InlineMath math={problem.formula} />
      </div>

      {/* Truth Table */}
      <div className={`overflow-x-auto ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-4`}>
        <table className="min-w-full">
          <thead>
            <tr>
              {problem.variables.map((variable, index) => (
                <th key={index} className={`px-4 py-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {variable}
                </th>
              ))}
              <th className={`px-4 py-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                <InlineMath math={problem.formula} />
              </th>
            </tr>
          </thead>
          <tbody>
            {tableValues.map((value, rowIndex) => (
              <tr key={rowIndex}>
                {/* Variable columns with fixed values */}
                {problem.variables.map((_, colIndex) => (
                  <td key={colIndex} className={`px-4 py-2 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {(rowIndex >> (problem.variables.length - colIndex - 1)) & 1}
                  </td>
                ))}
                {/* Result column - clickable */}
                <td 
                  onClick={() => toggleCell(rowIndex)}
                  className={`px-4 py-2 text-center cursor-pointer
                    ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}
                    ${value === null ? 'text-gray-400' : value === 1 ? 'text-green-500' : 'text-red-500'}`}
                >
                  {value === null ? '?' : value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between gap-4">
        <button
          onClick={checkSolution}
          className={`flex-1 p-4 ${darkMode ? 'bg-green-700 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'} 
            text-white text-xl font-bold rounded-lg transition-colors`}
        >
          Verifica soluzione
        </button>
        <button
          onClick={() => setTableValues(initializeEmptyTable(problem.variables))}
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
  );
};

export default TruthTableInteraction;