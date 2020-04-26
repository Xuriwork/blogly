import React, { useEffect } from 'react';

export const DarkLightModeContext = React.createContext();

export const DarkLightModeProvider = ({ children }) => {
  const body = document.body;

  useEffect(() => {
    const theme = localStorage.getItem('theme');

    if (theme) {
      body.classList.add(theme);
    }
  }, [body.classList]);

  const toggleTheme = () => {
    const theme = localStorage.getItem('theme');

    if (theme === 'dark-mode') {
      localStorage.setItem('theme', 'light-mode');
      body.classList.replace('dark-mode', 'light-mode');
      body.style.transition = 'background 800ms ease-in-out';
    } else {
      localStorage.setItem('theme', 'dark-mode');
      body.classList.replace('light-mode', 'dark-mode');
      body.style.transition = 'background 800ms ease-in-out';
    }
  };

  return (
    <DarkLightModeContext.Provider value={toggleTheme}>
      {children}
    </DarkLightModeContext.Provider>
  );
};
