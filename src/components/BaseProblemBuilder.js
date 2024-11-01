import React, { useState } from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';
import { HelpCircle } from 'lucide-react';

const InstructionsPopover = ({ darkMode, instructions }) => {
  const [isVisible, setIsVisible] = useState(false);

  return instructions ? (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setIsVisible(true)}
        onClick={() => setIsVisible(!isVisible)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg
          ${darkMode 
            ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          } transition-colors`}
      >
        <HelpCircle size={18} />
        <span>Istruzioni</span>
      </button>

      {isVisible && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsVisible(false)} />
          <div
            className={`absolute left-0 top-full mt-2 w-80 p-4 rounded-lg shadow-lg z-20
              ${darkMode ? 'bg-gray-700' : 'bg-white'} border
              ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
            onMouseLeave={() => setIsVisible(false)}
          >
            <div className={`text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {instructions}
            </div>
          </div>
        </>
      )}
    </div>
  ) : null;
};

const ResultModal = ({ isOpen, onClose, message, isSuccess, darkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg`}>
        <h3 className={`text-xl font-bold font-['EB_Garamond'] ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
          {isSuccess ? 'Ottimo lavoro!' : 'Riprova!'}
        </h3>
        <p className={`my-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{message}</p>
        <button
          onClick={onClose}
          className={`px-4 py-2 ${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded transition-colors`}
        >
          Chiudi
        </button>
      </div>
    </div>
  );
};

const BaseProblemBuilder = ({
  problem,
  onCorrectAnswer,
  onIncorrectAnswer,
  onNextProblem,
  title = "Problema",
  instructions,
  InteractionComponent, // This is now a component with normalizeInput already injected
  renderProblemContent,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { darkMode } = useDarkMode();

  if (!InteractionComponent) {
    console.error('InteractionComponent is required but was not provided');
    return (
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
        <p className="text-xl text-red-500">
          Error: InteractionComponent is required but was not provided
        </p>
      </div>
    );
  }

  const handleSuccess = () => {
    setIsSuccess(true);
    setModalMessage('Ottimo lavoro! Passando alla prossima domanda...');
    setModalOpen(true);
    onCorrectAnswer();
    setTimeout(() => {
      onNextProblem();
      setModalOpen(false);
    }, 2000);
  };

  const handleError = () => {
    setIsSuccess(false);
    setModalMessage('La tua risposta non è corretta. Riprova!');
    setModalOpen(true);
    onIncorrectAnswer();
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
      {/* Problem Title and Content */}
      <div className="mb-8">
        <h2 className={`text-3xl font-bold mb-4 font-['EB_Garamond'] ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          {title}
        </h2>
        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg`}>
          {renderProblemContent?.(darkMode) || (
            <p className={`text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {problem.text}
            </p>
          )}
        </div>
      </div>

      {/* Instructions */}
      {instructions && (
        <div className="mb-6">
          <InstructionsPopover darkMode={darkMode} instructions={instructions} />
        </div>
      )}

      {/* Interaction Area */}
      <InteractionComponent
        problem={problem}
        darkMode={darkMode}
        onSuccess={handleSuccess}
        onError={handleError}
        onNextProblem={onNextProblem}
      />

      {/* Result Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg`}>
            <h3 className={`text-xl font-bold font-['EB_Garamond'] ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
              {isSuccess ? 'Ottimo lavoro!' : 'Riprova!'}
            </h3>
            <p className={`my-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{modalMessage}</p>
            <button
              onClick={() => setModalOpen(false)}
              className={`px-4 py-2 ${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded transition-colors`}
            >
              Chiudi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BaseProblemBuilder;