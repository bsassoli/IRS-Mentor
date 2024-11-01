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

    if (correctAnswers.includes(userSolution)) {
      onSuccess();
    } else {
      onError();
    }
  };

  return (
    <div className="space-y-6">
      {/* Premises and Conclusion Display */}
      {(problem.premises?.length > 0 || problem.conclusion) && (
        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg`}>
          {problem.premises?.length > 0 && (
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
      )}

      {/* Argument Input Area */}
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} min-h-[80px] flex items-center`}>
        <InlineMath math={latexArgument || '\\text{Il tuo argomento apparirà qui}'} />
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