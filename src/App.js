// src/App.js

import React from 'react';
import LogicFormulaBuilder from './components/LogicFormulaBuilder';
import { DarkModeProvider } from './contexts/DarkModeContext';

const App = () => {
  return (
    <DarkModeProvider>
      <div className="min-h-screen transition-colors duration-300">
        <LogicFormulaBuilder />
      </div>
    </DarkModeProvider>
  );
};

export default App;



