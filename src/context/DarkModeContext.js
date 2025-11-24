import { createContext } from "react";

// Dark mode removed: keep a no-op context/provider to avoid breaking imports
export const DarkModeContext = createContext({ darkMode: false, toggleDarkMode: () => {} });

export const DarkModeProvider = ({ children }) => {
  return children;
};
