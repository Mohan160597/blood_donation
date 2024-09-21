import React, { createContext, useState } from 'react';
import { useColorScheme } from 'react-native';

export const ThemeContext = createContext();

const lightTheme = {
  backgroundColor: 'white',
  textColor: 'black',
  tabBarActiveTintColor: 'red',
  tabBarInactiveTintColor: 'gray',
};

const darkTheme = {
  backgroundColor: '#121212',
  textColor: 'white',
  tabBarActiveTintColor: 'red',
  tabBarInactiveTintColor: 'gray',
};

export const ThemeProvider = ({ children }) => {
  const systemTheme = useColorScheme();  
  const [theme, setTheme] = useState(systemTheme === 'dark' ? darkTheme : lightTheme);

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === lightTheme ? darkTheme : lightTheme
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};