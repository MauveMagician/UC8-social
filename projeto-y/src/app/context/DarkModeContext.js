"use client";
import { createContext, useState, useEffect, useContext } from "react";

// Create the context
export const DarkModeContext = createContext();

// Create the provider component
export const DarkModeContextProvider = ({ children }) => {
  useEffect(() => {
    // Check local storage for dark mode preference
    const storedPreference = localStorage.getItem("darkMode");
    if (storedPreference !== null) {
      setDark(storedPreference === "true");
    } else {
      // If no preference is stored, check OS preference
      const osPreference = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setDark(osPreference);
    }
  }, []);

  const [dark, setDark] = useState(false);
  return (
    <DarkModeContext.Provider value={{ dark, setDark }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => useContext(DarkModeContext);
