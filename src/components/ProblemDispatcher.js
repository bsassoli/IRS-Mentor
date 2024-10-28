// src/components/ProblemDispatcher.js

import React, { useState, useMemo } from 'react';
import { useProblems } from '../hooks/useProblems';
import { useDarkMode } from '../contexts/DarkModeContext';
import LogicFormulaBuilder from './LogicFormulaBuilder';
import FormulaWellFormednessChecker from './FormulaWellFormednessChecker';
import ArgumentConstructor from './ArgumentConstructor';
import Header from './Header';

// Define the mapping between problem types and components
const PROBLEM_COMPONENTS = {
  'translateToLogic': LogicFormulaBuilder,
  'wellFormedCheck': FormulaWellFormednessChecker,
  'argumentConstruction': ArgumentConstructor,
};

// Define problem groups with matching IDs
const PROBLEM_GROUPS = [
  {
    id: 'all',
    name: 'Tutti i problemi',
    description: 'Visualizza tutti i tipi di problemi'
  },
  {
    id: 'translateToLogic',
    name: 'Traduzione in Logica',
    description: 'Esercizi di traduzione dal linguaggio naturale alla logica proposizionale'
  },
  {
    id: 'wellFormedCheck',
    name: 'Formule Ben Formate',
    description: 'Verifica se una formula è ben formata'
  },
  {
    id: 'argumentConstruction',
    name: 'Costruzione Argomentazioni',
    description: 'Costruisci argomenti logici validi'
  }
];

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
  const [selectedGroup, setSelectedGroup] = useState('all');
  const { darkMode } = useDarkMode();
  const {
    currentProblem,
    nextProblem,
    problems,
    currentProblemIndex,
    filterProblemsByType
  } = useProblems();

  const handleGroupSelect = (groupId) => {
    setSelectedGroup(groupId);
    if (groupId === 'all') {
      filterProblemsByType(null); // Show all problems
    } else {
      filterProblemsByType(groupId); // Filter by problem type
    }
    setScores({ correct: 0, incorrect: 0 }); // Reset scores when changing groups
  };

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

  // Debug log
  console.log('Current problem:', currentProblem);
  console.log('Problem type:', currentProblem?.type);
  console.log('Available components:', Object.keys(PROBLEM_COMPONENTS));

  const ProblemComponent = currentProblem?.type ? PROBLEM_COMPONENTS[currentProblem.type] : null;

  // Find current group name for display
  const currentGroupName = PROBLEM_GROUPS.find(g => g.id === selectedGroup)?.name;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} font-['Istok_Web']`}>
      <Header 
        problemGroups={PROBLEM_GROUPS}
        currentGroup={currentGroupName}
        onGroupSelect={handleGroupSelect}
      />
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
          <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <p className="text-xl">
              {currentProblem?.type === 'loading' 
                ? 'Caricamento problemi...' 
                : `Tipo di problema non riconosciuto: ${currentProblem?.type}`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemDispatcher;