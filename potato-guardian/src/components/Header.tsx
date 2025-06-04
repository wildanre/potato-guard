import React from 'react';
import { Sun, Moon, Leaf } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="py-4 px-6 bg-green-50 dark:bg-green-950 transition-colors duration-300 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Leaf className="h-8 w-8 text-green-600 dark:text-green-400" />
          <h1 className="text-2xl font-bold text-green-800 dark:text-green-100">
            Pelindung Kentang
          </h1>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-green-100 dark:bg-green-800 hover:bg-green-200 dark:hover:bg-green-700 transition-colors duration-200"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5 text-green-800 dark:text-green-100" />
          ) : (
            <Sun className="h-5 w-5 text-green-800 dark:text-green-100" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;