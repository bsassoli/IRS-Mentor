import React from 'react';
import { InlineMath } from 'react-katex';

const ButtonGrid = ({ addToFormula, backspace, darkMode }) => {
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
        className={`p-4 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded-lg ${darkMode ? 'text-white' : 'text-gray-800'} text-xl transition-colors flex-1`}
      >
        <InlineMath math={item.latex} />
      </button>
    ))
  );

  return (
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
          className={`p-4 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded-lg ${darkMode ? 'text-white' : 'text-gray-800'} text-xl transition-colors flex-1`}
        >
          ⌫
        </button>
      </div>
    </div>
  );
};

export default ButtonGrid;