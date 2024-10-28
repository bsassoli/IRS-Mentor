// src/hooks/useProblems.js

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
  : 'https://fbf-2024-default-rtdb.europe-west1.firebasedatabase.app';

export const useProblems = () => {
  const [allProblems, setAllProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Firebase outside of the useEffect
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

  const filterProblemsByType = (type) => {
    if (!type || type === 'all') {
      setFilteredProblems(allProblems);
    } else {
      const filtered = allProblems.filter(problem => problem.type === type);
      setFilteredProblems(filtered);
    }
    setCurrentProblemIndex(0);
  };

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        if (process.env.NODE_ENV === 'development') {
          // Local development
          const response = await fetch(API_URL);
          if (!response.ok) {
            throw new Error('Failed to fetch problems');
          }
          const data = await response.json();
          processProblems(data.problems || data);
        } else {
          // Production: Firebase
          const dataRef = ref(database, 'problems');
          
          onValue(dataRef, (snapshot) => {
            const data = snapshot.val();
            console.log('Firebase data received:', data); // Debug log
            
            if (data) {
              const problemsArray = Array.isArray(data) ? data : Object.values(data);
              processProblems(problemsArray);
            } else {
              setError("No problems found in database");
              setLoading(false);
            }
          }, (error) => {
            console.error("Firebase error:", error);
            setError("Error fetching problems: " + error.message);
            setLoading(false);
          });
        }
      } catch (error) {
        console.error("Error in fetchProblems:", error);
        setError("Error fetching problems: " + error.message);
        setLoading(false);
      }
    };

    const processProblems = (data) => {
      console.log('Processing problems:', data); // Debug log
      
      if (!Array.isArray(data)) {
        console.error("Received data is not an array:", data);
        setError("Invalid data format received");
        setLoading(false);
        return;
      }

      const processedProblems = data.map(problem => {
        if (!problem || typeof problem !== 'object') {
          console.error("Invalid problem object:", problem);
          return null;
        }

        // Ensure all required fields are present
        return {
          id: problem.id || Math.random().toString(36).substr(2, 9),
          type: problem.type || 'unknown',
          text: problem.text || '',
          solution: Array.isArray(problem.solution) ? problem.solution : [problem.solution],
          variables: problem.variables || {},
          premises: problem.premises || [],
          conclusion: problem.conclusion || '',
          formula: problem.formula,
          isWellFormed: problem.isWellFormed,
        };
      }).filter(Boolean); // Remove any null entries

      console.log('Processed problems:', processedProblems); // Debug log

      setAllProblems(processedProblems);
      setFilteredProblems(processedProblems);
      setError(null);
      setLoading(false);
    };

    fetchProblems();

    // Cleanup function
    return () => {
      // If using Firebase, you might want to clean up the listener
      const dataRef = ref(database, 'problems');
      onValue(dataRef, () => {});
    };
  }, []); // Empty dependency array

  // Get current problem with loading state
  const currentProblem = loading
    ? { type: 'loading', text: 'Caricamento...', solution: [], variables: {} }
    : filteredProblems[currentProblemIndex] || null;

  const nextProblem = () => {
    if (filteredProblems.length > 0) {
      setCurrentProblemIndex((prevIndex) => (prevIndex + 1) % filteredProblems.length);
    }
  };

  const resetProblems = () => {
    setCurrentProblemIndex(0);
  };

  const getRandomProblem = () => {
    if (filteredProblems.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredProblems.length);
      setCurrentProblemIndex(randomIndex);
    }
  };

  // Debug logs
  console.log('Current state:', {
    loading,
    error,
    allProblemsLength: allProblems.length,
    filteredProblemsLength: filteredProblems.length,
    currentProblemIndex,
    currentProblem
  });

  return {
    problems: filteredProblems,
    currentProblem,
    currentProblemIndex,
    nextProblem,
    resetProblems,
    getRandomProblem,
    filterProblemsByType,
    error,
    loading
  };
};