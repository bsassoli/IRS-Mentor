import React, { useState, useEffect } from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Sun, Moon } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

// App's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBC1_APAcXHzW5bEZ_o6RZO1jp1ew7RAz4",
  authDomain: "fbf-2024.firebaseapp.com",
  databaseURL: "https://fbf-2024-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fbf-2024",
  storageBucket: "fbf-2024.appspot.com",
  messagingSenderId: "75025781037",
  appId: "1:75025781037:web:939484d96d65e369e903a4",
  measurementId: "G-J1EV200L67"
};

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error("Firebase initialization error", error);
}

const LogicFormulaBuilder = () => {
  const [formula, setFormula] = useState([]);
  const [latexFormula, setLatexFormula] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [problems, setProblems] = useState([]);
  const [error, setError] = useState(null);

  const propositionalVariables = [
    { id: 'P', latex: 'P' },
    { id: 'Q', latex: 'Q' },
    { id: 'R', latex: 'R' },
    { id: 'S', latex: 'S' },
  ];

  const connectives = [
    { id: 'not', latex: '\\neg' },
    { id: 'and', latex: '\\land' },
    { id: 'or', latex: '\\lor' },
    { id: 'implies', latex: '\\to' },
    { id: 'iff', latex: '\\leftrightarrow' },
  ];

  useEffect(() => {
    if (!app) {
      setError("Firebase not initialized. Check your configuration.");
      return;
    }

    const database = getDatabase(app);
    const problemsRef = ref(database, 'problems');

    const unsubscribe = onValue(problemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProblems(Object.values(data));
        setError(null);
      } else {
        setError("No problems found in the database.");
      }
    }, (error) => {
      setError("Error fetching problems: " + error.message);
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  const currentProblem = problems[currentProblemIndex] || { text: 'Carico...', solution: '' };

  const addToFormula = (element) => {
    setFormula([...formula, element]);
    setLatexFormula(prevFormula => prevFormula + ' ' + element.latex);
  };

  const resetFormula = () => {
    setFormula([]);
    setLatexFormula('');
  };

  const checkSolution = () => {
    if (latexFormula.trim() === currentProblem.solution) {
      setIsSuccess(true);
      setModalMessage('Ottimo lavoro!');
      resetFormula();
    } else {
      setIsSuccess(false);
      setModalMessage('La tua risposta non è corretta. Riprova!');
      resetFormula();
    }
    setModalOpen(true);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const nextProblem = () => {
    if (problems.length > 0) {
      setCurrentProblemIndex((prevIndex) => (prevIndex + 1) % problems.length);
      resetFormula();
    }
  };

  const ElementButton = ({ element, onClick }) => (
    <button
      onClick={() => onClick(element)}
      className={`px-4 py-2 rounded-md border transition-colors duration-200 ease-in-out shadow-sm ${
        isDarkMode
          ? 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600'
          : 'bg-green-50 text-green-800 border-green-200 hover:bg-green-100'
      }`}
    >
      <InlineMath math={element.latex} />
    </button>
  );

  // Ensure the logo paths are correct and the images exist
  const logoDark = '/images/logo-dark.png';
  const logoLight = '/images/logo-light.jpg';


  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <header className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={isDarkMode ? logoDark : logoLight} 
              alt="Logo"
              className="h-12"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/fallback-logo.png';
              }}
            />
            <h1 className="text-2xl font-['EB_Garamond'] font-bold text-blue-800">Dipartimento di Filosofia</h1>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-800'}`}
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </header>
      
      <main className="p-8">
        <div className={`max-w-4xl mx-auto rounded-lg shadow-lg p-8 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h2 className={`text-3xl font-['EB_Garamond'] font-bold mb-6 ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>Costruttore di Formule Logiche</h2>
          {error ? (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
              {error}
            </div>
          ) : (
            <>
              <div className={`p-6 rounded-lg border mb-6 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-200'}`}>
                <p className={`font-['Istok_Web'] font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                  Problema: Traduci "{currentProblem.text}" in una formula ben formata.
                </p>
              </div>
              <div className="mb-6">
                <h3 className={`text-xl font-['EB_Garamond'] font-semibold mb-3 ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>Variabili proposizionali:</h3>
                <div className={`flex flex-wrap gap-3 p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-green-50 border-green-200'}`}>
                  {propositionalVariables.map((item) => (
                    <ElementButton key={item.id} element={item} onClick={addToFormula} />
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <h3 className={`text-xl font-['EB_Garamond'] font-semibold mb-3 ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>Connettivi logici:</h3>
                <div className={`flex flex-wrap gap-3 p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-green-50 border-green-200'}`}>
                  {connectives.map((item) => (
                    <ElementButton key={item.id} element={item} onClick={addToFormula} />
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <h3 className={`text-xl font-['EB_Garamond'] font-semibold mb-3 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>La tua formula:</h3>
                <div className={`p-6 rounded-lg border min-h-[60px] flex items-center justify-center ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-200'}`}>
                  <InlineMath math={latexFormula || '\\text{La tua formula apparirà qui}'} />
                </div>
              </div>
              <div className="flex justify-between gap-4">
                <button
                  onClick={checkSolution}
                  className={`flex-1 px-6 py-3 rounded-md transition-colors duration-200 ease-in-out font-['Istok_Web'] font-semibold shadow-sm ${
                    isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Verifica soluzione
                </button>
                <button
                  onClick={resetFormula}
                  className={`flex-1 px-6 py-3 rounded-md transition-colors duration-200 ease-in-out font-['Istok_Web'] font-semibold shadow-sm ${
                    isDarkMode ? 'bg-gray-600 text-white hover:bg-red-700' : 'bg-gray-400 text-white hover:bg-red-700'
                  }`}
                >
                  Cancella formula
                </button>
                <button
                  onClick={nextProblem}
                  className={`flex-1 px-6 py-3 rounded-md transition-colors duration-200 ease-in-out font-['Istok_Web'] font-semibold shadow-sm ${
                    isDarkMode ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  Prossimo problema
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className={`relative p-5 border w-96 shadow-lg rounded-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`mt-3 text-center ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
              <h3 className="text-lg leading-6 font-['EB_Garamond'] font-medium mb-2">
                {isSuccess ? 'Ottimo lavoro!' : 'Riprova!'}
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className={`text-sm font-['Istok_Web'] ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {modalMessage}
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setModalOpen(false)}
                  className={`px-4 py-2 ${isSuccess ? 'bg-green-600' : 'bg-blue-600'} text-white text-base font-['Istok_Web'] font-medium rounded-md w-full shadow-sm hover:${isSuccess ? 'bg-green-700' : 'bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-${isSuccess ? 'green' : 'blue'}-300`}
                >
                  Chiudi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogicFormulaBuilder;
