import { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

// Firebase configuration
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

export const useProblems = () => {
  const [problems, setProblems] = useState([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let app;
    try {
      app = initializeApp(firebaseConfig);
    } catch (error) {
      console.error("Firebase initialization error", error);
      setError("Firebase initialization error: " + error.message);
      setLoading(false);
      return;
    }

    const database = getDatabase(app);
    const dataRef = ref(database, 'problems');

    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Raw data from Firebase:", data);

      if (data && typeof data === 'object') {
        const problemsArray = Object.values(data).map(problem => ({
          ...problem,
          solution: Array.isArray(problem.solution) ? problem.solution : [problem.solution],
          variables: problem.variables ? problem.variables.reduce((acc, v) => {
            acc[v.variable] = v.text;
            return acc;
          }, {}) : {}
        }));
        console.log("Processed problems array:", problemsArray);
        setProblems(problemsArray);
        setError(null);
      } else {
        console.error("Invalid data structure:", data);
        setError("No valid problems found in the database.");
      }
      setLoading(false);
    }, (error) => {
      console.error("Firebase data fetching error:", error);
      setError("Error fetching data: " + error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const nextProblem = useCallback(() => {
    console.log("Next problem function called");
    console.log("Current index:", currentProblemIndex);
    console.log("Total problems:", problems.length);
    setCurrentProblemIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % problems.length;
      console.log("New index:", newIndex);
      return newIndex;
    });
  }, [problems.length, currentProblemIndex]);

  const currentProblem = problems[currentProblemIndex] || { 
    text: 'Caricamento...',
    solution: [],
    id: null,
    variables: {},
    type: 'loading'
  };

  const resetProblems = useCallback(() => {
    setCurrentProblemIndex(0);
  }, []);

  const getRandomProblem = useCallback(() => {
    if (problems.length > 0) {
      const randomIndex = Math.floor(Math.random() * problems.length);
      setCurrentProblemIndex(randomIndex);
    }
  }, [problems]);

  return {
    problems,
    currentProblem,
    currentProblemIndex,
    nextProblem,
    resetProblems,
    getRandomProblem,
    error,
    loading
  };
};
