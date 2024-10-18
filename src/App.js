// src/App.js

import React from 'react';
import ProblemDispatcher from './components/ProblemDispatcher';
import { DarkModeProvider } from './contexts/DarkModeContext';


const App = () => {
  return (
    <DarkModeProvider>
      <div className="min-h-screen transition-colors duration-300">
        < ProblemDispatcher />
      </div>
    </DarkModeProvider>
  );
};

export default App;



