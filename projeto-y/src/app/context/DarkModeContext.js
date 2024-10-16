"use client";
import { createContext, useState, useEffect } from "react";

// Create the context
const DarkModeContext = createContext();

// Create the provider component
const DarkModeContextProvider = ({ children }) => {
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

// Export both the context and provider
export { DarkModeContextProvider, DarkModeContext };
