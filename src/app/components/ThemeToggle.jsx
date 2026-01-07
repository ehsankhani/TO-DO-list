import React from "react";
import { useTheme } from "../theme/useTheme.jsx";
import { t } from "../../shared/i18n/dictionary";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      className="btn"
      onClick={toggleTheme}
      aria-label={t("a11y.themeToggle")}
      title={t("a11y.themeToggle")}
    >
      {theme === "dark" ? t("theme.dark") : t("theme.light")}
    </button>
  );
}


