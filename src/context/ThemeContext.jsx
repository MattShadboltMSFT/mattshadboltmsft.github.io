import React, { createContext, useContext, useState } from 'react';
import { getTheme, defaultTheme } from '../themes/themeConfig';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState(() => {
    // Load theme from localStorage or use default
    const saved = localStorage.getItem('jaysFootyTheme');
    return saved || defaultTheme;
  });

  const theme = getTheme(currentTheme);

  const changeTheme = (themeId) => {
    setCurrentTheme(themeId);
    localStorage.setItem('jaysFootyTheme', themeId);
  };

  return (
    <ThemeContext.Provider value={{ theme, currentTheme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
