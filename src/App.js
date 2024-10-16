import React from 'react';
import Header from './components/Header';
import LogicFormulaBuilder from './components/LogicFormulaBuilder';
import { DarkModeProvider } from './contexts/DarkModeContext';

const App = () => {
  return (
    <DarkModeProvider>
      <div className="min-h-screen transition-colors duration-300">
        <Header />
        <LogicFormulaBuilder />
      </div>
    </DarkModeProvider>
  );
};

export default App;



