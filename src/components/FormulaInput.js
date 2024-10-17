// src/components/FormulaInput.js
// Description: This component displays the LaTeX formula input by the user.

import React from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const FormulaInput = ({ latexFormula, darkMode }) => (
  <div className="mb-6">
    <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>La tua formula</h2>
    <div className={`flex items-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg overflow-hidden`}>
      <div className={`flex-grow ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 ${darkMode ? 'text-white' : 'text-gray-900'} outline-none`}>
        <InlineMath math={latexFormula || '\\text{La tua formula apparirà qui}'} />
      </div>
    </div>
  </div>
);

export default FormulaInput;