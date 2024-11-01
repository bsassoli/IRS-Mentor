// src/components/ProblemDispatcher.js
// Description: This component is the main component that handles the logic for displaying and solving problems.

import React, { useState, useMemo } from 'react';
import { useProblems } from '../hooks/useProblems';
import { useDarkMode } from '../contexts/DarkModeContext';
import LogicFormulaBuilder from './LogicFormulaBuilder';
import WFFChecker from './WFFChecker';
import ArgumentConstructor from './ArgumentConstructor';
import TruthTableBuilder from './TruthTableBuilder';
import Header from './Header';

// Define the mapping between problem types and components
const PROBLEM_COMPONENTS = {
  'translateToLogic': LogicFormulaBuilder,
  'wellFormedCheck': WFFChecker,
  'argumentConstruction': ArgumentConstructor,
  'truthTable': TruthTableBuilder,
};

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
    name: 'Costruzione di Argomentazioni',
    description: 'Costruisci argomentazioni valide',
  },
  {
    id: 'truthTable',
    name: 'Tavole di Verità',
    description: 'Costruisci tavole di verità'
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
    filterProblemsByType,
    error,
    loading
  } = useProblems();

  // Enhanced debugging
  console.log('ProblemDispatcher Debug:', {
    'Available Components': Object.keys(PROBLEM_COMPONENTS),
    'Selected Group': selectedGroup,
    'Current Problem Full': currentProblem,
    'Current Problem Type': currentProblem?.type,
    'Is Component Available': currentProblem?.type ? !!PROBLEM_COMPONENTS[currentProblem.type] : 'No type',
    'Problems Length': problems.length,
    'Current Index': currentProblemIndex
  });

  const handleGroupSelect = (groupId) => {
    console.log('Group selected:', groupId);
    setSelectedGroup(groupId);
    filterProblemsByType(groupId === 'all' ? null : groupId);
    setScores({ correct: 0, incorrect: 0 });
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

  const renderContent = () => {
    if (loading) {
      return (
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <p className="text-xl">Caricamento problemi...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <p className="text-xl text-red-500">Errore: {error}</p>
        </div>
      );
    }

    if (!currentProblem) {
      return (
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <p className="text-xl">Nessun problema disponibile</p>
        </div>
      );
    }

    const ProblemComponent = PROBLEM_COMPONENTS[currentProblem.type];

    if (!ProblemComponent) {
      return (
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <p className="text-xl">
            Tipo di problema non riconosciuto: {currentProblem.type || 'undefined'}
          </p>
          <p className="mt-2 text-gray-400">
            Tipi disponibili: {Object.keys(PROBLEM_COMPONENTS).join(', ')}
          </p>
        </div>
      );
    }

    return <ProblemComponent {...commonProps} />;
  };

  // Get current group name
  const getCurrentGroupName = () => {
    const group = PROBLEM_GROUPS.find(g => g.id === selectedGroup);
    return group ? group.name : 'Tutti i problemi';
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} font-['Istok_Web']`}>
      <Header
        problemGroups={PROBLEM_GROUPS}
        currentGroup={getCurrentGroupName()}
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

        {renderContent()}
      </div>
    </div>
  );
};

export default ProblemDispatcher;