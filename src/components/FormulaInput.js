import React from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const FormulaInput = ({ latexFormula }) => (
  <div className="mb-6">
    <div className="flex items-center bg-gray-800 rounded-lg overflow-hidden">
      <div className="flex-grow bg-transparent p-4 text-white outline-none">
        <InlineMath math={latexFormula || '\\text{...}'} />
      </div>
    </div>
  </div>
);

export default FormulaInput;