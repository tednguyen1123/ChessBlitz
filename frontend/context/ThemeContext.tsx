import React, { createContext, useContext, useState } from 'react';
import { Themes } from '@/constants/Colors';

export type ThemeContextType = {
  theme: typeof Themes.default; // Use the correct type from Themes
  setTheme: (themeName: keyof typeof Themes) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeName, setThemeName] = useState<keyof typeof Themes>('default');
  const theme = Themes[themeName]; // Get the theme object based on the current theme name

  const setTheme = (themeName: keyof typeof Themes) => {
    setThemeName(themeName);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};