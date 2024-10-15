import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import LogicFormulaBuilder from './LogicFormulaBuilder';
// Ensure the logo paths are correct and the images exist
const logoDark = '/images/logo-dark.png';
const logoLight = '/images/logo-light.jpg';

const Header = () => {
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
        <header className={`p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={darkMode ? logoDark : logoLight}
              alt="Logo"
              className="h-12"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/fallback-logo.png';
              }}
            />
            <h1 className="text-2xl font-['EB_Garamond'] font-bold text-blue-800">Dipartimento di Filosofia</h1>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-800'}`}
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </header>
      <LogicFormulaBuilder darkMode={darkMode}/>
      </div>
    );
};

export default Header;