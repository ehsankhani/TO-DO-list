import React from "react";
import { ThemeProvider } from "../theme/ThemeProvider.jsx";
import { ToastProvider } from "../../shared/ui/toast/ToastProvider.jsx";

/**
 * App-wide providers. Keep this small and intentional.
 * @param {{ children: React.ReactNode }} props
 */
export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  );
}


