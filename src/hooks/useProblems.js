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

const isDevelopment = process.env.NODE_ENV === 'development';
const API_URL = 'http://localhost:3001/api/problems';

export const useProblems = () => {
  const [allProblems, setAllProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Firebase only in production
  const app = !isDevelopment ? initializeApp(firebaseConfig) : null;
  const database = !isDevelopment ? getDatabase(app) : null;

  const ensureArray = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'object' && data.problems) return data.problems;
    if (typeof data === 'object') return Object.values(data);
    return [];
  };

  const processProblems = (data) => {
    try {
      // First ensure we have an array to work with
      const problemsArray = ensureArray(data);
      console.log('Processing problems array:', problemsArray);

      // Then process each problem
      return problemsArray
        .filter(problem => problem && typeof problem === 'object' && problem.type)
        .map(problem => {
          try {
            return {
              ...problem,
              id: problem.id || Math.random().toString(36).substr(2, 9),
              type: problem.type,
              text: problem.text || '',
              // Handle different solution formats
              solution: Array.isArray(problem.solution) 
                ? problem.solution 
                : problem.solution 
                  ? [problem.solution] 
                  : [],
              // Handle different variables formats
              variables: Array.isArray(problem.variables)
                ? problem.variables
                : problem.variables || {},
              // Handle premises for argument construction
              premises: Array.isArray(problem.premises)
                ? problem.premises
                : problem.premises
                  ? [problem.premises]
                  : [],
              conclusion: problem.conclusion || '',
              // Handle formula for truth tables and well-formedness checks
              formula: problem.formula || '',
              isWellFormed: problem.hasOwnProperty('isWellFormed') 
                ? problem.isWellFormed 
                : null
            };
          } catch (e) {
            console.error('Error processing individual problem:', e, problem);
            return null;
          }
        })
        .filter(Boolean); // Remove any null entries from failed processing
    } catch (e) {
      console.error('Error in processProblems:', e);
      throw new Error(`Failed to process problems: ${e.message}`);
    }
  };

  const filterProblemsByType = (type) => {
    console.log('Filter called with type:', type);
    if (!type || type === 'all') {
      setFilteredProblems(allProblems);
    } else {
      const filtered = allProblems.filter(problem => problem.type === type);
      console.log(`Found ${filtered.length} problems of type ${type}`);
      setFilteredProblems(filtered);
    }
    setCurrentProblemIndex(0);
  };

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        if (isDevelopment) {
          // Fetch from local API in development
          console.log('Fetching from local API...');
          const response = await fetch(API_URL);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log('Local API response:', data);

          const validProblems = processProblems(data);
          console.log('Processed problems:', validProblems);
          
          if (validProblems.length === 0) {
            setError("No valid problems found in local API");
          } else {
            setAllProblems(validProblems);
            setFilteredProblems(validProblems);
            setError(null);
          }
        } else {
          // Use Firebase in production
          console.log('Fetching from Firebase...');
          const dataRef = ref(database, 'problems');
          onValue(dataRef, (snapshot) => {
            const data = snapshot.val();
            console.log('Firebase data received:', data);
            
            try {
              const validProblems = processProblems(data);
              console.log('Processed Firebase problems:', validProblems);
              
              if (validProblems.length === 0) {
                setError("No valid problems found in database");
              } else {
                setAllProblems(validProblems);
                setFilteredProblems(validProblems);
                setError(null);
              }
            } catch (e) {
              console.error('Error processing Firebase data:', e);
              setError(`Error processing problems: ${e.message}`);
            }
          }, (error) => {
            console.error("Firebase error:", error);
            setError("Error fetching problems: " + error.message);
          });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error in fetchProblems:", error);
        setError("Error fetching problems: " + error.message);
        setLoading(false);
      }
    };

    fetchProblems();

    return () => {
      if (!isDevelopment && database) {
        const dataRef = ref(database, 'problems');
        onValue(dataRef, () => {});
      }
    };
  }, [database, isDevelopment]);

  return {
    problems: filteredProblems,
    currentProblem: loading
      ? {
          type: 'loading',
          text: 'Caricamento...',
          solution: [],
          variables: {}
        } 
      : error 
        ? {
            type: 'error',
            text: error,
            solution: [],
            variables: {}
          } 
        : filteredProblems[currentProblemIndex] || null,
    currentProblemIndex,
    nextProblem: () => {
      if (filteredProblems.length > 0) {
        setCurrentProblemIndex((prevIndex) => (prevIndex + 1) % filteredProblems.length);
      }
    },
    resetProblems: () => {
      setCurrentProblemIndex(0);
    },
    filterProblemsByType,
    error,
    loading
  };
};