import React, { createContext, useState, useContext } from 'react';
import { Appearance } from 'react-native';
import colors from '../theme/colors';

const ThemeContext = createContext({
  isDarkMode: false,
  colors: colors.light,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = Appearance.getColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const themeColors = isDarkMode ? colors.dark : colors.light;

  return (
    <ThemeContext.Provider value={{ isDarkMode, colors: themeColors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
