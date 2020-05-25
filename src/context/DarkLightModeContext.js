import React, { useEffect, useState } from 'react';

export const DarkLightModeContext = React.createContext();

export const DarkLightModeProvider = ({ children }) => {
  const body = document.body;
  const [theme, setTheme] = useState(() => {
    if (localStorage.getItem('theme')) {
      return localStorage.getItem('theme') === 'dark-mode' ? 'dark' : 'light-mode' ? 'light' : null;
    }
    else return null;
  });

  useEffect(() => {
    const theme = localStorage.getItem('theme');

    if (theme) {
      body.classList.add(theme);
    }
  }, [body.classList]);

  const handleToggleTheme = async () => {
    const theme = localStorage.getItem('theme');

    if (theme  === 'dark-mode') {
      localStorage.setItem('theme', 'light-mode');
      body.classList.replace('dark-mode', 'light-mode');
      body.style.transition = 'background 800ms ease-in-out';
      setTheme('light');
    } else {
      localStorage.setItem('theme', 'dark-mode');
      body.classList.replace('light-mode', 'dark-mode');
      body.style.transition = 'background 800ms ease-in-out';
      setTheme('dark');
    }
  };

  return (
    <DarkLightModeContext.Provider value={{ handleToggleTheme, theme }}>
      {children}
    </DarkLightModeContext.Provider>
  );
};
