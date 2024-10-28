// src/components/Header.js
// Description: This component is the header of the application. It displays the logo and a button to toggle dark mode.

import React, { useState } from 'react';
import { Sun, Moon, ChevronDown, ChevronUp } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

const ProblemGroupNavigation = ({ darkMode, problemGroups, onGroupSelect, currentGroup }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg 
          ${darkMode 
            ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          } transition-colors`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>{currentGroup || 'Seleziona gruppo'}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isOpen && (
        <div 
          className={`absolute top-full left-0 mt-2 w-64 rounded-lg shadow-lg z-50
            ${darkMode ? 'bg-gray-700' : 'bg-white'} border 
            ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
        >
          <ul className="py-2" role="menu">
            {problemGroups.map((group) => (
              <li key={group.id} role="none">
                <button
                  role="menuitem"
                  onClick={() => {
                    onGroupSelect(group.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2
                    ${darkMode ? 'text-gray-200' : 'text-gray-800'}
                    ${darkMode 
                      ? 'hover:bg-gray-600' 
                      : 'hover:bg-gray-100'
                    }
                    ${currentGroup === group.name 
                      ? (darkMode ? 'bg-gray-600' : 'bg-gray-100') 
                      : ''
                    }
                  `}
                >
                  <div className="font-medium">{group.name}</div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {group.description}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const Header = ({ problemGroups, currentGroup, onGroupSelect }) => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const logoDark = '/images/logo-dark.png';
  const logoLight = '/images/logo-light.jpg';

  return (
    <header 
      className={`sticky top-0 z-50 p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
    >
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
          <h1 className={`text-3xl font-['EB_Garamond'] font-bold ${darkMode ? 'text-blue-100' : 'text-blue-800'}`}>
            IRS TUTOR
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <ProblemGroupNavigation
            darkMode={darkMode}
            problemGroups={problemGroups}
            onGroupSelect={onGroupSelect}
            currentGroup={currentGroup}
          />
          
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full 
              ${darkMode 
                ? 'bg-gray-700 text-yellow-300' 
                : 'bg-gray-200 text-gray-800'
              }`}
            aria-label={darkMode ? 'Attiva modalità chiara' : 'Attiva modalità scura'}
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
