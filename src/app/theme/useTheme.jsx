import React, { createContext, useContext } from "react";

/**
 * @typedef {"light" | "dark"} Theme
 * @typedef {{ theme: Theme, setTheme: (t: Theme) => void, toggleTheme: () => void }} ThemeContextValue
 */

/** @type {React.Context<ThemeContextValue | null>} */
const ThemeCtx = createContext(null);

export function ThemeProviderInternal({ value, children }) {
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}


