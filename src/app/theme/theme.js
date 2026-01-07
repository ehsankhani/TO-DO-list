export const THEMES = /** @type {const} */ ({
  light: "light",
  dark: "dark",
});

/**
 * @typedef {"light" | "dark"} Theme
 */

/**
 * @param {any} value
 * @returns {value is Theme}
 */
export function isTheme(value) {
  return value === THEMES.light || value === THEMES.dark;
}

/**
 * @returns {Theme}
 */
export function getSystemTheme() {
  if (typeof window === "undefined") return THEMES.dark;
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches
    ? THEMES.dark
    : THEMES.light;
}


