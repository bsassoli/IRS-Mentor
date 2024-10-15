import React, { useState, useEffect } from "react";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

// App's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBC1_APAcXHzW5bEZ_o6RZO1jp1ew7RAz4",
  authDomain: "fbf-2024.firebaseapp.com",
  databaseURL:
    "https://fbf-2024-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fbf-2024",
  storageBucket: "fbf-2024.appspot.com",
  messagingSenderId: "75025781037",
  appId: "1:75025781037:web:939484d96d65e369e903a4",
  measurementId: "G-J1EV200L67",
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
  const [latexFormula, setLatexFormula] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [problems, setProblems] = useState([]);
  const [error, setError] = useState(null);

  const connectives = [
    { id: "not", latex: "\\neg" },
    { id: "and", latex: "\\land" },
    { id: "or", latex: "\\lor" },
    { id: "implies", latex: "\\to" },
    { id: "iff", latex: "\\leftrightarrow" },
  ];

  const propositionalVariables = [
    { id: "P", latex: "P" },
    { id: "Q", latex: "Q" },
    { id: "R", latex: "R" },
    { id: "S", latex: "S" },
    { id: "(", latex: "(" },
    { id: ")", latex: ")" },
    { id: ",", latex: "," },
   
  ];

  useEffect(() => {
    if (!app) {
      setError("Firebase not initialized. Check your configuration.");
      return;
    }

    const database = getDatabase(app);
    const problemsRef = ref(database, "problems");

    const unsubscribe = onValue(
      problemsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setProblems(Object.values(data));
          setError(null);
        } else {
          setError("No problems found in the database.");
        }
      },
      (error) => {
        setError("Error fetching problems: " + error.message);
      }
    );

    // Cleanup function
    return () => unsubscribe();
  }, []);

  const currentProblem = problems[currentProblemIndex] || {
    text: "Carico...",
    solution: "",
  };

  const addToFormula = (element) => {
    setFormula([...formula, element]);
    setLatexFormula((prevFormula) => prevFormula + " " + element.latex);
  };

  const resetFormula = () => {
    setFormula([]);
    setLatexFormula("");
  };

  const backspace = () => {
    if (formula.length > 0) {
      const newFormula = formula.slice(0, -1);
      setFormula(newFormula);
      setLatexFormula(newFormula.map((f) => f.latex).join(""));
    }
  };

  const checkSolution = () => {
    if (latexFormula.trim() === currentProblem.solution) {
      setIsSuccess(true);
      setModalMessage("Ottimo lavoro!");
      resetFormula();
    } else {
      setIsSuccess(false);
      setModalMessage("La tua risposta non è corretta. Riprova!");
      resetFormula();
    }
    setModalOpen(true);
  };

  const nextProblem = () => {
    if (problems.length > 0) {
      setCurrentProblemIndex((prevIndex) => (prevIndex + 1) % problems.length);
      resetFormula();
    }
  };

  return (
    <div>
      <main className="flex-grow p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl">
          <div className="mb-6">
            <div className="flex items-center bg-gray-800 rounded-lg overflow-hidden">
              <div className="flex-grow bg-transparent p-4 text-white outline-none">
                <InlineMath
                  math={latexFormula || "\\text{...}"}
                />
              </div>
              <button className="p-4 bg-gray-700 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
              <button className="p-4 bg-gray-700 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-2 mb-6">
            {[...propositionalVariables, ...connectives].map((item) => (
              <button
                key={item.id}
                onClick={() => addToFormula(item)}
                className="p-4 bg-gray-800 rounded-lg text-white text-xl hover:bg-gray-700 transition-colors"
              >
                <InlineMath math={item.latex} />
              </button>
            ))}
            <button
              onClick={backspace}
              className="p-4 bg-gray-800 rounded-lg text-white text-xl hover:bg-gray-700 transition-colors"
            >
              ⌫
            </button>
          </div>

          {error ? (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
              {error}
            </div>
          ) : (
            <>
              <div className="mb-6 bg-gray-800 p-4 rounded-lg">
                <p className="text-white">Problema: {currentProblem.text}</p>
              </div>
              <div className="flex justify-between gap-4">
                <button
                  onClick={checkSolution}
                  className="flex-1 px-6 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Verifica soluzione
                </button>
                <button
                  onClick={resetFormula}
                  className="flex-1 px-6 py-3 rounded-md bg-gray-600 text-white hover:bg-gray-700 transition-colors"
                >
                  Cancella formula
                </button>
                <button
                  onClick={nextProblem}
                  className="flex-1 px-6 py-3 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  Prossimo problema
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="p-4 bg-gray-800 text-center text-gray-400">
        <p>Proudly provided by Bernardino</p>
        <p className="text-sm">Legal Notice © 2024 All rights reserved.</p>
      </footer>

      {modalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative p-5 border w-96 shadow-lg rounded-md bg-gray-800">
            <div
              className={`mt-3 text-center ${
                isSuccess ? "text-green-500" : "text-red-500"
              }`}
            >
              <h3 className="text-lg leading-6 font-medium mb-2">
                {isSuccess ? "Ottimo lavoro!" : "Riprova!"}
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-300">{modalMessage}</p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setModalOpen(false)}
                  className={`px-4 py-2 ${
                    isSuccess ? "bg-green-600" : "bg-blue-600"
                  } text-white text-base font-medium rounded-md w-full shadow-sm hover:${
                    isSuccess ? "bg-green-700" : "bg-blue-700"
                  } focus:outline-none focus:ring-2 focus:ring-${
                    isSuccess ? "green" : "blue"
                  }-300`}
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
