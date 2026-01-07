import React from "react";
import { t } from "../../shared/i18n/dictionary";
import { ThemeToggle } from "./ThemeToggle.jsx";

export function Header() {
  return (
    <header className="container" style={{ paddingBottom: 0 }}>
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "center", padding: "var(--sp-4)" }}
      >
        <div className="row" style={{ gap: "var(--sp-2)" }}>
          <div
            aria-hidden="true"
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background:
                "linear-gradient(135deg, color-mix(in srgb, var(--accent) 70%, transparent), color-mix(in srgb, var(--accent-2) 60%, transparent))",
              boxShadow: "var(--shadow-sm)",
            }}
          />
          <div style={{ display: "grid" }}>
            <div style={{ fontWeight: 750, lineHeight: "var(--lh-tight)" }}>{t("appName")}</div>
            <div className="muted" style={{ fontSize: "var(--text-sm)" }}>
              {t("appSubtitle")}
            </div>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}


