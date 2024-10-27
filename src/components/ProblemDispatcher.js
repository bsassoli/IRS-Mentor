import React, { useState, useMemo } from 'react';
import { useProblems } from '../hooks/useProblems';
import { useDarkMode } from '../contexts/DarkModeContext';
import LogicFormulaBuilder from './LogicFormulaBuilder';
import FormulaWellFormednessChecker from './FormulaWellFormednessChecker';
import ArgumentConstructor from './ArgumentConstructor';
import Header from './Header';

const PROBLEM_COMPONENTS = {
  translateToLogic: LogicFormulaBuilder,
  wellFormedCheck: FormulaWellFormednessChecker,
  argumentConstruction: ArgumentConstructor,
};

const ProgressSection = ({ correctAnswers, incorrectAnswers, currentProblemIndex, totalProblems, darkMode }) => (
  <section className={`mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-md flex justify-between items-center`}>
    <h2 className={`text-xl font-bold font-['EB_Garamond'] ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
      Progresso
    </h2>
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
      <span className="font-bold text-blue-500">{totalProblems}</span>
    </div>
  </section>
);

const ProblemDispatcher = () => {
  const [scores, setScores] = useState({ correct: 0, incorrect: 0 });
  const { darkMode } = useDarkMode();
  const {
    currentProblem,
    nextProblem,
    problems,
    currentProblemIndex
  } = useProblems();

  const handleAnswer = (isCorrect) => {
    setScores(prev => ({
      ...prev,
      [isCorrect ? 'correct' : 'incorrect']: prev[isCorrect ? 'correct' : 'incorrect'] + 1
    }));
  };

  const commonProps = useMemo(() => ({
    onCorrectAnswer: () => handleAnswer(true),
    onIncorrectAnswer: () => handleAnswer(false),
    onNextProblem: nextProblem,
    problem: currentProblem
  }), [currentProblem, nextProblem]);

  const ProblemComponent = PROBLEM_COMPONENTS[currentProblem?.type];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} font-['Istok_Web']`}>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ProgressSection
          correctAnswers={scores.correct}
          incorrectAnswers={scores.incorrect}
          currentProblemIndex={currentProblemIndex}
          totalProblems={problems.length}
          darkMode={darkMode}
        />

        {ProblemComponent ? (
          <ProblemComponent {...commonProps} />
        ) : (
          <p>Tipo di problema non riconosciuto</p>
        )}
      </div>
    </div>
  );
};

export default ProblemDispatcher;