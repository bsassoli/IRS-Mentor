import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const isDevelopment = process.env.NODE_ENV === 'development';
const API_URL = isDevelopment
  ? 'http://localhost:3001/api/problems'
  : process.env.REACT_APP_FIREBASE_DATABASE_URL;


export const useProblems = () => {
  const [allProblems, setAllProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const app = !isDevelopment ? initializeApp(firebaseConfig) : null;
  const database = !isDevelopment ? getDatabase(app) : null;

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

  const processProblems = (data) => {
    // Add debug logging
    console.log('Processing raw data:', data);

    if (!data) return [];

    // Handle potential nested data structure from json-server
    let problemsArray;
    if (data.problems) {
      problemsArray = data.problems;
    } else if (Array.isArray(data)) {
      problemsArray = data;
    } else {
      problemsArray = Object.values(data);
    }

    console.log('Extracted problems array:', problemsArray);

    const processed = problemsArray
      .filter(problem => {
        const isValid = problem && problem.type;
        if (!isValid) {
          console.log('Filtered out invalid problem:', problem);
        }
        return isValid;
      })
      .map(problem => {
        const processed = {
          ...problem,
          id: problem.id || Math.random().toString(36).substr(2, 9),
          text: problem.text || '',
          solution: Array.isArray(problem.solution) ? problem.solution : [problem.solution],
          variables: problem.variables || {},
          premises: problem.premises || [],
          conclusion: problem.conclusion || ''
        };
        console.log('Processed problem:', processed);
        return processed;
      });
    
    console.log('Final processed problems:', processed);
    return processed;
  };

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        if (isDevelopment) {
          console.log('Fetching from local API:', API_URL);
          const response = await fetch(API_URL);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log('Local API raw response:', data);
          
          const validProblems = processProblems(data);
          console.log('Processed problems count:', validProblems.length);
          
          if (validProblems.length === 0) {
            setError("No valid problems found in local API");
          } else {
            setAllProblems(validProblems);
            setFilteredProblems(validProblems);
            setError(null);
          }
          setLoading(false);
        } else {
          console.log('Fetching from Firebase...');
          const dataRef = ref(database, 'problems');
          
          onValue(dataRef, (snapshot) => {
            const data = snapshot.val();
            console.log('Firebase data received:', data);
            
            const validProblems = processProblems(data);
            if (validProblems.length === 0) {
              setError("No valid problems found in database");
            } else {
              setAllProblems(validProblems);
              setFilteredProblems(validProblems);
              setError(null);
            }
            setLoading(false);
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

    fetchProblems();

    return () => {
      if (!isDevelopment && database) {
        const dataRef = ref(database, 'problems');
        onValue(dataRef, () => {});
      }
    };
  }, [database]);

  return {
    problems: filteredProblems,
    currentProblem: loading ? {
      type: 'loading',
      text: 'Caricamento...',
      solution: [],
      variables: {}
    } : error ? {
      type: 'error',
      text: error,
      solution: [],
      variables: {}
    } : filteredProblems[currentProblemIndex] || null,
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