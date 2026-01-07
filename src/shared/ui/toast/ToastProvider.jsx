import React, { useCallback, useMemo, useRef, useState } from "react";
import { t } from "../../i18n/dictionary";
import { ToastCtx } from "./toastContext.js";

/**
 * @typedef {"info" | "success" | "warning" | "danger"} ToastVariant
 * @typedef {{ id: string, title: string, description?: string, variant: ToastVariant, timeoutMs?: number }} Toast
 */

export function ToastProvider({ children }) {
  /** @type {[Toast[], any]} */
  const [toasts, setToasts] = useState([]);
  const timeouts = useRef(new Map());

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const handle = timeouts.current.get(id);
    if (handle) window.clearTimeout(handle);
    timeouts.current.delete(id);
  }, []);

  const push = useCallback(
    (toast) => {
      const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
      const next = { id, timeoutMs: 3200, variant: "info", ...toast };
      setToasts((prev) => [next, ...prev].slice(0, 4));

      const handle = window.setTimeout(() => remove(id), next.timeoutMs);
      timeouts.current.set(id, handle);
    },
    [remove],
  );

  const ctxValue = useMemo(() => ({ push }), [push]);

  return (
    <ToastCtx.Provider value={ctxValue}>
      {children}
      <div className="toastRegion" aria-label={t("a11y.toasts")} aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast-${toast.variant}`}
            role="status"
            tabIndex={0}
          >
            <div className="toastBody">
              <div className="toastTitle">{toast.title}</div>
              {toast.description ? <div className="toastDesc">{toast.description}</div> : null}
            </div>
            <button className="toastClose" type="button" onClick={() => remove(toast.id)}>
              <span className="sr-only">{t("actions.close")}</span>
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}


