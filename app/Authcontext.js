"use client";
import React, { createContext, useState, useContext } from 'react';

const GlobalContext = createContext({
  isLoggedin: false,
  setIsLoggedIn: () => {},
  isAdmin: false,
  setIsAdmin: () => {}
});

export const GlobalContextProvider = ({ children }) => {
  const [isLoggedin, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);


  React.useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <GlobalContext.Provider value={{ isLoggedin, setIsLoggedIn, isAdmin, setIsAdmin }}>
      {children}
    </GlobalContext.Provider>
  );
};