import React from 'react';
import { InlineMath } from 'react-katex';

const ProblemContent = ({ problem, darkMode }) => {
  // Helper function to process LaTeX text
  const processLatex = (text) => {
    if (!text) return '';
    return text.replace(/\\text{([^}]*)}/g, '$1');
  };

  return (
    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg space-y-4`}>
      {/* Variables Display */}
      {problem.variables && problem.variables.length > 0 && (
        <div>
          <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            Variabili proposizionali:
          </h3>
          <ul className="list-none space-y-1">
            {problem.variables.map((v, index) => (
              <li
                key={index}
                className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-baseline gap-2`}
              >
                <div className="flex items-center gap-1">
                  <InlineMath math={v.variable || v} />
                  <span>:</span>
                </div>
                {v.text && <span>{v.text}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Premises and Conclusion Display */}
      {(problem.premises?.length > 0 || problem.conclusion) && (
        <div>
          {problem.premises?.length > 0 && (
            <div className="mb-4">
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                Premesse:
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {problem.premises.map((premise, index) => (
                  <li key={index} className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {premise.includes('\\text{') ? (
                      <InlineMath math={premise} />
                    ) : (
                      processLatex(premise)
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
                {problem.conclusion.includes('\\text{') ? (
                  <InlineMath math={problem.conclusion} />
                ) : (
                  processLatex(problem.conclusion)
                )}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Formula Display - at the bottom since we don't seem to need it for this type */}
      {problem.formula && (
        <div className="flex flex-col items-start">
          <p className={`text-lg ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            {problem.instruction || 'Risolvi per la formula:'}
          </p>
          <div className="mt-2">
            <InlineMath math={problem.formula} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemContent;