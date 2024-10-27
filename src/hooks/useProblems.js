import { useState, useEffect } from 'react';
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

const API_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3001/api/problems'
  : 'https://your-firebase-url.com/problems';

export const useProblems = () => {
  const [problems, setProblems] = useState([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        /* if (process.env.NODE_ENV === 'development') {
          // Fetch from local server
          const response = await fetch(API_URL);
          if (!response.ok) {
            throw new Error('Failed to fetch problems');
          }
          const data = await response.json();
          processProblems(data.problems || data); // Handle both {problems: [...]} and direct array
        } else  {*/
          // Production mode: use Firebase
          const app = initializeApp(firebaseConfig);
          const database = getDatabase(app);
          const dataRef = ref(database, 'problems');

          onValue(dataRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              processProblems(Array.isArray(data) ? data : Object.values(data));
            } else {
              setError("No valid problems found in the database.");
            }
            setLoading(false);
          }, (error) => {
            setError("Error fetching data: " + error.message);
            setLoading(false);
          });
        }
       catch (error) {
        console.error("Error fetching problems:", error);
        setError("Error fetching problems: " + error.message);
        setLoading(false);
      }
    };

    const processProblems = (data) => {
      if (!Array.isArray(data)) {
        console.error("Received data is not an array:", data);
        setError("Invalid data format received");
        setLoading(false);
        return;
      }

      const problemsArray = data.map(problem => {
        if (!problem || typeof problem !== 'object') {
          console.error("Invalid problem object:", problem);
          return null;
        }

        return {
          ...problem,
          solution: Array.isArray(problem.solution) ? problem.solution : [problem.solution],
          variables: Array.isArray(problem.variables) 
            ? problem.variables.reduce((acc, v) => {
                if (v && v.variable && v.text) {
                  acc[v.variable] = v.text;
                }
                return acc;
              }, {})
            : problem.variables || {}
        };
      }).filter(Boolean); // Remove any null entries

      setProblems(problemsArray);
      setError(null);
      setLoading(false);
    };

    fetchProblems();
  }, []);

  const currentProblem = problems[currentProblemIndex] || { 
    text: 'Caricamento...', 
    solution: [], 
    id: null,
    variables: {},
    type: 'loading'
  };

  const nextProblem = () => {
    if (problems.length > 0) {
      setCurrentProblemIndex((prevIndex) => (prevIndex + 1) % problems.length);
    }
  };

  const resetProblems = () => {
    setCurrentProblemIndex(0);
  };

  const getRandomProblem = () => {
    if (problems.length > 0) {
      const randomIndex = Math.floor(Math.random() * problems.length);
      setCurrentProblemIndex(randomIndex);
    }
  };

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