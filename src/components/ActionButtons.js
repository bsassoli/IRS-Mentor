// src/components/ActionButtons.js
// Description: This component displays the action buttons to check the solution, reset the formula, and move to the next problem.

import React from 'react';

const ActionButtons = ({ checkSolution, resetFormula, nextProblem }) => (
  <div className="flex justify-between gap-4">
    <button
      onClick={checkSolution}
      className="flex-1 px-6 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
    >
      Verifica soluzione
    </button>
    <button
      onClick={resetFormula}
      className="flex-1 px-6 py-3 rounded-md bg-gray-600 text-white hover:bg-gray-700 transition-colors"
    >
      Cancella formula
    </button>
    <button
      onClick={nextProblem}
      className="flex-1 px-6 py-3 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
    >
      Prossimo problema
    </button>
  </div>
);

export default ActionButtons;