import React, { useEffect, useMemo } from "react";
import { useLocalStorage } from "../../shared/hooks/useLocalStorage";
import { getSystemTheme, isTheme, THEMES } from "./theme";
import { APP_CONFIG } from "../config/appConfig.js";
import { ThemeProviderInternal } from "./useTheme.jsx";

const STORAGE_KEY = APP_CONFIG.THEME_STORAGE_KEY;
const STORAGE_VERSION = 1;

function validateTheme(value) {
  return isTheme(value);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage(STORAGE_KEY, getSystemTheme, {
    version: STORAGE_VERSION,
    validate: validateTheme,
    migrate: (wrapper) => {
      // wrapper: { v, data } or older shapes
      const data = wrapper?.data ?? wrapper;
      return validateTheme(data) ? data : getSystemTheme();
    },
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const value = useMemo(() => {
    return {
      theme,
      setTheme: (t) => setTheme(t),
      toggleTheme: () =>
        setTheme((prev) => (prev === THEMES.dark ? THEMES.light : THEMES.dark)),
    };
  }, [setTheme, theme]);

  return <ThemeProviderInternal value={value}>{children}</ThemeProviderInternal>;
}


