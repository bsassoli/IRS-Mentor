// hooks/useProblems.js
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

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error("Firebase initialization error", error);
}

export const useProblems = () => {
  const [problems, setProblems] = useState([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!app) {
      setError("Firebase not initialized. Check your configuration.");
      setLoading(false);
      return;
    }

    const database = getDatabase(app);
    const problemsRef = ref(database, 'problems');

    const unsubscribe = onValue(problemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const problemsArray = Object.values(data);
        setProblems(problemsArray);
        setError(null);
      } else {
        setError("No problems found in the database.");
      }
      setLoading(false);
    }, (error) => {
      setError("Error fetching problems: " + error.message);
      setLoading(false);
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  const currentProblem = problems[currentProblemIndex] || { text: 'Caricamento...', solution: '' };

  const nextProblem = () => {
    if (problems.length > 0) {
      setCurrentProblemIndex((prevIndex) => (prevIndex + 1) % problems.length);
    }
  };

  const resetProblems = () => {
    setCurrentProblemIndex(0);
  };

  return {
    problems,
    currentProblem,
    currentProblemIndex,
    nextProblem,
    resetProblems,
    error,
    loading
  };
};