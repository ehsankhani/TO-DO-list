import React, { createContext, useContext } from "react";

/** @type {React.Context<null | { push: (toast: any) => void }>} */
export const ToastCtx = createContext(null);

export function useToasts() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToasts must be used within ToastProvider");
  return ctx;
}


