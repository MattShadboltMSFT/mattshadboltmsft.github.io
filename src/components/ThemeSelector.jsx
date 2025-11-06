import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getThemeOptions } from '../themes/themeConfig';

export default function ThemeSelector() {
  const { currentTheme, changeTheme, theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const themeOptions = getThemeOptions();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-4 py-2 ${theme.styles.button} ${theme.colors.btnSecondary} ${theme.colors.textPrimary} flex items-center gap-2`}
      >
        <span>🎨</span>
        <span className="hidden sm:inline">Theme</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className={`absolute right-0 mt-2 w-80 ${theme.colors.bgCard} ${theme.styles.card} border ${theme.colors.border} z-50 overflow-hidden`}>
            <div className={`p-3 ${theme.colors.bgSecondary} border-b ${theme.colors.border}`}>
              <h3 className={`font-bold ${theme.colors.textPrimary}`}>Choose Theme</h3>
              <p className={`text-xs ${theme.colors.textSecondary}`}>Select your preferred UX design</p>
            </div>
            
            <div className="p-2 space-y-2">
              {themeOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    changeTheme(option.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    currentTheme === option.id
                      ? `${theme.colors.bgSecondary} ${theme.colors.borderAccent} border-2`
                      : `${theme.colors.bgCard} ${theme.colors.border} border hover:border-current`
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className={`font-semibold ${theme.colors.textPrimary} mb-1`}>
                        {option.name}
                      </h4>
                      <p className={`text-xs ${theme.colors.textSecondary}`}>
                        {option.description}
                      </p>
                    </div>
                    {currentTheme === option.id && (
                      <span className={`ml-2 ${theme.colors.textAccent}`}>✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
