import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

const Header = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const logoDark = '/images/logo-dark.png';
  const logoLight = '/images/logo-light.jpg';

  return (
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
          <h1 className="text-3xl font-['EB_Garamond'] font-bold text-blue-800">IRS TUTOR</h1>
        </div>
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-800'}`}
        >
          {darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>
    </header>
  );
};

export default Header;