import React, { useState, useEffect, useCallback } from 'react';
import { useProblems } from '../hooks/useProblems';
import LogicFormulaBuilder from './LogicFormulaBuilder';
import FormulaWellFormednessChecker from './FormulaWellFormednessChecker';
import { useDarkMode } from '../contexts/DarkModeContext';
import Header from './Header';

const ProblemDispatcher = () => {
  const { currentProblem, nextProblem, problems, currentProblemIndex, loading, error } = useProblems();
  const { darkMode } = useDarkMode();
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [key, setKey] = useState(0); // Add this line

  useEffect(() => {
    console.log("Current problem index:", currentProblemIndex);
    console.log("Total problems:", problems.length);
    console.log("Current problem:", currentProblem);
    setKey(prevKey => prevKey + 1); // Add this line
  }, [currentProblemIndex, problems, currentProblem]);

  const handleCorrectAnswer = useCallback(() => {
    setCorrectAnswers(prev => prev + 1);
  }, []);

  const handleIncorrectAnswer = useCallback(() => {
    setIncorrectAnswers(prev => prev + 1);
  }, []);

  const handleNextProblem = useCallback(() => {
    console.log("Next problem button clicked");
    nextProblem();
  }, [nextProblem]);

  const renderProblemComponent = () => {
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!currentProblem) return <div>No problem available</div>;

    const props = {
      key: key, // Add this line
      onCorrectAnswer: handleCorrectAnswer,
      onIncorrectAnswer: handleIncorrectAnswer,
      onNextProblem: handleNextProblem,
      problem: currentProblem // Pass the entire problem object
    };

    switch (currentProblem.type) {
      case 'translateToLogic':
        return <LogicFormulaBuilder {...props} />;
      case 'wellFormedCheck':
        return <FormulaWellFormednessChecker {...props} />;
      default:
        return <div>Unknown problem type: {currentProblem.type}</div>;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} font-['Istok_Web']`}>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Tracker */}
        <section className={`mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-md flex justify-between items-center`}>
          <h2 className={`text-xl font-bold font-['EB_Garamond'] ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Progresso</h2>
          <div className="text-lg">
            <span className="font-bold text-green-500">{correctAnswers}</span>
            <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}> corrette, </span>
            <span className="font-bold text-red-500">{incorrectAnswers}</span>
            <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}> errate</span>
          </div>
          <div className="text-lg">
            <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Domanda </span>
            <span className="font-bold text-blue-500">{currentProblemIndex + 1}</span>
            <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}> di </span>
            <span className="font-bold text-blue-500">{problems.length}</span>
          </div>
        </section>

        {/* Render the appropriate problem component */}
        {renderProblemComponent()}

        {/* Next Problem Button */}
        <section className="flex justify-center mt-8">
          <button
            onClick={handleNextProblem}
            className={`px-6 py-3 ${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-500 hover:bg-blue-600'} text-white text-lg rounded-lg transition-colors`}
          >
            Prossimo problema
          </button>
        </section>
      </div>
    </div>
  );
};

export default ProblemDispatcher;
