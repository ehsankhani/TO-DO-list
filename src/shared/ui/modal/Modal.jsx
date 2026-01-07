import React, { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { t } from "../../i18n/dictionary";

function getFocusable(root) {
  if (!root) return [];
  return Array.from(
    root.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    ),
  );
}

export function Modal({ isOpen, title, onClose, children }) {
  const panelRef = useRef(null);
  const labelId = useId();

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const focusables = getFocusable(panel);
    (focusables[0] || panel)?.focus?.();

    function onKeyDown(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const items = getFocusable(panel);
      if (items.length === 0) {
        e.preventDefault();
        panel?.focus?.();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="modalOverlay" role="presentation" onMouseDown={onClose}>
      <div
        className="modalPanel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        onMouseDown={(e) => e.stopPropagation()}
        ref={panelRef}
        tabIndex={-1}
      >
        <div className="modalHeader">
          <div id={labelId} className="modalTitle">
            {title}
          </div>
          <button className="btn" type="button" onClick={onClose}>
            {t("actions.close")}
          </button>
        </div>
        <div className="divider" />
        <div className="modalBody">{children}</div>
      </div>
    </div>,
    document.body,
  );
}


